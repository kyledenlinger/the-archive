import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { btnPrimary } from '../components/styles';
import { cartButton, enterStop, startAs } from './helpers';

const copy = content.interstitial;
const plain = content.stops.free.choices.find((c) => !c.mechanic)!.label;

test('class mode: the outcome button reads “Add to cart and pause”, with a pause icon and its own style', async () => {
  const user = await startAs('bard', 'class');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: plain }));
  const button = screen.getByRole('button', { name: copy.pauseLabel });
  expect(button.querySelector('svg.lucide-pause')).not.toBeNull();
  expect(button.className).not.toBe(btnPrimary);
  expect(button).toHaveClass('border-dashed');
  expect(screen.queryByRole('button', { name: /^Add to cart$/ })).not.toBeInTheDocument();
});

test('class mode: the pause card says to stop, has no Continue bar, and keeps your choice and cart', async () => {
  const user = await startAs('bard', 'class');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: plain }));
  await user.click(screen.getByRole('button', { name: copy.pauseLabel }));
  expect(screen.getByRole('heading', { level: 1, name: copy.waitTitle })).toBeInTheDocument();
  expect(copy.waitTitle).toBe('Stop here');
  expect(screen.getByText(copy.waitLead)).toBeInTheDocument();
  expect(screen.getByTestId('pause-card').querySelector('svg.lucide-pause')).not.toBeNull();
  expect(screen.queryByTestId('continue-bar')).not.toBeInTheDocument();
  expect(screen.getByText('Your choice')).toBeInTheDocument();
  expect(cartButton(1)).toBeInTheDocument();
});

test('class mode: leaving the pause needs the facilitator confirm; Not yet stays put, Yes moves on', async () => {
  const user = await startAs('bard', 'class');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: plain }));
  await user.click(screen.getByRole('button', { name: copy.pauseLabel }));
  const go = within(screen.getByTestId('pause-card')).getByRole('button', { name: copy.continueLabel });
  await user.click(go);
  const dialog = screen.getByRole('alertdialog', { name: copy.confirmMoveOn.question });
  expect(copy.confirmMoveOn.question).toBe('Has your facilitator said it’s time to move on?');
  const notYet = within(dialog).getByRole('button', { name: copy.confirmMoveOn.cancel });
  expect(document.activeElement).toBe(notYet);
  await user.click(notYet);
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: copy.waitTitle })).toBeInTheDocument();
  await user.click(go);
  await user.keyboard('{Escape}');
  expect(screen.getByRole('heading', { level: 1, name: copy.waitTitle })).toBeInTheDocument();
  await user.click(go);
  await user.click(screen.getByRole('button', { name: copy.confirmMoveOn.confirm }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
});

test('independent mode has neither the pause button nor the confirm', async () => {
  const user = await startAs('bard', 'independent');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: plain }));
  expect(screen.queryByRole('button', { name: copy.pauseLabel })).not.toBeInTheDocument();
  const add = screen.getByRole('button', { name: /^Add to cart/ });
  expect(add.querySelector('svg.lucide-pause')).toBeNull();
  await user.click(add);
  expect(screen.queryByText(copy.waitLead)).not.toBeInTheDocument();
  expect(screen.getByTestId('continue-bar')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: copy.continueLabel }));
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
});
