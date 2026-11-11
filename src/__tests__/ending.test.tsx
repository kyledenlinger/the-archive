import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { EndingId, LICENSE_IDS, STOP_ORDER } from '../content/types';
import { guessAndReveal, throughFlip, toFlip } from './helpers';

const clerk = content.clerk;

async function openRef(user: Awaited<ReturnType<typeof toFlip>>) {
  await user.click(screen.getByRole('button', { name: /^Reference$/ }));
  const dialog = screen.getByRole('dialog');
  const has = within(dialog).queryByText('Orphan Works') !== null;
  await user.click(screen.getByRole('button', { name: 'Close reference' }));
  return has;
}

test('orphan works unlocks in the reference only after the last reveal paragraph', async () => {
  const user = await toFlip('chronicler');
  await throughFlip(user);
  expect(screen.getByText(clerk.guessPrompt)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: clerk.guessOptions[0].label }));
  for (let i = 1; i < clerk.reveal.length; i++) {
    expect(screen.getByText(clerk.reveal[i - 1])).toBeInTheDocument();
    expect(await openRef(user)).toBe(false);
    await user.click(screen.getByRole('button', { name: /^Continue/ }));
  }
  expect(screen.getByText(clerk.reveal[clerk.reveal.length - 1])).toBeInTheDocument();
  expect(await openRef(user)).toBe(true);
});

test.each(['search', 'shelf', 'wait'] as EndingId[])('the %s ending shows its scene, the coda for the license, and the closing line', async (ending) => {
  const user = await toFlip('bard');
  await throughFlip(user, 'cc-by-nc');
  await guessAndReveal(user);
  await user.click(screen.getByRole('button', { name: clerk.endings[ending].label }));
  expect(screen.getByText(clerk.endings[ending].scene)).toBeInTheDocument();
  expect(screen.getByText(clerk.codaShade['cc-by-nc'])).toBeInTheDocument();
  expect(screen.getByText(clerk.closingLine)).toBeInTheDocument();
});

test('every license has its own coda', () => {
  expect(new Set(LICENSE_IDS.map((l) => clerk.codaShade[l])).size).toBe(5);
});

test('independent mode shows the flip debrief before the cart review', async () => {
  const user = await toFlip('conjurer', 'independent');
  await throughFlip(user);
  await guessAndReveal(user);
  await user.click(screen.getByRole('button', { name: clerk.endings.shelf.label }));
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByText(content.stops.flip.debrief.lesson)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByRole('heading', { level: 1, name: /Your cart/ })).toBeInTheDocument();
});

test('the cart review shows the guess and four notes, and Play again starts over', async () => {
  const user = await toFlip('herald');
  await throughFlip(user);
  await guessAndReveal(user, 'song');
  await user.click(screen.getByRole('button', { name: clerk.endings.wait.label }));
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByRole('heading', { level: 1, name: content.interstitial.waitTitle })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByText(/Your guess: A song\./)).toBeInTheDocument();
  for (const id of STOP_ORDER) expect(screen.getByRole('heading', { level: 2, name: new RegExp(content.stops[id].title.slice(0, 12)) })).toBeInTheDocument();
  expect(screen.getAllByTestId('cart-review-note')).toHaveLength(4);
  await user.click(screen.getByRole('button', { name: /Play again/ }));
  expect(screen.getByText('Are you playing this in a class, or on your own?')).toBeInTheDocument();
});
