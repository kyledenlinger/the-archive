# The Archive (General Edition) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the podcast edition of *The Archive* (`kyledenlinger/the-archive-v2`) into a general-audience copyright RPG on `kyledenlinger/the-archive` `main`, deployed as a static site on GitHub Pages.

**Architecture:** A React single-page app with no backend. All player-facing text lives in typed content modules under `src/content/`. A pure reducer in `src/state.ts` owns game state. Pure mechanic logic (seeded randomness, the Ask deal, license/event resolution, content validation) lives in `src/lib/` and is unit-tested. Screens are top-level components that read content and dispatch actions. v2’s visual style (amber-on-dark, serif italics, Motion transitions) is ported screen by screen. v2’s prose is reused where the spec keeps it, mainly the Clerk’s voice and the fair use factor descriptions.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind 4 (`@tailwindcss/vite`), `motion`, `lucide-react`; Vitest + Testing Library + jsdom for tests; `tsx` for scripts; GitHub Actions → GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-11-archive-general-design.md` (read it before starting; section numbers below, like §4, refer to it).

**Deviation from spec §9, step 3:** the spec suggests first extracting v2’s prose and components with no behavior change, then replacing the content. Every podcast string gets replaced anyway, so this plan skips the intermediate step and ports v2’s screens directly onto the new content schema. v2 remains the reference for look and voice, and `the-archive-v2` is never modified.

## Global Constraints

- `kyledenlinger/the-archive-v2` is read-only. Never push to it.
- Static site only: no backend, no API keys, no analytics, no network calls after page load, no saved progress across sessions (§2, §10).
- Remove `@google/genai`, `express`, `@types/express`, `dotenv`, the `GEMINI_API_KEY` `define`, `.env.example`, and `metadata.json` (§7.1).
- Vite `base` is `'/the-archive/'` (GitHub Pages project site).
- Player-facing copy always addresses “you” and never assumes how many people share a device. No “you two,” “your partner,” “both of you,” “each pair,” or “your pair” (§3.1).
- Never call a choice “correct,” “right,” or “wrong.” Cart notes describe what the player did and why it matters (§1).
- Neutral on AI: no value stance in AI-related text or outcomes (§1).
- No ending is framed as good or bad. Each states a trade-off (§6.3).
- All game prose lives in `src/content/`. Components contain no game prose; UI chrome labels like “Continue” and “Reference” may live in components.
- Any string about unsettled or recently changed law, or about a third party’s current terms, carries a `reviewBy` flag (§7.4).
- Accessibility: every interactive element is a real `<button>` or form control, keyboard-operable, with a visible focus ring. Information is never conveyed by color alone (§2).
- Six personas, in this order: `chronicler`, `herald`, `naturalist`, `artificer`, `bard`, `conjurer` (§3.3).
- Four stops, in this order: `free`, `layers`, `permission`, `flip` (§4).

## Review Focus

1. **State that resets mid-scene.** In v2, components are declared inside `App()`, so any App re-render remounts them and wipes local state. Opening the reference panel during onboarding resets the dialogue to step 1. Expected: opening or closing the reference panel never changes the current screen or step. Test in Task 5.
2. **Double-clicks and repeated choices.** A fast double-click on a choice, or replaying a stop, must not add two cart items or skip a stop. Expected: one cart slot per stop, and the last choice wins. Test in Task 3.
3. **Rerolling the Ask response.** A player who backs out of Ask and tries again must get the same response for the same request quality. Expected: the response is a pure function of the session seed, persona, and well-formedness. Test in Task 4.
4. **Broken asset paths on GitHub Pages.** The site is served under `/the-archive/`, not `/`. Expected: the built `index.html` references assets under `/the-archive/`, and the deployed page loads with no 404s. Test in Task 1.
5. **Keyboard-only players losing their place.** When the screen changes, focus stays on a removed button and keyboard users are stranded. Expected: on every screen change, focus moves to that screen’s main heading. Test in Task 5.

---

## File Map

```
.github/workflows/deploy.yml        Task 1
vite.config.ts, package.json        Task 1
vitest.setup.ts                     Task 1
src/content/types.ts                Task 2   schema (everything else imports this)
src/lib/validateContent.ts          Task 2   pure validator
scripts/validate-content.ts         Task 2   CLI wrapper
src/state.ts                        Task 3   GameState, actions, reducer
src/lib/rng.ts                      Task 4   seeded RNG
src/lib/ask.ts                      Task 4   Ask well-formedness + response deal
src/lib/flip.ts                     Task 4   license × event resolution
src/content/index.ts                Task 5   assembles all content into one GameContent object
src/content/{personas,onboarding,reference,resources}.ts   Task 5
src/App.tsx                         Task 5   reducer + screen router only
src/components/{ClerkSpeech,ChoiceButton,CartBar,ReferencePanel,ScreenHeading}.tsx   Task 5
src/screens/{ModeSelect,Onboarding,PersonaSelect}.tsx      Task 5
src/screens/{Stop,Interstitial}.tsx                        Task 6
src/mechanics/FairUseAnalysis.tsx                          Task 6
src/content/stops/stop1-free.ts, src/content/fairUse.ts    Task 6
src/content/stops/stop2-layers.ts                          Task 7
src/content/stops/stop3-permission.ts, src/content/ask.ts  Task 8
src/mechanics/AskRequest.tsx                               Task 8
src/content/stops/stop4-flip.ts                            Task 9
src/screens/Flip.tsx, src/mechanics/{LicensePicker,ReuseEvents}.tsx   Task 9
src/content/clerk.ts                                       Task 10
src/screens/{Guess,Reveal,Ending,CartReview}.tsx           Task 10
src/__tests__/playthrough.test.tsx                         Task 11
```

---

### Task 1: Migrate the repo and set up tooling

**Prerequisites (Kyle, once):**
- GitHub Pages on a private repo requires a paid GitHub plan. Either make `the-archive` public, or confirm the account has Pro.
- In the repo, go to Settings → Pages → Source and choose **GitHub Actions**.

**Files:**
- Replace: everything in `the-archive` except `docs/`
- Copy from v2: `index.html`, `src/`, `tsconfig.json`, `vite.config.ts`, `package.json`, `.gitignore`
- Modify: `package.json`, `vite.config.ts`
- Create: `vitest.setup.ts`, `.github/workflows/deploy.yml`, `src/__tests__/smoke.test.ts`

- [ ] **Step 1: Branch and replace contents with v2**

```bash
git clone https://github.com/kyledenlinger/the-archive && cd the-archive
git checkout -b general-edition
git ls-files | grep -v '^docs/' | xargs git rm -q
git clone --depth 1 https://github.com/kyledenlinger/the-archive-v2 /tmp/archive-v2
rsync -a --exclude .git --exclude .env.example --exclude metadata.json /tmp/archive-v2/ ./
```

Expected: `ls` shows `docs/ index.html package.json src/ tsconfig.json vite.config.ts`. If `docs/superpowers/specs/2026-11-11-archive-general-design.md` and this plan aren’t in `docs/`, copy them in now.

- [ ] **Step 2: Fix dependencies**

Remove `@google/genai`, `express`, `dotenv` from `dependencies`, and `@types/express` from `devDependencies`. Set `"name": "the-archive"`. Add devDependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`. Scripts:

```json
"dev": "vite",
"build": "tsc --noEmit && vite build",
"preview": "vite preview",
"lint": "tsc --noEmit",
"test": "vitest run",
"validate": "tsx scripts/validate-content.ts"
```

Run `npm install`. Expected: exits 0.

- [ ] **Step 3: Rewrite `vite.config.ts`**

Use `defineConfig({ base: '/the-archive/', plugins: [react(), tailwindcss()], test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'] } })`. Add `/// <reference types="vitest/config" />` at the top. Drop `loadEnv`, `define`, the `@` alias, and the AI Studio HMR block, and remove the matching `paths` entry from `tsconfig.json`. `vitest.setup.ts` contains `import '@testing-library/jest-dom/vitest';`.

- [ ] **Step 4: Write the base-path test** in `src/__tests__/smoke.test.ts`

```ts
import { readFileSync, existsSync } from 'node:fs';
test('built index.html references assets under /the-archive/', () => {
  expect(existsSync('dist/index.html')).toBe(true);
  const html = readFileSync('dist/index.html', 'utf8');
  expect(html).toMatch(/src="\/the-archive\/assets\//);
  expect(html).not.toMatch(/src="\/assets\//);
});
```

- [ ] **Step 5: Build and test**

Run: `npm run build && npm test`
Expected: the build succeeds (the v2 podcast game still compiles), and the smoke test passes.

- [ ] **Step 6: Add `.github/workflows/deploy.yml`**

Trigger on push to `main` and `workflow_dispatch`. Jobs: checkout → `actions/setup-node@v4` (node 22, npm cache) → `npm ci` → `npm test` → `npm run validate` (add this step in Task 2, once the script exists) → `npm run build` → `actions/upload-pages-artifact@v3` (path `dist`) → `actions/deploy-pages@v4`. Permissions: `pages: write`, `id-token: write`, `contents: read`.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "chore: start general edition from v2; strip AI Studio deps; add vitest and Pages deploy"
```

---

### Task 2: Content schema and validator

**Files:**
- Create: `src/content/types.ts`, `src/lib/validateContent.ts`, `scripts/validate-content.ts`
- Test: `src/lib/validateContent.test.ts`

**Interfaces:**
- Produces: every type below, plus `validateContent(c: GameContent): { errors: string[]; reviewItems: { where: string; date: string; note: string }[] }`.

- [ ] **Step 1: Write `src/content/types.ts` exactly as follows** (later tasks depend on these names):

```ts
export type PersonaId = 'chronicler' | 'herald' | 'naturalist' | 'artificer' | 'bard' | 'conjurer';
export const PERSONA_IDS: PersonaId[] = ['chronicler', 'herald', 'naturalist', 'artificer', 'bard', 'conjurer'];
export type StopId = 'free' | 'layers' | 'permission' | 'flip';
export const STOP_ORDER: StopId[] = ['free', 'layers', 'permission', 'flip'];
export type StandardStopId = Exclude<StopId, 'flip'>;
export type Mode = 'class' | 'independent';
export type LicenseId = 'arr' | 'cc-by' | 'cc-by-sa' | 'cc-by-nc' | 'cc0';
export const LICENSE_IDS: LicenseId[] = ['arr', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'cc0'];
export type ReuseEventKind = 'within' | 'outside' | 'beyond';
export type ReuseResponse = 'takedown' | 'credit' | 'negotiate' | 'let-go';
export type AskField = 'what' | 'how' | 'where' | 'howLong';
export type AskResponse = 'yes' | 'conditional' | 'no' | 'silence';
export type EndingId = 'search' | 'shelf' | 'wait';
export type GuessId = 'photograph' | 'song' | 'letter' | 'film' | 'other';

export interface ReviewFlag { date: string; note: string }   // date: ISO yyyy-mm-dd
export interface Outcome { text: string; cartNote: string }
export interface Persona { id: PersonaId; name: string; medium: string; description: string }

export interface Choice {
  id: string;
  label: string;
  mechanic?: 'fairUse' | 'ask';                       // mechanic choices have no outcome
  outcome?: Outcome | Record<PersonaId, Outcome>;
}
export interface Debrief { lesson: string; prompts: string[] }   // shown in independent mode
export interface StopBase {
  id: StopId;
  title: string;
  clerkIntro: string;
  clerkClue: string;
  setup: Record<PersonaId, string>;
  debrief: Debrief;
  reviewBy?: ReviewFlag;
  personaReviewBy?: Partial<Record<PersonaId, ReviewFlag>>;
}
export interface StandardStop extends StopBase { id: StandardStopId; complication: string; choices: Choice[] }

export interface FairUseFactor { title: string; description: string; text: Record<StandardStopId, Record<PersonaId, string>> }
export interface FairUseContent { factors: [FairUseFactor, FairUseFactor, FairUseFactor, FairUseFactor]; assessments: Record<StandardStopId, Record<PersonaId, string>> }

export interface AskContent {
  intro: string;
  fieldOptions: Record<AskField, { label: string; options: string[] }>;
  responses: Record<PersonaId, Record<AskResponse, Outcome>>;
  afterPrompt: string;   // “What do you do with this answer?”
}

export interface FlipStop extends StopBase {
  id: 'flip';
  work: Record<PersonaId, string>;    // what “your work” is
  licenses: Record<LicenseId, { label: string; clerkGloss: string; summary: string }>;
  events: Record<PersonaId, Record<ReuseEventKind, { setup: string; situation: Record<LicenseId, string> }>>;
  responses: Record<ReuseResponse, { label: string; cartNote: string }>;
}

export interface ClerkContent {
  askForHelp: string;                         // “Could you do that for me?”
  guessPrompt: string;
  guessOptions: { id: GuessId; label: string }[];
  reveal: string[];                           // paragraphs, shown in order
  endings: Record<EndingId, { label: string; scene: string }>;
  codaShade: Record<LicenseId, string>;
  closingLine: string;                        // the shared “license your work” message
}

export interface OnboardingContent { lines: string[] }
export interface ReferenceEntry { id: string; title: string; body: string; unlockAfterReveal?: boolean }
export interface Resource { name: string; url: string; description: string; reviewBy?: ReviewFlag }
export interface InterstitialCopy { waitTitle: string; waitBody: string; continueLabel: string }

export interface GameContent {
  personas: Persona[];
  onboarding: OnboardingContent;
  stops: { free: StandardStop; layers: StandardStop; permission: StandardStop; flip: FlipStop };
  fairUse: FairUseContent;
  ask: AskContent;
  clerk: ClerkContent;
  reference: ReferenceEntry[];
  resources: Resource[];
  interstitial: InterstitialCopy;
}
```

- [ ] **Step 2: Write failing tests** in `src/lib/validateContent.test.ts`, using a minimal valid fixture `makeValidContent(): GameContent` defined in the test file, where every string is `'x'`:

- `test('valid content has no errors')`: `expect(validateContent(makeValidContent()).errors).toEqual([])`
- `test('flags missing persona setup')`: delete `stops.free.setup.bard` → errors contain `'stops.free.setup.bard: missing'`
- `test('flags empty strings')`: set `stops.layers.complication = '  '` → errors contain `'stops.layers.complication: empty'`
- `test('flags missing fair use text')`: delete `fairUse.factors[2].text.permission.herald` → errors contain `'fairUse.factors[2].text.permission.herald: missing'`
- `test('flags flip event cell')`: delete `stops.flip.events.naturalist.beyond.situation['cc-by-nc']` → errors contain `"stops.flip.events.naturalist.beyond.situation.cc-by-nc: missing"`
- `test('flags group-size wording')`: set `stops.free.setup.chronicler = 'You two find a reel.'` → errors contain an entry starting with `'stops.free.setup.chronicler: assumes group size'`
- `test('flags verdict words in cart notes')`: set a choice outcome’s `cartNote = 'Correct choice.'` → errors contain an entry ending `': verdict word "correct"'`
- `test('collects review items')`: set `stops.permission.personaReviewBy = { bard: { date: '2027-01-01', note: 'check generator terms' } }` → `reviewItems` contains `{ where: 'stops.permission.personaReviewBy.bard', date: '2027-01-01', note: 'check generator terms' }`
- `test('mechanic choices need no outcome; others do')`: a choice with `mechanic: 'fairUse'` and no outcome → no error; a choice with neither → error `'…: outcome missing'`

Run: `npm test -- validateContent`. Expected: FAIL (module not found).

- [ ] **Step 3: Implement `validateContent`** in `src/lib/validateContent.ts`

Walk the structure explicitly: every `Record<PersonaId, …>` must have all six keys, every `Record<LicenseId, …>` all five, every `Record<StandardStopId, …>` all three, and `ReuseEventKind`/`AskResponse`/`EndingId` records all their keys. Report missing keys as `<dotted.path>: missing`. Recursively check every string for `.trim() === ''` → `: empty`. Group-size regex (case-insensitive): `/\b(you two|both of you|your partner|each pair|your pair|the pair)\b/` → `: assumes group size (“<match>”)`. Verdict regex on `cartNote` and `Outcome.text` only: `/\b(correct|incorrect|right answer|wrong)\b/i` → `: verdict word "<word lowercased>"`. Collect every `reviewBy`/`personaReviewBy`/`Resource.reviewBy` into `reviewItems`.

- [ ] **Step 4: Run tests.** Expected: PASS.

- [ ] **Step 5: Write `scripts/validate-content.ts`**

Import `content` from `../src/content/index` and run `validateContent`. Print errors, then a “Review each term:” list sorted by date. Exit 1 if there are errors. Until Task 5 creates `src/content/index.ts`, this script fails at import. That’s expected; add the `npm run validate` step to the deploy workflow now.

- [ ] **Step 6: Commit** — `git commit -am "feat: content schema and validator"` (add new files first).

---

### Task 3: Game state reducer

**Files:**
- Create: `src/state.ts`
- Test: `src/state.test.ts`

**Interfaces:**
- Consumes: types from `src/content/types.ts`.
- Produces:

```ts
export type Screen = 'mode' | 'onboarding' | 'persona' | 'stop' | 'interstitial' | 'flip' | 'guess' | 'reveal' | 'ending' | 'cart';
export interface FlipRecord { license: LicenseId | null; responses: Partial<Record<ReuseEventKind, ReuseResponse>> }
export interface GameState {
  screen: Screen; mode: Mode | null; persona: PersonaId | null;
  stopIndex: number;                               // index into STOP_ORDER
  cart: Partial<Record<StopId, string>>;           // one cart note per stop
  flip: FlipRecord; guess: GuessId | null; ending: EndingId | null;
  revealed: boolean; seed: number;
}
export type Action =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'CHOOSE_PERSONA'; persona: PersonaId }
  | { type: 'RECORD_STOP'; stopId: StandardStopId; cartNote: string }
  | { type: 'ADVANCE' }
  | { type: 'SET_LICENSE'; license: LicenseId }
  | { type: 'RECORD_REUSE'; kind: ReuseEventKind; response: ReuseResponse }
  | { type: 'FINISH_FLIP'; cartNote: string }
  | { type: 'SET_GUESS'; guess: GuessId }
  | { type: 'REVEAL' }
  | { type: 'SET_ENDING'; ending: EndingId }
  | { type: 'RESET'; seed: number };
export function initialState(seed: number): GameState;
export function reducer(state: GameState, action: Action): GameState;
```

- [ ] **Step 1: Write failing tests** in `src/state.test.ts`:

- `initialState(42)` → `screen 'mode'`, `stopIndex 0`, `cart {}`, `seed 42`, `revealed false`
- Flow: `SET_MODE` → `'onboarding'`; `FINISH_ONBOARDING` → `'persona'`; `CHOOSE_PERSONA` → `'stop'`, with `persona` set
- `RECORD_STOP` → `screen 'interstitial'`, `cart.free === note`
- **Review Focus 2:** dispatching `RECORD_STOP` for `free` twice with notes `'a'` then `'b'` → `cart.free === 'b'`, `Object.keys(cart).length === 1`, `stopIndex` unchanged (0)
- `ADVANCE` from the interstitial at `stopIndex 0` → `stopIndex 1`, `screen 'stop'`; at `stopIndex 2` → `stopIndex 3`, `screen 'flip'`
- **Review Focus 2:** `ADVANCE` while `screen !== 'interstitial'` → state unchanged (a stray double-click can’t skip a stop)
- `RECORD_STOP` whose `stopId !== STOP_ORDER[stopIndex]` → state unchanged
- `SET_LICENSE` then `RECORD_REUSE within credit` → `flip.responses.within === 'credit'`; `SET_LICENSE` again → `flip.responses` reset to `{}` (responses depend on the license)
- `FINISH_FLIP` with no license → state unchanged; with a license and all three responses → `cart.flip === note`, `screen 'guess'`
- `SET_GUESS` → `'reveal'`; `REVEAL` → `revealed true`; `SET_ENDING` → `'ending'`, with `ending` set; `ADVANCE` from `'ending'` → `'cart'`
- `RESET` → equals `initialState(seed)`

Run: `npm test -- state`. Expected: FAIL.

- [ ] **Step 2: Implement `initialState` and `reducer`** to pass. Unknown or out-of-order actions return the same state object.

- [ ] **Step 3: Run tests.** Expected: PASS. **Commit.**

---

### Task 4: Mechanic logic (RNG, Ask, flip resolution)

**Files:**
- Create: `src/lib/rng.ts`, `src/lib/ask.ts`, `src/lib/flip.ts`
- Test: `src/lib/rng.test.ts`, `src/lib/ask.test.ts`, `src/lib/flip.test.ts`

**Interfaces:**
- Produces:
  - `mulberry32(seed: number): () => number` (returns a float in [0, 1))
  - `ASK_WEIGHTS: { wellFormed: Record<AskResponse, number>; poor: Record<AskResponse, number> }` = `wellFormed { yes: 35, conditional: 35, no: 15, silence: 15 }`, `poor { yes: 15, conditional: 25, no: 25, silence: 35 }`
  - `isWellFormed(request: Partial<Record<AskField, string>>): boolean` (at least 3 of the 4 fields are non-empty)
  - `dealAskResponse(seed: number, persona: PersonaId, wellFormed: boolean): AskResponse`
  - `resolveReuse(flip: FlipStop, persona: PersonaId, kind: ReuseEventKind, license: LicenseId): string` (returns `flip.events[persona][kind].situation[license]`)
  - `flipCartNote(flip: FlipStop, license: LicenseId, responses: Record<ReuseEventKind, ReuseResponse>): string` (license label followed by the three response cart notes, joined with `' '`)

- [ ] **Step 1: Write failing tests:**
- rng: the same seed gives the same first five values; different seeds give different first values; all values are in [0, 1)
- `isWellFormed({ what: 'a', how: 'b', where: 'c' })` → `true`; two fields → `false`; whitespace-only fields don’t count
- **Review Focus 3:** `dealAskResponse(7, 'bard', true)` called twice → identical results
- Weights never guarantee: over seeds 1..2000, `wellFormed=true` produces all four responses at least once, and `yes + conditional` makes up a larger share than with `wellFormed=false`
- Different personas with the same seed can differ: across seeds 1..50, at least one seed where `bard` ≠ `herald` (the persona is mixed into the seed)
- `resolveReuse` returns the fixture cell; `flipCartNote` includes the license label and all three response notes, in `within, outside, beyond` order

- [ ] **Step 2: Implement.** For `dealAskResponse`, derive a sub-seed as `seed ^ hash(persona)`, where `hash` is a simple string hash (e.g. FNV-1a), take one `mulberry32` draw, and pick from the cumulative weights in the order `yes, conditional, no, silence`.

- [ ] **Step 3: Run tests.** Expected: PASS. **Commit.**

---

### Task 5: App shell, shared components, and the opening screens

**Files:**
- Create: `src/content/{index,personas,onboarding,reference,resources}.ts`, `src/components/{ClerkSpeech,ChoiceButton,CartBar,ReferencePanel,ScreenHeading}.tsx`, `src/screens/{ModeSelect,Onboarding,PersonaSelect}.tsx`
- Replace: `src/App.tsx`. Delete `src/constants.ts` once nothing imports it (Task 10 at the latest; until then, leave unused v2 code out of the build by not importing it).
- Test: `src/__tests__/shell.test.tsx`

**Interfaces:**
- Consumes: `reducer`, `initialState` (Task 3); `GameContent` (Task 2).
- Produces:
  - `content: GameContent`, exported from `src/content/index.ts`. Stops, `fairUse`, `ask`, and `clerk` can start as placeholder objects that pass type-checking; later tasks replace each with real content.
  - `<ScreenHeading>{children}</ScreenHeading>`: an `h1` with `tabIndex={-1}` that focuses itself on mount (Review Focus 5). Every screen renders exactly one.
  - `<ChoiceButton onSelect disabled?>`: a `<button>` that ignores clicks after the first until it remounts (Review Focus 2, UI side).
  - `<ClerkSpeech text />`: the v2 Clerk speech styling (amber label “The Clerk”).
  - `<ReferencePanel entries revealed />`: a slide-over port of v2’s panel. Its open/closed state lives in `App` (`useState`), not in screens. Entries with `unlockAfterReveal` stay hidden until `revealed`.
  - `<CartBar cart />`: four slots labeled with the stop titles, filled or empty shown by both a glyph and text (not color alone).
  - Every screen component has the signature `(props: { state: GameState; dispatch: Dispatch<Action>; content: GameContent }) => JSX.Element`, and is **declared at module top level, never inside another component** (Review Focus 1).

- [ ] **Step 1: Write the content** for `personas.ts` (the six personas from spec §3.3, with `name` in the v2 uppercase style, e.g. `'THE HERALD'`), `onboarding.ts` (adapt v2’s three onboarding lines from `App.tsx` lines 243–254 to “the place where everything anyone ever made ends up,” and add the onboarding clue from §6.2), `reference.ts` (port v2’s reference entries and add “Contracts and terms of service,” “Asking permission,” and “Orphan works” (`unlockAfterReveal: true`)), and `resources.ts` (the generalized list from spec §5.5, each item with `reviewBy`).

- [ ] **Step 2: Write failing tests** in `shell.test.tsx` (render `<App seed={1} />`; `App` accepts an optional `seed` prop that defaults to `Date.now()`):
- The first screen asks “Are you playing this in a class, or on your own?” and offers two buttons
- Choosing “In a class” shows onboarding; advancing through the onboarding lines reaches persona select, which lists all six persona names
- **Review Focus 1:** at onboarding line 2, open the reference panel and close it → still on line 2
- **Review Focus 5:** after each screen change, `document.activeElement` is the screen’s `h1`
- The whole flow is reachable by keyboard: `userEvent.tab()` plus `{Enter}` gets from mode select to persona select without clicking

- [ ] **Step 3: Implement `App`** (`useReducer(reducer, seed, initialState)`, a `screen` switch to top-level screen components, `CartBar` + `ReferencePanel` chrome) and the three screens, porting v2’s Tailwind classes and Motion transitions.

- [ ] **Step 4: Run** `npm test && npm run validate && npm run build`. Expected: tests pass. `validate` reports errors only for the placeholder stop/fairUse/ask/clerk content; temporarily allow that by having the CLI accept `--allow-placeholder`, which downgrades errors under those four keys to warnings. Remove the flag in Task 11.

- [ ] **Step 5: Commit.**

---

### Task 6: The stop engine, interstitials, fair use, and stop 1 content

**Files:**
- Create: `src/screens/Stop.tsx`, `src/screens/Interstitial.tsx`, `src/mechanics/FairUseAnalysis.tsx`, `src/content/stops/stop1-free.ts`, `src/content/fairUse.ts`
- Modify: `src/content/index.ts`
- Test: `src/__tests__/stop.test.tsx`

**Interfaces:**
- Consumes: `StandardStop`, `FairUseContent`, the `RECORD_STOP`/`ADVANCE` actions, `ScreenHeading`, `ChoiceButton`, `ClerkSpeech`.
- Produces: `<Stop>`, which renders any `StandardStop`. The sequence is Clerk intro (with `clerkClue` appended) → persona setup → complication → choices. A plain choice shows its outcome (persona-specific if the outcome is a `Record`), then `RECORD_STOP` with its `cartNote`. A `mechanic: 'fairUse'` choice opens `<FairUseAnalysis stopId persona content onDone(cartNote) />`. A `mechanic: 'ask'` choice opens the Ask mechanic (Task 8; until then it’s not used). `<Interstitial>` shows `content.interstitial` wait copy in class mode, or `stop.debrief` (lesson + prompts) in independent mode. Both modes advance with `ADVANCE`.
- `FairUseAnalysis` follows v2’s flow (`App.tsx` lines 582–720): four factors one at a time, each showing `description` then `text[stopId][persona]`, with a free-text or tap response (port v2’s response UI). Then `assessments[stopId][persona]`, then “Add to cart on a fair use basis” or “Go back to the choices.” Its cart note is `'Fair use basis. ' + assessment`.

- [ ] **Step 1: Write content:**
  - `stop1-free.ts`: the six setups from spec §4 stop 1. The four choices are “Take it” / “Try to find out who owns it” / fair use / “Leave it and find something you know is usable,” with outcomes and cart notes adapted from v2’s scenario 1 for the new media. The clue is from §6.2 (quiet at “no license stated,” hums a tune). Write the debrief.
  - `fairUse.ts`: keep v2’s four factor titles and descriptions word for word, and write `text` and `assessments` for `free` for all six personas, in v2’s voice. Write `layers` and `permission` entries as part of Tasks 7 and 8; until then, mark them with the placeholder flag.

- [ ] **Step 2: Write failing tests** in `stop.test.tsx`, rendering `App` and choosing `chronicler`:
- Stop 1 shows the Chronicler setup text from `content.stops.free.setup.chronicler`
- Choosing “Leave it…” shows its outcome, and continuing lands on the interstitial; in class mode the wait title shows and `debrief.lesson` doesn’t; in independent mode `debrief.lesson` and all `debrief.prompts` show
- Choosing fair use walks through 4 factor screens, each with the persona-specific text, then shows `assessments.free.chronicler`; “Add to cart…” records a cart note starting with `'Fair use basis.'` (check the `CartBar` shows stop 1 filled)
- “Go back to the choices” from the assessment returns to the stop 1 choices with the cart unchanged

- [ ] **Step 3: Implement.** **Step 4: Run** `npm test`. Expected: PASS.

- [ ] **Step 5: Content review gate.** Stop and ask Kyle to read stop 1 and the fair use text in `npm run dev` before continuing. Apply his edits.

- [ ] **Step 6: Commit.**

---

### Task 7: Stop 2 content (rights layers)

**Files:**
- Create: `src/content/stops/stop2-layers.ts`
- Modify: `src/content/fairUse.ts` (`layers` entries), `src/content/index.ts`
- Test: extend `src/__tests__/stop.test.tsx`

- [ ] **Step 1: Write content** from spec §4 stop 2. Use the persona artifacts in the table and the verified legal framing in the “Legal framing” and “Sound recordings” notes. Exact requirements:
  - **Bard:** names a specific recording year (1925 or earlier for the public-domain recording) and carries `personaReviewBy.bard = { date: '2027-01-01', note: 'Sound-recording PD cutoff moves each Jan 1 (MMA): update the named year.' }`
  - **Herald:** distinguishes the 1928 Mickey (PD) from later versions (protected) and from Disney trademarks (misleading sponsorship, use as a brand)
  - **Artificer:** the stock scan of the 2D illustration carries no new copyright under *Bridgeman*; the 2020 colorized version is protected; the debrief mentions site terms as a contract layer (setting up stop 3)
  - **Naturalist:** a NASA image (U.S. government work) vs. a partner-credited image on a NASA page
  - The four choices are “Find a version that’s clean all the way down” / “Contact the rights holder” / fair use / “Pass on it.” Port v2’s scenario 4 Clerk intro (“Tricky one…”), generalized beyond audio, and add the §6.2 clue (“developed” once, long ago).
  - `fairUse.ts`: the `layers` text and assessments for all six personas.

- [ ] **Step 2: Add tests:** for each persona, stop 2 renders that persona’s setup; `npm run validate` reports the Bard `reviewBy` item.

- [ ] **Step 3: Run** `npm test && npm run validate -- --allow-placeholder`. Expected: PASS, with no errors under `stops.layers` or `fairUse.*.layers`.

- [ ] **Step 4: Content review gate** (Kyle). **Step 5: Commit.**

---

### Task 8: Stop 3 content and the Ask mechanic

**Files:**
- Create: `src/content/stops/stop3-permission.ts`, `src/content/ask.ts`, `src/mechanics/AskRequest.tsx`
- Modify: `src/screens/Stop.tsx` (wire `mechanic: 'ask'`), `src/content/fairUse.ts` (`permission`), `src/content/index.ts`
- Test: `src/__tests__/ask.test.tsx`

**Interfaces:**
- Consumes: `isWellFormed`, `dealAskResponse` (Task 4); `state.seed`, `state.persona`.
- Produces: `<AskRequest content persona seed onDone(cartNote) onBack />`. The player picks one option per field from `ask.fieldOptions` (each field may be left blank). On “Send,” compute `isWellFormed` and `dealAskResponse(seed, persona, wellFormed)`, then show `ask.responses[persona][response].text` and `ask.afterPrompt`, with three buttons: “Use it” / “Don’t use it” / “Run a fair use analysis.” The resulting cart note is `responses[persona][response].cartNote` plus a short sentence for the follow-up choice. Fair use from inside Ask opens `FairUseAnalysis` for `permission`.

- [ ] **Step 1: Write content** from spec §4 stop 3:
  - **Setups, using the current table:** Chronicler editorial-only stock clip; Herald app sound library, cross-posting and paid promo; Naturalist AI artwork of a rare species (free tier non-commercial, monetized channel); Artificer reachable living artist; Bard AI backing track (commercial rights on paid plans only); Conjurer asset-store pack and desktop font license, open-sourcing on GitHub.
  - **AI debriefs** follow the “AI handling” paragraph exactly. Naturalist: tool terms plus the accuracy question. Bard: plan terms plus “purely AI-generated material generally isn’t protected by U.S. copyright.”
  - **`personaReviewBy`** for `naturalist`, `bard`, `herald`, and `conjurer`, each with date `'2027-01-01'` and a note naming what to re-check.
  - **Choices:** “Use it” / “Don’t use it” / fair use / `mechanic: 'ask'` labeled “Ask for permission.”
  - **§6.2 clue:** he quotes a line “somebody wrote to me, once” and flinches at “takedown.”
  - **`ask.ts`:** field options (e.g. what: “the whole thing” / “a 10-second clip” / “one image”; how; where; howLong), and all 6 × 4 responses. “Silence” outcomes state plainly that silence isn’t a yes. “Polite no” outcomes note that fair use may still apply.
  - **`fairUse.ts`:** the `permission` text and assessments.

- [ ] **Step 2: Write failing tests:**
- With seed 1 and the `artificer` persona, filling 3 fields and sending shows `ask.responses.artificer[dealAskResponse(1, 'artificer', true)].text`
- **Review Focus 3:** Send → Back → refill the same field count → Send shows the same response text
- Filling 1 field still sends (no form validation blocks the player) and uses the `poor` weights (assert the shown response equals `dealAskResponse(1, 'artificer', false)`)
- The resulting cart slot 3 is filled, and the note contains the response’s `cartNote`

- [ ] **Step 3: Implement.** **Step 4: Run** `npm test && npm run validate -- --allow-placeholder`. Expected: PASS.

- [ ] **Step 5: Content review gate** (Kyle). **Step 6: Commit.**

---

### Task 9: Stop 4, the flip

**Files:**
- Create: `src/content/stops/stop4-flip.ts`, `src/screens/Flip.tsx`, `src/mechanics/LicensePicker.tsx`, `src/mechanics/ReuseEvents.tsx`
- Modify: `src/content/index.ts`
- Test: `src/__tests__/flip.test.tsx`

**Interfaces:**
- Consumes: `FlipStop`; `resolveReuse`, `flipCartNote` (Task 4); `SET_LICENSE`, `RECORD_REUSE`, `FINISH_FLIP`.
- Produces: `<Flip>`. The sequence is Clerk intro + clue → “your work” (`work[persona]`) → `<LicensePicker>` (five options, each showing `label`, the Clerk’s `clerkGloss`, and a “What this actually means” toggle revealing `summary`; there’s also a link to the reference panel) → `<ReuseEvents>` (the three events in order `within, outside, beyond`; each shows `setup`, then `resolveReuse(...)`, then four response buttons from `responses`) → Clerk `askForHelp` line → `FINISH_FLIP` with `flipCartNote(...)`. The flip has no interstitial: the guess follows immediately (§3 flow).

- [ ] **Step 1: Write content** from spec §4 stop 4:
  - `work` and the three events per persona from the table, including the two **AI events**: Herald `outside` = a brand’s AI-generated near-copy of their graphic; Artificer `beyond` = an AI company asking to license their portfolio as training data. Write them per the “AI in the flip” paragraph, with `personaReviewBy` for both.
  - Write all 6 × 3 × 5 `situation` cells. Each says what the chosen license does or doesn’t permit in that situation. For `arr` (all rights reserved), `within` means a use that needs no permission (for example, a link or a brief quote that would likely be fair use). Say so plainly.
  - Licenses: the CC `summary` text must match the reference panel’s definitions.
  - The §6.2 clue: he watches the license picker closely.
  - The debrief, shown at the final interstitial in independent mode (Task 10).

- [ ] **Step 2: Write failing tests:**
- Picking `cc-by-nc` then viewing event 1 shows `events[persona].within.situation['cc-by-nc']`
- The response buttons record into `flip.responses`; after three events, the Clerk’s `askForHelp` line shows
- Changing the license mid-events isn’t possible: the license picker isn’t reachable after event 1 starts (no back button past that point)
- The cart’s flip slot contains the license label after `FINISH_FLIP`

- [ ] **Step 3: Implement.** **Step 4: Run** `npm test && npm run validate -- --allow-placeholder`. Expected: PASS.

- [ ] **Step 5: Content review gate** (Kyle). **Step 6: Commit.**

---

### Task 10: The Clerk’s guess, reveal, ending, and cart review

**Files:**
- Create: `src/content/clerk.ts`, `src/screens/{Guess,Reveal,Ending,CartReview}.tsx`
- Modify: `src/content/index.ts`; delete `src/constants.ts`
- Test: `src/__tests__/ending.test.tsx`

**Interfaces:**
- Consumes: `SET_GUESS`, `REVEAL`, `SET_ENDING`, `ADVANCE`, `RESET`; `ReferencePanel`’s `revealed` prop.
- Produces:
  - `<Guess>`: `guessPrompt` plus the five options → `SET_GUESS`.
  - `<Reveal>`: shows the `reveal` paragraphs one at a time (port the staging of v2’s `RevealScreen`, `App.tsx` lines 794–820), dispatches `REVEAL` on the last one, then offers the three `endings` → `SET_ENDING`.
  - `<Ending>`: shows `endings[ending].scene`, then `codaShade[state.flip.license]`, then `closingLine`. In independent mode, it shows `stops.flip.debrief` before continuing; in class mode, the wait copy. Then `ADVANCE` to `'cart'`.
  - `<CartReview>`: lists the four cart notes under their stop titles, plus “Your guess: <label>. The Clerk was a scrapbook.” Class mode shows v2’s facilitator line, reworded to drop the pairs wording: “Facilitator: use these cart notes as case documents for the full-room debrief.” Independent mode shows a two-sentence summary. Also offers resources and “Play again” (`RESET` with a new seed).

- [ ] **Step 1: Write `clerk.ts`** from spec §6:
  - **Reveal:** the answer to “Could you do that for me?” is no, because only the creator or time can license or release a work. Then he shows he’s a scrapbook: unattributed photos, letters, clippings, a pressed concert program. Every earlier clue turns out to be true.
  - **Endings:** `search` (introduces a diligent search; the compiler may be found, but every piece still has its own missing creator), `shelf`, and `wait`. Each states its trade-off; none is framed as better.
  - **`codaShade`:** one sentence per license, reflecting the player’s own choice back without judgment.
  - **`closingLine`:** a clear license and your name on your work keep it from becoming him.
  - Keep v2’s Clerk voice: hedging, apologetic, “That’s not advice, obviously.”

- [ ] **Step 2: Write failing tests:**
- The guess, then the reveal: the “Orphan works” reference entry is hidden before the last reveal paragraph and visible after
- Each of the three endings shows its scene, then the `codaShade` line for the chosen license, then `closingLine`
- The cart review shows the guess label and all four cart notes; “Play again” returns to mode select with an empty cart

- [ ] **Step 3: Implement. Delete `src/constants.ts`.** **Step 4: Run** `npm test && npm run validate && npm run build`. `validate` now runs **without** `--allow-placeholder` and must report zero errors.

- [ ] **Step 5: Content review gate** (Kyle). **Step 6: Commit.**

---

### Task 11: Full playthrough, cleanup, deploy

**Files:**
- Create: `src/__tests__/playthrough.test.tsx`
- Modify: `scripts/validate-content.ts` (remove `--allow-placeholder`), `README.md` (new)

- [ ] **Step 1: Write the playthrough test:** for each of the six personas × both modes, drive the whole game with `userEvent`, always picking the first non-mechanic choice at stops 1–3, `cc-by` in the flip, and the `credit` response for every event. Assert the player reaches the cart review with all four slots filled and that no rendered text matches the group-size regex from Task 2.

- [ ] **Step 2: Run** `npm test && npm run validate && npm run build`. Expected: all pass, and `validate` prints the review list (Bard recording year; the stop 3 Herald, Naturalist, Bard, and Conjurer terms; the stop 4 Herald and Artificer AI events; the resources).

- [ ] **Step 3: Remove the `--allow-placeholder` handling** from the CLI. Re-run `npm run validate`. Expected: zero errors.

- [ ] **Step 4: Write `README.md`.** It covers: what the game is (one paragraph); `npm run dev`; where every kind of text lives (a table mapping “stop 1 setups” → `src/content/stops/stop1-free.ts`, etc.); how to run `npm run validate` each term and what the review list means; and that `the-archive-v2` holds the podcast edition.

- [ ] **Step 5: Manual check in the browser** (`npm run dev`): one full keyboard-only run; check every screen at 1280×800 and 768×1024; confirm no console errors.

- [ ] **Step 6: Merge and deploy**

```bash
git checkout main && git merge --ff-only general-edition && git push origin main
```

Expected: the Actions run goes green, and the site loads at `https://kyledenlinger.github.io/the-archive/` with no 404s in the network panel (Review Focus 4).

- [ ] **Step 7: Kyle’s pre-launch legal check:** go through the `validate` review list against current sources.
