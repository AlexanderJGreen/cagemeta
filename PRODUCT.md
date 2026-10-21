# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Friend groups who already watch MMA and run private leagues together. They mostly use phones, checking in around fight nights: drafting before lock, following picks and standings, and talking trash about individual fights. Public or casual-fan audiences are not the current target.

## Product Purpose
A points-only fantasy MMA platform with mechanics built around how fights actually work (finishes, rounds, upsets) rather than a reskin of fantasy football. Per event, each league member drafts fighters within a credit budget, may call one finish (method + round), and standings accumulate across events. Success is a friend group that returns every fight card to draft, follow results and argue.

## Positioning
Scoring and drafting are designed around fight outcomes: method and round bonuses, cheap underdogs that pay off, and a once-per-event "Call the Finish". A fantasy-football clone could not truthfully offer this.

## Operating Context
Event-driven usage: drafts open before a card and lock server-side at fight or event start (configurable per league). Fight nights are the peak. Leagues are private, joined by invite code. Data comes from an external MMA provider via a data-access layer; currently mock data.

## Capabilities and Constraints
- Pages: home, events list, event detail (fight card), fighter profile, matchup comparison, league, draft/picks, leaderboard.
- Draft UI enforces budget and one fighter per bout.
- Stack: Next.js App Router, React, TypeScript strict, Tailwind CSS, lucide-react for icons.
- No real money or betting of any kind.
- No promotion logos or fighter photos unless a data provider licenses them; use initials/silhouette placeholders.
- Phases 2 to 4 (Supabase backend, real data, live tracking) are still ahead; the frontend must stay compatible with the data-access layer.

## Brand Commitments
- Working name: CAGEMETA, kept through the redesign.
- Mobile-first.

## Evidence on Hand
Mock data in `src/lib/data/mock/` uses real UFC fighters on two real cards: UFC 334 (upcoming, Nov 14 2026) and UFC 300 (completed, with its real results). Records, reach and height come from public records as of Oct 2026; per-minute striking/takedown stats are approximations and per-fight stats are not sourced. League, users and picks are invented. No fighter photography, no testimonials, no usage data. Do not fabricate any.

## Product Principles
- Fight outcomes drive the product; numbers (records, prices, points) must be fast to scan.
- Built for friends competing: standings, picks and rivalry are the emotional core.
- Phone-first; the draft must be usable one-handed before a lock.
- Points only; competition without money.

## Accessibility & Inclusion
Accessible by default: semantic HTML, keyboard navigation, sufficient contrast (dark-only theme for now).
