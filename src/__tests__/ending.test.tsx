import { screen } from '@testing-library/react';
import { content } from '../content';
import { STOP_ORDER } from '../content/types';
import { throughFlip, toFlip } from './helpers';

// revision-2: the guess, reveal, three endings, codas, and the Orphan Works reference entry are gone.
// The shelf and project summary are stubs until Task 12, which replaces these tests and deletes this file.
test.skip('orphan works unlocks after the reveal; each ending shows its scene and coda', () => {
  // revision-2: replaced in Task 12
});

test('the flip leads to the shelf stub, which shows the closing line', async () => {
  const user = await toFlip('bard');
  await throughFlip(user, 'cc-by-nc');
  expect(screen.getByText(content.clerk.shelf.closingLine)).toBeInTheDocument();
});

// revision-2: Task 12 routes independent mode through the flip debrief (interstitial) before the shelf.
test.todo('independent mode shows the flip debrief before the shelf');

test('the project summary shows four notes, and Play again starts over', async () => {
  const user = await toFlip('herald');
  await throughFlip(user);
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  for (const id of STOP_ORDER) expect(screen.getByRole('heading', { level: 2, name: new RegExp(content.stops[id].title.slice(0, 12)) })).toBeInTheDocument();
  expect(screen.getAllByTestId('cart-review-note')).toHaveLength(4);
  await user.click(screen.getByRole('button', { name: /Play again/ }));
  expect(screen.getByText('Are you playing this in a class, or on your own?')).toBeInTheDocument();
});
