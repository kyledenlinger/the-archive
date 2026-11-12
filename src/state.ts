import {
  LicenseId,
  Mode,
  PersonaId,
  ReuseEventKind,
  ReuseResponse,
  StandardStopId,
  STOP_ORDER,
  StopId,
} from './content/types';

// revision-2: the guess and ending ids left the content types; Task 5 removes these from state.
type GuessId = string;
type EndingId = string;

export type Screen = 'mode' | 'onboarding' | 'persona' | 'stop' | 'interstitial' | 'flip' | 'guess' | 'reveal' | 'ending' | 'cart';
export interface FlipRecord { license: LicenseId | null; responses: Partial<Record<ReuseEventKind, ReuseResponse>> }
export interface GameState {
  screen: Screen; mode: Mode | null; persona: PersonaId | null;
  stopIndex: number;                               // index into STOP_ORDER
  cart: Partial<Record<StopId, string>>;           // one cart note per stop
  flip: FlipRecord; guess: GuessId | null; ending: EndingId | null;
  revealed: boolean; seed: number;
}
export type Action =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'FINISH_ONBOARDING' }
  | { type: 'CHOOSE_PERSONA'; persona: PersonaId }
  | { type: 'RECORD_STOP'; stopId: StandardStopId; cartNote: string }
  | { type: 'ADVANCE' }
  | { type: 'REVISIT_STOP' }
  | { type: 'SET_LICENSE'; license: LicenseId }
  | { type: 'RECORD_REUSE'; kind: ReuseEventKind; response: ReuseResponse }
  | { type: 'FINISH_FLIP'; cartNote: string }
  | { type: 'SET_GUESS'; guess: GuessId }
  | { type: 'REVEAL' }
  | { type: 'SET_ENDING'; ending: EndingId }
  | { type: 'RESET'; seed: number };

export function initialState(seed: number): GameState {
  return {
    screen: 'mode',
    mode: null,
    persona: null,
    stopIndex: 0,
    cart: {},
    flip: { license: null, responses: {} },
    guess: null,
    ending: null,
    revealed: false,
    seed,
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
      return { ...state, persona: action.persona, screen: 'stop', stopIndex: 0 };

    case 'RECORD_STOP': {
      // Accepted on the stop itself or (for a late duplicate) on its interstitial; last note wins.
      if (state.screen !== 'stop' && state.screen !== 'interstitial') return state;
      if (action.stopId !== STOP_ORDER[state.stopIndex]) return state;
      return { ...state, cart: { ...state.cart, [action.stopId]: action.cartNote }, screen: 'interstitial' };
    }

    case 'ADVANCE':
      if (state.screen === 'interstitial') {
        const next = state.stopIndex + 1;
        return { ...state, stopIndex: next, screen: STOP_ORDER[next] === 'flip' ? 'flip' : 'stop' };
      }
      if (state.screen === 'ending') return { ...state, screen: 'cart' };
      return state;

    case 'REVISIT_STOP':
      // From a stop's interstitial back to that stop's choices; re-recording replaces the cart note.
      if (state.screen !== 'interstitial') return state;
      return { ...state, screen: 'stop' };

    case 'SET_LICENSE':
      if (state.screen !== 'flip') return state;
      return { ...state, flip: { license: action.license, responses: {} } };

    case 'RECORD_REUSE':
      if (state.screen !== 'flip' || !state.flip.license) return state;
      return { ...state, flip: { ...state.flip, responses: { ...state.flip.responses, [action.kind]: action.response } } };

    case 'FINISH_FLIP': {
      const r = state.flip.responses;
      if (state.screen !== 'flip' || !state.flip.license || !r.within || !r.outside || !r.beyond) return state;
      return { ...state, cart: { ...state.cart, flip: action.cartNote }, screen: 'guess' };
    }

    case 'SET_GUESS':
      if (state.screen !== 'guess') return state;
      return { ...state, guess: action.guess, screen: 'reveal' };

    case 'REVEAL':
      if (state.screen !== 'reveal' || state.revealed) return state;
      return { ...state, revealed: true };

    case 'SET_ENDING':
      if (state.screen !== 'reveal' || !state.revealed) return state;
      return { ...state, ending: action.ending, screen: 'ending' };

    case 'RESET':
      return initialState(action.seed);

    default:
      return state;
  }
}
