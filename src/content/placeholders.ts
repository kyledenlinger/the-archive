// Temporary stand-ins so the app type-checks before each section's real content lands.
// Empty strings are deliberate: the validator flags them until they're replaced.
import { AskContent, ClerkContent, FairUseContent, FairUseFactor, FlipStop, LICENSE_IDS, PERSONA_IDS, StandardStop, StandardStopId } from './types';

const rec = <K extends string, V>(ks: readonly K[], f: () => V) => Object.fromEntries(ks.map((k) => [k, f()])) as Record<K, V>;
const P = () => rec(PERSONA_IDS, () => '');
const STD: StandardStopId[] = ['free', 'layers', 'permission'];

export const placeholderStop = (id: StandardStopId): StandardStop => ({
  id, title: id, clerkIntro: '', clerkClue: '', setup: P(), complication: '', choices: [], debrief: { lesson: '', prompts: [] },
});
export const placeholderFlip: FlipStop = {
  id: 'flip', title: 'flip', clerkIntro: '', clerkClue: '', setup: P(), debrief: { lesson: '', prompts: [] }, work: P(),
  licenses: rec(LICENSE_IDS, () => ({ label: '', clerkGloss: '', summary: '' })),
  events: rec(PERSONA_IDS, () => rec(['within', 'outside', 'beyond'] as const, () => ({ setup: '', situation: rec(LICENSE_IDS, () => '') }))),
  responses: rec(['takedown', 'credit', 'negotiate', 'let-go'] as const, () => ({ label: '', cartNote: '' })),
};
const factor = (): FairUseFactor => ({ title: '', description: '', text: rec(STD, P) });
export const placeholderFairUse: FairUseContent = { factors: [factor(), factor(), factor(), factor()], assessments: rec(STD, P) };
export const placeholderAsk: AskContent = {
  intro: '', afterPrompt: '',
  fieldOptions: rec(['what', 'how', 'where', 'howLong'] as const, () => ({ label: '', options: [] })),
  responses: rec(PERSONA_IDS, () => rec(['yes', 'conditional', 'no', 'silence'] as const, () => ({ text: '', cartNote: '' }))),
};
export const placeholderClerk: ClerkContent = {
  askForHelp: '', guessPrompt: '', guessOptions: [], reveal: [], closingLine: '',
  endings: rec(['search', 'shelf', 'wait'] as const, () => ({ label: '', scene: '' })),
  codaShade: rec(LICENSE_IDS, () => ''),
};
