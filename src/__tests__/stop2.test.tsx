import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { Effects, GameContent, Meters, PERSONA_IDS, PersonaId } from '../content/types';
import { ui } from '../content/ui';
import { describeChanges } from '../components/MeterDisplay';
import { applyEffects, previewChanges } from '../lib/meters';
import { validateContent } from '../lib/validateContent';
import { choiceEffects, outcomeFor } from '../screens/Stop';
import { enterStop, passStopWithFirstChoice, startAs } from './helpers';

test.each(PERSONA_IDS)('stop 2 renders the %s setup', async (persona) => {
  const user = await startAs(persona);
  await passStopWithFirstChoice(user);
  expect(screen.getByText(content.stops.layers.clerkIntro)).toBeInTheDocument();
  await enterStop(user);
  expect(screen.getByText(content.stops.layers.setup[persona])).toBeInTheDocument();
});

test('the Bard recording year is flagged for yearly review', () => {
  const items = validateContent(content).reviewItems;
  expect(items).toContainEqual(expect.objectContaining({ where: 'stops.layers.personaReviewBy.bard', date: '2027-01-01' }));
});

/** The real content, with one persona's starting meters overridden. */
const withStart = (persona: PersonaId, over: Partial<Meters>): GameContent => ({
  ...content,
  personas: content.personas.map((p) => (p.id === persona ? { ...p, startMeters: { ...p.startMeters, ...over } } : p)),
});
const meterList = () => screen.getByRole('list', { name: ui.metersLabel }).textContent;

test('stop 2 is titled Old Bones and stop 3 Strings Attached', async () => {
  const user = await startAs('bard');
  await passStopWithFirstChoice(user);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Old Bones');
  await passStopWithFirstChoice(user);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Strings Attached');
});

test('a stop 3 choice that needs Time is locked when time is out, and does nothing', async () => {
  const ask = content.stops.permission.choices.find((c) => c.requires?.includes('time'))!;
  const user = await startAs('chronicler', 'class', withStart('chronicler', { time: 1 }));
  await passStopWithFirstChoice(user);
  await passStopWithFirstChoice(user);
  await enterStop(user);
  const button = screen.getByRole('button', { name: ask.label });
  expect(button).toHaveAttribute('aria-disabled', 'true');
  expect(button).toHaveAccessibleDescription(ui.lockReasons.time);
  await user.click(button);
  expect(screen.getByRole('group', { name: /What do you do/ })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Send the request/ })).not.toBeInTheDocument();
});

test('a choice previews its meter changes, the header meters change only on Add to cart, and Back shows the outcome read-only', async () => {
  const clean = content.stops.layers.choices.find((c) => c.id === 'clean')!;
  const user = await startAs('chronicler');
  await passStopWithFirstChoice(user);
  await enterStop(user);
  const before = meterList();
  await user.click(screen.getByRole('button', { name: clean.label }));
  // Stop 2 previews against the meters stop 1's first choice left.
  const first = content.stops.free.choices.find((c) => !c.mechanic)!;
  const start = content.personas.find((p) => p.id === 'chronicler')!.startMeters;
  const afterStop1 = applyEffects(start, choiceEffects(first, 'free', 'chronicler', content)).meters;
  const lines = describeChanges(previewChanges(afterStop1, clean.effects ? (clean.effects as Record<PersonaId, Effects>).chronicler : []));
  expect(lines.length).toBeGreaterThan(0);
  const shown = screen.getByRole('list', { name: ui.changesLabel });
  for (const line of lines) expect(within(shown).getByText(line)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Choose again/ })).not.toBeInTheDocument();
  expect(meterList()).toBe(before);
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  const after = meterList();
  expect(after).not.toBe(before);
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(screen.getByText(outcomeFor(clean, 'chronicler').cartNote)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Add to cart/ })).not.toBeInTheDocument();
  expect(meterList()).toBe(after);
});

test('fair use in stop 2 costs Time once, when it starts, and the summary previews no further Time', async () => {
  const fairUse = content.stops.layers.choices.find((c) => c.mechanic === 'fairUse')!;
  // From 5, one charge drops Plenty to Tight.
  const user = await startAs('herald', 'class', withStart('herald', { time: 5 }));
  await passStopWithFirstChoice(user);
  await enterStop(user);
  const timeWord = () => screen.getByRole('list', { name: ui.metersLabel }).querySelector('li')!.getAttribute('title');
  expect(timeWord()).toBe('Time: Plenty');
  await user.click(screen.getByRole('button', { name: fairUse.label }));
  expect(screen.getByTestId('meter-live')).toHaveTextContent('Time: Plenty → Tight');
  expect(timeWord()).toBe('Time: Tight');
  for (let i = 0; i < 4; i++) await user.click(screen.getByRole('button', { name: /Not sure yet/ }));
  // Back to the choices and forward again doesn't charge again.
  for (let i = 0; i < 5; i++) await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(screen.getByRole('button', { name: fairUse.label })).toHaveAccessibleDescription(ui.yourChoice);
  await user.click(screen.getByRole('button', { name: fairUse.label }));
  for (let i = 0; i < 4; i++) await user.click(screen.getByRole('button', { name: /Not sure yet/ }));
  expect(timeWord()).toBe('Time: Tight');
  const shown = screen.getByRole('list', { name: ui.changesLabel });
  expect(within(shown).queryByText(/^Time/)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Add to cart on a fair use basis/ }));
  expect(timeWord()).toBe('Time: Tight');
});
