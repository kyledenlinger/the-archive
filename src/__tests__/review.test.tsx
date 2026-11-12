import { screen } from '@testing-library/react';
import { content } from '../content';
import { PersonaId } from '../content/types';
import { review } from '../content/review';
import { enterStop, leaveInterstitial, startAs } from './helpers';

const stop = content.stops.free;
const label = (id: string) => stop.choices.find((c) => c.id === id)!.label;
const note = (id: string, p: PersonaId) => {
  const o = stop.choices.find((c) => c.id === id)!.outcome!;
  return 'cartNote' in o ? (o.cartNote as string) : (o as Record<PersonaId, { cartNote: string }>)[p].cartNote;
};

test.each(['class', 'independent'] as const)('the %s-mode interstitial shows the choice just made', async (mode) => {
  const user = await startAs('bard', mode);
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: label('take') }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  expect(screen.getByText(review.yourChoice)).toBeInTheDocument();
  expect(screen.getByText(note('take', 'bard'))).toBeInTheDocument();
  // Choices are final: there is no way back from here to redo it.
  expect(screen.queryByRole('button', { name: /go back/i })).not.toBeInTheDocument();
  expect(screen.queryByText(/choose again/i)).not.toBeInTheDocument();
});

test('the cart so far lists earlier stops behind a toggle', async () => {
  const user = await startAs('conjurer');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: label('take') }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  await leaveInterstitial(user);
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: content.stops.layers.choices[0].label }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  const toggle = screen.getByRole('button', { name: review.cartSoFar });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByText(note('take', 'conjurer'))).not.toBeInTheDocument();
  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(note('take', 'conjurer'))).toBeInTheDocument();
});
