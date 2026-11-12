import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';
import { ui } from '../content/ui';
import { outcomeFor } from '../screens/Stop';
import { cartButton, enterStop, passStopWithFirstChoice, startAs, toChoices, toFlip } from './helpers';

const lines = content.onboarding.lines;
const backButton = () => screen.getByRole('button', { name: ui.header.back });
const h1 = () => screen.getByRole('heading', { level: 1 });
const meterList = () => screen.getByRole('list', { name: ui.metersLabel }).textContent;
const label = (stop: 'free' | 'layers', id: string) => content.stops[stop].choices.find((c) => c.id === id)!.label;
const choiceGroup = () => screen.getByRole('group', { name: /What do you do/ });

test('Back is hidden on mode select', () => {
  render(<App seed={1} />);
  expect(screen.queryByRole('button', { name: ui.header.back })).not.toBeInTheDocument();
});

test('Back sits left of Home, is aria-disabled on the first onboarding beat, and does nothing there', async () => {
  const user = userEvent.setup();
  render(<App seed={1} />);
  await user.click(screen.getByRole('button', { name: /In a class/ }));
  const back = backButton();
  const home = screen.getByRole('button', { name: ui.header.home });
  expect(back.compareDocumentPosition(home) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(back).toHaveAttribute('aria-disabled', 'true');
  expect(back).not.toHaveAttribute('disabled');
  await user.click(back);
  back.focus();
  await user.keyboard('{Enter}');
  await user.keyboard(' ');
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[0][0].text);
  expect(screen.queryByText(ui.modeQuestion)).not.toBeInTheDocument();
});

test('Back steps through onboarding beats and moves focus to the heading; Continue walks forward again', async () => {
  const user = userEvent.setup();
  render(<App seed={1} />);
  await user.click(screen.getByRole('button', { name: /In a class/ }));
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[2][0].text);
  expect(backButton()).not.toHaveAttribute('aria-disabled');
  await user.click(backButton());
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[1][0].text);
  expect(document.activeElement).toBe(h1());
  await user.click(backButton());
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[0][0].text);
  expect(backButton()).toHaveAttribute('aria-disabled', 'true');
  await user.click(screen.getByRole('button', { name: /Continue/ }));
  expect(screen.getByTestId('onboarding-line')).toHaveTextContent(lines[1][0].text);
});

test('Back to persona select shows your persona chosen and the others locked', async () => {
  const user = await startAs('bard');
  await user.click(backButton()); // stop 1 intro → brief
  expect(h1()).toHaveTextContent(ui.briefHeading);
  await user.click(backButton());
  expect(h1()).toHaveTextContent(ui.personaHeading);
  const herald = screen.getByRole('button', { name: /THE HERALD/ });
  expect(herald).toHaveAttribute('aria-disabled', 'true');
  expect(herald).toHaveAccessibleDescription(ui.lockReasons.decided);
  await user.click(herald);
  expect(h1()).toHaveTextContent(ui.personaHeading);
  const bard = screen.getByRole('button', { name: /THE BARD/ });
  expect(bard).not.toHaveAttribute('aria-disabled');
  await user.click(bard);
  expect(h1()).toHaveTextContent(ui.briefHeading);
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(h1()).toHaveTextContent('Stop 1 of 4');
  expect(backButton()).not.toHaveAttribute('aria-disabled');
});

test('Back walks a stop’s pages; a revisited choice page shows the choice made and locks the rest', async () => {
  const user = await startAs('herald');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: label('free', 'free') }));
  expect(screen.getByRole('button', { name: /Add to cart/ })).toBeInTheDocument();
  await user.click(backButton());
  expect(document.activeElement).toBe(h1());
  const free = within(choiceGroup()).getByRole('button', { name: label('free', 'free') });
  expect(free).not.toHaveAttribute('aria-disabled');
  expect(free).toHaveAccessibleDescription(ui.yourChoice);
  const rely = within(choiceGroup()).getByRole('button', { name: label('free', 'rely') });
  expect(rely).toHaveAttribute('aria-disabled', 'true');
  expect(rely).toHaveAccessibleDescription(ui.lockReasons.decided);
  await user.click(rely);
  expect(choiceGroup()).toBeInTheDocument();
  // Back again: the coached analysis's summary, read-only.
  await user.click(backButton());
  expect(screen.getByRole('heading', { name: /Fair use summary/ })).toBeInTheDocument();
  // Forward again, to the outcome, which still records.
  await user.click(screen.getByRole('button', { name: ui.coached.toDecision }));
  await user.click(within(choiceGroup()).getByRole('button', { name: label('free', 'free') }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  expect(cartButton(1)).toBeInTheDocument();
});

test('Back walks stop 1’s coached pages: invitation, complication, setup, intro', async () => {
  const user = await startAs('bard');
  await enterStop(user);
  expect(screen.getByText(content.stops.free.setup.bard)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: ui.coached.toComplication }));
  expect(screen.getByText(content.stops.free.complication)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: ui.coached.toInvite }));
  expect(screen.getByText(content.clerk.coachInvite)).toBeInTheDocument();
  await user.click(backButton());
  expect(screen.getByText(content.stops.free.complication)).toBeInTheDocument();
  await user.click(backButton());
  expect(screen.getByText(content.stops.free.setup.bard)).toBeInTheDocument();
  await user.click(backButton());
  expect(screen.getByText(content.stops.free.clerkIntro)).toBeInTheDocument();
});

test('no “Choose again” and no “Go back to this stop” anywhere', async () => {
  const user = await startAs('herald');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: label('free', 'free') }));
  expect(screen.queryByRole('button', { name: /Choose again/ })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  expect(screen.queryByRole('button', { name: /Go back to this stop/ })).not.toBeInTheDocument();
  expect(screen.queryByText(/choose again/i)).not.toBeInTheDocument();
});

test('Back through fair use shows each answer given, locked', async () => {
  const user = await startAs('artificer');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: ui.coached.toComplication }));
  await user.click(screen.getByRole('button', { name: ui.coached.toInvite }));
  await user.click(screen.getByRole('button', { name: ui.coached.startAnalysis }));
  expect(screen.queryByRole('button', { name: /Go back to the choices/ })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Not sure yet/ }));
  expect(screen.getByText(content.fairUse.factors[1].description)).toBeInTheDocument();
  await user.click(backButton());
  expect(screen.getByText(content.fairUse.factors[0].description)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Not sure yet/ })).toHaveAccessibleDescription(ui.yourChoice);
  expect(screen.getByRole('button', { name: /supports fair use/ })).toHaveAttribute('aria-disabled', 'true');
  await user.click(screen.getByRole('button', { name: /Not sure yet/ }));
  expect(screen.getByText(content.fairUse.factors[1].description)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /supports fair use/ })).not.toHaveAttribute('aria-disabled');
});

test('Back from stop 2’s intro returns to stop 1’s pause screen, then its outcome, read-only and with the cart kept', async () => {
  const user = await startAs('naturalist');
  await passStopWithFirstChoice(user);
  expect(h1()).toHaveTextContent('Stop 2 of 4');
  await user.click(backButton());
  expect(h1()).toHaveTextContent(content.interstitial.waitTitle);
  expect(document.activeElement).toBe(h1());
  await user.click(backButton());
  expect(h1()).toHaveTextContent('Stop 1 of 4');
  expect(cartButton(1)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Add to cart/ })).not.toBeInTheDocument();
  // Forward again: the outcome, then the pause screen (no second confirm), then stop 2.
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(h1()).toHaveTextContent(content.interstitial.waitTitle);
  await user.click(screen.getByRole('button', { name: content.interstitial.continueLabel }));
  expect(h1()).toHaveTextContent('Stop 2 of 4');
  expect(cartButton(1)).toBeInTheDocument();
});

test('Back across “Add to cart” keeps the header meters; meters change only on Add to cart', async () => {
  const user = await startAs('chronicler', 'independent');
  await passStopWithFirstChoice(user);
  await enterStop(user);
  const before = meterList();
  await user.click(screen.getByRole('button', { name: label('layers', 'clean') }));
  expect(meterList()).toBe(before);
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  const after = meterList();
  expect(after).not.toBe(before);
  const announced = screen.getByTestId('meter-live').textContent;
  await user.click(backButton());
  const clean = content.stops.layers.choices.find((c) => c.id === 'clean')!;
  expect(screen.getByText(outcomeFor(clean, 'chronicler').text)).toBeInTheDocument();
  expect(meterList()).toBe(after);
  expect(cartButton(2)).toBeInTheDocument();
  expect(screen.queryByTestId('change-lines')).not.toBeInTheDocument();
  expect(screen.getByTestId('meter-live').textContent).toBe(announced);
});

test('Back from the reuse events shows the license chosen and the others locked', async () => {
  const user = await toFlip('bard');
  const flip = content.stops.flip;
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses['cc-by'].label}` }));
  await user.click(screen.getByRole('button', { name: flip.responses.credit.label }));
  await user.click(backButton());
  expect(screen.getByRole('button', { name: `Choose ${flip.licenses.cc0.label}` })).toHaveAttribute('aria-disabled', 'true');
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses['cc-by'].label}` }));
  expect(screen.getByRole('button', { name: flip.responses.credit.label })).toHaveAccessibleDescription(ui.yourChoice);
});

test('Start over clears the history', async () => {
  const user = await startAs('bard');
  await user.click(screen.getByRole('button', { name: ui.header.home }));
  await user.click(screen.getByRole('button', { name: ui.confirmReset.confirm }));
  await user.click(screen.getByRole('button', { name: /On my own/ }));
  expect(backButton()).toHaveAttribute('aria-disabled', 'true');
});
