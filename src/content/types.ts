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
  /**
   * 'fairUse': the choice relies on the stop's fair use assessment, so its effects come from that assessment's
   * strength (`fairUseEffects`), not from `effects`. It has no static effects, and the validator skips the
   * gain-and-cost rule for it (a strong assessment only gains).
   */
  effectsFrom?: 'fairUse';
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
  searchFound?: Partial<Record<PersonaId, string>>;         // who you found, and how; shown above the Ask form
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
export type AskFollowUpId = 'use' | 'useAnyway' | 'dont' | 'fairUse';
/** What you do with the answer. `use` follows a yes; `useAnyway` follows a no, silence, or terms turned down. */
export interface AskFollowUp { label: string; note: string; effects: Effects }
export interface AskContent {
  intro: string;
  fieldOptions: Record<AskField, { label: string; options: string[] }>;
  afterPrompt: string;   // “What do you do with this answer?”
  responses: Partial<Record<StandardStopId, Record<PersonaId, Record<AskResponse, Outcome>>>>;
  odds?: Partial<Record<StandardStopId, Partial<Record<PersonaId, AskOdds>>>>;
  /**
   * Drawn on a 'conditional' response, per stop and persona: the counterpart differs by stop (stop 1's owner,
   * found by a search, and stop 3's rights holder), so the terms they'd set do too.
   */
  terms: Partial<Record<StandardStopId, Record<PersonaId, Term[]>>>;
  acceptLabel: string;
  declineLabel: string;
  /** Added to the cart note when a conditional yes's terms are turned down, before the follow-up's note. */
  declineNote: string;
  followUps: Record<AskFollowUpId, AskFollowUp>;
}

export interface ReuseEvent {
  setup: string;
  situation: Record<LicenseId, string>;
  /** Per-response effects for this event only, replacing `FlipStop.responses[r].effects`. */
  effects?: Partial<Record<ReuseResponse, Effects>>;
}

export interface FlipStop extends StopBase {
  id: 'flip';
  work: Record<PersonaId, string>;    // what “your work” is
  licenses: Record<LicenseId, { label: string; clerkGloss: string; summary: string }>;
  events: Record<PersonaId, Record<ReuseEventKind, ReuseEvent>>;
  /** `effects` are the defaults; an event can override them for one response (see `ReuseEvent.effects`). */
  responses: Record<ReuseResponse, { label: string; cartNote: string; effects: Effects }>;
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
export interface InterstitialCopy {
  waitTitle: string;
  /** The pause card's first line, under the heading. */
  waitLead: string;
  waitBody: string;
  continueLabel: string;
  /** Class mode: the outcome button that records the stop and goes to the pause card. */
  pauseLabel: string;
  /** Class mode: the other buttons that record a stop and go straight to the pause card. */
  pauseLabels: { fairUse: string; askUse: string; askUseAnyway: string; askDont: string; askAccept: string };
  /** Class mode: asked before leaving the pause card. */
  confirmMoveOn: { question: string; confirm: string; cancel: string };
}

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
