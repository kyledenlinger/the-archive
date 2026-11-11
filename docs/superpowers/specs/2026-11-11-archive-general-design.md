# The Archive (General Edition) — Design Spec

**Date:** 2026-11-11
**Owner:** Kyle Denlinger
**Status:** Draft for review
**Base code:** `kyledenlinger/the-archive-v2` (podcast edition, left untouched)
**Target repo:** `kyledenlinger/the-archive` — `main` is replaced with this edition

---

## 1. Purpose

*The Archive* is a cooperative text RPG that supports a short undergraduate lesson on copyright, fair use, the public domain, licensing, and creators’ own rights. The podcast edition was built for one class producing podcasts. This edition generalizes it for **standalone copyright and information-literacy sessions** (first-year seminars, library workshops) that are not tied to a student project.

### Design principles (carried over and still binding)

- **Reward reasoning, not right answers.** The game never declares a choice “correct.” Cart notes record what the player did and why it matters.
- **Surface genuine uncertainty.** Model making defensible decisions under ambiguity.
- **Fair use is something you practice, not a loophole.** The four-factor analysis remains the centerpiece mechanic.
- **“Don’t let perfect be the enemy of good enough.”** Cautious choices are not automatically better.
- **Neutral on AI.** No value stance embedded in text or outcomes.
- **The facilitator is not the legal authority.** The game and the debriefs surface questions; they don’t issue rulings.

### Success criteria

- A player can play the full game in about 30 minutes of play time, leaving about 15 minutes for four debriefs, inside a 45-minute session.
- 10–15 devices can run the game simultaneously on laptops with no installs, accounts, or network calls after the page loads.
- In independent mode, a learner can finish with no facilitator and still get the equivalent of each debrief.
- Kyle can edit any player-facing text without touching component code.

---

## 2. Constraints

- Runs in a laptop browser. It is a static site, hosted on GitHub Pages.
- No backend, no API keys, no analytics, no data collection.
- Session length is about 45 minutes, with four stops.
- Accessibility: keyboard navigable, readable contrast, and no information conveyed by color alone.

---

## 3. Game flow

```
Mode select ──► Onboarding (meet The Clerk) ──► Persona select
   │
   ▼
Stop 1 ──► [Wait / Debrief] ──► Stop 2 ──► [Wait / Debrief] ──► Stop 3 ──► [Wait / Debrief]
   │
   ▼
Stop 4: The Flip ──► Guess: what is The Clerk? ──► Reveal ──► Ending choice ──► Coda ──► Cart review ──► [Final debrief]
```

### 3.1 Mode select (new)

The first screen asks: **“Are you playing this in a class, or on your own?”**

| | Class mode | Independent mode |
|---|---|---|
| After each stop | “Wait here” screen: the player waits for the facilitator; an advance button is available (honor system, no code) | Debrief screen: a mini-lesson plus 2–3 reflection prompts, then continue |
| Cart review | Shows the facilitator note (“use these cart notes as case documents…”) | Shows a short written summary instead |

Mode is stored in game state.

**Player-facing copy always addresses “you.”** It never assumes how many people are at a device: one student, a pair, or a small group all see the same text.

### 3.2 Onboarding

Adapted from v2’s onboarding: the player meets The Clerk, a small, rumpled, unauthorized stowaway with ink-stained fingers. The scene opens by establishing the player’s purpose: they’re a creator who needs material for a project, and they’ve come to the Archive, where a copy of almost everything ends up sooner or later, including most of what’s ever been posted online. The first orphan-work clue is planted here (§6.2).

### 3.3 Persona select

There are six personas, using the fantasy-title convention.

| Persona | What they make | Purpose / stakes | Shines in |
|---|---|---|---|
| **The Chronicler** | Short documentary film | Student festival, hoping for streaming later | Stop 1: archival clips and fair use for commentary |
| **The Herald** | Social media content (short video, graphics) | Campus org or personal account with a real following; sometimes sponsored | Stop 3: platform terms; Stop 4: an AI near-copy of their work |
| **The Naturalist** | Nature and science channel: explainer videos, blog, own wildlife photos | Monetized channel, educational mission | Stop 2: U.S. government works; Stop 4: the viral photo and the cover deal |
| **The Artificer** | Zines, collages, prints | Sells at a campus market | Stop 2: PD art vs. photographs of it; transformative reuse |
| **The Bard** | Music: samples, covers, remixes | Releasing on streaming services | Stop 2: composition vs. recording |
| **The Conjurer** | Indie game | Posting to itch.io, possibly paid | Stop 3: asset-store and font licenses |

The roster mixes commercial personas (Bard, Chronicler), in-between ones (Herald, Artificer, Naturalist), and one that depends on whether the game is sold (Conjurer). Six personas spread a typical room across all six, so each persona usually has more than one voice in the debrief.

---

## 4. The four stops

Every stop has: a Clerk intro, a persona-specific setup, a shared complication, choices, cart notes, and a debrief block. Stops 1–3 offer the fair use analysis as one choice. Each stop’s persona artifacts are drafted below. The full prose is written during implementation, following v2’s voice and length.

### Stop 1 — The “Free” Thing That Isn’t

**Concept:** Freely accessible ≠ free to reuse. With no license, the default is all rights reserved.
**Choices:** take it / try to find the owner / run a fair use analysis / leave it and find something clearly usable.

| Persona | Artifact |
|---|---|
| Chronicler | A 1970s local TV news clip of the event their film covers, re-uploaded to a video site by an unrelated account |
| Herald | A viral photo circulating as a meme, with the original poster unknown |
| Naturalist | A striking wildlife photo on a hobbyist’s blog, with no license stated |
| Artificer | An illustration pinned and re-pinned until the source is lost |
| Bard | A drum break on a “free samples” site, likely lifted from a 1980s record |
| Conjurer | A sprite sheet on a forum, posted with “free to use lol” |

**Fair use:** reuse v2’s four-factor engine with new per-persona text and assessments, keyed by stop (§7.3).

### Stop 2 — The Public Domain Trap (Rights Layers)

**Concept:** A public domain work can sit inside protected layers: a recording, a restoration, a new arrangement, a later adaptation, or a trademark.
**Choices:** find a version that’s clean all the way down / contact the rights holder / fair use analysis / pass on it.

| Persona | Artifact | Layer at issue |
|---|---|---|
| Chronicler | 1920s newsreel footage (PD) in a 2010 remastered release with a new score | Restoration and new soundtrack |
| Herald | *Steamboat Willie*-era Mickey (PD since 2024) for a post | Later character versions and trademark |
| Naturalist | NASA imagery (U.S. government work), plus an image on a NASA page credited to a partner agency | Not everything on a .gov site is a government work |
| Artificer | A 19th-century botanical illustration (PD), scanned by a stock site that claims copyright, and a 2020 colorized version | Faithful reproduction vs. new creative contribution |
| Bard | A Beethoven composition (PD), a 2019 orchestral recording (protected), and a pre-1926 recording (now PD) | Composition vs. recording; recording terms |
| Conjurer | Sherlock Holmes stories (PD) and a recent TV adaptation’s character designs | Adaptations add protected layers |

**Legal framing (verified 2026-11-11):**

- **Mickey (Herald):** the 1928 *Steamboat Willie* and silent *Plane Crazy* versions of Mickey and Minnie entered the U.S. public domain on January 1, 2024. Later versions (for example, *Fantasia*-era Mickey and the modern design) stay protected until their own terms run out. Disney’s trademarks are a separate layer: you can’t use Mickey in a way that misleads people into thinking Disney made or sponsored your work, or use him as your brand or logo. A sponsored post makes the trademark question sharper, which is the point of the scenario.
- **Photos of public-domain art (Artificer):** in *Bridgeman Art Library v. Corel* (S.D.N.Y. 1998–99), the court held that faithful photographic reproductions of public-domain two-dimensional artworks lack the originality copyright requires. It’s a federal district court decision, not a Supreme Court ruling, but it is widely followed in the U.S. Two nuances belong in the debrief: photos of three-dimensional objects (sculpture, furniture) can involve real creative choices and may be protected; and a site’s terms of use can still restrict use by contract even where copyright doesn’t, which sets up stop 3. Many museums (for example the Met, the Rijksmuseum, and the Smithsonian) now release these images under CC0. The 2020 colorized version is a new creative contribution and is protected.

Neither framing is expected to change, so neither carries a `reviewBy`.

**Sound recordings (verified 2026-11-11):** under the Music Modernization Act (2018), U.S. sound recordings published before 1923 entered the public domain on January 1, 2022, and recordings published 1923–1946 enter it 100 years after publication. As of January 1, 2026, recordings published in 1925 or earlier are public domain. The cutoff moves forward one year every January 1, so the Bard’s “old recording” text must name a year, not a fixed cutoff, and carries a yearly `reviewBy`. Compositions run on a different clock (95 years; works published before 1931 are public domain as of 2026), which is exactly the layer distinction the stop teaches.

### Stop 3 — Permission Isn’t Only About Copyright

**Concept:** Contracts, licenses, and platform terms can govern use independently of copyright, and sometimes the right move is to ask.
**Choices:** use it / don’t / fair use analysis / **Ask** (new mechanic, §5.1).

| Persona | Artifact |
|---|---|
| Chronicler | A stock clip they paid for, licensed “editorial use only”; the festival has a sponsor |
| Herald | A trending song from the app’s built-in sound library; they want to cross-post the video to another platform and run it as a paid promo |
| Naturalist | **AI variant:** AI-generated artwork of a rare species for an explainer video. The tool’s free tier allows non-commercial use only, and the channel is monetized |
| Artificer | A photograph on a living artist’s portfolio, no license stated, artist reachable |
| Bard | **AI variant:** an AI-generated backing track from a music generator. Its terms grant commercial rights only on paid plans, and the Bard is releasing on streaming services |
| Conjurer | An asset-store pack licensed for use in games but not redistribution, plus a desktop font license; they want to open-source the game on GitHub |

**AI handling:** two personas use AI tools in this stop, and both go through the contract lens (the terms you agreed to), not unsettled law.

- **Naturalist (AI artwork):** the tool’s terms decide what you can do with the output, and free and paid tiers can grant different rights. A monetized channel runs into the non-commercial limit. The debrief can raise a non-legal question the Naturalist cares about: whether an AI image of a real species is accurate enough to put in front of an audience.
- **Bard (AI music):** the same contract question on the input side. The generator’s plan decides whether you have commercial rights at all. The debrief can add one mostly settled point: purely AI-generated material generally isn’t protected by U.S. copyright, which requires human authorship. So the Bard may not own the backing track the way they own the parts they wrote and performed themselves.

The debrief can note what’s settled and what isn’t, but neither scenario hinges on unsettled law. Both variants are flagged `reviewBy`.

### Stop 4 — The Flip

**Concept:** The student is now the creator. They choose a license, then deal with reuse. Creative Commons is taught by applying it.

**Step A, choose a license:** all rights reserved / CC BY / CC BY-SA / CC BY-NC / CC0. The Clerk gives a one-line, slightly unreliable gloss on each. The reference panel has accurate definitions.

**Step B, three reuse events (persona-specific),** each resolved against the chosen license:
1. **Within your terms.** Someone uses the work exactly as the license allows. Tests whether they meant it.
2. **Outside your terms.** Someone violates the license, or uses the work without permission if all rights are reserved.
3. **Beyond your terms.** Someone asks for something the license doesn’t grant.

Responses: send a takedown / ask for credit / negotiate / let it go. These are recorded for the cart and shade the coda, but don’t change the ending.

| Persona | Their work | Example events |
|---|---|---|
| Chronicler | Festival documentary | A local news outlet uses a clip; a YouTuber reuploads the whole film; a streaming service asks for exclusive rights |
| Herald | A graphic that went semi-viral | A student club reposts it with credit; **AI:** a brand runs an ad with an AI-generated graphic that’s a near-copy of yours; a nonprofit asks to adapt it |
| Naturalist | A wildlife photo that went viral | A news outlet runs it uncredited; a textbook publisher asks to license it; a magazine offers the cover in exchange for exclusive rights |
| Artificer | A collage print | A fan reposts it with credit; a fast-fashion site prints it on shirts; **AI:** an AI company asks to license your portfolio as training data |
| Bard | A released track | A remix appears on SoundCloud; a brand uses it in an ad; a filmmaker asks to sync it |
| Conjurer | The game | Fans make mods; someone reuploads it to another storefront; a publisher offers a deal |

**AI in the flip:** two personas meet AI from the creator’s side.

- **Herald, outside your terms:** a brand’s AI-generated ad graphic closely copies theirs. The lesson is that AI doesn’t change the basic test. If the output copies your actual expression, it can infringe like any copy. If it only borrows your general style, it probably doesn’t, because style alone isn’t protected.
- **Artificer, beyond your terms:** an AI company asks to license their portfolio for training. Here the creator is asking the stop 3 question from the other side: whatever the law ends up saying about training, a direct request is something they can say yes to, say no to, or negotiate.

Both are flagged `reviewBy`.

**Then the reveal** (§6).

---

## 5. Mechanics

### 5.1 Ask (new, stop 3; reusable)

The player drafts a permission request by picking: what they want to use, how, where, and for how long. A request needs at least three of these to count as “well-formed.” Then the game deals a response from a weighted, persona-specific table:

- **Yes**
- **Yes, with conditions** (credit, fee, time limit)
- **Polite no**
- **Silence**

Well-formed requests shift the weights toward yes/conditional, but never guarantee them. The player then decides what to do with the answer. Key lesson: **silence isn’t a yes**, and a “no” doesn’t end the fair use question.

The response should be deterministic per playthrough (seeded per session), so a player can’t reroll by going back.

### 5.2 Fair use analysis (existing, refactored)

The v2 flow stays: four factors, each with general text plus persona-specific text, then a persona-and-stop-specific assessment, then add to cart or not. The refactor keys all text by `stopId` + `personaId` instead of array position.

### 5.3 License picker and reuse events (new, stop 4)

These are described in §4. Each event resolves through a lookup table: (license, event) → situation text. The situation explains what the license does or doesn’t permit in that case. The player’s response choice then produces a cart note.

### 5.4 Cart (existing, generalized)

“Tracks” becomes “items.” There are four slots, one per stop. Cart notes stay the case documents for debrief. The v2 numeric `score` and `clerkScore` are **removed**, since endings no longer derive from scores.

### 5.5 Reference panel (existing, expanded)

The reference panel covers copyright, public domain, Creative Commons, fair use, and rights layers. It adds **contracts and terms of service**, **permission requests**, and **orphan works**, the last unlocked after the reveal so it doesn’t spoil anything. The resources list is generalized beyond audio (for example Wikimedia Commons, Openverse, Freesound, Free Music Archive, the Internet Archive, the Smithsonian Open Access collection, NASA Images).

---

## 6. The Clerk

### 6.1 Identity

The Clerk is an **orphan work**: a creative work whose creator can’t be identified or located, so nobody can license or release him. That’s why he’s an unauthorized stowaway. The v2 voice (hedging, apologetic, “that’s not advice, obviously”) is kept as-is.

**What he is:** ambiguous until the reveal. Clues point at several media, and the reveal resolves all of them: he is **a scrapbook**, a compiled collection of unattributed photos, letters, clippings, and a pressed concert program. He’s a stack of orphan works, which also embodies stop 2’s rights layers.

### 6.2 Clue track

| Where | Clue |
|---|---|
| Onboarding | No name tag. When asked who he works for: “Nobody’s ever been able to tell me.” |
| Stop 1 | Goes quiet at “no license stated.” Hums a tune he can’t place. |
| Stop 2 | Mentions being “developed” once, long ago. |
| Stop 3 | Quotes a line “somebody wrote to me, once.” Flinches at “takedown.” |
| Stop 4 | Watches the license picker closely. Asks, “Could you do that for me?” |

### 6.3 Guess, reveal, ending

1. **Guess.** Before the reveal, the player picks what they think The Clerk is: a photograph, a song, a letter, a film, or something else. This is stored and shown on the cart review for the final debrief.
2. **Reveal.** The answer to “Could you do that for me?” is no. You can’t license or release a work you don’t own; only the creator, or time, can. Then The Clerk shows what he is.
3. **Ending choice.** The player decides what to do for him:
   - **Search for his compiler.** Introduces the idea of a diligent search. The outcome is honest: the compiler may be found, but every piece inside him still has its own missing creator.
   - **Leave him on the shelf.** He returns to his camp. Honest about how most orphan works end up.
   - **Wait with him.** For his term to run out. Honest about how long that takes.
4. **Coda.** A short scene per ending, shaded by the stop 4 license choice and responses. Every coda ends with the same message: **a clear license and your name attached to your work keep it from becoming him.**

No ending is “good” or “bad.” Each states its trade-off.

---

## 7. Architecture

### 7.1 Stack

React, Vite, TypeScript, Tailwind, and Motion, kept from v2. Removed: `@google/genai`, `express`, `dotenv`, the `GEMINI_API_KEY` define in `vite.config.ts`, `.env.example`, and `metadata.json`. Vite `base` is set for GitHub Pages, deployed by a GitHub Actions workflow.

### 7.2 File structure

```
src/
  main.tsx
  App.tsx                    # screen router + game state only
  state.ts                   # GameState type, initial state, reducer
  content/
    types.ts                 # content schema types
    personas.ts
    onboarding.ts
    clerk.ts                 # clue lines, guess options, reveal, endings, codas
    stops/
      stop1-free.ts
      stop2-layers.ts
      stop3-permission.ts
      stop4-flip.ts
    fairUse.ts               # factor text + assessments keyed by stop+persona
    reference.ts
    resources.ts
  screens/
    ModeSelect.tsx  Onboarding.tsx  PersonaSelect.tsx  Stop.tsx
    WaitScreen.tsx  DebriefScreen.tsx  Guess.tsx  Reveal.tsx
    Ending.tsx  CartReview.tsx
  mechanics/
    FairUseAnalysis.tsx  AskRequest.tsx  LicensePicker.tsx  ReuseEvents.tsx
  components/
    ClerkSpeech.tsx  Choice.tsx  CartBar.tsx  ReferencePanel.tsx
scripts/
  validate-content.ts        # completeness checks (see §8)
```

### 7.3 Content schema (sketch)

```ts
type PersonaId = 'chronicler' | 'herald' | 'naturalist' | 'artificer' | 'bard' | 'conjurer';

interface Stop {
  id: 'free' | 'layers' | 'permission' | 'flip';
  title: string;
  clerkIntro: string;
  clerkClue?: string;
  setup: Record<PersonaId, string>;
  complication: string;
  choices: Choice[];
  debrief: { lesson: string; prompts: string[] };   // shown in independent mode
  reviewBy?: { date: string; note: string };         // time-sensitive content flag
}

interface Choice {
  id: string;
  label: string;
  mechanic?: 'fairUse' | 'ask';
  outcome?: Record<PersonaId, { text: string; cartNote: string }> | { text: string; cartNote: string };
}
```

All player-facing strings live under `src/content/`. Components contain no game prose.

### 7.4 Time-sensitive content

Any string that depends on unsettled or recently changed law or on a third party’s current terms carries a `reviewBy` field. The validator prints every flagged item with its note, so Kyle can check them each term. Items flagged at launch: the stop 2 Bard recording year (moves every January 1); the stop 3 Naturalist and Bard AI-tool terms; the stop 3 Herald sound-library terms and Conjurer asset-store terms; the stop 4 Herald and Artificer AI events; and the resources list URLs.

---

## 8. Testing and verification

- `tsc --noEmit` passes.
- `scripts/validate-content.ts` checks that every stop has setup text for all six personas, every persona/stop pair has fair use text where fair use is offered, every stop has a debrief block, every Ask table and (license, event) cell is filled, and no player-facing string is empty. It exits non-zero on failure and lists `reviewBy` items.
- Unit tests for the reducer, the Ask response dealing (seeded and deterministic), and license-event resolution.
- Manual playthrough in a browser: one full run per persona in class mode, and at least two in independent mode, including keyboard-only navigation.
- Legal claims in content are checked against current sources before launch (the `reviewBy` list).

---

## 9. Migration

1. Replace `the-archive` `main` with the v2 codebase as the base commit (history from v1’s single commit is not preserved on `main`).
2. Remove the unused dependencies and wiring (§7.1).
3. Extract all prose from `App.tsx` into `src/content/` and split screens into components, with no behavior change. Verify with a v2-equivalent playthrough.
4. Add mode select, debrief blocks, and new personas, stops, and mechanics.
5. Replace score-based endings with the orphan-work reveal.
6. Deploy to GitHub Pages.

`the-archive-v2` is not modified at any point.

---

## 10. Out of scope (this version)

- The printable handout (to be revised after the content is final)
- A facilitator dashboard, unlock codes, or any multi-device sync
- Analytics, accounts, or saved progress across sessions
- AI as a standalone stop
- Localization

---

## 11. Decisions log

| Decision | Choice |
|---|---|
| Audience | Standalone session, not project-tied |
| Motivation | Creator personas, plus a late flip to the creator side |
| Length | About 45 minutes, four stops |
| AI | Not a standalone stop. Stop 3: Naturalist (AI artwork) and Bard (AI music), via the contract lens. Stop 4: Herald (AI near-copy of their work) and Artificer (training-data license request) |
| Creative Commons | Taught in the flip, by applying a license to your own work |
| Personas | Chronicler, Herald, Naturalist, Artificer, Bard, Conjurer (Scholar cut) |
| The Clerk | Orphan work; medium ambiguous until the reveal (scrapbook); guess mechanic |
| Endings | Player choice of what to do for The Clerk; shared “license your work” message |
| Pauses | Mode selector; class mode uses an honor-system wait screen |
| Build | Static React site on GitHub Pages, from v2 |
| Repo | Replace `the-archive` `main`; `the-archive-v2` untouched |
