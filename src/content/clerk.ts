import { ClerkContent, FateId, LICENSE_IDS, PERSONA_IDS, PersonaId, ReuseResponse, VisionBand } from './types';

// Revision 2: the orphan-work mystery is gone. The shelf below is PLACEHOLDER text until Task 12
// writes it. The validator reports
// these as errors; `npm run validate -- --allow-placeholder` lists them as warnings instead.
const tbd = (task: number, what: string) => `PLACEHOLDER (Task ${task}): ${what}`;
const FATES: FateId[] = ['pulled', 'asPlanned', 'underCloud', 'late', 'smaller', 'compromised'];
const VISION_BANDS: VisionBand[] = ['intact', 'compromised', 'lost'];
const RESPONSES: ReuseResponse[] = ['takedown', 'credit', 'negotiate', 'let-go'];
const byPersona = <V,>(fn: (p: PersonaId) => V) => Object.fromEntries(PERSONA_IDS.map((p) => [p, fn(p)])) as Record<PersonaId, V>;
const byKey = <K extends string>(keys: readonly K[], fn: (k: K) => string) =>
  Object.fromEntries(keys.map((k) => [k, fn(k)])) as Record<K, string>;

export const clerk: ClerkContent = {
  briefIntro:
    'Here’s what you came for, then. I’ve put it all on one card: what you’re making, who’s waiting on it, when it’s due, and the three things you need from these shelves. At the bottom is where your project stands before you’ve touched anything. That part tends to change. Sorry in advance.',
  coachInvite:
    'Before you decide, would you mind if we thought this one through together? There’s a test for exactly this question, called fair use. It has four parts, and I’ll tell you what each one is really asking. It won’t hand you a yes or a no, I’m afraid, but you’ll have a much better idea of where you stand.',
  shelf: {
    intro: [tbd(12, 'the Clerk walks you to the shelf')],
    fate: byPersona((p) => byKey(FATES, (f) => tbd(12, `${p} fate: ${f}`))),
    scenes: byPersona((p) => byKey(LICENSE_IDS, (l) => tbd(12, `${p} scene: ${l}`))),
    outsideDetail: byKey(RESPONSES, (r) => tbd(12, `outside detail: ${r}`)),
    lastWord: byPersona((p) => byKey(VISION_BANDS, (v) => tbd(12, `${p} last word: ${v}`))),
    othersOffer: tbd(12, 'the Clerk offers to show other futures'),
    altFrame: tbd(12, 'What might have been: {license}'),
    backToYours: tbd(12, 'Back to your shelf'),
    closingLine: tbd(12, 'the Clerk’s closing line'),
  },
};
