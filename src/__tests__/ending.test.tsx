import { screen } from '@testing-library/react';
import { content } from '../content';
import { STOP_ORDER } from '../content/types';
import { guessAndReveal, throughFlip, toFlip } from './helpers';

// revision-2: the guess, reveal, three endings, codas, and the Orphan Works reference entry are gone.
// The tests for them are replaced by the shelf tests in Task 12, which also deletes this file.
test.skip('orphan works unlocks after the reveal; each ending shows its scene and coda', () => {
  // revision-2: replaced in Task 12
});

test('the ending stub shows the closing line', async () => {
  const user = await toFlip('bard');
  await throughFlip(user, 'cc-by-nc');
  await guessAndReveal(user);
  expect(screen.getByText(content.clerk.shelf.closingLine)).toBeInTheDocument();
});

test('independent mode shows the flip debrief before the cart review', async () => {
  const user = await toFlip('conjurer', 'independent');
  await throughFlip(user);
  await guessAndReveal(user);
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByText(content.stops.flip.debrief.lesson)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByRole('heading', { level: 1, name: /Your cart/ })).toBeInTheDocument();
});

test('the cart review shows four notes, and Play again starts over', async () => {
  const user = await toFlip('herald');
  await throughFlip(user);
  await guessAndReveal(user);
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByRole('heading', { level: 1, name: content.interstitial.waitTitle })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  for (const id of STOP_ORDER) expect(screen.getByRole('heading', { level: 2, name: new RegExp(content.stops[id].title.slice(0, 12)) })).toBeInTheDocument();
  expect(screen.getAllByTestId('cart-review-note')).toHaveLength(4);
  await user.click(screen.getByRole('button', { name: /Play again/ }));
  expect(screen.getByText('Are you playing this in a class, or on your own?')).toBeInTheDocument();
});
