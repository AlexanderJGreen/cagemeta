-- Row Level Security for every table.
--
-- Model:
--   * Reference data (fighters, events, fights, results, prices) is world-readable and has NO
--     write policies, so only the service role (server-side admin code) can change it.
--   * Tables that carry game state (league_members, picks, finish_calls) are readable by league
--     members but have NO client write policies. All writes go through Server Actions that
--     validate budget, lock time, membership and duplicates, then write with the service role.
--   * Tables a user directly owns (profiles, comments) allow writes to their own rows only.
--   * With RLS enabled and no matching policy, access is denied by default.

alter table public.profiles            enable row level security;
alter table public.fighters            enable row level security;
alter table public.events              enable row level security;
alter table public.fights              enable row level security;
alter table public.fight_results       enable row level security;
alter table public.fight_fighter_stats enable row level security;
alter table public.fighter_prices      enable row level security;
alter table public.leagues             enable row level security;
alter table public.league_members      enable row level security;
alter table public.picks               enable row level security;
alter table public.finish_calls        enable row level security;
alter table public.comments            enable row level security;

-- ---------------------------------------------------------------------------
-- Helpers. SECURITY DEFINER so policies on league_members can ask "is this user a member?"
-- without recursing into league_members' own policy.
-- ---------------------------------------------------------------------------
create function public.is_league_member(p_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.league_members
    where league_id = p_league_id and user_id = (select auth.uid())
  );
$$;

-- Other members' picks stay hidden until they are locked, so nobody can copy a draft.
-- per-fight leagues reveal a pick when that fighter's bout starts; event-start leagues
-- reveal everything when the event starts.
create function public.pick_is_revealed(p_league_id uuid, p_event_id uuid, p_fighter_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select lock_mode from public.leagues where id = p_league_id) = 'event-start' then
      exists (select 1 from public.events e where e.id = p_event_id and e.starts_at <= now())
    else
      exists (
        select 1 from public.fights f
        where f.event_id = p_event_id
          and p_fighter_id in (f.fighter_a_id, f.fighter_b_id)
          and f.scheduled_start_time <= now()
      )
  end;
$$;

create function public.finish_call_is_revealed(p_league_id uuid, p_event_id uuid, p_fight_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when (select lock_mode from public.leagues where id = p_league_id) = 'event-start' then
      exists (select 1 from public.events e where e.id = p_event_id and e.starts_at <= now())
    else
      exists (select 1 from public.fights f where f.id = p_fight_id and f.scheduled_start_time <= now())
  end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: any signed-in user can see profiles (names on leaderboards); you edit only your own.
-- Rows are created by the signup trigger, never inserted by clients.
-- ---------------------------------------------------------------------------
create policy "profiles are visible to signed-in users"
  on public.profiles for select to authenticated
  using (true);

create policy "users update their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Reference data: readable by everyone, writable by nobody (service role bypasses RLS).
-- ---------------------------------------------------------------------------
create policy "fighters are public"            on public.fighters            for select to anon, authenticated using (true);
create policy "events are public"              on public.events              for select to anon, authenticated using (true);
create policy "fights are public"              on public.fights              for select to anon, authenticated using (true);
create policy "fight results are public"       on public.fight_results       for select to anon, authenticated using (true);
create policy "fight stats are public"         on public.fight_fighter_stats for select to anon, authenticated using (true);
create policy "fighter prices are public"      on public.fighter_prices      for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- leagues: members read; only the owner edits settings or deletes. Creation and joining by invite
-- code happen in Server Actions (a non-member must not be able to read leagues to look up a code).
-- ---------------------------------------------------------------------------
create policy "members can read their leagues"
  on public.leagues for select to authenticated
  using (public.is_league_member(id));

create policy "owners update their league"
  on public.leagues for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "owners delete their league"
  on public.leagues for delete to authenticated
  using (owner_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- league_members: see everyone in your leagues; leave a league (but an owner can't abandon theirs).
-- Inserts happen via the league-creation trigger or the join Server Action.
-- ---------------------------------------------------------------------------
create policy "members can see fellow members"
  on public.league_members for select to authenticated
  using (public.is_league_member(league_id));

create policy "members can leave a league"
  on public.league_members for delete to authenticated
  using (user_id = (select auth.uid()) and role <> 'owner');

-- ---------------------------------------------------------------------------
-- picks / finish_calls: your own always; other members' only once revealed (locked).
-- ---------------------------------------------------------------------------
create policy "read own picks, others once revealed"
  on public.picks for select to authenticated
  using (
    user_id = (select auth.uid())
    or (
      public.is_league_member(league_id)
      and public.pick_is_revealed(league_id, event_id, fighter_id)
    )
  );

create policy "read own finish call, others once revealed"
  on public.finish_calls for select to authenticated
  using (
    user_id = (select auth.uid())
    or (
      public.is_league_member(league_id)
      and public.finish_call_is_revealed(league_id, event_id, fight_id)
    )
  );

-- ---------------------------------------------------------------------------
-- comments: fight discussion is visible to signed-in users; you write and edit only as yourself.
-- ---------------------------------------------------------------------------
create policy "comments are visible to signed-in users"
  on public.comments for select to authenticated
  using (true);

create policy "users post comments as themselves"
  on public.comments for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "users edit their own comments"
  on public.comments for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "users delete their own comments"
  on public.comments for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Lock down function execution: helpers are for policies, not for the public API.
-- ---------------------------------------------------------------------------
revoke execute on function public.handle_new_user()      from public, anon, authenticated;
revoke execute on function public.handle_new_league()    from public, anon, authenticated;
