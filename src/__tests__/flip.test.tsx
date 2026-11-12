import { screen } from '@testing-library/react';
import { content } from '../content';
import { toFlip } from './helpers';

const flip = content.stops.flip;

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

test('three responses lead to Continue, with no way back to the picker', async () => {
  const user = await toFlip('artificer');
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses['cc-by'].label}` }));
  for (const kind of ['within', 'outside', 'beyond'] as const) {
    expect(screen.getByText(flip.events.artificer[kind].situation['cc-by'])).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Choose / })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: flip.responses.credit.label }));
    await user.click(screen.getByRole('button', { name: /^Next/ }));
  }
  // revision-2: the Clerk's askForHelp line is gone (Task 11 removes the phase).
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  const slot = screen.getByTestId('cart-slot-flip');
  expect(slot).toHaveAttribute('data-filled', 'true');
  expect(slot.getAttribute('title')).toContain(flip.licenses['cc-by'].label);
});
