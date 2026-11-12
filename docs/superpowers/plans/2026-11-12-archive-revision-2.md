# The Archive — Revision 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the project brief, the four constraint meters with locks and hidden rolls, coached fair use in stop 1, the renamed stops, and “the shelf” ending with other futures. Remove the orphan-work mystery. Add the header (Home, About), cart panel, fixed Continue bar, and distinct Clerk speech.

**Architecture:** Same app and patterns as now. Content stays in `src/content/`, typed by `src/content/types.ts`. The pure reducer in `src/state.ts` owns all game state, including meters. New pure logic goes in `src/lib/meters.ts` and `src/lib/epilogue.ts`, and `src/lib/ask.ts` gains new rolls. Screens are top-level components with `ScreenProps` (`src/screens/types.ts`).

**Tech Stack:** Unchanged: React 19, TypeScript, Vite 6, Tailwind 4, motion, lucide-react, Vitest + Testing Library, `tsx` scripts, GitHub Pages via Actions.

**Spec:** `docs/superpowers/specs/2026-11-12-archive-revision-design.md` (the “revision spec”; § numbers below refer to it). It builds on `2026-11-11-archive-general-design.md`. All new and changed prose follows `docs/superpowers/specs/2026-11-11-archive-prose-style-sheet.md`.

## Global Constraints

- Work on a branch `revision-2`; merge to `main` only in Task 13. `kyledenlinger/the-archive-v2` is never touched.
- Every existing rule still holds: static site, no network calls, all prose in `src/content/`, player copy says “you” and never assumes group size, no verdict words, neutral on AI, `reviewBy` on anything time-sensitive.
- **Meters:** ids `time`, `budget`, `exposure`, `vision`; integers clamped to 0–6; never show the numbers.
  - Bands for `time`/`budget`/`vision`: 5–6 `best`, 2–4 `middle`, 0–1 `worst`. For `exposure`: 0–1 `best`, 2–4 `middle`, 5–6 `worst`.
  - State words: Time *Plenty / Tight / Out of time*; Budget *Comfortable / Stretched / Broke*; Exposure *Low / Some / High*; Vision *Intact / Compromised / Lost*.
- **Locks:** only `time` and `budget` lock options, and only in the `worst` band. Reasons, verbatim: “You’re out of time for this.”, “You’re already over budget.”, and, for a failed search, “You already looked. No luck.”
- **Locked options** stay visible and use `aria-disabled="true"`, never the native `disabled` attribute (so they stay focusable and readable). Activating one by click, Enter, or Space does nothing. The reason renders as visible text under the label and is linked with `aria-describedby`.
- Every stop keeps at least one choice with no `requires`.
- Every hidden roll is seeded from `state.seed` plus persona plus stop id, so retrying or going back never rerolls.
- Stop titles, verbatim: **Unmarked** (`free`), **Old Bones** (`layers`), **Strings Attached** (`permission`), **Out in the World** (`flip`). Ids don’t change.
- The project always ships (§7.2). No epilogue is a verdict: each includes something gained and something lost.
- About panel copy needs Kyle’s license choice and credit line. Leave the clearly marked placeholder `ABOUT_LICENSE_TBD` until he supplies them; the validator reports it as a warning, not an error.

## Review Focus

1. **Going back refunds meters but not a failed search.** Expected: after a failed search, going back to the stop restores the meters to their arrival values, the search choice stays locked with “You already looked. No luck.”, and Time isn’t charged twice. Test in Task 5.
2. **Everything locked at once.** Out of time *and* broke must still leave a usable choice at every stop and in every Ask follow-up. Expected: “Turn them down” and each stop’s unrequired choice are always available. Test in Tasks 2 and 10.
3. **Keyboard activation of locked options.** Because locked buttons stay focusable, Enter or Space could fire them. Expected: nothing happens, and screen readers read the reason. Test in Task 6.
4. **The fixed Continue bar hiding text.** On a short screen, the bar covers the last lines of a long passage. Expected: narrative screens have bottom padding at least the bar’s height, and the last line can be scrolled clear of the bar at 375×667. Test in Task 6.
5. **Repeated meter announcements.** The `aria-live` region re-announces on every render, or announces the same change twice. Expected: each meter change is announced exactly once, when it happens. Test in Task 6.

---

## File Map

```
src/content/types.ts                 T1   new/changed types
src/lib/testFixtures.ts              T1   fixture updated to the new schema
src/lib/validateContent.ts           T1   new rules
src/lib/meters.ts                    T2   new
src/lib/ask.ts                       T3   stop-aware odds, rollSearch, rollTerms
src/lib/epilogue.ts                  T4   new
src/state.ts                         T5   meters, snapshots, searches, new screens
src/components/Header.tsx            T6   new (Home, meters, Cart, Reference, About)
src/components/{MeterDisplay,CartPanel,AboutPanel,ConfirmDialog,ContinueBar}.tsx   T6 new
src/components/{ClerkSpeech,ChoiceButton}.tsx                                     T6 changed
src/components/CartBar.tsx           T6   deleted
src/content/ui.ts                    T6   meter words, lock reasons, header/about copy
src/screens/Brief.tsx                T7   new
src/content/personas.ts              T7   briefs + start meters
src/screens/Stop.tsx                 T8, T9   effects, locks, coached flow
src/mechanics/FairUseAnalysis.tsx    T8, T9   strength, coaching
src/content/stops/*.ts, fairUse.ts   T8–T11  titles, effects, requires, content
src/mechanics/AskRequest.tsx         T9, T10  search, terms, effects
src/content/ask.ts                   T9, T10  per-stop responses, odds, terms
src/screens/Flip.tsx                 T11  response effects; no clue/askForHelp
src/screens/Shelf.tsx, src/screens/ProjectSummary.tsx   T12 new
src/content/clerk.ts                 T12  rewritten as briefIntro + coachInvite + shelf
src/screens/{Guess,Reveal,Ending,CartReview}.tsx        T12 deleted
src/content/reference.ts             T12  orphan-works entry removed
```

---

### Task 1: Schema, fixture, and validator for revision 2

**Files:**
- Modify: `src/content/types.ts`, `src/lib/testFixtures.ts`, `src/lib/validateContent.ts`, `src/lib/validateContent.test.ts`
- Temporarily modify the content files only enough to type-check (add empty `effects: []`, placeholder briefs, and so on); the later tasks fill them in. Keep `npm run validate` usable by reviving the `--allow-placeholder` flag for this branch only, covering the new keys. It is removed in Task 13.

**Interfaces — Produces** (exact names; everything later imports these):

```ts
export type MeterId = 'time' | 'budget' | 'exposure' | 'vision';
export const METER_IDS: MeterId[] = ['time', 'budget', 'exposure', 'vision'];
export type Meters = Record<MeterId, number>;
export type MeterBand = 'best' | 'middle' | 'worst';
export type LockMeter = 'time' | 'budget';
export type ExposureTag = 'legal' | 'reputational';
export interface Effect { meter: MeterId; delta: number; tag?: ExposureTag }   // delta in -2..2
export type Effects = Effect[];
export type Strength = 'strong' | 'moderate' | 'weak';
export type TermKind = 'smallFee' | 'largeFee' | 'restriction' | 'credit';
export type VisionBand = 'intact' | 'compromised' | 'lost';
export type FateId = 'pulled' | 'asPlanned' | 'underCloud' | 'late' | 'smaller' | 'compromised';

export interface Outcome { text: string; cartNote: string; effects?: Effects }
export interface Choice {
  id: string;
  label: string;
  mechanic?: 'fairUse' | 'ask' | 'search';           // 'search' = track down, then ask
  outcome?: Outcome | Record<PersonaId, Outcome>;
  effects?: Effects | Record<PersonaId, Effects>;     // applied when the choice is recorded
  requires?: LockMeter[];
}
export interface Brief { making: string; answersTo: string; deadline: string; items: [string, string, string] }
export interface Persona { id: PersonaId; name: string; medium: string; description: string; brief: Brief; startMeters: Meters }

// StopBase loses clerkClue. StandardStop gains:
//   coached?: boolean                                        // true only for 'free'
//   searchFindChance?: Partial<Record<PersonaId, number>>     // 0..1, for 'search' choices
//   searchFail?: Partial<Record<PersonaId, string>>           // the not-found outcome text
export interface FairUseAssessment { text: string; strength: Strength }
export interface FairUseContent {
  factors: [FairUseFactor, FairUseFactor, FairUseFactor, FairUseFactor];
  coaching: [string, string, string, string];                 // Clerk lines, stop 1 only
  assessments: Record<StandardStopId, Record<PersonaId, FairUseAssessment>>;
}
export interface AskOdds { wellFormed: Record<AskResponse, number>; poor: Record<AskResponse, number> }
export interface Term { kind: TermKind; text: string; cartNote: string; effects: Effects; weight: number }
export interface AskContent {
  intro: string;
  fieldOptions: Record<AskField, { label: string; options: string[] }>;
  afterPrompt: string;
  responses: Partial<Record<StandardStopId, Record<PersonaId, Record<AskResponse, Outcome>>>>;
  odds?: Partial<Record<StandardStopId, Partial<Record<PersonaId, AskOdds>>>>;
  terms: Record<PersonaId, Term[]>;                            // drawn on a 'conditional' response
  acceptLabel: string; declineLabel: string;
}
// FlipStop loses clerkClue; its responses gain effects:
//   responses: Record<ReuseResponse, { label: string; cartNote: string; effects?: Effects }>
export interface ShelfContent {
  intro: string[];                                              // the Clerk walks you to the shelf
  fate: Record<PersonaId, Record<FateId, string>>;              // pulled/asPlanned: paragraphs; others: sentences
  scenes: Record<PersonaId, Record<LicenseId, string>>;         // the base scene, incl. the unwanted-use moment
  outsideDetail: Record<ReuseResponse, string>;                 // real run only, keyed by the 'outside' response
  lastWord: Record<PersonaId, Record<VisionBand, string>>;
  othersOffer: string;
  altFrame: string;                                             // contains "{license}"
  backToYours: string;
  closingLine: string;
}
export interface ClerkContent { briefIntro: string; coachInvite: string; shelf: ShelfContent }
// ReferenceEntry loses unlockAfterReveal. Remove GuessId, EndingId.
```

- [ ] **Step 1: Update `makeValidContent()`** to the new schema (every string `'x'`, every record complete; each choice with `effects: [{meter:'time',delta:-1},{meter:'exposure',delta:-1}]`; one choice per stop with no `requires`; start meters all `3`).

- [ ] **Step 2: Write failing validator tests** (add them to `validateContent.test.ts`):
- the valid fixture → `errors` is `[]`
- a choice whose effects are all costs → error ending `': effects need at least one gain and one cost'` (gain = `delta > 0` for time/budget/vision, `delta < 0` for exposure)
- a choice with only one meter in its effects → the same error
- an exposure effect with `delta > 0` and no `tag` → error ending `': exposure increase needs a tag'`
- every choice in a stop given `requires: ['time']` → error `'stops.free: needs at least one choice with no requires'`
- `startMeters.time = 7` → error `'personas[0].startMeters.time: out of range 0–6'`
- an effect `delta: 3` → error ending `': delta out of range -2..2'`
- a `'search'` choice in `free` with `searchFindChance.bard` missing → error `'stops.free.searchFindChance.bard: missing'`
- `ask.responses.free` missing while `free` has a `search` or `ask` choice → error `'ask.responses.free: missing'`
- `ask.terms.herald = []` → error `'ask.terms.herald: needs at least one term'`
- `clerk.shelf.altFrame` without `{license}` → error `'clerk.shelf.altFrame: must contain {license}'`
- `fairUse.assessments.free.bard.strength = 'meh'` → error ending `': invalid strength'`
- the group-size and verdict-word checks still run over all the new strings (brief, shelf)
- the string `ABOUT_LICENSE_TBD` anywhere → listed in `warnings` (add `warnings: string[]` to `ValidationResult`), not `errors`

Run: `npm test -- validateContent`. Expected: FAIL.

- [ ] **Step 3: Implement the rules** in `validateContent`. Remove the `ENDING_IDS` and `clerkClue` checks. The CLI prints warnings after errors and doesn’t fail on them.

- [ ] **Step 4: Run** `npm test && npm run lint`. Expected: PASS (the screens may still reference removed fields; stub them minimally to compile. Tasks 8–12 replace them).

- [ ] **Step 5: Commit** — `feat: revision 2 content schema and validator rules`.

---

### Task 2: Meter logic

**Files:**
- Create: `src/lib/meters.ts`
- Test: `src/lib/meters.test.ts`

**Interfaces — Produces:**
- `band(meter: MeterId, value: number): MeterBand`
- `applyEffects(meters: Meters, effects: Effects): { meters: Meters; legal: number; reputational: number }` (clamps to 0–6; `legal` and `reputational` count only the exposure *actually added* after clamping, by tag)
- `effectsFor(e: Effects | Record<PersonaId, Effects> | undefined, persona: PersonaId): Effects`
- `lockReason(choice: Choice, meters: Meters): LockMeter | null` (the first of `choice.requires` whose meter is in the `worst` band)
- `meterChanges(before: Meters, after: Meters): { meter: MeterId; from: MeterBand; to: MeterBand; direction: 'up' | 'down' }[]` (only meters whose value changed)
- `visionBand(v: number): VisionBand`

- [ ] **Step 1: Write failing tests:**
- `band('time', 5) === 'best'`, `band('time', 4) === 'middle'`, `band('time', 1) === 'worst'`; `band('exposure', 1) === 'best'`, `band('exposure', 5) === 'worst'`
- `applyEffects` clamps: time 1 with −2 → 0; exposure 6 with +2 tagged legal → exposure 6 and `legal 0`; exposure 4 with +2 legal → 6 and `legal 2`
- `lockReason({requires:['time']}, {time:1,…})` → `'time'`; time 2 → `null`; no `requires` → `null`
- **Review Focus 2:** for every persona’s `startMeters` driven to `{time:0, budget:0, …}`, every stop in the real `content` still has at least one choice with `lockReason(...) === null`
- `meterChanges` lists the right bands and direction, and omits unchanged meters
- `effectsFor` returns the persona entry for records, and the array as-is otherwise

- [ ] **Step 2: Implement.** **Step 3: Run tests.** Expected: PASS. **Step 4: Commit.**

---

### Task 3: Rolls for search, response odds, and terms

**Files:**
- Modify: `src/lib/ask.ts`, `src/lib/ask.test.ts`

**Interfaces — Produces** (replacing the current `dealAskResponse` signature; update its callers):
- `DEFAULT_ODDS: AskOdds` = the current `ASK_WEIGHTS` values (wellFormed 35/35/15/15, poor 15/25/25/35)
- `rollSeed(seed: number, persona: PersonaId, stopId: StandardStopId, salt: string): number` (FNV-1a over `${persona}|${stopId}|${salt}`, XORed with `seed`)
- `dealAskResponse(seed: number, persona: PersonaId, stopId: StandardStopId, wellFormed: boolean, odds?: AskOdds): AskResponse` (salt `'response'`)
- `rollSearch(seed: number, persona: PersonaId, stopId: StandardStopId, findChance: number): boolean` (salt `'search'`; true when the draw `< findChance`)
- `rollTerms(seed: number, persona: PersonaId, stopId: StandardStopId, terms: Term[]): Term` (salt `'terms'`; weighted by `Term.weight`)

- [ ] **Step 1: Write failing tests:**
- each roll gives the same result for the same inputs, every time
- `rollSearch` over seeds 1..4000 with `findChance 0.3` → a find rate within 0.27–0.33; with `0` → never; with `1` → always
- `rollTerms` over seeds 1..2000 with four terms of weight 1 → every kind appears
- `dealAskResponse` with custom odds `{wellFormed:{yes:100,conditional:0,no:0,silence:0}, …}` → always `'yes'` when well-formed
- the same seed with different `stopId` → at least one differing result over seeds 1..50

- [ ] **Step 2: Implement.** **Step 3: Run tests.** Expected: PASS. **Step 4: Commit.**

---

### Task 4: Epilogue assembly

**Files:**
- Create: `src/lib/epilogue.ts`
- Test: `src/lib/epilogue.test.ts`

**Interfaces — Produces:**
- `fateModifiers(atFlip: Meters, final: Meters, legal: number, reputational: number): FateId[]`. Rules (revision spec §7.2): if `band('exposure', final.exposure) === 'worst'` and `legal >= reputational` → `['pulled']`. Otherwise collect, in this order: `underCloud` (exposure worst and reputational larger), `late` (time worst at `atFlip`), `smaller` (budget worst at `atFlip`), `compromised` (vision worst at `atFlip`). If none applies → `['asPlanned']`.
- `assembleShelf(shelf: ShelfContent, persona: PersonaId, fate: FateId[], license: LicenseId, outside: ReuseResponse | undefined, finalVision: number): { fate: string; scene: string; lastWord: string }`. The fate text is the single paragraph for `pulled`/`asPlanned`; otherwise the modifier sentences joined with `' '`. The scene is `scenes[persona][license]`, followed by `' ' + outsideDetail[outside]` when `outside` is defined. The last word is `lastWord[persona][visionBand(finalVision)]`.
- `alternateScene(shelf: ShelfContent, persona: PersonaId, license: LicenseId): { heading: string; scene: string }`. The heading is `altFrame` with `{license}` replaced by the license label (pass the labels in, or import from the flip content). The scene is the base scene only, with no outside detail.

- [ ] **Step 1: Write failing tests:**
- exposure 6, legal 3, reputational 1 → `['pulled']`, even when time is 0
- exposure 6, legal 1, reputational 3, time 0 → `['underCloud', 'late']`
- all good → `['asPlanned']`
- `atFlip` budget 1 but final budget 3 → `smaller` still applies (fate reads stop-3-end values for time/budget/vision)
- `assembleShelf` with `outside` undefined → the scene equals the base scene exactly
- `alternateScene` never includes any `outsideDetail` text
- every one of the 2⁴ combinations of `underCloud`/`late`/`smaller`/`compromised` produces non-empty text for every persona in the real content (run this in Task 12, once the content exists; mark it `it.todo` until then)

- [ ] **Step 2: Implement.** **Step 3: Run tests.** Expected: PASS. **Step 4: Commit.**

---

### Task 5: Game state

**Files:**
- Modify: `src/state.ts`, `src/state.test.ts`

**Interfaces — Produces:**

```ts
export type Screen = 'mode' | 'onboarding' | 'persona' | 'brief' | 'stop' | 'interstitial' | 'flip' | 'shelf' | 'project';
export interface GameState {
  screen: Screen; mode: Mode | null; persona: PersonaId | null; stopIndex: number;
  cart: Partial<Record<StopId, string>>;
  flip: FlipRecord;
  meters: Meters;
  arrival: Meters;                  // snapshot when the current stop started
  atFlip: Meters | null;            // snapshot when the flip started (end of stop 3)
  exposureLegal: number; exposureReputational: number;
  arrivalTags: { legal: number; reputational: number };   // restored with `arrival` on REVISIT_STOP
  searches: Partial<Record<StandardStopId, 'found' | 'notFound'>>;
  sunk: Effects;                    // mid-stop costs already paid at this stop
  sunkKeys: string[];               // which one-time costs were paid ('search', 'fairUse', 'send')
  lastChanges: { id: number; changes: ReturnType<typeof meterChanges> } | null;   // for the live region
  seed: number;
}
// New or changed actions:
| { type: 'CHOOSE_PERSONA'; persona: PersonaId; startMeters: Meters }   // → 'brief'
| { type: 'FINISH_BRIEF' }                                               // → 'stop', sets arrival
| { type: 'APPLY_EFFECTS'; effects: Effects; key: string }               // one-time sunk cost mid-stop; ignored if key already in sunkKeys
| { type: 'RECORD_SEARCH'; stopId: StandardStopId; found: boolean }
| { type: 'RECORD_STOP'; stopId: StandardStopId; cartNote: string; effects: Effects }
| { type: 'RECORD_REUSE'; kind: ReuseEventKind; response: ReuseResponse; effects: Effects }
| { type: 'FINISH_FLIP'; cartNote: string }                              // → 'shelf'
// ADVANCE from 'shelf' → 'project'. REVISIT_STOP restores meters/tags from arrival.
// Removed: SET_GUESS, REVEAL, SET_ENDING.
```

- [ ] **Step 1: Write failing tests:**
- `CHOOSE_PERSONA` sets `meters` and `arrival` to `startMeters`, and the screen to `'brief'`; `FINISH_BRIEF` → `'stop'`
- `RECORD_STOP` applies effects through `applyEffects`, accumulates the tags, and sets `lastChanges` with a new `id`
- `ADVANCE` from the interstitial sets `arrival` to the current meters for the next stop; entering the flip also sets `atFlip`
- **Review Focus 1:** `APPLY_EFFECTS` time −2 → `RECORD_SEARCH notFound` → `RECORD_STOP` → `REVISIT_STOP` → meters equal `arrival`, `searches.free === 'notFound'`, and recording again doesn’t charge the search a second time
- `REVISIT_STOP` restores `exposureLegal`/`exposureReputational` to their values at arrival
- `RECORD_REUSE` applies effects; `FINISH_FLIP` → `'shelf'`; `ADVANCE` from `'shelf'` → `'project'`
- double `RECORD_STOP` still keeps one cart note per stop (existing test, kept) and applies effects **once** (the second replaces the first: meters are recomputed from `arrival`)
- `RESET` → `initialState(seed)`

- [ ] **Step 2: Implement.** `RECORD_STOP` computes from `arrival` plus the stop’s sunk effects, so a replaced choice doesn’t stack: `meters = applyEffects(applyEffects(arrival, sunk), choiceEffects)`. `APPLY_EFFECTS` appends to `sunk` and `sunkKeys` and updates `meters` immediately (so locks reflect it), unless `key` is already in `sunkKeys`. `ADVANCE` and `REVISIT_STOP` clear `sunk` and `sunkKeys`. Note that `REVISIT_STOP` refunds sunk costs by design (revision spec §4.7), while `searches` persists.
- Add a test: `APPLY_EFFECTS` with the same `key` twice charges once.

- [ ] **Step 3: Run tests.** Expected: PASS. **Step 4: Commit.**

---

### Task 6: Site chrome (header, meters, cart, about, Continue bar, Clerk speech, locked buttons)

**Files:**
- Create: `src/components/{Header,MeterDisplay,CartPanel,AboutPanel,ConfirmDialog,ContinueBar}.tsx`
- Modify: `src/components/{ClerkSpeech,ChoiceButton}.tsx`, `src/App.tsx`, `src/content/ui.ts`, `src/index.css`
- Delete: `src/components/CartBar.tsx` (and its uses)
- Test: `src/__tests__/chrome.test.tsx`

**Interfaces — Produces:**
- `<ChoiceButton onSelect lockedReason?: string>`: when `lockedReason` is set, it renders `aria-disabled="true"`, greyed, with the reason in a `<span id>` linked by `aria-describedby`; click, Enter, and Space do nothing. Remove all uses of native `disabled` for locked choices.
- `<ContinueBar>{button}</ContinueBar>`: fixed to the bottom, solid background, `h-20`. Narrative screens add the `pb-28` class to their page container.
- `<ClerkSpeech text>`: a separate block with a left rule, the “The Clerk” label, and a typewriter font: add `--font-clerk: "Courier Prime", "Courier New", ui-monospace, monospace` in `index.css`. No web-font loading (no network calls); the system fallback is fine.
- `<MeterDisplay meters lastChanges>`: four items, each with its name, state word, and a three-segment glyph (`■■□`, with best = 3 filled for time/budget/vision and Low = 1 filled for exposure); plus a visually hidden `aria-live="polite"` region that renders the change lines only when `lastChanges.id` changes. Change line wording comes from `ui.meterChange(meterLabel, fromWord, toWord)`, e.g. “Time: Plenty → Tight”. Same-band changes use `ui.meterNudge(meterLabel, direction, tag?)`, e.g. “Exposure rises (legal)”.
- `<Header>`: Home, `MeterDisplay` (after a persona is chosen), Cart button (“2 of 3 found”), Reference, About. Home opens `<ConfirmDialog>` with the revision spec §2.1 copy.
- `<CartPanel>`: the brief summary, three items with status (“Not yet found” or the cart note), plus “Your work” after the flip. On narrow screens it also shows the full meter words.
- `<AboutPanel>`: revision spec §2.1 copy from `ui.about`, including the `ABOUT_LICENSE_TBD` placeholder.
- Dialogs and panels trap focus, close on Escape, and return focus to their opener.

- [ ] **Step 1: Write failing tests:**
- Home on stop 2 → dialog; Keep playing → same screen, same cart; Start over → mode select, empty cart
- About opens and closes with Escape, and focus returns to the About button
- **Review Focus 3:** a `ChoiceButton` with `lockedReason` — click, `{Enter}`, and `{ }` don’t call `onSelect`; `getByRole('button', { description: /out of time/ })` finds it
- **Review Focus 5:** after one `RECORD_STOP` that changes two meters, the live region contains exactly two lines; re-rendering (open and close Reference) doesn’t change its text node identity or duplicate lines
- **Review Focus 4:** narrative screens render with the `pb-28` class and the Continue bar with `fixed bottom-0` (checked by class; the visual check is in Task 13)
- the Cart panel shows the three brief items and “Not yet found” before stop 1
- each Clerk line renders inside an element with the “The Clerk” label

- [ ] **Step 2: Implement.** Move every narrative screen’s primary Continue into `ContinueBar`: onboarding, the stop intro, outcomes, interstitial, brief, shelf.
- [ ] **Step 3: Run** `npm test`. Expected: PASS. **Step 4: Commit.**

---

### Task 7: The brief

**Files:**
- Create: `src/screens/Brief.tsx`
- Modify: `src/content/personas.ts`, `src/content/clerk.ts` (`briefIntro` only), `src/screens/PersonaSelect.tsx` (dispatch `startMeters`), `src/App.tsx`
- Test: `src/__tests__/brief.test.tsx`

- [ ] **Step 1: Write content:** each persona’s `brief` from the revision spec §3 table, in that persona’s voice, and `startMeters` from §4.5 verbatim. `briefIntro` is the Clerk presenting it. Each `items` line must name the artifact so the player recognizes it at the matching stop; check it against that stop’s `setup[persona]`.
- [ ] **Step 2: Write failing tests:** after choosing a persona, the brief shows its making, answers-to, deadline, three items, and the meter words for the starting values; Continue → stop 1; the header meters match.
- [ ] **Step 3: Implement.** **Step 4: Run tests.** Expected: PASS.
- [ ] **Step 5: Content review gate (Kyle).** **Step 6: Commit.**

---

### Task 8: Effects and locks in stops 2 and 3, plus renames

**Files:**
- Modify: `src/screens/Stop.tsx`, `src/mechanics/FairUseAnalysis.tsx`, `src/content/stops/{stop1-free,stop2-layers,stop3-permission,stop4-flip}.ts` (titles; remove `clerkClue`), `src/content/stops/{stop2-layers,stop3-permission}.ts` (effects, requires), `src/content/fairUse.ts` (strength on every assessment)
- Test: extend `src/__tests__/stop2.test.tsx`, `src/__tests__/stop.test.tsx`

**Interfaces:**
- Consumes: `effectsFor`, `lockReason`, `meterChanges` (Task 2); `RECORD_STOP` with effects; `APPLY_EFFECTS` (Task 5); `ChoiceButton lockedReason` (Task 6).
- `Stop` passes `lockedReason={ui.lock[lockReason(c, state.meters)]}` to each choice (`ui.lock = { time: 'You’re out of time for this.', budget: 'You’re already over budget.' }`).
- The outcome screen lists `meterChanges(before, after)` using the same `ui` wording as the live region, where `after` previews the result of `applyEffects`. The effects are actually applied only on “Add to cart.”
- Optional fair use (stops 2–3): starting the analysis dispatches `APPLY_EFFECTS` with `effects: [{meter:'time',delta:-1}]`, `key: 'fairUse'`. Its cart record carries strength effects: `strong` → `[{exposure 0},{vision +1}]`, `moderate` → `[{exposure +1, tag:'legal'},{vision +1}]`, `weak` → `[{exposure +2, tag:'legal'},{vision +1}]`. (A zero delta is fine for display, but the validator counts the gain/cost rule on the recorded set, which is time −1 plus these.)

- [ ] **Step 1: Write content:** effects and `requires` for every stop 2–3 choice, per revision spec §4.3, §4.6, and §5.3. Contacting a rights holder or asking requires `time`; paying requires `budget`. Every exposure increase carries a tag, and the outcome text says which kind in plain words. Give every fair use assessment a `strength` matching its existing text. Apply the new titles verbatim.
- [ ] **Step 2: Write failing tests:**
- stop 2 shows the title “Old Bones”; stop 3 shows “Strings Attached”
- a stop 3 choice requiring Time, with time set to 1 by test content → rendered with “You’re out of time for this.” and not selectable
- picking a choice shows its meter change lines; “Choose again” leaves the header meters unchanged; “Add to cart” changes them
- fair use in stop 2 costs Time once, even after backing out and starting again (dispatch `APPLY_EFFECTS` with `key: 'fairUse'`, which the reducer ignores the second time)
- [ ] **Step 3: Implement.** **Step 4: Run** `npm test && npm run validate -- --allow-placeholder`. Expected: PASS.
- [ ] **Step 5: Content review gate (Kyle).** **Step 6: Commit.**

---

### Task 9: Stop 1, Unmarked: coached fair use, then decide (with search)

**Files:**
- Modify: `src/screens/Stop.tsx`, `src/mechanics/FairUseAnalysis.tsx`, `src/mechanics/AskRequest.tsx`, `src/content/stops/stop1-free.ts`, `src/content/fairUse.ts` (`coaching`), `src/content/clerk.ts` (`coachInvite`), `src/content/ask.ts` (`responses.free`)
- Test: rewrite `src/__tests__/stop.test.tsx` for the new stop 1 flow

**Interfaces:**
- When `stop.coached` is true, the flow is: intro → setup → complication → `ClerkSpeech(coachInvite)` → `FairUseAnalysis coached` (no back-out; each factor shows `fairUse.coaching[i]` in `ClerkSpeech` before the persona text) → assessment → the decision choices. There’s no `APPLY_EFFECTS` time cost for the coached analysis.
- The decision choices (revision spec §5.2), in this order: use it on your fair use analysis (effects by strength, as in Task 8, without the time cost) / find a free alternative (time −1, vision −1, exposure −1) / pay for a licensed alternative (`requires: ['budget']`; budget −2, exposure −1) / track down the owner and ask (`mechanic: 'search'`, `requires: ['time']`).
- `'search'`: dispatch `APPLY_EFFECTS` with `effects: [{meter:'time',delta:-2}]`, `key: 'search'`, call `rollSearch(seed, persona, 'free', stop.searchFindChance[persona])`, and dispatch `RECORD_SEARCH`.
  - Not found → show `stop.searchFail[persona]`, then return to the choices, where the search choice shows `lockedReason` “You already looked. No luck.”
  - Found → open `AskRequest` with `stopId='free'` and `sendCost={[]}` (the search already paid).
- `AskRequest` gains the props `stopId: StandardStopId` and `sendCost: Effects` (default `[{meter:'time',delta:-1}]`, applied via `APPLY_EFFECTS` with `key: 'send'` when the request is sent).

- [ ] **Step 1: Write content:**
  - the four `coaching` lines (the Clerk explaining what each factor really asks, the same for every persona, in his voice)
  - `coachInvite`
  - stop 1’s new choices with outcomes, effects, and `requires`, per persona
  - `searchFindChance` per persona, from 0.3 to 0.7, matched to how traceable the artifact is (for example, Conjurer’s forum sprite sheet 0.3, Bard’s drum break 0.6)
  - `searchFail` per persona (the username leads nowhere, and so on)
  - `ask.responses.free` for all six personas × four responses, with effects per revision spec §5.4
- [ ] **Step 2: Write failing tests:**
- stop 1 has no fair use *choice*; the analysis starts after the complication, and each factor shows the coaching line in a Clerk block
- after the assessment, the four decision choices appear in order
- the search with a seed that fails (find it in the test by scanning seeds with `rollSearch`) → the fail text, Time drops one band from Plenty for the Conjurer start (5 → 3), and the search choice is locked with “You already looked. No luck.”
- the search with a seed that succeeds → the Ask form, and sending it doesn’t charge Time again
- **Review Focus 2:** with start meters forced to time 0 and budget 0, stop 1 still offers “use it” and “find a free alternative”
- [ ] **Step 3: Implement.** **Step 4: Run tests.** Expected: PASS.
- [ ] **Step 5: Content review gate (Kyle).** **Step 6: Commit.**

---

### Task 10: Ask responses, odds, and terms

**Files:**
- Modify: `src/mechanics/AskRequest.tsx`, `src/content/ask.ts` (move the current `responses` under `responses.permission`; add `odds`, `terms`, `acceptLabel`, `declineLabel`)
- Test: rewrite `src/__tests__/ask.test.tsx`

**Interfaces:**
- On send: `dealAskResponse(seed, persona, stopId, wellFormed, ask.odds?.[stopId]?.[persona] ?? DEFAULT_ODDS)`.
- `conditional` → `rollTerms(seed, persona, stopId, ask.terms[persona])`. Show the response text plus `term.text`, with two buttons:
  - **Accept the terms:** `lockedReason` budget when the term has a negative budget effect and budget is in the worst band. Records the cart note `response.cartNote + ' ' + term.cartNote` with the effects `[...response.effects, ...term.effects, {meter:'exposure', delta:-1}]`.
  - **Turn them down:** goes to the existing follow-ups (use it anyway / don’t / fair use).
- `yes` / `no` / `silence` → the response with its `effects`, then the existing follow-ups. Each follow-up appends its `askFollowUps` cart sentence and adds its own effects. Content defines these in `askFollowUps` (rename to `{ label, note, effects }` objects): **use it anyway** after a no or silence → `exposure +2 legal`, `vision +1`; **don’t use it** → `vision −1`, `exposure −1`; **fair use** → opens the analysis for this stop.

- [ ] **Step 1: Write content:**
  - `terms` per persona: at least one of each kind, with weights. A large fee is rarer for indie creators and more common for labels and stock agencies.
  - `odds` overrides wherever a persona’s counterpart is plainly more or less likely to answer (a label vs. an individual artist), with each override explained in a code comment.
  - effects on every response
- [ ] **Step 2: Write failing tests:**
- a seed giving `conditional` with a `largeFee` (found by scanning) and budget 1 → “Accept the terms” locked with “You’re already over budget.”, and “Turn them down” enabled (**Review Focus 2**)
- Accept applies budget and exposure changes visible in the header
- Send → Back → Send gives the same response and the same terms
- custom odds in test content (yes 100) always give yes
- [ ] **Step 3: Implement.** **Step 4: Run tests.** Expected: PASS.
- [ ] **Step 5: Content review gate (Kyle).** **Step 6: Commit.**

---

### Task 11: Out in the World (the flip) adjustments

**Files:**
- Modify: `src/screens/Flip.tsx`, `src/mechanics/ReuseEvents.tsx`, `src/content/stops/stop4-flip.ts`
- Test: update `src/__tests__/flip.test.tsx`

- [ ] **Step 1: Content:**
  - Remove the clue and the `askForHelp` line, and rewrite any flip text that hinted at the Clerk’s secret, following the style sheet.
  - Add `effects` to the four responses: takedown time −1; negotiate budget +1 and time −1; credit none; let it go vision −1. These are defaults; vary them per event in the event `setup` copy only if the text needs it.
  - The title is “Out in the World.”
- [ ] **Step 2: Write failing tests:**
- the title shows; no `askForHelp` text renders
- `negotiate` raises Budget by one step in state
- `FINISH_FLIP` goes to the shelf
- [ ] **Step 3: Implement** (`RECORD_REUSE` with effects). **Step 4: Run tests.** Expected: PASS. **Step 5: Commit.**

---

### Task 12: The shelf, other futures, and the project summary

**Files:**
- Create: `src/screens/Shelf.tsx`, `src/screens/ProjectSummary.tsx`
- Rewrite: `src/content/clerk.ts` (the `shelf` content)
- Modify: `src/content/reference.ts` (remove `orphan-works`), `src/content/ui.ts` (remove `endUi` guess/reveal strings; add project summary labels), `src/App.tsx`, `src/__tests__/helpers.tsx` (drop `guessAndReveal`; add `toShelf`), `src/lib/epilogue.test.ts` (turn the `it.todo` into a real test)
- Delete: `src/screens/{Guess,Reveal,Ending,CartReview}.tsx` and their tests (`ending.test.tsx`)
- Test: `src/__tests__/shelf.test.tsx`

**Interfaces:**
- `<Shelf>`: shows the `shelf.intro` paragraphs (Continue bar), then the `assembleShelf` fate, scene, and last word, then `othersOffer` with four buttons for the licenses other than `state.flip.license`.
  - An alternate view uses `alternateScene`. It’s styled distinctly (`opacity-80 saturate-50` plus a dashed border) and headed with `altFrame` text; the “Back to your shelf” button returns. Which alternate is shown is `useState` in `Shelf` (declared at module top level).
  - Then `closingLine`, then `ADVANCE` → `'project'`.
- `<ProjectSummary>`: the brief, the three items with their cart notes, “Your work” with its license, the final meter words, the facilitator line in class mode (revision spec §7.6 copy) or the independent summary, resources, and “Play again” (`RESET` with a new seed).
- In independent mode, the flip’s `debrief` shows between the flip and the shelf. Use the existing interstitial: `FINISH_FLIP` goes to `'interstitial'` when the mode is independent, and `ADVANCE` from there goes to `'shelf'`. Update Task 5’s reducer and add that test here.

- [ ] **Step 1: Write content** per revision spec §7:
  - `intro`
  - `fate`: 6 personas × 6 fates
  - `scenes`: 6 × 5. Each one includes something gained, something lost, and an unauthorized or uncredited moment written to sting. The CC0 scene is legally accurate that uncredited use is allowed.
  - `outsideDetail`: 4 lines
  - `lastWord`: 6 × 3
  - `othersOffer`, `altFrame` (containing `{license}`), `backToYours`, `closingLine`

  All rights reserved scenes can use the life-plus-70 adaptation example, which is accurate for works by individual creators. Mark any claim that could change with `reviewBy`.
- [ ] **Step 2: Write failing tests:**
- the shelf shows the fate, the scene, and the last word for a seeded playthrough
- the four alternate buttons exclude the chosen license; opening one shows its base scene and the “What might have been” heading; Back returns; header meters, cart, and `flip.license` are unchanged afterward
- independent mode shows the flip debrief before the shelf; class mode doesn’t
- the project summary lists all three items and Your work; Play again → mode select
- the reference panel has no “Orphan Works” entry
- the epilogue combination test from Task 4 (all modifier combinations × all personas give non-empty text)
- [ ] **Step 3: Implement. Delete the old screens.** **Step 4: Run** `npm test && npm run validate -- --allow-placeholder && npm run build`. Expected: PASS.
- [ ] **Step 5: Content review gate (Kyle).** **Step 6: Commit.**

---

### Task 13: Playthrough, prose pass, cleanup, deploy

**Files:**
- Modify: `src/__tests__/playthrough.test.tsx`, `src/__tests__/helpers.tsx`, `scripts/validate-content.ts` (remove `--allow-placeholder`), `README.md`

- [ ] **Step 1: Update the playthrough test:** six personas × both modes, always taking the first *unlocked* choice, `cc-by` in the flip, and `credit` for every response; assert the run reaches the project summary with all three items filled. Add one run that takes the most expensive unlocked option at every step, asserting no dead end (**Review Focus 2**).
- [ ] **Step 2: Prose pass** over every string added or changed on this branch, against the prose style sheet and its continuity outline. Check in particular:
  - the brief items match the stop setups
  - no text still alludes to the Clerk’s old secret (`grep -ri "orphan\|scrapbook\|clue" src/content` → none)
  - meter-change wording reads naturally
- [ ] **Step 3: Remove `--allow-placeholder`.** Run `npm test && npm run validate && npm run build`. Expected: all pass. `validate` shows the review list, plus the `ABOUT_LICENSE_TBD` warning until Kyle supplies the license.
- [ ] **Step 4: Update the README:** the meters, where to tune starting values and effects, and where to edit rolls (find chances, odds, terms).
- [ ] **Step 5: Manual check** in `npm run dev`, at 1280×800 and 375×667:
  - the Continue bar never moves and never covers text (**Review Focus 4**)
  - one keyboard-only run, including a locked option
  - no console errors
- [ ] **Step 6: Merge and deploy:** `git checkout main && git merge --ff-only revision-2 && git push origin main`. Expected: Actions green, and the site live at `https://kyledenlinger.github.io/the-archive/`.
