import { initialState, reducer, GameState, Action } from './state';
import { Meters } from './content/types';

const START: Meters = { time: 5, budget: 4, exposure: 1, vision: 5 };
const run = (s: GameState, ...actions: Action[]) => actions.reduce(reducer, s);
const atBrief = (): GameState =>
  run(
    initialState(1),
    { type: 'SET_MODE', mode: 'class' },
    { type: 'FINISH_ONBOARDING' },
    { type: 'CHOOSE_PERSONA', persona: 'bard', startMeters: START },
  );
const atStop = (): GameState => reducer(atBrief(), { type: 'FINISH_BRIEF' });
const atFlip = (): GameState => {
  let s = atStop();
  for (const stopId of ['free', 'layers', 'permission'] as const) {
    s = run(s, { type: 'RECORD_STOP', stopId, cartNote: stopId, effects: [] }, { type: 'ADVANCE' });
  }
  return s;
};
const flipDone = (): GameState =>
  run(
    atFlip(),
    { type: 'SET_LICENSE', license: 'cc-by' },
    { type: 'RECORD_REUSE', kind: 'within', response: 'credit', effects: [] },
    { type: 'RECORD_REUSE', kind: 'outside', response: 'credit', effects: [] },
    { type: 'RECORD_REUSE', kind: 'beyond', response: 'credit', effects: [] },
    { type: 'FINISH_FLIP', cartNote: 'n' },
  );

test('initial state', () => {
  const s = initialState(42);
  expect(s.screen).toBe('mode');
  expect(s.stopIndex).toBe(0);
  expect(s.cart).toEqual({});
  expect(s.seed).toBe(42);
  expect(s.searches).toEqual({});
  expect(s.sunk).toEqual([]);
  expect(s.sunkKeys).toEqual([]);
  expect(s.lastChanges).toBeNull();
  expect(s.atFlip).toBeNull();
  expect(s.exposureLegal).toBe(0);
  expect(s.exposureReputational).toBe(0);
});

test('opening flow: persona → brief → stop', () => {
  let s = reducer(initialState(1), { type: 'SET_MODE', mode: 'independent' });
  expect(s.screen).toBe('onboarding');
  expect(s.mode).toBe('independent');
  s = reducer(s, { type: 'FINISH_ONBOARDING' });
  expect(s.screen).toBe('persona');
  s = reducer(s, { type: 'CHOOSE_PERSONA', persona: 'herald', startMeters: START });
  expect(s.screen).toBe('brief');
  expect(s.persona).toBe('herald');
  expect(s.meters).toEqual(START);
  expect(s.arrival).toEqual(START);
  expect(s.arrivalTags).toEqual({ legal: 0, reputational: 0 });
  s = reducer(s, { type: 'FINISH_BRIEF' });
  expect(s.screen).toBe('stop');
  expect(s.stopIndex).toBe(0);
  expect(s.arrival).toEqual(START);
});

test('FINISH_BRIEF only works on the brief', () => {
  const s = atStop();
  expect(reducer(s, { type: 'FINISH_BRIEF' })).toBe(s);
});

test('RECORD_STOP fills the cart and goes to the interstitial', () => {
  const s = reducer(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'note', effects: [] });
  expect(s.screen).toBe('interstitial');
  expect(s.cart.free).toBe('note');
});

test('RECORD_STOP applies effects, accumulates tags, and sets lastChanges with a new id', () => {
  const s = reducer(atStop(), {
    type: 'RECORD_STOP',
    stopId: 'free',
    cartNote: 'n',
    effects: [
      { meter: 'exposure', delta: 2, tag: 'legal' },
      { meter: 'vision', delta: -1 },
    ],
  });
  expect(s.meters).toEqual({ ...START, exposure: 3, vision: 4 });
  expect(s.exposureLegal).toBe(2);
  expect(s.exposureReputational).toBe(0);
  expect(s.lastChanges?.changes.map((c) => c.meter)).toEqual(['exposure', 'vision']);
  const s2 = run(s, { type: 'ADVANCE' }, {
    type: 'RECORD_STOP',
    stopId: 'layers',
    cartNote: 'n',
    effects: [{ meter: 'exposure', delta: 1, tag: 'reputational' }, { meter: 'exposure', delta: 1, tag: 'legal' }],
  });
  expect(s2.exposureLegal).toBe(3);
  expect(s2.exposureReputational).toBe(1);
  expect(s2.lastChanges!.id).toBeGreaterThan(s.lastChanges!.id);
});

test('recording the same stop twice keeps one slot and applies effects once (last choice wins)', () => {
  const s = run(
    atStop(),
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'budget', delta: -2 }] },
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'b', effects: [{ meter: 'budget', delta: -1 }, { meter: 'exposure', delta: 1, tag: 'legal' }] },
  );
  expect(s.cart.free).toBe('b');
  expect(Object.keys(s.cart).length).toBe(1);
  expect(s.stopIndex).toBe(0);
  expect(s.meters).toEqual({ ...START, budget: 3, exposure: 2 });
  expect(s.exposureLegal).toBe(1);
});

test('ADVANCE from interstitial moves to the next stop, and to the flip after stop 3', () => {
  let s = run(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'time', delta: -1 }] }, { type: 'ADVANCE' });
  expect(s.stopIndex).toBe(1);
  expect(s.screen).toBe('stop');
  expect(s.arrival).toEqual({ ...START, time: 4 });
  expect(s.atFlip).toBeNull();
  s = run(s, { type: 'RECORD_STOP', stopId: 'layers', cartNote: 'b', effects: [{ meter: 'exposure', delta: 1, tag: 'legal' }] }, { type: 'ADVANCE' });
  expect(s.arrivalTags).toEqual({ legal: 1, reputational: 0 });
  s = run(s, { type: 'RECORD_STOP', stopId: 'permission', cartNote: 'c', effects: [{ meter: 'budget', delta: -2 }] });
  expect(s.stopIndex).toBe(2);
  s = reducer(s, { type: 'ADVANCE' });
  expect(s.stopIndex).toBe(3);
  expect(s.screen).toBe('flip');
  const end = { ...START, time: 4, exposure: 2, budget: 2 };
  expect(s.arrival).toEqual(end);
  expect(s.atFlip).toEqual(end);
});

test('ADVANCE clears sunk costs for the next stop', () => {
  const s = run(
    atStop(),
    { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' },
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [] },
    { type: 'ADVANCE' },
  );
  expect(s.sunk).toEqual([]);
  expect(s.sunkKeys).toEqual([]);
  // The same key at the next stop is a new cost.
  const s2 = reducer(s, { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' });
  expect(s2.meters.time).toBe(START.time - 2);
});

test('ADVANCE outside the interstitial and shelf does nothing', () => {
  const s = atStop();
  expect(reducer(s, { type: 'ADVANCE' })).toBe(s);
  const s2 = run(s, { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [] }, { type: 'ADVANCE' });
  expect(reducer(s2, { type: 'ADVANCE' })).toBe(s2); // double-click can't skip stop 2
});

test('RECORD_STOP for a stop other than the current one is ignored', () => {
  const s = atStop();
  expect(reducer(s, { type: 'RECORD_STOP', stopId: 'layers', cartNote: 'x', effects: [] })).toBe(s);
});

test('APPLY_EFFECTS charges immediately, tracks the cost, and sets lastChanges', () => {
  const s = reducer(atStop(), { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -2 }], key: 'search' });
  expect(s.meters.time).toBe(START.time - 2);
  expect(s.sunk).toEqual([{ meter: 'time', delta: -2 }]);
  expect(s.sunkKeys).toEqual(['search']);
  expect(s.lastChanges?.changes).toEqual([{ meter: 'time', from: 'best', to: 'middle', direction: 'down' }]);
});

test('APPLY_EFFECTS with the same key twice charges once', () => {
  const once = reducer(atStop(), { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' });
  const twice = reducer(once, { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' });
  expect(twice).toBe(once);
  expect(twice.meters.time).toBe(START.time - 1);
});

test('RECORD_STOP counts sunk costs once on top of arrival', () => {
  const s = run(
    atStop(),
    { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'send' },
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'vision', delta: -1 }] },
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'b', effects: [{ meter: 'vision', delta: -1 }] },
  );
  expect(s.meters).toEqual({ ...START, time: 4, vision: 4 });
});

test('Review Focus 1: going back refunds meters but not a failed search', () => {
  let s = run(
    atStop(),
    { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -2 }], key: 'search' },
    { type: 'RECORD_SEARCH', stopId: 'free', found: false },
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'vision', delta: -1 }] },
  );
  expect(s.meters).toEqual({ ...START, time: 3, vision: 4 });
  s = reducer(s, { type: 'REVISIT_STOP' });
  expect(s.screen).toBe('stop');
  expect(s.meters).toEqual(s.arrival);
  expect(s.meters).toEqual(START);
  expect(s.searches.free).toBe('notFound');
  expect(s.sunk).toEqual([]);
  expect(s.sunkKeys).toEqual([]);
  s = reducer(s, { type: 'RECORD_STOP', stopId: 'free', cartNote: 'b', effects: [{ meter: 'vision', delta: -1 }] });
  expect(s.meters).toEqual({ ...START, vision: 4 });
});

test('RECORD_SEARCH records found and notFound for the current stop only', () => {
  const s = atStop();
  expect(reducer(s, { type: 'RECORD_SEARCH', stopId: 'free', found: true }).searches.free).toBe('found');
  expect(reducer(s, { type: 'RECORD_SEARCH', stopId: 'layers', found: true })).toBe(s);
});

test('REVISIT_STOP restores the exposure tags to their values at arrival', () => {
  let s = run(
    atStop(),
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'exposure', delta: 1, tag: 'reputational' }] },
    { type: 'ADVANCE' },
    { type: 'APPLY_EFFECTS', effects: [{ meter: 'exposure', delta: 1, tag: 'legal' }], key: 'x' },
    { type: 'RECORD_STOP', stopId: 'layers', cartNote: 'b', effects: [{ meter: 'exposure', delta: 2, tag: 'legal' }] },
  );
  expect(s.exposureLegal).toBe(3);
  expect(s.exposureReputational).toBe(1);
  s = reducer(s, { type: 'REVISIT_STOP' });
  expect(s.exposureLegal).toBe(0);
  expect(s.exposureReputational).toBe(1);
  expect(s.meters.exposure).toBe(START.exposure + 1);
  expect(s.lastChanges?.changes).toEqual([{ meter: 'exposure', from: 'worst', to: 'middle', direction: 'down' }]);
});

test('REVISIT_STOP returns from the interstitial to the same stop, keeping one cart slot', () => {
  let s = run(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [] });
  s = reducer(s, { type: 'REVISIT_STOP' });
  expect(s.screen).toBe('stop');
  expect(s.stopIndex).toBe(0);
  expect(s.cart.free).toBe('a');
  s = reducer(s, { type: 'RECORD_STOP', stopId: 'free', cartNote: 'b', effects: [] });
  expect(s.cart.free).toBe('b');
  expect(Object.keys(s.cart)).toHaveLength(1);
  expect(s.screen).toBe('interstitial');
});

test('REVISIT_STOP is ignored anywhere but the interstitial', () => {
  const s = atStop();
  expect(reducer(s, { type: 'REVISIT_STOP' })).toBe(s);
  const flip = atFlip();
  expect(reducer(flip, { type: 'REVISIT_STOP' })).toBe(flip);
});

test('SET_LICENSE resets reuse responses and their effects', () => {
  let s = run(
    atFlip(),
    { type: 'SET_LICENSE', license: 'cc-by' },
    { type: 'RECORD_REUSE', kind: 'within', response: 'let-go', effects: [{ meter: 'vision', delta: -1 }] },
  );
  expect(s.flip.responses.within).toBe('let-go');
  expect(s.meters.vision).toBe(START.vision - 1);
  s = reducer(s, { type: 'SET_LICENSE', license: 'cc0' });
  expect(s.flip.license).toBe('cc0');
  expect(s.flip.responses).toEqual({});
  expect(s.meters).toEqual(s.atFlip);
});

test('RECORD_REUSE applies effects once per event', () => {
  const s = run(
    atFlip(),
    { type: 'SET_LICENSE', license: 'cc-by' },
    { type: 'RECORD_REUSE', kind: 'beyond', response: 'negotiate', effects: [{ meter: 'budget', delta: 1 }, { meter: 'time', delta: -1 }] },
  );
  expect(s.meters).toEqual({ ...START, budget: 5, time: 4 });
  expect(s.lastChanges?.changes.map((c) => c.meter)).toEqual(['time', 'budget']);
  expect(reducer(s, { type: 'RECORD_REUSE', kind: 'beyond', response: 'credit', effects: [{ meter: 'budget', delta: 1 }] })).toBe(s);
});

test('FINISH_FLIP needs a license and all three responses, then goes to the shelf', () => {
  const s = atFlip();
  expect(reducer(s, { type: 'FINISH_FLIP', cartNote: 'n' })).toBe(s);
  const partial = run(s, { type: 'SET_LICENSE', license: 'cc-by' }, { type: 'RECORD_REUSE', kind: 'within', response: 'credit', effects: [] });
  expect(reducer(partial, { type: 'FINISH_FLIP', cartNote: 'n' })).toBe(partial);
  const done = flipDone();
  expect(done.cart.flip).toBe('n');
  expect(done.screen).toBe('shelf');
});

test('ADVANCE from the shelf goes to the project summary', () => {
  const s = reducer(flipDone(), { type: 'ADVANCE' });
  expect(s.screen).toBe('project');
  expect(reducer(s, { type: 'ADVANCE' })).toBe(s);
});

test('RESET returns to the initial state with the new seed', () => {
  expect(reducer(flipDone(), { type: 'RESET', seed: 9 })).toEqual(initialState(9));
});
