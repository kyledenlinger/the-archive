import {
  Effects,
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
import { applyEffects, meterChanges } from './lib/meters';

export type Screen = 'mode' | 'onboarding' | 'persona' | 'brief' | 'stop' | 'interstitial' | 'flip' | 'shelf' | 'project';
export interface FlipRecord { license: LicenseId | null; responses: Partial<Record<ReuseEventKind, ReuseResponse>> }
export interface ExposureTags { legal: number; reputational: number }
export interface GameState {
  screen: Screen; mode: Mode | null; persona: PersonaId | null;
  stopIndex: number;                               // index into STOP_ORDER
  cart: Partial<Record<StopId, string>>;           // one cart note per stop
  flip: FlipRecord;
  meters: Meters;
  arrival: Meters;                                 // snapshot when the current stop started
  atFlip: Meters | null;                           // snapshot when the flip started (end of stop 3)
  exposureLegal: number; exposureReputational: number;
  arrivalTags: ExposureTags;                       // restored with `arrival` on REVISIT_STOP
  searches: Partial<Record<StandardStopId, 'found' | 'notFound'>>;   // persists through REVISIT_STOP
  sunk: Effects;                                   // mid-stop costs already paid at this stop
  sunkKeys: string[];                              // which one-time costs were paid ('search', 'fairUse', 'send')
  lastChanges: { id: number; changes: ReturnType<typeof meterChanges> } | null;   // for the live region
  seed: number;
}
export type Action =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'CHOOSE_PERSONA'; persona: PersonaId; startMeters: Meters }
  | { type: 'FINISH_BRIEF' }
  | { type: 'APPLY_EFFECTS'; effects: Effects; key: string }
  | { type: 'RECORD_SEARCH'; stopId: StandardStopId; found: boolean }
  | { type: 'RECORD_STOP'; stopId: StandardStopId; cartNote: string; effects: Effects }
  | { type: 'ADVANCE' }
  | { type: 'REVISIT_STOP' }
  | { type: 'SET_LICENSE'; license: LicenseId }
  | { type: 'RECORD_REUSE'; kind: ReuseEventKind; response: ReuseResponse; effects: Effects }
  | { type: 'FINISH_FLIP'; cartNote: string }
  | { type: 'RESET'; seed: number };

const NO_METERS: Meters = { time: 0, budget: 0, exposure: 0, vision: 0 };

export function initialState(seed: number): GameState {
  return {
    screen: 'mode',
    mode: null,
    persona: null,
    stopIndex: 0,
    cart: {},
    flip: { license: null, responses: {} },
    meters: NO_METERS,
    arrival: NO_METERS,
    atFlip: null,
    exposureLegal: 0,
    exposureReputational: 0,
    arrivalTags: { legal: 0, reputational: 0 },
    searches: {},
    sunk: [],
    sunkKeys: [],
    lastChanges: null,
    seed,
  };
}

/** New meters and exposure tags, plus a fresh `lastChanges` entry (diffed against the current meters) for the live region. */
function withMeters(state: GameState, meters: Meters, tags: ExposureTags): GameState {
  return {
    ...state,
    meters,
    exposureLegal: tags.legal,
    exposureReputational: tags.reputational,
    lastChanges: { id: (state.lastChanges?.id ?? 0) + 1, changes: meterChanges(state.meters, meters) },
  };
}

/** Apply effects on top of the current meters and tags. */
function applyNow(state: GameState, effects: Effects): GameState {
  const r = applyEffects(state.meters, effects);
  return withMeters(state, r.meters, {
    legal: state.exposureLegal + r.legal,
    reputational: state.exposureReputational + r.reputational,
  });
}

/** Snapshot the current meters and tags as the arrival point for a new stop, with no sunk costs yet. */
function arriveAt(state: GameState): GameState {
  return {
    ...state,
    arrival: state.meters,
    arrivalTags: { legal: state.exposureLegal, reputational: state.exposureReputational },
    sunk: [],
    sunkKeys: [],
  };
}

/** Pure reducer. Any action that doesn't fit the current screen returns the same state object. */
export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_MODE':
      if (state.screen !== 'mode') return state;
      return { ...state, mode: action.mode, screen: 'onboarding' };

    case 'FINISH_ONBOARDING':
      if (state.screen !== 'onboarding') return state;
      return { ...state, screen: 'persona' };

    case 'CHOOSE_PERSONA':
      if (state.screen !== 'persona') return state;
      return {
        ...state,
        persona: action.persona,
        screen: 'brief',
        meters: action.startMeters,
        arrival: action.startMeters,
        arrivalTags: { legal: 0, reputational: 0 },
        exposureLegal: 0,
        exposureReputational: 0,
      };

    case 'FINISH_BRIEF':
      if (state.screen !== 'brief') return state;
      return { ...arriveAt(state), screen: 'stop', stopIndex: 0 };

    case 'APPLY_EFFECTS':
      // A one-time mid-stop cost (search, fair use, sending a request). Paying the same key twice is a no-op.
      if (state.screen !== 'stop' || state.sunkKeys.includes(action.key)) return state;
      return {
        ...applyNow(state, action.effects),
        sunk: [...state.sunk, ...action.effects],
        sunkKeys: [...state.sunkKeys, action.key],
      };

    case 'RECORD_SEARCH':
      if (state.screen !== 'stop' || action.stopId !== STOP_ORDER[state.stopIndex]) return state;
      return { ...state, searches: { ...state.searches, [action.stopId]: action.found ? 'found' : 'notFound' } };

    case 'RECORD_STOP': {
      // Accepted on the stop itself or (for a late duplicate) on its interstitial; last note wins.
      if (state.screen !== 'stop' && state.screen !== 'interstitial') return state;
      if (action.stopId !== STOP_ORDER[state.stopIndex]) return state;
      // Recomputed from arrival + sunk costs, so recording again replaces the earlier choice's effects.
      const paid = applyEffects(state.arrival, state.sunk);
      const chosen = applyEffects(paid.meters, action.effects);
      const next = withMeters(state, chosen.meters, {
        legal: state.arrivalTags.legal + paid.legal + chosen.legal,
        reputational: state.arrivalTags.reputational + paid.reputational + chosen.reputational,
      });
      return { ...next, cart: { ...state.cart, [action.stopId]: action.cartNote }, screen: 'interstitial' };
    }

    case 'ADVANCE':
      if (state.screen === 'interstitial') {
        const next = state.stopIndex + 1;
        const toFlip = STOP_ORDER[next] === 'flip';
        return {
          ...arriveAt(state),
          stopIndex: next,
          screen: toFlip ? 'flip' : 'stop',
          atFlip: toFlip ? state.meters : state.atFlip,
        };
      }
      if (state.screen === 'shelf') return { ...state, screen: 'project' };
      return state;

    case 'REVISIT_STOP': {
      // From a stop's interstitial back to that stop's choices. Meters, tags, and sunk costs go back to
      // arrival (revision spec §4.7); search results stay. Re-recording replaces the cart note.
      if (state.screen !== 'interstitial') return state;
      const back = withMeters(state, state.arrival, state.arrivalTags);
      return { ...back, screen: 'stop', sunk: [], sunkKeys: [] };
    }

    case 'SET_LICENSE': {
      if (state.screen !== 'flip') return state;
      const fresh = { ...state, flip: { license: action.license, responses: {} } };
      // Picking a license again clears the responses, so it also refunds their effects (back to the flip's arrival).
      if (Object.keys(state.flip.responses).length === 0) return fresh;
      return withMeters(fresh, state.arrival, state.arrivalTags);
    }

    case 'RECORD_REUSE': {
      // Each reuse event is answered once; a repeat would stack its effects, so it is ignored.
      if (state.screen !== 'flip' || !state.flip.license || state.flip.responses[action.kind]) return state;
      const next = applyNow(state, action.effects);
      return { ...next, flip: { ...state.flip, responses: { ...state.flip.responses, [action.kind]: action.response } } };
    }

    case 'FINISH_FLIP': {
      const r = state.flip.responses;
      if (state.screen !== 'flip' || !state.flip.license || !r.within || !r.outside || !r.beyond) return state;
      return { ...state, cart: { ...state.cart, flip: action.cartNote }, screen: 'shelf' };
    }

    case 'RESET':
      return initialState(action.seed);

    default:
      return state;
  }
}
