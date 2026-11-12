import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';

const lines = content.onboarding.lines;
/** Assert the shown beat contains every piece of beat `i`. */
const expectBeat = (i: number) => {
  for (const piece of lines[i]) expect(screen.getByTestId('onboarding-line')).toHaveTextContent(piece.text);
};

async function toOnboarding() {
  const user = userEvent.setup();
  render(<App seed={1} />);
  await user.click(screen.getByRole('button', { name: /In a class/ }));
  return user;
}

test('mode select asks how you are playing and offers two choices', () => {
  render(<App seed={1} />);
  expect(screen.getByText('Are you playing this in a class, or on your own?')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /In a class/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /On my own/ })).toBeInTheDocument();
});

test('onboarding leads to persona select with all six personas', async () => {
  const user = await toOnboarding();
  expectBeat(0);
  for (let i = 1; i < lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
  for (const p of content.personas) expect(screen.getByText(p.name)).toBeInTheDocument();
});

test('opening and closing the reference panel keeps the onboarding step (Review Focus 1)', async () => {
  const user = await toOnboarding();
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  expectBeat(1);
  await user.click(screen.getByRole('button', { name: /Reference/ }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Close reference' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expectBeat(1);
});

test('focus moves to the h1 on every screen change (Review Focus 5)', async () => {
  const user = userEvent.setup();
  render(<App seed={1} />);
  expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }));
  await user.click(screen.getByRole('button', { name: /On my own/ }));
  expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }));
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1 }));
  for (let i = 2; i < lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
  expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1, name: 'Who are you?' }));
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});

test('mode select to persona select by keyboard alone', async () => {
  const user = userEvent.setup();
  render(<App seed={1} />);
  for (let i = 0; i < 20 && !screen.queryByRole('heading', { name: 'Who are you?' }); i++) {
    await user.tab();
    await user.keyboard('{Enter}');
  }
  expect(screen.getByRole('heading', { level: 1, name: 'Who are you?' })).toBeInTheDocument();
});

test('while the reference desk is open, the game behind it is inert', async () => {
  const user = await toOnboarding();
  await user.click(screen.getByRole('button', { name: /Reference/ }));
  expect(document.querySelector('main')).toHaveAttribute('inert');
  await user.keyboard('{Escape}');
  expect(document.querySelector('main')).not.toHaveAttribute('inert');
  expectBeat(0);
});

test('onboarding beat 2 sets the Clerk’s speech apart from the narration', async () => {
  const user = await toOnboarding();
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  const clerk = screen.getByText('Ah. New arrivals.').closest('figure');
  expect(clerk).not.toBeNull();
  expect(within(clerk!).getByText('The Clerk')).toBeInTheDocument();
  const narration = screen.getByText(/^Before you can pick an aisle/);
  expect(narration.closest('figure')).toBeNull();
  expect(clerk).not.toContainElement(narration);
});

test('no onboarding beat mentions a name tag', async () => {
  for (const beat of lines) for (const piece of beat) expect(piece.text).not.toMatch(/name tag/i);
  const user = await toOnboarding();
  for (let i = 0; i < lines.length; i++) {
    expect(screen.getByTestId('onboarding-line').textContent).not.toMatch(/name tag/i);
    if (i < lines.length - 1) await user.click(screen.getByRole('button', { name: /Continue/ }));
  }
});
