import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { GameContent, Meters, PersonaId } from '../content/types';
import { ui } from '../content/ui';
import { askFollowUps } from '../content/ask';
import { describeChanges } from '../components/MeterDisplay';
import { fairUseEffects, previewChanges } from '../lib/meters';
import { dealAskResponse, DEFAULT_ODDS, isWellFormed } from '../lib/ask';
import { outcomeFor } from '../screens/Stop';
import { cartButton, enterStop, seedWhereAsk, seedWhereSearch, startAs, throughCoaching, toChoices } from './helpers';

const stop = content.stops.free;
const choice = (id: string) => stop.choices.find((c) => c.id === id)!;
const choiceGroup = () => screen.getByRole('group', { name: /What do you do/ });
const meters = () => screen.getByRole('list', { name: ui.metersLabel });
const withStart = (persona: PersonaId, over: Partial<Meters>): GameContent => ({
  ...content,
  personas: content.personas.map((p) => (p.id === persona ? { ...p, startMeters: { ...p.startMeters, ...over } } : p)),
});
/** A line of the Clerk's, in his own block. */
const expectClerk = (text: string) => {
  const block = screen.getByText(text).closest('figure');
  expect(block).not.toBeNull();
  expect(within(block!).getByText(ui.clerkLabel)).toBeInTheDocument();
};

test('stop 1 shows the Clerk intro, then the setup and the complication on their own pages', async () => {
  const user = await startAs('chronicler');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(stop.title);
  expect(screen.getByText(stop.clerkIntro)).toBeInTheDocument();
  await enterStop(user);
  expect(screen.getByText(stop.setup.chronicler)).toBeInTheDocument();
  expect(screen.queryByText(stop.complication)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: ui.coached.toComplication }));
  expect(screen.getByText(stop.complication)).toBeInTheDocument();
  expect(screen.queryByRole('group', { name: /What do you do/ })).not.toBeInTheDocument();
});

test('stop 1 has no fair use choice: the analysis starts after the complication, with the Clerk coaching each factor', async () => {
  expect(stop.coached).toBe(true);
  expect(stop.choices.some((c) => c.mechanic === 'fairUse')).toBe(false);
  const user = await startAs('artificer');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: ui.coached.toComplication }));
  await user.click(screen.getByRole('button', { name: ui.coached.toInvite }));
  expectClerk(content.clerk.coachInvite);
  await user.click(screen.getByRole('button', { name: ui.coached.startAnalysis }));
  const before = meters().textContent;
  content.fairUse.factors.forEach((f, i) => expect(content.fairUse.coaching[i]).not.toBe(f.description));
  for (let i = 0; i < 4; i++) {
    const f = content.fairUse.factors[i];
    expectClerk(content.fairUse.coaching[i]);
    expect(screen.getByText(f.text.free.artificer)).toBeInTheDocument();
    // The coaching comes before the persona text.
    const coaching = screen.getByText(content.fairUse.coaching[i]);
    expect(coaching.compareDocumentPosition(screen.getByText(f.text.free.artificer)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /supports fair use/ }));
  }
  expectClerk(content.fairUse.assessments.free.artificer.text);
  // The coached analysis costs no Time and records nothing.
  expect(meters().textContent).toBe(before);
  expect(cartButton(0)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Add to cart/ })).not.toBeInTheDocument();
  expect(screen.queryByTestId('change-lines')).not.toBeInTheDocument();
});

test('after the assessment, the four decision choices appear in order', async () => {
  const user = await startAs('herald');
  await toChoices(user);
  const labels = within(choiceGroup())
    .getAllByRole('button')
    .map((b) => b.textContent);
  expect(labels).toEqual(['rely', 'free', 'licensed', 'search'].map((id) => choice(id).label));
  expect(choice('licensed').requires).toEqual(['budget']);
  expect(choice('search')).toMatchObject({ mechanic: 'search', requires: ['time'] });
  expect(choice('rely').effectsFrom).toBe('fairUse');
});

test('relying on the analysis takes its effects from the assessment’s strength', async () => {
  const user = await startAs('herald');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: choice('rely').label }));
  expect(screen.getByText(outcomeFor(choice('rely'), 'herald').text)).toBeInTheDocument();
  const start = content.personas.find((p) => p.id === 'herald')!.startMeters;
  const lines = describeChanges(previewChanges(start, fairUseEffects(content.fairUse.assessments.free.herald.strength)));
  const shown = screen.getByRole('list', { name: ui.changesLabel });
  for (const line of lines) expect(within(shown).getByText(line)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: content.interstitial.pauseLabel }));
  expect(cartButton(1)).toBeInTheDocument();
});

test('a plain choice shows its outcome and lands on the class-mode wait screen', async () => {
  const user = await startAs('chronicler', 'class');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: choice('free').label }));
  expect(screen.getByText(outcomeFor(choice('free'), 'chronicler').text)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  expect(screen.getByRole('heading', { level: 1, name: content.interstitial.waitTitle })).toBeInTheDocument();
  expect(screen.queryByText(stop.debrief.lesson)).not.toBeInTheDocument();
  expect(cartButton(1)).toBeInTheDocument();
});

test('independent mode shows the debrief lesson and prompts', async () => {
  const user = await startAs('chronicler', 'independent');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: choice('licensed').label }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  expect(screen.getByText(stop.debrief.lesson)).toBeInTheDocument();
  for (const p of stop.debrief.prompts) expect(screen.getByText(p)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: content.interstitial.continueLabel }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
});

test('a search that finds no one: the fail text, Time drops from Plenty to Tight, and the search is locked', async () => {
  const user = await startAs('conjurer', 'class', content, seedWhereSearch('conjurer', false));
  await toChoices(user);
  expect(meters()).toHaveTextContent('Time: Plenty');
  await user.click(screen.getByRole('button', { name: choice('search').label }));
  expect(screen.getByText(stop.searchFail!.conjurer!)).toBeInTheDocument();
  expect(meters()).toHaveTextContent('Time: Tight');
  expect(within(screen.getByRole('list', { name: ui.changesLabel })).getByText('Time: Plenty → Tight')).toBeInTheDocument();
  expect(cartButton(0)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: ui.coached.afterSearchFail }));
  const search = within(choiceGroup()).getByRole('button', { name: choice('search').label });
  expect(search).toHaveAttribute('aria-disabled', 'true');
  expect(search).toHaveAccessibleDescription(ui.lockReasons.searched);
  await user.click(search);
  expect(choiceGroup()).toBeInTheDocument();
  expect(meters()).toHaveTextContent('Time: Tight');
  // The other choices are still open: the failed search isn't the stop's decision.
  for (const id of ['rely', 'free', 'licensed']) {
    expect(within(choiceGroup()).getByRole('button', { name: choice(id).label })).not.toHaveAttribute('aria-disabled');
  }
  // Back over the fail page refunds nothing and keeps the lock.
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(screen.getByText(stop.searchFail!.conjurer!)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(within(choiceGroup()).getByRole('button', { name: choice('search').label })).toHaveAccessibleDescription(ui.lockReasons.searched);
  expect(meters()).toHaveTextContent('Time: Tight');
});

test('a search that finds the owner says who, opens the Ask form, and sending doesn’t charge Time again', async () => {
  // A reply other than a conditional yes, so the follow-ups show straight away.
  const seed = seedWhereAsk('conjurer', 'free', (r) => r !== 'conditional');
  const user = await startAs('conjurer', 'independent', content, seed);
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: choice('search').label }));
  // The found line sits above the form, in the narrator's voice (not a Clerk block).
  const found = screen.getByText(stop.searchFound!.conjurer!);
  expect(found.closest('figure')).toBeNull();
  expect(found.compareDocumentPosition(screen.getByText(content.ask.intro)) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(meters()).toHaveTextContent('Time: Tight'); // 5 → 3 from the search
  const announced = screen.getByTestId('meter-live').textContent;
  await user.click(screen.getByRole('button', { name: /Send the request/ }));
  // The search already paid for the request: no new meter change.
  expect(screen.getByTestId('meter-live').textContent).toBe(announced);
  expect(meters()).toHaveTextContent('Time: Tight');
  const response = dealAskResponse(seed, 'conjurer', 'free', isWellFormed({}), content.ask.odds?.free?.conjurer ?? DEFAULT_ODDS);
  const answer = content.ask.responses.free!.conjurer[response];
  expect(screen.getByText(answer.text)).toBeInTheDocument();
  // Back to the form shows the found line again; forward again charges nothing either.
  await user.click(screen.getByRole('button', { name: ui.header.back }));
  expect(screen.getByText(stop.searchFound!.conjurer!)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: content.interstitial.continueLabel }));
  expect(screen.getByText(answer.text)).toBeInTheDocument();
  expect(screen.getByTestId('meter-live').textContent).toBe(announced);
  await user.click(screen.getByRole('button', { name: /^Don’t use it$/ }));
  expect(screen.getByText(`${answer.cartNote} ${askFollowUps.dont.note}`)).toBeInTheDocument();
  expect(cartButton(1)).toBeInTheDocument();
});

test('after a search that found the owner, sending leaves Time where the search put it: from 4, still Tight', async () => {
  const testContent = withStart('naturalist', { time: 4 });
  const user = await startAs('naturalist', 'class', testContent, seedWhereSearch('naturalist', true, testContent));
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: choice('search').label }));
  expect(meters()).toHaveTextContent('Time: Tight'); // 4 → 2
  await user.click(screen.getByRole('button', { name: /Send the request/ }));
  expect(meters()).toHaveTextContent('Time: Tight'); // a send cost would make it 1, Out of time
});

test('Review Focus 2: out of time and broke, stop 1 still offers “use it” and “find a free alternative”', async () => {
  const user = await startAs('conjurer', 'class', withStart('conjurer', { time: 0, budget: 0 }));
  await enterStop(user);
  await throughCoaching(user);
  for (const id of ['rely', 'free']) expect(within(choiceGroup()).getByRole('button', { name: choice(id).label })).not.toHaveAttribute('aria-disabled');
  const licensed = within(choiceGroup()).getByRole('button', { name: choice('licensed').label });
  expect(licensed).toHaveAccessibleDescription(ui.lockReasons.budget);
  const search = within(choiceGroup()).getByRole('button', { name: choice('search').label });
  expect(search).toHaveAccessibleDescription(ui.lockReasons.time);
  await user.click(search);
  expect(choiceGroup()).toBeInTheDocument();
  await user.click(within(choiceGroup()).getByRole('button', { name: choice('free').label }));
  expect(screen.getByText(outcomeFor(choice('free'), 'conjurer').text)).toBeInTheDocument();
});
