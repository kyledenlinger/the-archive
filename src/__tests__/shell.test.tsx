import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';

const lines = content.onboarding.lines;

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
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[0]);
  for (let i = 1; i < lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
  for (const p of content.personas) expect(screen.getByText(p.name)).toBeInTheDocument();
});

test('opening and closing the reference panel keeps the onboarding step (Review Focus 1)', async () => {
  const user = await toOnboarding();
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[1]);
  await user.click(screen.getByRole('button', { name: /Reference/ }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Close reference' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[1]);
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
