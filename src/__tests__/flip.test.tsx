import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { cartItemText, toFlip } from './helpers';

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

test('three responses lead to Continue, with no in-page way back to the picker', async () => {
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
  // revision-2: the Clerk's askForHelp line is gone (Task 11 removes the phase).
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(await cartItemText(user, 'flip')).toContain(flip.licenses['cc-by'].label);
});
