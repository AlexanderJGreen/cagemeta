-- Atomically replaces a user's draft (picks + Call the Finish) for one league/event.
-- Called only from the saveDraft Server Action, after it has validated budget, roster size,
-- locks, membership and duplicates. Not callable by clients: execute is granted to service_role only.

create function public.save_draft(
  p_user_id        uuid,
  p_league_id      uuid,
  p_event_id       uuid,
  p_fighter_ids    uuid[],
  p_call_fight_id  uuid,
  p_call_method    public.finish_method,
  p_call_round     smallint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Serialise concurrent saves for the same draft (e.g. a double-clicked submit).
  perform pg_advisory_xact_lock(hashtext(p_user_id::text || p_league_id::text || p_event_id::text));

  delete from public.picks
  where user_id = p_user_id and league_id = p_league_id and event_id = p_event_id
    and fighter_id <> all (p_fighter_ids);

  insert into public.picks (user_id, league_id, event_id, fighter_id)
  select p_user_id, p_league_id, p_event_id, f
  from unnest(p_fighter_ids) as f
  on conflict (user_id, league_id, event_id, fighter_id) do nothing;

  if p_call_fight_id is null then
    delete from public.finish_calls
    where user_id = p_user_id and league_id = p_league_id and event_id = p_event_id;
  else
    insert into public.finish_calls
      (user_id, league_id, event_id, fight_id, predicted_method, predicted_round)
    values
      (p_user_id, p_league_id, p_event_id, p_call_fight_id, p_call_method, p_call_round)
    on conflict (user_id, league_id, event_id) do update
      set fight_id = excluded.fight_id,
          predicted_method = excluded.predicted_method,
          predicted_round = excluded.predicted_round,
          created_at = now();
  end if;
end;
$$;

revoke all on function public.save_draft(uuid, uuid, uuid, uuid[], uuid, public.finish_method, smallint)
  from public, anon, authenticated;
grant execute on function public.save_draft(uuid, uuid, uuid, uuid[], uuid, public.finish_method, smallint)
  to service_role;
