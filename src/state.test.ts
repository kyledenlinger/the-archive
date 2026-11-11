import { initialState, reducer, GameState, Action } from './state';

const run = (s: GameState, ...actions: Action[]) => actions.reduce(reducer, s);
const atStop = (): GameState =>
  run(initialState(1), { type: 'SET_MODE', mode: 'class' }, { type: 'FINISH_ONBOARDING' }, { type: 'CHOOSE_PERSONA', persona: 'bard' });
const atFlip = (): GameState => {
  let s = atStop();
  for (const stopId of ['free', 'layers', 'permission'] as const) {
    s = run(s, { type: 'RECORD_STOP', stopId, cartNote: stopId }, { type: 'ADVANCE' });
  }
  return s;
};

test('initial state', () => {
  const s = initialState(42);
  expect(s.screen).toBe('mode');
  expect(s.stopIndex).toBe(0);
  expect(s.cart).toEqual({});
  expect(s.seed).toBe(42);
  expect(s.revealed).toBe(false);
});

test('opening flow', () => {
  let s = reducer(initialState(1), { type: 'SET_MODE', mode: 'independent' });
  expect(s.screen).toBe('onboarding');
  expect(s.mode).toBe('independent');
  s = reducer(s, { type: 'FINISH_ONBOARDING' });
  expect(s.screen).toBe('persona');
  s = reducer(s, { type: 'CHOOSE_PERSONA', persona: 'herald' });
  expect(s.screen).toBe('stop');
  expect(s.persona).toBe('herald');
});

test('RECORD_STOP fills the cart and goes to the interstitial', () => {
  const s = reducer(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'note' });
  expect(s.screen).toBe('interstitial');
  expect(s.cart.free).toBe('note');
});

test('recording the same stop twice keeps one slot, last choice wins (Review Focus 2)', () => {
  const s = run(
    atStop(),
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a' },
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'b' },
  );
  expect(s.cart.free).toBe('b');
  expect(Object.keys(s.cart).length).toBe(1);
  expect(s.stopIndex).toBe(0);
});

test('ADVANCE from interstitial moves to the next stop, and to the flip after stop 3', () => {
  let s = run(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a' }, { type: 'ADVANCE' });
  expect(s.stopIndex).toBe(1);
  expect(s.screen).toBe('stop');
  s = run(s, { type: 'RECORD_STOP', stopId: 'layers', cartNote: 'b' }, { type: 'ADVANCE' });
  s = run(s, { type: 'RECORD_STOP', stopId: 'permission', cartNote: 'c' });
  expect(s.stopIndex).toBe(2);
  s = reducer(s, { type: 'ADVANCE' });
  expect(s.stopIndex).toBe(3);
  expect(s.screen).toBe('flip');
});

test('ADVANCE outside the interstitial does nothing (Review Focus 2)', () => {
  const s = atStop();
  expect(reducer(s, { type: 'ADVANCE' })).toBe(s);
  const s2 = run(s, { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a' }, { type: 'ADVANCE' });
  expect(reducer(s2, { type: 'ADVANCE' })).toBe(s2); // double-click can't skip stop 2
});

test('RECORD_STOP for a stop other than the current one is ignored', () => {
  const s = atStop();
  expect(reducer(s, { type: 'RECORD_STOP', stopId: 'layers', cartNote: 'x' })).toBe(s);
});

test('SET_LICENSE resets reuse responses', () => {
  let s = run(atFlip(), { type: 'SET_LICENSE', license: 'cc-by' }, { type: 'RECORD_REUSE', kind: 'within', response: 'credit' });
  expect(s.flip.responses.within).toBe('credit');
  s = reducer(s, { type: 'SET_LICENSE', license: 'cc0' });
  expect(s.flip.license).toBe('cc0');
  expect(s.flip.responses).toEqual({});
});

test('FINISH_FLIP needs a license and all three responses', () => {
  const s = atFlip();
  expect(reducer(s, { type: 'FINISH_FLIP', cartNote: 'n' })).toBe(s);
  const partial = run(s, { type: 'SET_LICENSE', license: 'cc-by' }, { type: 'RECORD_REUSE', kind: 'within', response: 'credit' });
  expect(reducer(partial, { type: 'FINISH_FLIP', cartNote: 'n' })).toBe(partial);
  const done = run(
    partial,
    { type: 'RECORD_REUSE', kind: 'outside', response: 'takedown' },
    { type: 'RECORD_REUSE', kind: 'beyond', response: 'negotiate' },
    { type: 'FINISH_FLIP', cartNote: 'n' },
  );
  expect(done.cart.flip).toBe('n');
  expect(done.screen).toBe('guess');
});

test('guess, reveal, ending, cart', () => {
  let s = run(
    atFlip(),
    { type: 'SET_LICENSE', license: 'cc-by' },
    { type: 'RECORD_REUSE', kind: 'within', response: 'credit' },
    { type: 'RECORD_REUSE', kind: 'outside', response: 'credit' },
    { type: 'RECORD_REUSE', kind: 'beyond', response: 'credit' },
    { type: 'FINISH_FLIP', cartNote: 'n' },
  );
  s = reducer(s, { type: 'SET_GUESS', guess: 'letter' });
  expect(s.screen).toBe('reveal');
  expect(s.guess).toBe('letter');
  s = reducer(s, { type: 'REVEAL' });
  expect(s.revealed).toBe(true);
  s = reducer(s, { type: 'SET_ENDING', ending: 'wait' });
  expect(s.screen).toBe('ending');
  expect(s.ending).toBe('wait');
  s = reducer(s, { type: 'ADVANCE' });
  expect(s.screen).toBe('cart');
});

test('RESET returns to the initial state with the new seed', () => {
  expect(reducer(atFlip(), { type: 'RESET', seed: 9 })).toEqual(initialState(9));
});
