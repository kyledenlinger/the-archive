import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { content } from '../content';
import { AskField } from '../content/types';
import { dealAskResponse } from '../lib/ask';
import { enterStop, passStopWithFirstChoice, startAs } from './helpers';

type User = ReturnType<typeof userEvent.setup>;
const FIELDS: AskField[] = ['what', 'how', 'where', 'howLong'];

async function toAsk() {
  const user = await startAs('artificer');
  await passStopWithFirstChoice(user);
  await passStopWithFirstChoice(user);
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: /Ask for permission/ }));
  return user;
}

async function fill(user: User, count: number) {
  for (const f of FIELDS.slice(0, count)) {
    const { label, options } = content.ask.fieldOptions[f];
    await user.selectOptions(screen.getByLabelText(label), options[0]);
  }
  await user.click(screen.getByRole('button', { name: /Send the request/ }));
}

test('a well-formed request shows the dealt response', async () => {
  const user = await toAsk();
  await fill(user, 3);
  const r = dealAskResponse(1, 'artificer', true);
  expect(screen.getByText(content.ask.responses.artificer[r].text)).toBeInTheDocument();
  expect(screen.getByText(content.ask.afterPrompt)).toBeInTheDocument();
});

test('backing out and asking again gives the same answer (Review Focus 3)', async () => {
  const user = await toAsk();
  await fill(user, 3);
  const first = content.ask.responses.artificer[dealAskResponse(1, 'artificer', true)].text;
  expect(screen.getByText(first)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Back to the choices/ }));
  await user.click(screen.getByRole('button', { name: /Ask for permission/ }));
  await fill(user, 3);
  expect(screen.getByText(first)).toBeInTheDocument();
});

test('a one-field request still sends, using the poor weights', async () => {
  const user = await toAsk();
  await fill(user, 1);
  const r = dealAskResponse(1, 'artificer', false);
  expect(screen.getByText(content.ask.responses.artificer[r].text)).toBeInTheDocument();
});

test('following up fills cart slot 3 with the response cart note', async () => {
  const user = await toAsk();
  await fill(user, 4);
  const note = content.ask.responses.artificer[dealAskResponse(1, 'artificer', true)].cartNote;
  await user.click(screen.getByRole('button', { name: /^Don’t use it/ }));
  expect(screen.getByTestId('cart-slot-permission')).toHaveAttribute('data-filled', 'true');
  expect(screen.getByRole('heading', { level: 1, name: content.interstitial.waitTitle })).toBeInTheDocument();
  // the cart note is shown on the cart review later; check state through the slot's title attribute
  expect(screen.getByTestId('cart-slot-permission').getAttribute('title')).toContain(note);
});
