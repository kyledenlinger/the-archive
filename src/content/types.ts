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

export type MeterId = 'time' | 'budget' | 'exposure' | 'vision';
export const METER_IDS: MeterId[] = ['time', 'budget', 'exposure', 'vision'];
export type Meters = Record<MeterId, number>;        // integers, clamped to 0–6; never shown as numbers
export type MeterBand = 'best' | 'middle' | 'worst';
export type LockMeter = 'time' | 'budget';           // only these meters lock options
export type ExposureTag = 'legal' | 'reputational';
export interface Effect { meter: MeterId; delta: number; tag?: ExposureTag }   // delta in -2..2
export type Effects = Effect[];
export type Strength = 'strong' | 'moderate' | 'weak';
export type TermKind = 'smallFee' | 'largeFee' | 'restriction' | 'credit';
export type VisionBand = 'intact' | 'compromised' | 'lost';
export type FateId = 'pulled' | 'asPlanned' | 'underCloud' | 'late' | 'smaller' | 'compromised';

export interface ReviewFlag { date: string; note: string }   // date: ISO yyyy-mm-dd
export interface Outcome { text: string; cartNote: string; effects?: Effects }
export interface Brief { making: string; answersTo: string; deadline: string; items: [string, string, string] }
export interface Persona { id: PersonaId; name: string; medium: string; description: string; brief: Brief; startMeters: Meters }

export interface Choice {
  id: string;
  label: string;
  mechanic?: 'fairUse' | 'ask' | 'search';           // 'search' = track down, then ask; mechanic choices have no outcome
  outcome?: Outcome | Record<PersonaId, Outcome>;
  effects?: Effects | Record<PersonaId, Effects>;     // applied when the choice is recorded
  requires?: LockMeter[];
}
export interface Debrief { lesson: string; prompts: string[] }   // shown in independent mode
export interface StopBase {
  id: StopId;
  title: string;
  clerkIntro: string;
  setup: Record<PersonaId, string>;
  debrief: Debrief;
  reviewBy?: ReviewFlag;
  personaReviewBy?: Partial<Record<PersonaId, ReviewFlag>>;
}
export interface StandardStop extends StopBase {
  id: StandardStopId;
  complication: string;
  choices: Choice[];
  coached?: boolean;                                        // true only for 'free'
  searchFindChance?: Partial<Record<PersonaId, number>>;    // 0..1, for 'search' choices
  searchFail?: Partial<Record<PersonaId, string>>;          // the not-found outcome text
}

export interface FairUseFactor { title: string; description: string; text: Record<StandardStopId, Record<PersonaId, string>> }
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
  afterPrompt: string;   // “What do you do with this answer?”
  responses: Partial<Record<StandardStopId, Record<PersonaId, Record<AskResponse, Outcome>>>>;
  odds?: Partial<Record<StandardStopId, Partial<Record<PersonaId, AskOdds>>>>;
  terms: Record<PersonaId, Term[]>;                            // drawn on a 'conditional' response
  acceptLabel: string;
  declineLabel: string;
}

export interface FlipStop extends StopBase {
  id: 'flip';
  work: Record<PersonaId, string>;    // what “your work” is
  licenses: Record<LicenseId, { label: string; clerkGloss: string; summary: string }>;
  events: Record<PersonaId, Record<ReuseEventKind, { setup: string; situation: Record<LicenseId, string> }>>;
  responses: Record<ReuseResponse, { label: string; cartNote: string; effects?: Effects }>;
}

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

export interface OnboardingPiece { kind: 'narration' | 'clerk'; text: string }
/** Each beat of the opening scene is a list of pieces, shown in order. */
export interface OnboardingContent { lines: OnboardingPiece[][] }
export interface ReferenceEntry { id: string; title: string; body: string }
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
