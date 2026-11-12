import {
  AskField,
  AskResponse,
  Effects,
  ExposureTag,
  LicenseId,
  Meters,
  Mode,
  PersonaId,
  ReuseEventKind,
  ReuseResponse,
  StandardStopId,
  STOP_ORDER,
  StopId,
} from './content/types';
import { applyEffects, meterChanges, previewChanges } from './lib/meters';

export type Screen = 'mode' | 'onboarding' | 'persona' | 'brief' | 'stop' | 'interstitial' | 'flip' | 'shelf' | 'project';
export interface FlipRecord { license: LicenseId | null; responses: Partial<Record<ReuseEventKind, ReuseResponse>> }
export interface ExposureTags { legal: number; reputational: number }
/** One meter change for the live region. `tag` is set when exposure rose and all of the rise came from one tag. */
export type MeterChange = ReturnType<typeof meterChanges>[number] & { tag?: ExposureTag };

/** How a player reads one fair use factor. */
export type Lean = 'supports' | 'complicates' | 'unsure';
export type AskDraft = Partial<Record<AskField, string>>;
export interface AskRecord { request: AskDraft; response: AskResponse }

/**
 * Which page of the current screen is showing. Every page a player can step back to is described here, so
 * Back can return to it. Screens with one page use `single`. Later tasks add their pages to this union.
 */
export type Page =
  | { kind: 'single' }
  | { kind: 'beat'; index: number }                          // onboarding
  | { kind: 'intro' }                                        // a stop's or the flip's Clerk intro
  | { kind: 'choices' }                                      // a stop's setup, complication, and choices (coached: choices only)
  | { kind: 'setup' }                                        // coached stop: the persona setup
  | { kind: 'complication' }                                 // coached stop: the complication
  | { kind: 'coachInvite' }                                  // coached stop: the Clerk suggests thinking it through
  | { kind: 'searchFail' }                                   // a search that found no one, before the choices again
  | { kind: 'outcome'; choiceId: string }                    // a plain choice's outcome, before Add to cart
  | { kind: 'fairUse'; factor: number; via?: 'ask' }        // factor 0–3, or 4 for the summary; coached in a coached stop
  | { kind: 'askForm'; draft: AskDraft }                     // the draft changes without adding history
  | { kind: 'askReply' }                                     // the reply; a conditional yes shows its terms here
  | { kind: 'askDeclined' }                                  // a conditional yes's terms turned down: the follow-ups
  | { kind: 'license' }                                      // the flip's license picker
  | { kind: 'reuse'; index: number }                         // the flip's reuse events, 0–2
  | { kind: 'flipEnd' };                                     // revision-2: Task 11 removes this page

/** A place in the game that Back can return to. */
export interface Location { screen: Screen; stopIndex: number; page: Page }

/** Keys for decisions that are kept only so a revisited page can show what was chosen. */
export const decisionKey = {
  choice: (stop: StandardStopId) => `${stop}:choice`,
  factor: (stop: StandardStopId, i: number) => `${stop}:factor:${i}`,
  askFollowUp: (stop: StandardStopId) => `${stop}:askFollowUp`,
  askTerms: (stop: StandardStopId) => `${stop}:askTerms`,   // 'accept' | 'decline'
};

export interface GameState {
  screen: Screen; mode: Mode | null; persona: PersonaId | null;
  stopIndex: number;                               // index into STOP_ORDER
  page: Page;
  cart: Partial<Record<StopId, string>>;           // one cart note per stop
  flip: FlipRecord;
  meters: Meters;
  atFlip: Meters | null;                           // snapshot when the flip started (end of stop 3)
  exposureLegal: number; exposureReputational: number;
  searches: Partial<Record<StandardStopId, 'found' | 'notFound'>>;
  sunkKeys: string[];                              // one-time costs already paid at this stop ('search', 'fairUse', 'send')
  decisions: Record<string, string>;               // see `decisionKey`; each is set once and never changes
  asks: Partial<Record<StandardStopId, AskRecord>>;   // a request, once sent, and its reply
  /** Back is navigation only: these are places, never state to restore. Decisions are permanent. */
  history: Location[];                             // places behind this one (Back pops)
  forward: Location[];                             // places ahead after going Back (Forward pops); non-empty = reviewing
  lastChanges: { id: number; changes: MeterChange[] } | null;   // for the live region
  seed: number;
}

export type Action =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'GO_TO'; page: Page }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'CHOOSE_PERSONA'; persona: PersonaId; startMeters: Meters }
  | { type: 'FINISH_BRIEF' }
  | { type: 'DECIDE'; key: string; value: string; page?: Page }
  | { type: 'APPLY_EFFECTS'; effects: Effects; key: string }
  | { type: 'RECORD_SEARCH'; stopId: StandardStopId; found: boolean }
  | { type: 'SET_ASK_DRAFT'; draft: AskDraft }
  | { type: 'SEND_ASK'; stopId: StandardStopId; request: AskDraft; response: AskResponse }
  | { type: 'RECORD_STOP'; stopId: StandardStopId; cartNote: string; effects: Effects }
  | { type: 'ADVANCE' }
  | { type: 'SET_LICENSE'; license: LicenseId }
  | { type: 'RECORD_REUSE'; kind: ReuseEventKind; response: ReuseResponse; effects: Effects }
  | { type: 'FINISH_FLIP'; cartNote: string }
  | { type: 'BACK' }
  | { type: 'FORWARD' }
  | { type: 'RESET'; seed: number };

const NO_METERS: Meters = { time: 0, budget: 0, exposure: 0, vision: 0 };
const SINGLE: Page = { kind: 'single' };

export function initialState(seed: number): GameState {
  return {
    screen: 'mode',
    mode: null,
    persona: null,
    stopIndex: 0,
    page: SINGLE,
    cart: {},
    flip: { license: null, responses: {} },
    meters: NO_METERS,
    atFlip: null,
    exposureLegal: 0,
    exposureReputational: 0,
    searches: {},
    sunkKeys: [],
    decisions: {},
    asks: {},
    history: [],
    forward: [],
    lastChanges: null,
    seed,
  };
}

/** True after Back, until the player has walked forward again to where they were. Pages show read-only. */
export const isReviewing = (state: GameState) => state.forward.length > 0;

/**
 * What a forward button dispatches: the action itself at the frontier, or FORWARD on a revisited page,
 * so walking forward again never re-records anything.
 */
export const onward = (state: GameState, action: Action): Action => (isReviewing(state) ? { type: 'FORWARD' } : action);

/** Apply effects on top of the current meters and tags, with a fresh `lastChanges` entry for the live region. */
function applyNow(state: GameState, effects: Effects): GameState {
  const r = applyEffects(state.meters, effects);
  const changes: MeterChange[] = previewChanges(state.meters, effects);
  return {
    ...state,
    meters: r.meters,
    exposureLegal: state.exposureLegal + r.legal,
    exposureReputational: state.exposureReputational + r.reputational,
    lastChanges: { id: (state.lastChanges?.id ?? 0) + 1, changes },
  };
}

const samePage = (a: Page, b: Page) => JSON.stringify(a) === JSON.stringify(b);
const here = (s: GameState): Location => ({ screen: s.screen, stopIndex: s.stopIndex, page: s.page });
const at = (s: GameState, loc: Location): GameState => ({ ...s, screen: loc.screen, stopIndex: loc.stopIndex, page: loc.page });

/** The game itself. Any action that doesn't fit the current screen returns the same state object. */
function play(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_MODE':
      if (state.screen !== 'mode') return state;
      return { ...state, mode: action.mode, screen: 'onboarding', page: { kind: 'beat', index: 0 } };

    case 'GO_TO':
      // Moving between pages of the current screen. Recording happens in the other actions.
      if (!['onboarding', 'stop', 'flip'].includes(state.screen) || samePage(state.page, action.page)) return state;
      return { ...state, page: action.page };

    case 'FINISH_ONBOARDING':
      if (state.screen !== 'onboarding') return state;
      return { ...state, screen: 'persona', page: SINGLE };

    case 'CHOOSE_PERSONA':
      if (state.screen !== 'persona' || state.persona) return state;
      return {
        ...state,
        persona: action.persona,
        screen: 'brief',
        page: SINGLE,
        meters: action.startMeters,
        exposureLegal: 0,
        exposureReputational: 0,
      };

    case 'FINISH_BRIEF':
      if (state.screen !== 'brief') return state;
      return { ...state, screen: 'stop', stopIndex: 0, page: { kind: 'intro' }, sunkKeys: [] };

    case 'DECIDE':
      if (action.key in state.decisions) return state;
      return { ...state, decisions: { ...state.decisions, [action.key]: action.value }, page: action.page ?? state.page };

    case 'APPLY_EFFECTS':
      // A one-time mid-stop cost (search, fair use, sending a request). Paying the same key twice is a no-op.
      if (state.screen !== 'stop' || state.sunkKeys.includes(action.key)) return state;
      return { ...applyNow(state, action.effects), sunkKeys: [...state.sunkKeys, action.key] };

    case 'RECORD_SEARCH':
      if (state.screen !== 'stop' || action.stopId !== STOP_ORDER[state.stopIndex]) return state;
      return { ...state, searches: { ...state.searches, [action.stopId]: action.found ? 'found' : 'notFound' } };

    case 'SET_ASK_DRAFT':
      if (state.page.kind !== 'askForm') return state;
      return { ...state, page: { kind: 'askForm', draft: action.draft } };

    case 'SEND_ASK':
      if (state.screen !== 'stop' || action.stopId !== STOP_ORDER[state.stopIndex] || state.asks[action.stopId]) return state;
      return { ...state, asks: { ...state.asks, [action.stopId]: { request: action.request, response: action.response } }, page: { kind: 'askReply' } };

    case 'RECORD_STOP': {
      // Choices are final: a stop is recorded once, and its effects apply on top of the current meters.
      if (state.screen !== 'stop' || action.stopId !== STOP_ORDER[state.stopIndex] || state.cart[action.stopId]) return state;
      const next = applyNow(state, action.effects);
      return { ...next, cart: { ...state.cart, [action.stopId]: action.cartNote }, screen: 'interstitial', page: SINGLE };
    }

    case 'ADVANCE':
      if (state.screen === 'interstitial') {
        const next = state.stopIndex + 1;
        const toFlip = STOP_ORDER[next] === 'flip';
        return {
          ...state,
          stopIndex: next,
          screen: toFlip ? 'flip' : 'stop',
          page: { kind: 'intro' },
          sunkKeys: [],
          atFlip: toFlip ? state.meters : state.atFlip,
        };
      }
      if (state.screen === 'shelf') return { ...state, screen: 'project', page: SINGLE };
      return state;

    case 'SET_LICENSE':
      // Picked once; the reuse events follow.
      if (state.screen !== 'flip' || state.flip.license) return state;
      return { ...state, flip: { license: action.license, responses: {} }, page: { kind: 'reuse', index: 0 } };

    case 'RECORD_REUSE': {
      // Each reuse event is answered once; a repeat would stack its effects, so it is ignored.
      if (state.screen !== 'flip' || !state.flip.license || state.flip.responses[action.kind]) return state;
      const next = applyNow(state, action.effects);
      return { ...next, flip: { ...state.flip, responses: { ...state.flip.responses, [action.kind]: action.response } } };
    }

    case 'FINISH_FLIP': {
      const r = state.flip.responses;
      if (state.screen !== 'flip' || !state.flip.license || !r.within || !r.outside || !r.beyond) return state;
      return { ...state, cart: { ...state.cart, flip: action.cartNote }, screen: 'shelf', page: SINGLE };
    }

    default:
      return state;
  }
}

/**
 * Pure reducer: the game plus navigation history. Every move to a new place (screen, stop, or page) pushes the
 * old place onto `history`, except choosing a mode (the game starts there) and typing into the Ask form.
 * BACK only moves: meters, cart, flip, searches, and decisions stay as they are. While reviewing (after BACK),
 * only BACK, FORWARD, and RESET do anything, so no decision can be made twice.
 */
export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'RESET':
      return initialState(action.seed);
    case 'BACK': {
      const prev = state.history[state.history.length - 1];
      if (!prev) return state;
      return { ...at(state, prev), history: state.history.slice(0, -1), forward: [...state.forward, here(state)] };
    }
    case 'FORWARD': {
      const next = state.forward[state.forward.length - 1];
      if (!next) return state;
      return { ...at(state, next), history: [...state.history, here(state)], forward: state.forward.slice(0, -1) };
    }
  }
  if (isReviewing(state)) return state;
  const next = play(state, action);
  if (next === state || action.type === 'SET_MODE' || action.type === 'SET_ASK_DRAFT') return next;
  const moved = next.screen !== state.screen || next.stopIndex !== state.stopIndex || !samePage(next.page, state.page);
  return moved ? { ...next, history: [...state.history, here(state)] } : next;
}
