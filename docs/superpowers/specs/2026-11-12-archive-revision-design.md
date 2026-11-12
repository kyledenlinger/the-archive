# The Archive — Revision 2 Design Spec

**Date:** 2026-11-12
**Owner:** Kyle Denlinger
**Status:** Draft for review
**Builds on:** `2026-11-11-archive-general-design.md` (the “base spec”) and the live build on `main`
**Prose rules:** `2026-11-11-archive-prose-style-sheet.md` applies to all new and changed text

This spec describes changes to the live game. Anything not mentioned here stays as the base spec and the current build have it. Where the two conflict, this spec wins.

---

## 1. What changes, in one paragraph

Players now get a **project brief** with three things to find. Every decision is made under four visible **constraint meters**, and choices cost and gain against them. Some options lock when a meter runs out. Stop 1 **requires a fair use analysis, coached by the Clerk**. The four stops get **new names**. The orphan-work mystery (clues, guess, reveal, scrapbook, three endings) is **removed**. In its place, the Clerk shows the player **the shelf where their work ends up**, an epilogue assembled from how they treated other people’s work and how they shared their own. The site gets a **header with Home and About**, a **cart you can open**, a **fixed Continue button**, and a **distinct look for the Clerk’s speech**.

### Principles still binding (from base spec §1)

These still apply, and the meters must respect them:

- **Reward reasoning, not right answers.** No path improves every meter, and no meter state is labeled good or bad in the text.
- **Neutral on AI.**
- **No epilogue is a verdict.** Every epilogue includes something gained and something lost.
- **Player copy always says “you”** and never assumes a group size.

---

## 2. Site fixes

### 2.1 Header

A slim header is present on every screen after mode select. Left to right:

1. **Home.** It opens a confirmation dialog: “Start over? You’ll lose your progress in this game.” with the buttons **Start over** and **Keep playing**. “Start over” dispatches `RESET`. On mode select itself, Home is hidden.
2. **Meters** (§4.4), shown once a persona is chosen.
3. **Cart** button (§2.4), shown once a persona is chosen.
4. **Reference** button (the existing reference panel).
5. **About.** It opens a panel with: what the game is (two sentences); “This is a learning game, not legal advice.”; who made it (Kyle Denlinger, Z. Smith Reynolds Library, Wake Forest University); the game’s own license; and a link to the source repository. Kyle supplies the license and confirms the credit line before launch.

Dialogs and panels trap focus while open, close with Escape, and return focus to the button that opened them.

### 2.2 Fixed Continue

On every narrative screen (onboarding, Clerk intros, setups, outcomes, the epilogue), the primary **Continue** button sits in a fixed bar at the bottom of the viewport. The text scrolls in the space above it. The bar has a solid background, so text never shows through. Choice lists are not narrative screens, and their buttons stay inline.

### 2.3 The Clerk’s speech

Every line the Clerk speaks renders in the `ClerkSpeech` component, which has three visual cues besides color:

- a small label, **The Clerk**
- a different typeface (the narrator stays in the current serif; the Clerk uses a typewriter-style monospace)
- a separate block with a left rule, never inline with narration

### 2.4 The cart, made visible

The cart becomes the **project brief made concrete**. Opening the Cart button shows a panel with:

- what you’re making and who you answer to (from the brief, §3)
- the **three items you need**, each showing its status (*Not yet found*, or what you got and on what terms, from the cart note) and the stop it belongs to
- once stop 4 is done, a fourth entry: **Your work**, with the license you chose

The current `CartBar` slot strip is replaced by the Cart button, which shows a compact count (“2 of 3 found”).

---

## 3. The project brief

Right after persona select, a new **Brief** screen shows a card for the chosen persona. The Clerk introduces it (“Here’s what you came for, then.”). The card lists:

- **What you’re making**
- **Who you answer to,** and what they expect (the obligation)
- **Your deadline**
- **What you need:** three items, one per stop 1–3, each named in a single line
- **Where you’re starting:** the four meters at their starting values (§4.5)

The three items are the artifacts already in stops 1–3 (base spec §4, as revised). The brief names each one plainly enough that the player recognizes it when they find it.

| Persona | Making | Answers to | Item 1 (Unmarked) | Item 2 (Old Bones) | Item 3 (Strings Attached) |
|---|---|---|---|---|---|
| Chronicler | Short documentary | Student film festival; a sponsor | News footage of the event | 1920s newsreel footage | A stock clip of the city |
| Herald | A campaign for a campus org | The org and its sponsor | An image that will catch people’s eye | A cartoon character everyone knows | A song for the video |
| Naturalist | An explainer video for their channel | Their audience and ad revenue | A photo of the animal | Space imagery | An illustration of a rare species |
| Artificer | A zine and print run for the campus market | The market date; the print shop | An illustration for the cover | A botanical illustration | A photograph for the centerfold |
| Bard | An EP | The streaming distributor’s release date | A drum break | A classical piece to build on | A backing track |
| Conjurer | An indie game | The itch.io launch date | Character sprites | A detective to base the hero on | Art assets and a font |

The table names the items; the brief’s prose (written during the build) describes them in the persona’s voice. The obligations replace the separate “Obligations” meter that was considered and dropped. They shape what costs Time and Budget in each persona’s setups.

---

## 4. Constraint meters

### 4.1 The four meters

| Meter | Measures | Higher means | States (from best to worst) |
|---|---|---|---|
| **Time** | Days left before your deadline | more time | Plenty → Tight → Out of time |
| **Budget** | Money left for the project | more money | Comfortable → Stretched → Broke |
| **Exposure** | Your legal and reputational risk | more risk | Low → Some → High |
| **Vision** | How close the work is to what you set out to make | more intact | Intact → Compromised → Lost |

### 4.2 Values and bands

Each meter is an integer from **0 to 6**, clamped. The state shown is the band:

- **Time, Budget, Vision:** 5–6 is the best state, 2–4 the middle, 0–1 the worst.
- **Exposure:** 0–1 is Low, 2–4 is Some, 5–6 is High.

Numbers are never shown to the player, only the state words.

### 4.3 Effects

Every choice, fair use result, Ask response, and stop 4 response can carry **effects**: a change to one or more meters, from −2 to +2 each. Effects can be shared across personas or specific to each one.

Rules, enforced by the content validator:

- Every **choice** in stops 1–3 changes **at least two meters**: at least one for the better and at least one for the worse. (“Better” means up for Time, Budget, and Vision, and down for Exposure.)
- Every Exposure increase is tagged **`legal`** or **`reputational`**. The outcome text says which, in plain words (for example, “If the owner notices, this is the kind of use that gets a takedown” or “No law against it, but people may call you out for it”).
- Exposure decreases need no tag.

The game tracks how much Exposure came from each tag across the run (`exposureLegal`, `exposureReputational`), because the epilogue uses the split (§7.2).

### 4.4 Display

- The four meters show in the header at all times once a persona is chosen. Each shows its name, its state word, and a 3-segment glyph (filled segments for the current band), so the state never depends on color alone.
- When a choice changes meters, the outcome screen shows a short line per changed meter, for example “Time: Plenty → Tight,” or “Exposure rises (legal)” when the band doesn’t change. A polite `aria-live` region announces the same text once.
- On narrow screens, the meters collapse to their glyphs, with the full words available in the Cart panel.

### 4.5 Starting values

Persona starting meters, drafts to tune in playtesting:

| Persona | Time | Budget | Exposure | Vision |
|---|---|---|---|---|
| Chronicler | 3 | 4 | 1 | 5 |
| Herald | 5 | 5 | 2 | 4 |
| Naturalist | 4 | 3 | 1 | 5 |
| Artificer | 4 | 2 | 1 | 6 |
| Bard | 4 | 2 | 2 | 6 |
| Conjurer | 5 | 2 | 1 | 5 |

### 4.6 Locked options

A choice can **require** a meter not to be in its worst band. When the requirement fails, the choice still shows, but it is **disabled** (`aria-disabled="true"`, greyed, not focusable as an action) and has a one-line reason directly beneath it:

| Meter in worst band | Reason shown |
|---|---|
| Time | You’re out of time for this. |
| Budget | You’re already over budget. |

Exposure and Vision never lock options. High Exposure and Lost Vision show up in the epilogue instead.

Which choices require what: anything that involves asking, searching, or waiting requires Time (track down the owner, ask for permission, contact the rights holder). Anything that involves paying requires Budget (license a paid alternative).

**Every stop must keep at least one choice that has no requirement,** so the player can never be stuck. The validator enforces this.

### 4.7 Going back

The existing “Go back to this stop” option on the between-stops screen stays. Going back **restores the meters to what they were when the player arrived at the stop** (the game stores a snapshot when each stop starts), so changing a choice replaces its effects rather than stacking them.

---

## 5. Stops

### 5.1 New names

| id (unchanged) | Old title | New title |
|---|---|---|
| `free` | The “Free” Thing That Isn’t | **Unmarked** |
| `layers` | The Public Domain Trap | **Old Bones** |
| `permission` | Permission Isn’t Only About Copyright | **Strings Attached** |
| `flip` | The Flip | **Out in the World** |

### 5.2 Stop 1 (Unmarked): coached fair use, required

The new flow:

1. Clerk intro → setup → complication (as now).
2. The Clerk suggests thinking it through together before deciding. **The fair use analysis starts automatically.** There is no choice to skip it.
3. **Coaching:** for each of the four factors, the Clerk adds one or two lines of coaching before the persona-specific text. The coaching explains what the factor is really asking, in his voice. It is the same for every persona.
4. The assessment (as now). Each stop 1 assessment carries a **strength**: `strong`, `moderate`, or `weak`.
5. **Decision,** with choices:
   - **Use it, relying on your fair use analysis.** Effects depend on the strength: Time +0; Exposure +0 (strong), +1 (moderate), or +2 (weak), tagged legal; Vision +1.
   - **Find a free alternative.** Time −1, Vision −1, Exposure −1.
   - **Pay for a licensed alternative** (requires Budget). Budget −2, Exposure −1.
   - **Track down the owner and ask** (requires Time). Runs a search first (§5.4): Time −2 whether or not it succeeds. If the owner is found, the Ask mechanic opens and the response’s effects follow. If not, the time is spent and the player chooses again.

Exact effect values may be tuned per persona in the content. The validator rules in §4.3 apply.

### 5.3 Stops 2 and 3: fair use optional and uncoached

Fair use stays one of the choices and runs as now, without coaching. Its result applies effects by strength (as in §5.2) plus **Time −1** for the time spent on the analysis. Every other choice gets effects, and requirements per §4.6.

### 5.4 The Ask mechanic gains effects

**Searching first.** When asking means tracking someone down (the stop 1 choice, or any choice marked `search` in content), a hidden roll decides whether the search finds anyone before the request can be sent:

- The search costs **Time −2** either way. That’s the sunk cost.
- **Found:** the Ask mechanic opens as usual. The search cost replaces the normal request cost, so the player doesn’t pay twice.
- **Not found:** an outcome screen says so, in the persona’s situation (the username leads nowhere; the account was deleted years ago). The player returns to the stop’s choices. The search choice is now disabled with the reason **“You already looked. No luck.”** (it uses the same locked-option display as §4.6).
- **Odds** are set per persona in content as a find chance from 0 to 1, reflecting how traceable that artifact really is (a sprite sheet on a forum is harder to trace than a drum break off a known record). Drafts range from 0.3 to 0.7.
- **The roll is seeded,** like the Ask response (session seed + persona + stop), so going back to the stop or retrying gives the same result. Going back restores the meters (§4.7), but the search result stands.

Where the owner is already known (a named label, a reachable artist), there’s no search, and sending a request costs **Time −1**.

**The response is a hidden roll too.** The game already deals the response from a seeded draw (base spec §5.1). Revision 2 keeps that and changes two things:

- **Odds live in content, per persona and stop,** instead of one global table. A well-formed request still shifts the odds toward yes, but never guarantees it. Defaults when content doesn’t override them: well-formed yes 35 / conditional 35 / no 15 / silence 15; poorly formed 15 / 25 / 25 / 35.
- **Conditions are a second hidden roll, and they can be unwelcome surprises.** A “yes, with conditions” response draws its terms from the persona’s list in content:
  - **a small fee** (Budget −1)
  - **a large fee** (Budget −2)
  - **a restriction** (Vision −1): for example, only 10 seconds, no edits, or not in the trailer
  - **credit with a specific wording or placement** (no meter change, but it’s a real obligation)

  The player doesn’t know the terms until they arrive.

**Accepting or turning down terms.** A conditional yes leads to a decision:

- **Accept the terms.** Applies the terms’ effects. If the terms include a fee, this option **requires Budget** and shows “You’re already over budget.” when locked. A fee can also push Budget into the worst band, and the game lets it, because that’s the surprise.
- **Turn them down.** No terms apply. The player continues to the existing follow-up choices (use it anyway / don’t use it / run a fair use analysis).

Like every roll, the response and its terms are seeded (session seed + persona + stop), so going back gives the same answer.

Each response carries effects:

| Response | Effects (default) |
|---|---|
| Yes | Exposure −2, Vision +1 |
| Yes, with conditions | Exposure −1 if accepted, plus the drawn terms’ effects (above) |
| Polite no | Vision −1 |
| Silence | Time −1 (you waited) |

After the response, the existing follow-up choices (use it / don’t use it / run a fair use analysis) carry their own effects.

### 5.5 Stop 4 (Out in the World): unchanged mechanics, plus effects

The license picker and the three reuse events stay. Reuse responses get small effects so they register:

- **Takedown:** Time −1
- **Negotiate:** Budget +1, Time −1
- **Ask for credit:** no change
- **Let it go:** Vision −1, if the reuse changed the work’s meaning

Content may vary these per event. The responses also feed the epilogue (§7).

---

## 6. The Clerk, without the mystery

Removed entirely: the orphan-work identity, the clue track, every `clerkClue` line, the guess screen, the reveal, the scrapbook, the three endings (`search`, `shelf`, `wait`), the coda lines tied to them, and the “Orphan works” reference entry.

The Clerk stays as the guide, with his hedging, slightly apologetic, wry voice. His jobs are now:

- introducing the Archive (onboarding)
- presenting the brief (§3)
- introducing each stop and coaching the stop 1 fair use analysis (§5.2)
- at the end, taking the player to **the shelf** (§7)

Any line that hinted at his secret is rewritten or cut during the build, following the prose style sheet.

---

## 7. The ending: the shelf where your work ends up

### 7.1 Frame

After stop 4, the Clerk tells the player that the Archive holds everything, including what hasn’t happened yet, and walks them to the shelf where their work ends up, some years from now. The epilogue is what they find there. It is **assembled from three parts** (§7.2–§7.4), shown in order, then the Clerk’s closing line.

### 7.2 Part 1: what became of the project

The project **always ships**, so there is never an empty shelf. How it shipped depends on the meters at the end of stop 3 and on Exposure at the end of stop 4. Rules, checked in this order (several modifiers can apply together):

1. **Pulled:** Exposure is High and `exposureLegal ≥ exposureReputational`. It shipped, then a takedown or legal claim pulled it, or forced a re-edit. This overrides 3–5 and is the only fate line shown.
2. **Under a cloud:** Exposure is High and the reputational share is larger. It shipped, but people called out how it was made. This is combined with any of 3–5.
3. **Late:** Time is Out of time.
4. **Smaller:** Budget is Broke.
5. **Compromised:** Vision is Lost.
6. **As planned:** none of the above.

Content provides one fate paragraph per persona for **pulled** and **as planned**, and one sentence per persona for each of **under a cloud**, **late**, **smaller**, and **compromised**. Those sentences combine into a single paragraph when several apply. Each persona thus has 6 fate pieces, 36 in all.

### 7.3 Part 2: what’s next to it on the shelf

This part is determined by the stop 4 license, with one detail added from the stop 4 responses. Each license has a scene per persona showing its effects concretely, with something gained and something lost:

| License | The shelf shows (examples) |
|---|---|
| All rights reserved | It earned something, and it’s protected. It’s behind a paywall, or someone’s adaptation sits on hold until 70 years after you die, or a student who needed it never found it. And protection didn’t stop a knockoff: a copy someone sold without asking. |
| CC BY | Remixes and reuses with your name on them, some in places you’d never have chosen. |
| CC BY-SA | A small family of works that all had to stay open, and one company that walked away because of that. |
| CC BY-NC | Classrooms and nonprofits using it freely, and a commercial project that wanted it and couldn’t. |
| CC0 | It traveled furthest, often without your name attached. |

**Unauthorized and uncredited uses.** Every license scene, not just all rights reserved, includes at least one use the player didn’t want: someone copying the work without permission, stripping the player’s name, or using it somewhere that changes its meaning. These moments are written to land emotionally (frustration, anger, a sting) rather than as lessons, and to stay legally accurate about what happened:

- Under **all rights reserved** or any **CC** license, a copy with no permission or no required credit is an unauthorized use, and the text can say so.
- Under **CC0**, an uncredited use is allowed, because the player gave up the right to require credit. The scene should still let it sting. That gap between what’s legal and what feels fair is the point, and it makes good debrief material.
- The stop 4 responses shape these moments. A player who let the out-of-terms use go finds more copies; one who sent a takedown finds that one gone, and another somewhere else.

Content provides one unauthorized-or-uncredited moment per license per persona, folded into that license scene, so this adds no new piece count.

Response details, one sentence each, chosen by the stop 4 responses (for example, a takedown leaves a gap where the remix was, and a negotiated deal shows a contract on the shelf). The order of precedence is set in content. Content provides 5 license scenes × 6 personas = 30, plus 4 response details shared across personas.

The legal claims here (life plus 70 years for works by individual creators; what each CC license allows) are stated accurately, and carry `reviewBy` only if they could change.

### 7.4 Part 3: your last word

This is one line in the persona’s voice, chosen by Vision at the end: Intact, Compromised, or Lost (3 × 6 = 18 lines).

### 7.5 Other futures

After the player has seen their own shelf, the Clerk offers to show them what might have been, the way Clarence shows George Bailey a world without him. (The scene can nod to that kind of moment, but it doesn’t quote or name the film.)

- **The offer** comes after part 3. The Clerk asks whether the player wants to see how it would have gone under a different license, and the screen shows the other four licenses as buttons.
- **An alternate future** shows that license’s **part 2 scene** (§7.3) for the player’s persona. Part 1 (the fate) and part 3 (the last word) don’t change, because they come from the meters, not the license. The Clerk frames it with a line like “If you’d chosen CC BY…”.
- **Responses in alternate futures:** the player’s stop 4 responses were made against their real license, so alternate scenes use each license scene’s **base version** of the unauthorized-or-uncredited moment, without the response-specific details. Content therefore writes each license scene as a base, plus the response details that apply only to the real run.
- **Clearly hypothetical.** Alternate futures look different from the real shelf: dimmer or desaturated styling, plus the heading “What might have been: <license>.” That difference never depends on color alone; the heading always says it.
- **Nothing changes.** Viewing alternates doesn’t change the license, the cart, the meters, or the project summary. A **Back to your shelf** button returns to the real epilogue. The player can view any or all of the four, in any order.
- **Then continue** to the closing line and the project summary as before.

In class mode, this gives the facilitator a ready debrief prompt: “Look at a future you didn’t choose. Would you trade?”

### 7.6 After the shelf

The Clerk’s closing line, kept general (for example: the decisions were yours, and every one of them had a cost). Then **Your project**, which replaces the cart review screen: the brief, the three items and their terms, your work and its license, the final meters, and, in class mode, the facilitator line (“Facilitator: use these notes for the full-room debrief.”). Then resources and “Play again.”

---

## 8. Architecture changes (summary for the build plan)

**Types**
- Add: `MeterId = 'time' | 'budget' | 'exposure' | 'vision'`, `Meters = Record<MeterId, number>`, `ExposureTag = 'legal' | 'reputational'`, `Effect { meter: MeterId; delta: number; tag?: ExposureTag }`, `Effects = Effect[]`.
- `Choice` gains `effects?: Effects | Record<PersonaId, Effects>` and `requires?: ('time' | 'budget')[]`.
- `Persona` gains `brief` and `startMeters`.
- Assessments gain a strength.
- Ask responses and flip responses gain effects.
- `ClerkContent` is replaced by a shelf/epilogue content shape (§7).
- Remove `GuessId`, `EndingId`, `clerkClue`, and `unlockAfterReveal`.

**State**
- Add: `meters`, `meterSnapshot` (taken when each stop starts), `exposureLegal`, `exposureReputational`.
- Remove: `guess`, `ending`, `revealed`.
- Screens: add `brief` (after `persona`) and `shelf` (after the flip); remove `guess`, `reveal`, `ending`; rename `cart` to `project`.

**Library**
- `lib/meters.ts`: apply effects (clamped), band lookup, lock check and lock reason, meter-change lines for display.
- `lib/epilogue.ts`: compute the fate modifiers and assemble the three parts, plus `alternateScene(content, persona, license)` for other futures (§7.5). Which alternate is being viewed is UI state on the shelf screen, not game state.
- `lib/ask.ts` gains `rollSearch(seed, persona, stopId, findChance): boolean` and `rollTerms(seed, persona, stopId, terms): Terms`, both seeded the same way as `dealAskResponse`. `dealAskResponse` takes its odds from content (per persona and stop) instead of the global `ASK_WEIGHTS`, which become the defaults. State records search results per stop so a failed search stays failed.

**Validator**
- Effects rules (§4.3), at least one unrequired choice per stop (§4.6), all new content present for all six personas, and starting meters within 0–6.

---

## 9. Testing focus

- Going back to a stop restores meters (no double-counting) but keeps a failed search failed.
- A failed search costs Time once, disables the search choice with its reason, and leaves at least one other choice open.
- Search odds behave as set: over many seeds, the find rate is close to each persona’s find chance.
- Over many seeds, conditional responses produce every term type in the persona’s list; a large fee when Budget is low locks “Accept the terms” and leaves “Turn them down” available.
- A locked choice can’t be activated by click, Enter, or Space, and its reason is read by screen readers.
- No stop can leave the player with every choice locked.
- Meters clamp at 0 and 6.
- Epilogue assembly is deterministic, and every combination of fate modifiers produces readable text.
- Viewing alternate futures never changes game state; every license’s base scene exists for every persona; the real license is not offered as an alternate.
- Home’s confirmation dialog: Keep playing changes nothing, and Start over fully resets.
- The Continue bar doesn’t move between narrative screens of different text lengths.

---

## 10. Decisions log (revision 2)

| Decision | Choice |
|---|---|
| Meters | Time, Budget, Exposure (legal + reputational), Vision; always visible; state words, never numbers |
| Locks | Greyed with a text reason; only Time and Budget lock; every stop keeps an unlocked choice |
| Searching | Tracking someone down is a seeded hidden roll; Time is spent either way; a failed search can’t be retried |
| Permission | Response and its conditions are seeded hidden rolls; odds per persona and stop; fees can be unexpected; the player can accept or turn down terms |
| Obligations | Part of the brief, not a meter |
| Stop 1 | Required fair use analysis, coached by the Clerk; then decide |
| Stop names | Unmarked, Old Bones, Strings Attached, Out in the World |
| Clerk | Guide only; no identity mystery |
| Other futures | After their shelf, players can view the other four licenses’ scenes as clearly marked hypotheticals; game state is unchanged |
| Ending | The shelf: fate + license scene + last word; the project always ships (it can be late, smaller, compromised, under a cloud, or pulled) |
| Site | Header with Home (confirm) and About; cart panel; fixed Continue; distinct Clerk speech |
