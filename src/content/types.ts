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
