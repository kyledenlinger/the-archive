import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { projectUi, shelfUi } from '../content/ui';
import { FateId, LICENSE_IDS, Meters, PersonaId } from '../content/types';
import { Action, GameState, initialState, reducer } from '../state';
import { cartButton, cartItemText, leaveInterstitial, throughFlip, toFlip, toShelf } from './helpers';

const shelf = content.clerk.shelf;
const flip = content.stops.flip;
const header = () => screen.getByRole('banner');

/** Continue from the shelf intro to your shelf. */
const toMine = async (user: Awaited<ReturnType<typeof toShelf>>) => user.click(screen.getByRole('button', { name: /^Continue/ }));

test('the shelf shows the fate, the scene, and the last word for a seeded playthrough', async () => {
  const persona: PersonaId = 'chronicler';
  const user = await toShelf(persona, 'class', 'cc-by-sa', 'credit');
  for (const p of shelf.intro) expect(screen.getByText(p)).toBeInTheDocument();
  await toMine(user);
  expect(screen.getByRole('heading', { level: 1, name: new RegExp(shelfUi.yourShelf) })).toBeInTheDocument();

  const fate = screen.getByTestId('shelf-fate').textContent ?? '';
  const pieces = Object.values(shelf.fate[persona]).filter((f) => fate.includes(f));
  expect(pieces.length).toBeGreaterThan(0);
  expect(pieces.join(' ').length).toBe(fate.length);

  // The real run adds the detail for how you answered the use outside your terms.
  expect(screen.getByTestId('shelf-scene')).toHaveTextContent(`${shelf.scenes[persona]['cc-by-sa']} ${shelf.outsideDetail.credit}`);
  expect(Object.values(shelf.lastWord[persona])).toContain(screen.getByTestId('shelf-last-word').textContent);
  expect(screen.getByText(shelf.othersOffer)).toBeInTheDocument();
});

test('the alternates exclude your license, show the base scene, and change nothing', async () => {
  const user = await toShelf('naturalist', 'class', 'cc-by', 'takedown');
  await toMine(user);
  const metersBefore = header().textContent;
  const cartBefore = await cartItemText(user, 'flip');
  const sceneBefore = screen.getByTestId('shelf-scene').textContent;

  const group = screen.getByRole('group', { name: shelfUi.otherFutures });
  const others = LICENSE_IDS.filter((l) => l !== 'cc-by');
  expect(within(group).getAllByRole('button').map((b) => b.textContent)).toEqual(others.map((l) => shelfUi.see(flip.licenses[l].label)));
  expect(within(group).queryByRole('button', { name: shelfUi.see(flip.licenses['cc-by'].label) })).not.toBeInTheDocument();

  for (const l of others) {
    await user.click(screen.getByRole('button', { name: shelfUi.see(flip.licenses[l].label) }));
    const alt = screen.getByTestId('shelf-alt');
    expect(alt.className).toMatch(/opacity-80/);
    expect(alt.className).toMatch(/saturate-50/);
    expect(alt.className).toMatch(/border-dashed/);
    expect(screen.getByRole('heading', { level: 1, name: `What might have been: ${flip.licenses[l].label}.` })).toBeInTheDocument();
    // The base scene only: no response detail in a future you didn't play.
    expect(within(alt).getByText(shelf.scenes.naturalist[l])).toBeInTheDocument();
    expect(alt).not.toHaveTextContent(shelf.outsideDetail.takedown);
    await user.click(screen.getByRole('button', { name: shelf.backToYours }));
    expect(screen.getByTestId('shelf-scene').textContent).toBe(sceneBefore);
  }
  expect(header().textContent).toBe(metersBefore);
  expect(await cartItemText(user, 'flip')).toBe(cartBefore);
  expect(cartBefore).toContain(flip.licenses['cc-by'].label);
});

test('Back from an alternate returns to your shelf', async () => {
  const user = await toShelf('bard');
  await toMine(user);
  await user.click(screen.getByRole('button', { name: shelfUi.see(flip.licenses.arr.label) }));
  await user.click(within(header()).getByRole('button', { name: 'Back' }));
  expect(screen.getByRole('heading', { level: 1, name: new RegExp(shelfUi.yourShelf) })).toBeInTheDocument();
  // Looking at another future after Back still works.
  await user.click(screen.getByRole('button', { name: shelfUi.see(flip.licenses.cc0.label) }));
  expect(screen.getByRole('heading', { level: 1, name: `What might have been: ${flip.licenses.cc0.label}.` })).toBeInTheDocument();
});

test('independent mode shows the flip debrief before the shelf', async () => {
  const user = await toFlip('artificer', 'independent');
  await throughFlip(user);
  expect(screen.getByText(flip.debrief.lesson)).toBeInTheDocument();
  expect(screen.queryByText(shelf.intro[0])).not.toBeInTheDocument();
  await leaveInterstitial(user);
  expect(screen.getByText(shelf.intro[0])).toBeInTheDocument();
});

test('class mode goes from the flip straight to the shelf', async () => {
  const user = await toFlip('artificer', 'class');
  await throughFlip(user);
  expect(screen.queryByText(flip.debrief.lesson)).not.toBeInTheDocument();
  expect(screen.getByText(shelf.intro[0])).toBeInTheDocument();
});

test.each(['class', 'independent'] as const)('the project summary in %s mode lists the three items and Your work; Play again → mode select', async (mode) => {
  const user = await toShelf('herald', mode, 'cc-by-nc');
  await toMine(user);
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByText(shelf.closingLine)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));

  expect(screen.getByRole('heading', { level: 1, name: projectUi.heading })).toBeInTheDocument();
  const persona = content.personas.find((p) => p.id === 'herald')!;
  expect(screen.getByText(persona.brief.making)).toBeInTheDocument();
  const items = screen.getAllByTestId('project-item');
  expect(items).toHaveLength(3);
  persona.brief.items.forEach((item, i) => expect(items[i]).toHaveTextContent(item));
  const work = screen.getByTestId('project-work');
  expect(work).toHaveTextContent(projectUi.yourWork);
  expect(work).toHaveTextContent(projectUi.license(flip.licenses['cc-by-nc'].label));
  expect(work).toHaveTextContent(flip.responses.credit.cartNote);
  if (mode === 'class') {
    expect(screen.getByText(projectUi.facilitatorLine)).toBeInTheDocument();
    expect(screen.getByText(projectUi.debriefPrompt)).toBeInTheDocument();
  } else {
    expect(screen.getByText(projectUi.independentSummary)).toBeInTheDocument();
    expect(screen.queryByText(projectUi.facilitatorLine)).not.toBeInTheDocument();
  }
  expect(cartButton(3)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: projectUi.playAgain }));
  expect(screen.getByText('Are you playing this in a class, or on your own?')).toBeInTheDocument();
});

test('the reference panel has no Orphan Works entry', () => {
  expect(content.reference.some((e) => /orphan/i.test(`${e.id} ${e.title} ${e.body}`))).toBe(false);
});

describe('reducer', () => {
  const START: Meters = { time: 5, budget: 4, exposure: 1, vision: 5 };
  const run = (s: GameState, ...actions: Action[]) => actions.reduce(reducer, s);
  const flipDone = (mode: 'class' | 'independent') => {
    let s = run(
      initialState(1),
      { type: 'SET_MODE', mode },
      { type: 'FINISH_ONBOARDING' },
      { type: 'CHOOSE_PERSONA', persona: 'bard', startMeters: START },
      { type: 'FINISH_BRIEF' },
    );
    for (const stopId of ['free', 'layers', 'permission'] as const) {
      s = run(s, { type: 'RECORD_STOP', stopId, cartNote: stopId, effects: [] }, { type: 'ADVANCE' });
    }
    return run(
      s,
      { type: 'SET_LICENSE', license: 'cc-by' },
      { type: 'RECORD_REUSE', kind: 'within', response: 'credit', effects: [] },
      { type: 'RECORD_REUSE', kind: 'outside', response: 'credit', effects: [] },
      { type: 'RECORD_REUSE', kind: 'beyond', response: 'credit', effects: [] },
      { type: 'FINISH_FLIP', cartNote: 'n' },
    );
  };

  test('independent: FINISH_FLIP goes to the interstitial, and ADVANCE from there to the shelf intro', () => {
    const s = flipDone('independent');
    expect(s.screen).toBe('interstitial');
    const next = reducer(s, { type: 'ADVANCE' });
    expect(next.screen).toBe('shelf');
    expect(next.page).toEqual({ kind: 'intro' });
  });

  test('alternate futures are pages: Back covers them, and they never touch license, cart, or meters', () => {
    const s = run(flipDone('class'), { type: 'GO_TO', page: { kind: 'shelfMine' } });
    const alt = run(s, { type: 'GO_TO', page: { kind: 'shelfAlt', license: 'arr' } });
    expect(alt.page).toEqual({ kind: 'shelfAlt', license: 'arr' });
    for (const k of ['flip', 'cart', 'meters', 'exposureLegal', 'exposureReputational'] as const) expect(alt[k]).toEqual(s[k]);
    const back = reducer(alt, { type: 'BACK' });
    expect(back.page).toEqual({ kind: 'shelfMine' });
    // Still free to look at another one after Back.
    const other = reducer(back, { type: 'GO_TO', page: { kind: 'shelfAlt', license: 'cc0' } });
    expect(other.page).toEqual({ kind: 'shelfAlt', license: 'cc0' });
    expect(other.forward).toEqual([]);
    expect(other.flip.license).toBe('cc-by');
  });

  test('every fate id has text for every persona', () => {
    const ids: FateId[] = ['pulled', 'asPlanned', 'underCloud', 'late', 'smaller', 'compromised'];
    for (const p of Object.keys(shelf.fate) as PersonaId[]) for (const f of ids) expect(shelf.fate[p][f].length).toBeGreaterThan(0);
  });
});
