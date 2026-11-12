import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { content } from '../content';
import { AskField, AskResponse, GameContent, Meters, PersonaId, StandardStopId, Term } from '../content/types';
import { ui } from '../content/ui';
import { DEFAULT_ODDS, dealAskResponse, rollTerms } from '../lib/ask';
import { cartItemText, enterStop, passStopWithFirstChoice, seedWhereAsk, startAs, toChoices } from './helpers';

type User = ReturnType<typeof userEvent.setup>;
const FIELDS: AskField[] = ['what', 'how', 'where', 'howLong'];
const meters = () => screen.getByRole('list', { name: ui.metersLabel });
const withStart = (persona: PersonaId, over: Partial<Meters>, base: GameContent = content): GameContent => ({
  ...base,
  personas: base.personas.map((p) => (p.id === persona ? { ...p, startMeters: { ...p.startMeters, ...over } } : p)),
});
const searchLabel = content.stops.free.choices.find((c) => c.mechanic === 'search')!.label;
const accept = () => screen.getByRole('button', { name: content.ask.acceptLabel });
const decline = () => screen.getByRole('button', { name: content.ask.declineLabel });
const conditionalWith = (kind: Term['kind']) => (r: AskResponse, t?: Term) => r === 'conditional' && t?.kind === kind;

/** What the seeded rolls give for a blank (poorly formed) request. */
function dealt(seed: number, persona: PersonaId, stopId: StandardStopId, testContent: GameContent = content) {
  const response = dealAskResponse(seed, persona, stopId, false, testContent.ask.odds?.[stopId]?.[persona] ?? DEFAULT_ODDS);
  const answer = testContent.ask.responses[stopId]![persona][response];
  const term = response === 'conditional' ? rollTerms(seed, persona, stopId, testContent.ask.terms[stopId]![persona]) : undefined;
  return { response, answer, term };
}

/** Stop 1, independent mode: the search finds the owner, and a blank request is sent. */
async function stop1Reply(persona: PersonaId, seed: number, testContent: GameContent = content) {
  const user = await startAs(persona, 'independent', testContent, seed);
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: searchLabel }));
  await user.click(screen.getByRole('button', { name: /Send the request/ }));
  return user;
}

/** Stop 3's Ask form, after passing stops 1 and 2 with their first plain choice. */
async function toStop3Ask(seed = 1, testContent: GameContent = content, mode: 'class' | 'independent' = 'independent') {
  const user = await startAs('artificer', mode, testContent, seed);
  await passStopWithFirstChoice(user);
  await passStopWithFirstChoice(user);
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: /Ask for permission/ }));
  return user;
}

async function fill(user: User, count: number) {
  for (const f of FIELDS.slice(0, count)) {
    const { label, options } = content.ask.fieldOptions[f];
    await user.selectOptions(screen.getByLabelText(label), options[0]);
  }
  await user.click(screen.getByRole('button', { name: /Send the request/ }));
}

test('Review Focus 2: out of time and broke, a large fee locks “Accept the terms”, and turning them down still works', async () => {
  // Time 2 → 0 from the search, and Budget 0: both meters in their worst band at the reply.
  const testContent = withStart('naturalist', { time: 2, budget: 0 });
  const seed = seedWhereAsk('naturalist', 'free', conditionalWith('largeFee'), { testContent });
  const user = await stop1Reply('naturalist', seed, testContent);
  expect(meters()).toHaveTextContent('Time: Out of time');
  expect(meters()).toHaveTextContent('Budget: Broke');
  const { answer, term } = dealt(seed, 'naturalist', 'free', testContent);
  expect(screen.getByText(answer.text)).toBeInTheDocument();
  expect(screen.getByText(term!.text)).toBeInTheDocument();
  expect(accept()).toHaveAttribute('aria-disabled', 'true');
  expect(accept()).toHaveAccessibleDescription('You’re already over budget.');
  await user.click(accept());
  expect(accept()).toBeInTheDocument();
  expect(decline()).not.toHaveAttribute('aria-disabled');
  await user.click(decline());
  // Every follow-up is open.
  for (const name of [content.ask.followUps.useAnyway.label, content.ask.followUps.dont.label, content.ask.followUps.fairUse.label]) {
    expect(screen.getByRole('button', { name })).not.toHaveAttribute('aria-disabled');
  }
});

test('with budget 1, a large fee locks “Accept the terms”, and “Turn them down” stays enabled', async () => {
  const testContent = withStart('naturalist', { budget: 1 });
  const seed = seedWhereAsk('naturalist', 'free', conditionalWith('largeFee'), { testContent });
  await stop1Reply('naturalist', seed, testContent);
  expect(accept()).toHaveAccessibleDescription(ui.lockReasons.budget);
  expect(decline()).not.toHaveAttribute('aria-disabled');
});

test('accepting the terms applies the fee and lowers Exposure, in the header, and records both notes', async () => {
  // Budget 3 − 2 = 1 (Stretched → Broke); Exposure 2 − 1 = 1 (Some → Low).
  const testContent = withStart('naturalist', { exposure: 2 });
  const seed = seedWhereAsk('naturalist', 'free', conditionalWith('largeFee'), { testContent });
  const user = await stop1Reply('naturalist', seed, testContent);
  expect(meters()).toHaveTextContent('Budget: Stretched');
  expect(meters()).toHaveTextContent('Exposure: Some');
  await user.click(accept());
  expect(meters()).toHaveTextContent('Budget: Broke');
  expect(meters()).toHaveTextContent('Exposure: Low');
  const { answer, term } = dealt(seed, 'naturalist', 'free', testContent);
  expect(await cartItemText(user, 'free')).toContain(`${answer.cartNote} ${term!.cartNote}`);
});

test('Send → Back → forward gives the same reply and terms, and charges nothing again', async () => {
  const seed = seedWhereAsk('artificer', 'permission', (r) => r === 'conditional');
  const user = await toStop3Ask(seed);
  const beforeLive = screen.getByTestId('meter-live').textContent;
  await user.click(screen.getByRole('button', { name: /Send the request/ }));
  const { answer, term } = dealt(seed, 'artificer', 'permission');
  expect(screen.getByText(answer.text)).toBeInTheDocument();
  expect(screen.getByTestId('ask-terms')).toHaveTextContent(term!.text);
  const afterSend = meters().textContent;
  const announced = screen.getByTestId('meter-live').textContent;
  expect(announced).not.toBe(beforeLive); // sending cost Time once
  expect(announced).toMatch(/Time/);
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(screen.queryByRole('button', { name: /Send the request/ })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByText(answer.text)).toBeInTheDocument();
  expect(screen.getByTestId('ask-terms')).toHaveTextContent(term!.text);
  expect(meters().textContent).toBe(afterSend);
  expect(screen.getByTestId('meter-live').textContent).toBe(announced);
});

test('odds in content decide the reply: yes 100 always gives yes, well formed or not', async () => {
  const always = { yes: 100, conditional: 0, no: 0, silence: 0 };
  const testContent: GameContent = { ...content, ask: { ...content.ask, odds: { permission: { artificer: { wellFormed: always, poor: always } } } } };
  for (const seed of [1, 2, 3, 42, 977]) expect(dealAskResponse(seed, 'artificer', 'permission', seed % 2 === 0, testContent.ask.odds!.permission!.artificer)).toBe('yes');
  const user = await toStop3Ask(7, testContent);
  await fill(user, 1);
  expect(screen.getByText(content.ask.responses.permission!.artificer.yes.text)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: content.ask.followUps.use.label })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: content.ask.followUps.useAnyway.label })).not.toBeInTheDocument();
});

test('“Use it anyway” after a no adds its own effects and note to the reply’s', async () => {
  // Exposure 1 + 2 (legal) = 3: Low → Some. Vision 5 − 1 (the no) + 1 = 5: still Intact.
  const seed = seedWhereAsk('naturalist', 'free', (r) => r === 'no');
  const user = await stop1Reply('naturalist', seed);
  const { answer } = dealt(seed, 'naturalist', 'free');
  expect(meters()).toHaveTextContent('Exposure: Low');
  await user.click(screen.getByRole('button', { name: content.ask.followUps.useAnyway.label }));
  expect(meters()).toHaveTextContent('Exposure: Some');
  expect(meters()).toHaveTextContent('Vision: Intact');
  expect(await cartItemText(user, 'free')).toContain(`${answer.cartNote} ${content.ask.followUps.useAnyway.note}`);
});

test('“Don’t use it” after silence adds its effects to the wait', async () => {
  // Time 4 − 2 (search) − 1 (silence) = 1: Out of time. Vision 5 − 1 = 4: Compromised.
  const seed = seedWhereAsk('naturalist', 'free', (r) => r === 'silence');
  const user = await stop1Reply('naturalist', seed);
  await user.click(screen.getByRole('button', { name: content.ask.followUps.dont.label }));
  expect(meters()).toHaveTextContent('Time: Out of time');
  expect(meters()).toHaveTextContent('Vision: Compromised');
  expect(await cartItemText(user, 'free')).toContain(content.ask.followUps.dont.note);
});

test('turning the terms down notes it, and “Use it anyway” follows', async () => {
  const seed = seedWhereAsk('naturalist', 'free', (r) => r === 'conditional');
  const user = await stop1Reply('naturalist', seed);
  await user.click(decline());
  expect(screen.getByText(content.ask.declineNote)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: content.ask.followUps.useAnyway.label }));
  const { answer } = dealt(seed, 'naturalist', 'free');
  expect(await cartItemText(user, 'free')).toContain(`${answer.cartNote} ${content.ask.declineNote} ${content.ask.followUps.useAnyway.note}`);
});

test('a revisited terms page is read-only: turned down stays turned down', async () => {
  const seed = seedWhereAsk('naturalist', 'free', (r) => r === 'conditional');
  const user = await stop1Reply('naturalist', seed);
  const before = meters().textContent;
  await user.click(decline());
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(decline()).toHaveAccessibleDescription(ui.yourChoice);
  expect(accept()).toHaveAttribute('aria-disabled', 'true');
  expect(accept()).toHaveAccessibleDescription(ui.lockReasons.decided);
  await user.click(accept());
  expect(meters().textContent).toBe(before);
  expect(accept()).toBeInTheDocument();
  await user.click(decline());
  expect(screen.getByText(content.ask.declineNote)).toBeInTheDocument();
});

test('a revisited terms page is read-only: accepted stays accepted, and nothing is charged twice', async () => {
  const seed = seedWhereAsk('naturalist', 'free', (r) => r === 'conditional');
  const user = await stop1Reply('naturalist', seed);
  await user.click(accept());
  const after = meters().textContent;
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(accept()).toHaveAccessibleDescription(ui.yourChoice);
  expect(decline()).toHaveAccessibleDescription(ui.lockReasons.decided);
  await user.click(decline());
  expect(accept()).toBeInTheDocument();
  await user.click(accept());
  expect(meters().textContent).toBe(after);
});

test('a revisited follow-up page is read-only', async () => {
  const seed = seedWhereAsk('artificer', 'permission', (r) => r === 'no' || r === 'silence');
  const user = await toStop3Ask(seed);
  await fill(user, 0);
  await user.click(screen.getByRole('button', { name: content.ask.followUps.dont.label }));
  const after = meters().textContent;
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(screen.getByRole('button', { name: content.ask.followUps.dont.label })).toHaveAccessibleDescription(ui.yourChoice);
  const anyway = screen.getByRole('button', { name: content.ask.followUps.useAnyway.label });
  expect(anyway).toHaveAccessibleDescription(ui.lockReasons.decided);
  await user.click(anyway);
  expect(meters().textContent).toBe(after);
});
