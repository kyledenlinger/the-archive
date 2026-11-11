# The Archive (General Edition)

*The Archive* is a short text RPG for undergraduate copyright and information-literacy sessions. Players pick a creator (a documentary maker, a social media creator, a nature channel, a zine artist, a musician, or a game developer). Guided by an unreliable Clerk, they make four decisions about reusing other people's work and licensing their own. Each decision goes into a cart as a "case note" for debrief. The game takes about 30 minutes, which leaves time for four short debriefs in a 45-minute session. It runs entirely in the browser, with no accounts, no data collection, and no network calls after the page loads.

The podcast edition this was built from lives in [`the-archive-v2`](https://github.com/kyledenlinger/the-archive-v2) and is unchanged.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173/the-archive/
npm test           # unit, screen, and full-playthrough tests (run `npm run build` first; one test checks dist/)
npm run validate   # content checks + the review list
npm run build      # type-check and build to dist/
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml` (validate → build → test → deploy).

## Where the text lives

All player-facing text is in `src/content/`. Components contain no game prose, so you can edit any of these files without touching code.

| What | File |
|---|---|
| Personas (names, media, descriptions) | `src/content/personas.ts` |
| Opening scene with the Clerk | `src/content/onboarding.ts` |
| Mode select, persona select, and end-screen framing | `src/content/ui.ts` |
| Class-mode "Wait here" screen | `src/content/interstitial.ts` |
| Stop 1: The "Free" Thing That Isn't (setups, choices, outcomes, cart notes, debrief) | `src/content/stops/stop1-free.ts` |
| Stop 2: The Public Domain Trap | `src/content/stops/stop2-layers.ts` |
| Stop 3: Permission Isn't Only About Copyright | `src/content/stops/stop3-permission.ts` |
| Ask-for-permission form and the 24 replies | `src/content/ask.ts` |
| Fair use factors, per-stop/per-persona text, and assessments | `src/content/fairUse.ts` |
| Stop 4: The Flip (licenses, reuse events, situations) | `src/content/stops/stop4-flip.ts` |
| The Clerk's guess, reveal, endings, and codas | `src/content/clerk.ts` |
| Reference desk entries and license definitions | `src/content/reference.ts` |
| Resources list | `src/content/resources.ts` |

The license definitions in `reference.ts` are also the "What this actually means" text in stop 4, so the two always match.

## Each term: `npm run validate`

The validator fails (exit 1) if any persona, license, or event is missing text, or any string is empty. It also fails if text assumes how many people share a device ("you two," "your partner," and similar) or if an outcome or cart note uses verdict words ("correct," "wrong," and similar).

It then prints **Review each term:** every item flagged `reviewBy`, sorted by date. These depend on law that changes on a schedule, on unsettled law, or on third parties' current terms:

- **Stop 2, Bard:** the U.S. sound-recording public-domain cutoff moves forward every January 1. Update the named year (currently "1925 or earlier," as of 2026).
- **Stop 3, Herald, Naturalist, Bard, Conjurer:** platform sound-library, AI-tool, asset-store, and font license terms.
- **Stop 4, Herald and Artificer:** the AI near-copy and AI training-license events.
- **Resources:** URLs and descriptions.

To flag something new, add `reviewBy: { date, note }` to a stop or resource, or `personaReviewBy: { persona: { date, note } }` to a stop.
