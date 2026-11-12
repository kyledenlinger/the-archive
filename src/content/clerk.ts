import { ClerkContent, FateId, LICENSE_IDS, PERSONA_IDS, PersonaId, ReuseResponse, VisionBand } from './types';

// Revision 2: the orphan-work mystery is gone. Everything below is PLACEHOLDER text until its task
// writes it (Task 7: briefIntro; Task 9: coachInvite; Task 12: the shelf). The validator reports
// these as errors; `npm run validate -- --allow-placeholder` lists them as warnings instead.
const tbd = (task: number, what: string) => `PLACEHOLDER (Task ${task}): ${what}`;
const FATES: FateId[] = ['pulled', 'asPlanned', 'underCloud', 'late', 'smaller', 'compromised'];
const VISION_BANDS: VisionBand[] = ['intact', 'compromised', 'lost'];
const RESPONSES: ReuseResponse[] = ['takedown', 'credit', 'negotiate', 'let-go'];
const byPersona = <V,>(fn: (p: PersonaId) => V) => Object.fromEntries(PERSONA_IDS.map((p) => [p, fn(p)])) as Record<PersonaId, V>;
const byKey = <K extends string>(keys: readonly K[], fn: (k: K) => string) =>
  Object.fromEntries(keys.map((k) => [k, fn(k)])) as Record<K, string>;

export const clerk: ClerkContent = {
  briefIntro: tbd(7, 'the Clerk presents the brief'),
  coachInvite: tbd(9, 'the Clerk offers to think it through together'),
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
