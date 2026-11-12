import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { ui } from '../content/ui';
import { reuseEffects } from '../lib/flip';
import { Action, GameState, initialState, reducer } from '../state';
import { Meters } from '../content/types';
import { cartItemText, throughFlip, toFlip } from './helpers';

const flip = content.stops.flip;
const backButton = () => screen.getByRole('button', { name: ui.header.back });

test('the stop is titled “Out in the World”', async () => {
  await toFlip('naturalist');
  expect(flip.title).toBe('Out in the World');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Out in the World');
});

test('the chosen license resolves the first reuse event', async () => {
  const user = await toFlip('naturalist');
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  expect(screen.getByText(flip.work.naturalist)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses['cc-by-nc'].label}` }));
  expect(screen.getByText(flip.events.naturalist.within.setup)).toBeInTheDocument();
  expect(screen.getByText(flip.events.naturalist.within.situation['cc-by-nc'])).toBeInTheDocument();
});

test('the license picker can reveal what a license actually means', async () => {
  const user = await toFlip('bard');
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  expect(screen.queryByText(flip.licenses.cc0.summary)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: `What ${flip.licenses.cc0.label} actually means` }));
  expect(screen.getByText(flip.licenses.cc0.summary)).toBeInTheDocument();
});

test('the last reuse event’s Next goes straight to the shelf and records Your work in the cart', async () => {
  const user = await toFlip('artificer');
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses['cc-by'].label}` }));
  for (const kind of ['within', 'outside', 'beyond'] as const) {
    expect(screen.getByText(flip.events.artificer[kind].situation['cc-by'])).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Choose / })).not.toBeInTheDocument();
    // Only the header's Back leads back to the picker, and there the license is final.
    expect(within(document.querySelector('main')!).queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: flip.responses.credit.label }));
    await user.click(screen.getByRole('button', { name: /^Next/ }));
  }
  // No in-between page: the shelf is next.
  expect(screen.queryByRole('button', { name: /^Next/ })).not.toBeInTheDocument();
  expect(screen.getByText(content.clerk.shelf.closingLine)).toBeInTheDocument();
  // The Cart panel shows the work and its license; the full note (with the responses) is in state.cart.flip.
  expect(await cartItemText(user, 'flip')).toContain(flip.licenses['cc-by'].label);
});

test('no line asking you for help renders anywhere in the flip', async () => {
  const user = await toFlip('herald');
  const pages: string[] = [document.body.textContent ?? ''];
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  pages.push(document.body.textContent ?? '');
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses.arr.label}` }));
  for (let i = 0; i < 3; i++) {
    await user.click(screen.getByRole('button', { name: flip.responses['let-go'].label }));
    pages.push(document.body.textContent ?? '');
    await user.click(screen.getByRole('button', { name: /^Next/ }));
  }
  for (const text of pages) expect(text).not.toMatch(/do that for me|for me\?|help me/i);
  expect(Object.keys(flip)).not.toContain('askForHelp');
});

test('choosing Negotiate shows what it does to the meters', async () => {
  const user = await toFlip('conjurer');
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses.arr.label}` }));
  await user.click(screen.getByRole('button', { name: flip.responses.negotiate.label }));
  const lines = screen.getByTestId('change-lines').textContent!;
  expect(lines).toContain(ui.meterLabels.budget);
  expect(lines).toContain(ui.meterLabels.time);
});

test('reuse answers are read-only on Back', async () => {
  const user = await toFlip('chronicler');
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses.cc0.label}` }));
  await user.click(screen.getByRole('button', { name: flip.responses.takedown.label }));
  await user.click(screen.getByRole('button', { name: /^Next/ }));
  const meters = screen.getByRole('list', { name: ui.metersLabel }).textContent;
  await user.click(backButton());
  expect(screen.getByText(flip.events.chronicler.within.setup)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: flip.responses.takedown.label })).toHaveAccessibleDescription(ui.yourChoice);
  for (const r of ['credit', 'negotiate', 'let-go'] as const) {
    const button = screen.getByRole('button', { name: flip.responses[r].label });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAccessibleDescription(ui.lockReasons.decided);
    await user.click(button);
  }
  // Nothing re-recorded, and the change lines aren't replayed while reviewing.
  expect(screen.getByText(flip.events.chronicler.within.setup)).toBeInTheDocument();
  expect(screen.queryByTestId('change-lines')).not.toBeInTheDocument();
  expect(screen.getByRole('list', { name: ui.metersLabel }).textContent).toBe(meters);
});

describe('in state', () => {
  const START: Meters = { time: 4, budget: 3, exposure: 2, vision: 4 };
  const run = (s: GameState, ...actions: Action[]) => actions.reduce(reducer, s);
  const atFlip = (): GameState => {
    let s = run(
      initialState(1),
      { type: 'SET_MODE', mode: 'class' },
      { type: 'FINISH_ONBOARDING' },
      { type: 'CHOOSE_PERSONA', persona: 'bard', startMeters: START },
      { type: 'FINISH_BRIEF' },
    );
    for (const stopId of ['free', 'layers', 'permission'] as const) s = run(s, { type: 'RECORD_STOP', stopId, cartNote: stopId, effects: [] }, { type: 'ADVANCE' });
    return run(s, { type: 'SET_LICENSE', license: 'cc-by' });
  };
  const respond = (s: GameState, kind: 'within' | 'outside' | 'beyond', response: 'takedown' | 'credit' | 'negotiate' | 'let-go') =>
    reducer(s, { type: 'RECORD_REUSE', kind, response, effects: reuseEffects(flip, 'bard', kind, response) });

  test('Negotiate raises Budget by one step and costs a step of Time', () => {
    const s = respond(atFlip(), 'beyond', 'negotiate');
    expect(s.meters).toEqual({ ...START, budget: START.budget + 1, time: START.time - 1 });
  });

  test('the other responses: takedown costs Time, credit costs nothing, letting a meaning-changing reuse go costs Vision', () => {
    expect(respond(atFlip(), 'within', 'takedown').meters).toEqual({ ...START, time: START.time - 1 });
    expect(respond(atFlip(), 'within', 'credit').meters).toEqual(START);
    // The brand ad changes what the track means; a credited blog review doesn't.
    expect(respond(atFlip(), 'outside', 'let-go').meters).toEqual({ ...START, vision: START.vision - 1 });
    expect(respond(atFlip(), 'within', 'let-go').meters).toEqual(START);
  });

  test('no flip response raises Exposure without a tag', () => {
    const all = [
      ...Object.values(flip.responses).flatMap((r) => r.effects),
      ...Object.values(flip.events).flatMap((byKind) => Object.values(byKind).flatMap((e) => Object.values(e.effects ?? {}).flat())),
    ];
    for (const e of all) if (e.meter === 'exposure' && e.delta > 0) expect(e.tag).toBeDefined();
  });

  test('FINISH_FLIP records the cart note and goes to the shelf', () => {
    const s = run(
      atFlip(),
      { type: 'RECORD_REUSE', kind: 'within', response: 'credit', effects: [] },
      { type: 'RECORD_REUSE', kind: 'outside', response: 'credit', effects: [] },
      { type: 'RECORD_REUSE', kind: 'beyond', response: 'credit', effects: [] },
      { type: 'FINISH_FLIP', cartNote: 'note' },
    );
    expect(s.screen).toBe('shelf');
    expect(s.cart.flip).toBe('note');
  });
});

test('the full flip helper lands on the shelf', async () => {
  const user = await toFlip('bard');
  await throughFlip(user, 'cc0', 'negotiate');
  expect(screen.getByText(content.clerk.shelf.closingLine)).toBeInTheDocument();
});
