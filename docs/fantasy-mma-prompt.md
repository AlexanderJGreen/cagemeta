# Project: Fantasy MMA Web App (working name: CAGEMETA)

## Role & how to work with me
This is a passion project and I want to learn as it gets built, but you are fully in the driver's seat. Write all the code yourself. Don't leave gaps, TODOs, or exercises for me to fill in.
- Build in logical, incremental steps so the app works at every stage.
- After each step, explain what you built and why: the concepts involved, how the pieces connect, and any tradeoffs you made. Keep it concise and practical, no fluff.
- When something is ambiguous, make a reasonable call, state the assumption in one line, and keep going. Only stop to ask when a decision would be expensive to reverse later (e.g., a schema change, a paid service, or a major library choice).
- I'll redirect you if I want something done differently. Treat my feedback as course corrections, not a reason to start over.
- If you think something in this spec is a bad idea, say so directly and suggest the better option.
- Keep the codebase organized by responsibility. No giant files.
- Pause for my feedback at the end of each phase, not after every step.

## What the app is
A fantasy MMA platform: the closest thing to fantasy football for MMA, but with its own mechanics built around how fights actually work (finishes, rounds, upsets), not a reskin of fantasy football. Points only. No real money, no betting.

Three pillars:
1. **Community:** private leagues (free to create/join via invite code), user profiles, friends, picks, per-fight discussion threads, league and global leaderboards.
2. **Fight database:** fighters, events, fights, records, stats, results, rankings, upcoming cards, head-to-head matchup comparisons.
3. **Engineering:** auth, real database, secure permissions, automated server-side scoring, tests, deployment.

## Core game mechanic (default, may be revised)
Per-event "Fight Card Draft":
- Each user gets a budget (e.g., 100 credits) per event in each league.
- Every fighter on the card has a price based on betting odds or ranking (favorites cost more, underdogs are cheap).
- Users draft up to N fighters within budget. You can't draft both fighters in the same bout.
- **Scoring:** win, method bonus (KO/TKO > SUB > DEC), early-finish bonus by round, small stat bonuses (sig strikes landed, takedowns, knockdowns).
- **"Call the Finish":** once per event, a user predicts the method + round for one fight. An exact hit gives a big bonus.
- Underdog wins naturally pay off because underdogs are cheap.
- League standings accumulate across events (season format).
- All picks lock server-side at each fight's scheduled start (or at event start, configurable per league).
- Scoring rules live in config/data, not hardcoded, so they can be tuned later.

## Tech stack
- Next.js (App Router) + React + TypeScript (strict mode)
- Tailwind CSS for styling, mobile-first responsive design
- Next.js server code (Server Actions / Route Handlers) for validation, rule enforcement, scoring, and authorization
- Supabase: PostgreSQL + Auth (use @supabase/ssr for server-side auth)
- Zod for input validation
- Vitest for unit tests, Playwright for a few end-to-end flows
- GitHub for version control, Vercel for hosting
- MMA data from an external provider via a data-access layer (provider TBD, mock data first)

## Folder structure (suggested, adjust and justify if needed)
- app/ for routes, layouts, pages
- components/ for UI components (ui/ for generic, features/ for domain-specific)
- lib/ for shared utilities
- lib/data/ for the data-access layer (mock implementation now, real API later; same interface)
- lib/scoring/ for pure scoring functions (heavily unit tested)
- lib/supabase/ for Supabase clients (server and browser)
- types/ for shared TypeScript types
- supabase/migrations/ for SQL migrations

## Build phases
Do these in order. Each phase ends with something working that I can see and test.

### Phase 1: Frontend with mock data (React + TypeScript)
Concepts: components & props, state & event handlers, rendering lists with .map(), conditional rendering, interfaces/types, Next.js routing & layouts.
- Define TypeScript types that mirror the future database schema.
- Create realistic mock data (2 events, ~10 fights, ~20 fighters).
- Pages: home, events list, event detail (fight card), fighter profile, matchup comparison, league page, draft/picks screen, leaderboard.
- The draft screen enforces budget and the one-fighter-per-bout rule in the UI.
- Deliverable: the full app is clickable with fake data.

### Phase 2: Backend & database (Supabase)
Concepts: tables, rows, primary/foreign keys, SQL queries & joins, authentication vs authorization, server-side validation, environment variables & secrets.

Tables and relationships:
- profiles: 1:1 with auth.users
- fighters
- events: one-to-many fights
- fights: references two fighters (fighter_a_id, fighter_b_id), with scheduled start time and status
- fight_results: method, round, time, winner, stats
- fighter_prices: per fighter per event
- leagues: owner, settings (lock mode, scoring config), invite code
- league_members: join table (user ↔ league, role: owner/member)
- picks: user + league + event + fighter, plus a unique constraint so a user can't draft the same fighter twice in a league/event
- finish_calls: user + league + fight + method + round, unique per user/league/event
- comments: per fight discussion

Rules:
- Enable Row Level Security on every table before exposing user data. Write explicit policies (e.g., users only see leagues they belong to; only owners edit league settings).
- Picks are validated on the server: budget, lock time, membership, duplicates. Never trust the browser.
- Scores are calculated only on the server from fight_results, never submitted by clients.
- Secrets stay in env vars. The service role key never reaches the browser.
- Replace mock data with real queries through the same data-access layer.

### Phase 3: Real application engineering
Concepts: error & loading states, database constraints & permissions, automated tests, API integration & caching, deployment & debugging.
- Loading skeletons, error boundaries, empty states.
- Unit tests for all scoring logic; E2E tests for sign up → join league → draft → view leaderboard.
- Integrate a real MMA data provider behind the data-access layer, with caching (fighter/event data changes rarely; cache aggressively).
- Admin-only screen to manually enter results and trigger scoring.
- Deploy to Vercel with separate dev/prod Supabase projects.

### Phase 4: Stretch goals (only after Phases 1–3 work)
- Live round tracking: start with admin-entered round-by-round updates, then a paid live feed if it's worth it.
- Friends, notifications, global rankings, season awards.

## Constraints
- No real-money features of any kind.
- Don't use UFC/promotion logos or fighter photos unless the data provider licenses them. Use placeholders.
- Accessible by default (semantic HTML, keyboard navigation, sufficient contrast).

## Start
The project is already scaffolded, but no app code has been written yet. Before writing anything:
1. Inspect the existing setup (package.json, config files, folder layout, Tailwind/TypeScript config, any env files or Supabase setup) and give me a short summary of what's there.
2. Work with the existing setup instead of re-scaffolding. Match its conventions (e.g., src/ directory or not), and only add or change config where needed, with a reason.
3. Then begin Phase 1: define the TypeScript types and folder structure, explain the reasoning, and continue straight into building the mock data and pages.
