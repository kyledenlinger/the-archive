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
  expect(s.sunkKeys).toEqual([]);
  expect(s.decisions).toEqual({});
  expect(s.history).toEqual([]);
  expect(s.forward).toEqual([]);
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
  s = reducer(s, { type: 'FINISH_BRIEF' });
  expect(s.screen).toBe('stop');
  expect(s.stopIndex).toBe(0);
  expect(s.page).toEqual({ kind: 'intro' });
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

test('ADVANCE from interstitial moves to the next stop, and to the flip after stop 3', () => {
  let s = run(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'time', delta: -1 }] }, { type: 'ADVANCE' });
  expect(s.stopIndex).toBe(1);
  expect(s.screen).toBe('stop');
  expect(s.meters).toEqual({ ...START, time: 4 });
  expect(s.page).toEqual({ kind: 'intro' });
  expect(s.atFlip).toBeNull();
  s = run(s, { type: 'RECORD_STOP', stopId: 'layers', cartNote: 'b', effects: [{ meter: 'exposure', delta: 1, tag: 'legal' }] }, { type: 'ADVANCE' });
  expect(s.exposureLegal).toBe(1);
  s = run(s, { type: 'RECORD_STOP', stopId: 'permission', cartNote: 'c', effects: [{ meter: 'budget', delta: -2 }] });
  expect(s.stopIndex).toBe(2);
  s = reducer(s, { type: 'ADVANCE' });
  expect(s.stopIndex).toBe(3);
  expect(s.screen).toBe('flip');
  const end = { ...START, time: 4, exposure: 2, budget: 2 };
  expect(s.meters).toEqual(end);
  expect(s.page).toEqual({ kind: 'intro' });
  expect(s.atFlip).toEqual(end);
});

test('ADVANCE clears sunk costs for the next stop', () => {
  const s = run(
    atStop(),
    { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' },
    { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [] },
    { type: 'ADVANCE' },
  );
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
  expect(s.sunkKeys).toEqual(['search']);
  expect(s.lastChanges?.changes).toEqual([{ meter: 'time', from: 'best', to: 'middle', direction: 'down' }]);
});

test('APPLY_EFFECTS with the same key twice charges once', () => {
  const once = reducer(atStop(), { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' });
  const twice = reducer(once, { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' });
  expect(twice).toBe(once);
  expect(twice.meters.time).toBe(START.time - 1);
});

test('RECORD_SEARCH records found and notFound for the current stop only', () => {
  const s = atStop();
  expect(reducer(s, { type: 'RECORD_SEARCH', stopId: 'free', found: true }).searches.free).toBe('found');
  expect(reducer(s, { type: 'RECORD_SEARCH', stopId: 'layers', found: true })).toBe(s);
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

test('FINISH_FLIP needs a license and all three responses, then goes to the shelf (class mode)', () => {
  const s = atFlip();
  expect(reducer(s, { type: 'FINISH_FLIP', cartNote: 'n' })).toBe(s);
  const partial = run(s, { type: 'SET_LICENSE', license: 'cc-by' }, { type: 'RECORD_REUSE', kind: 'within', response: 'credit', effects: [] });
  expect(reducer(partial, { type: 'FINISH_FLIP', cartNote: 'n' })).toBe(partial);
  const done = flipDone();
  expect(done.cart.flip).toBe('n');
  expect(done.screen).toBe('shelf');
  expect(done.page).toEqual({ kind: 'intro' });
});

test('ADVANCE from the shelf goes to the project summary', () => {
  const s = reducer(flipDone(), { type: 'ADVANCE' });
  expect(s.screen).toBe('project');
  expect(reducer(s, { type: 'ADVANCE' })).toBe(s);
});

test('RESET returns to the initial state with the new seed', () => {
  expect(reducer(flipDone(), { type: 'RESET', seed: 9 })).toEqual(initialState(9));
});

test('lastChanges tags an exposure rise when one tag accounts for it', () => {
  const s = reducer(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'n', effects: [{ meter: 'exposure', delta: 1, tag: 'reputational' }] });
  expect(s.lastChanges?.changes).toEqual([{ meter: 'exposure', from: 'best', to: 'middle', direction: 'up', tag: 'reputational' }]);
  const both = reducer(atStop(), {
    type: 'RECORD_STOP',
    stopId: 'free',
    cartNote: 'n',
    effects: [
      { meter: 'exposure', delta: 1, tag: 'legal' },
      { meter: 'exposure', delta: 1, tag: 'reputational' },
    ],
  });
  expect(both.lastChanges?.changes[0].tag).toBeUndefined();
});


describe('choices are final (Task 8b)', () => {
  test('a stop is recorded once; a second RECORD_STOP is ignored', () => {
    const s = reducer(atStop(), { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'budget', delta: -2 }] });
    expect(s.cart.free).toBe('a');
    expect(s.meters.budget).toBe(START.budget - 2);
    expect(s.screen).toBe('interstitial');
    // Even back on the stop, it can't be recorded again.
    const onStop = { ...s, screen: 'stop' as const, forward: [] };
    expect(reducer(onStop, { type: 'RECORD_STOP', stopId: 'free', cartNote: 'b', effects: [{ meter: 'budget', delta: -1 }] })).toBe(onStop);
  });

  test('DECIDE records once and can move to a page', () => {
    const s = reducer(atStop(), { type: 'DECIDE', key: 'free:choice', value: 'take', page: { kind: 'outcome', choiceId: 'take' } });
    expect(s.decisions['free:choice']).toBe('take');
    expect(s.page).toEqual({ kind: 'outcome', choiceId: 'take' });
    expect(reducer(s, { type: 'DECIDE', key: 'free:choice', value: 'leave', page: { kind: 'outcome', choiceId: 'leave' } })).toBe(s);
  });

  test('a license is picked once and leads to the first reuse event', () => {
    const s = reducer(atFlip(), { type: 'SET_LICENSE', license: 'cc-by' });
    expect(s.flip.license).toBe('cc-by');
    expect(s.page).toEqual({ kind: 'reuse', index: 0 });
    expect(reducer(s, { type: 'SET_LICENSE', license: 'cc0' })).toBe(s);
  });

  test('CHOOSE_PERSONA works once', () => {
    const s = atBrief();
    const again = { ...s, screen: 'persona' as const };
    expect(reducer(again, { type: 'CHOOSE_PERSONA', persona: 'herald', startMeters: START })).toBe(again);
  });

  test('SEND_ASK records the request and reply once, and SET_ASK_DRAFT edits the form without history', () => {
    const form = reducer(atStop(), { type: 'GO_TO', page: { kind: 'askForm', draft: {} } });
    const typed = reducer(form, { type: 'SET_ASK_DRAFT', draft: { what: 'x' } });
    expect(typed.page).toEqual({ kind: 'askForm', draft: { what: 'x' } });
    expect(typed.history).toBe(form.history);
    const sent = reducer(typed, { type: 'SEND_ASK', stopId: 'free', request: { what: 'x' }, response: 'no' });
    expect(sent.asks.free).toEqual({ request: { what: 'x' }, response: 'no' });
    expect(sent.page).toEqual({ kind: 'askReply' });
    expect(reducer(sent, { type: 'SEND_ASK', stopId: 'free', request: {}, response: 'yes' })).toBe(sent);
    expect(reducer(atStop(), { type: 'SET_ASK_DRAFT', draft: { what: 'x' } }).page).toEqual({ kind: 'intro' });
  });
});

describe('Back is navigation only (Task 8b)', () => {
  const back = (s: GameState) => reducer(s, { type: 'BACK' });
  const forward = (s: GameState) => reducer(s, { type: 'FORWARD' });

  test('a new game has no history, and BACK with none is a no-op', () => {
    const s = reducer(initialState(1), { type: 'SET_MODE', mode: 'class' });
    expect(s.history).toEqual([]);
    expect(s.page).toEqual({ kind: 'beat', index: 0 });
    expect(back(s)).toBe(s);
    expect(forward(s)).toBe(s);
  });

  test('BACK steps through onboarding beats and from persona select to the last beat; FORWARD walks back', () => {
    let s = run(
      initialState(1),
      { type: 'SET_MODE', mode: 'class' },
      { type: 'GO_TO', page: { kind: 'beat', index: 1 } },
      { type: 'FINISH_ONBOARDING' },
    );
    expect(s.history).toHaveLength(2);
    s = back(s);
    expect(s.screen).toBe('onboarding');
    expect(s.page).toEqual({ kind: 'beat', index: 1 });
    s = back(s);
    expect(s.page).toEqual({ kind: 'beat', index: 0 });
    expect(s.history).toEqual([]);
    expect(s.forward).toHaveLength(2);
    s = forward(forward(s));
    expect(s.screen).toBe('persona');
    expect(s.forward).toEqual([]);
    expect(s.history).toHaveLength(2);
  });

  test('going to the same page again does not push', () => {
    const s = run(atStop(), { type: 'GO_TO', page: { kind: 'choices' } });
    expect(reducer(s, { type: 'GO_TO', page: { kind: 'choices' } })).toBe(s);
  });

  test('BACK across “Add to cart” keeps the meters, tags, and cart, and announces nothing', () => {
    const outcome = run(
      atStop(),
      { type: 'GO_TO', page: { kind: 'choices' } },
      { type: 'DECIDE', key: 'free:choice', value: 'take', page: { kind: 'outcome', choiceId: 'take' } },
    );
    const after = reducer(outcome, {
      type: 'RECORD_STOP',
      stopId: 'free',
      cartNote: 'n',
      effects: [{ meter: 'exposure', delta: 2, tag: 'legal' }, { meter: 'time', delta: -3 }],
    });
    const s = back(after);
    expect(s.screen).toBe('stop');
    expect(s.page).toEqual({ kind: 'outcome', choiceId: 'take' });
    expect(s.meters).toEqual(after.meters);
    expect(s.exposureLegal).toBe(after.exposureLegal);
    expect(s.cart).toEqual(after.cart);
    expect(s.lastChanges).toBe(after.lastChanges);
  });

  test('while reviewing, nothing records: only BACK, FORWARD, and RESET act', () => {
    const recorded = run(
      atStop(),
      { type: 'GO_TO', page: { kind: 'choices' } },
      { type: 'DECIDE', key: 'free:choice', value: 'take', page: { kind: 'outcome', choiceId: 'take' } },
      { type: 'RECORD_STOP', stopId: 'free', cartNote: 'n', effects: [{ meter: 'budget', delta: -1 }] },
    );
    const s = back(back(recorded)); // the choices page
    expect(s.page).toEqual({ kind: 'choices' });
    for (const a of [
      { type: 'DECIDE', key: 'free:choice', value: 'leave', page: { kind: 'outcome', choiceId: 'leave' } },
      { type: 'DECIDE', key: 'free:other', value: 'x' },
      { type: 'GO_TO', page: { kind: 'intro' } },
      { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -1 }], key: 'fairUse' },
      { type: 'RECORD_STOP', stopId: 'free', cartNote: 'b', effects: [] },
      { type: 'ADVANCE' },
    ] as Action[]) {
      expect(reducer(s, a)).toBe(s);
    }
    const f = forward(forward(s));
    expect(f.screen).toBe('interstitial');
    expect(f.cart.free).toBe('n');
    expect(f.meters).toEqual(recorded.meters);
    expect(f.forward).toEqual([]);
    expect(reducer(f, { type: 'ADVANCE' }).stopIndex).toBe(1);
  });

  test('BACK crosses stops: stop 2 intro → stop 1 pause screen → stop 1 outcome, with the cart intact', () => {
    const s2 = run(
      atStop(),
      { type: 'GO_TO', page: { kind: 'choices' } },
      { type: 'DECIDE', key: 'free:choice', value: 'take', page: { kind: 'outcome', choiceId: 'take' } },
      { type: 'RECORD_STOP', stopId: 'free', cartNote: 'a', effects: [{ meter: 'budget', delta: -2 }] },
      { type: 'ADVANCE' },
    );
    let s = back(s2);
    expect(s.screen).toBe('interstitial');
    expect(s.stopIndex).toBe(0);
    s = back(s);
    expect(s.screen).toBe('stop');
    expect(s.stopIndex).toBe(0);
    expect(s.page).toEqual({ kind: 'outcome', choiceId: 'take' });
    expect(s.cart.free).toBe('a');
    expect(s.meters.budget).toBe(START.budget - 2);
    expect(forward(forward(s)).stopIndex).toBe(1);
  });

  test('BACK over a failed search keeps the result, the lock, and the time spent', () => {
    const searched = run(
      atStop(),
      { type: 'GO_TO', page: { kind: 'choices' } },
      { type: 'APPLY_EFFECTS', effects: [{ meter: 'time', delta: -2 }], key: 'search' },
      { type: 'RECORD_SEARCH', stopId: 'free', found: false },
      { type: 'GO_TO', page: { kind: 'searchFail' } },
    );
    const s = back(searched);
    expect(s.page).toEqual({ kind: 'choices' });
    expect(s.searches.free).toBe('notFound');
    expect(s.meters.time).toBe(START.time - 2);
    expect(s.sunkKeys).toEqual(['search']);
    expect(s.seed).toBe(searched.seed);
  });

  test('BACK in the flip keeps the reuse response and the license', () => {
    const answered = run(
      atFlip(),
      { type: 'GO_TO', page: { kind: 'license' } },
      { type: 'SET_LICENSE', license: 'cc-by' },
      { type: 'RECORD_REUSE', kind: 'within', response: 'let-go', effects: [{ meter: 'vision', delta: -1 }] },
    );
    const s = back(answered);
    expect(s.page).toEqual({ kind: 'license' });
    expect(s.flip).toEqual(answered.flip);
    expect(s.meters).toEqual(answered.meters);
  });

  test('RESET clears history and forward', () => {
    const s = back(run(atStop(), { type: 'GO_TO', page: { kind: 'choices' } }));
    const r = reducer(s, { type: 'RESET', seed: 3 });
    expect(r.history).toEqual([]);
    expect(r.forward).toEqual([]);
  });
});
