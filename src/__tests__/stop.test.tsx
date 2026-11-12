import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { PersonaId } from '../content/types';
import { cartButton, startAs, enterStop } from './helpers';

const stop = content.stops.free;
const leaveLabel = stop.choices.find((c) => c.id === 'leave')!.label;
const fairUseLabel = stop.choices.find((c) => c.mechanic === 'fairUse')!.label;

test('stop 1 shows the Clerk intro, then the persona setup and complication', async () => {
  const user = await startAs('chronicler');
  expect(screen.getByText(stop.clerkIntro)).toBeInTheDocument();
  await enterStop(user);
  expect(screen.getByText(stop.setup.chronicler)).toBeInTheDocument();
  expect(screen.getByText(stop.complication)).toBeInTheDocument();
});

test('a plain choice shows its outcome and lands on the class-mode wait screen', async () => {
  const user = await startAs('chronicler', 'class');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: leaveLabel }));
  const outcome = stop.choices.find((c) => c.id === 'leave')!.outcome as Record<PersonaId, { text: string; cartNote: string }>;
  expect(screen.getByText(outcome.chronicler.text)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  expect(screen.getByRole('heading', { level: 1, name: content.interstitial.waitTitle })).toBeInTheDocument();
  expect(screen.queryByText(stop.debrief.lesson)).not.toBeInTheDocument();
  expect(cartButton(1)).toBeInTheDocument();
});

test('independent mode shows the debrief lesson and prompts', async () => {
  const user = await startAs('chronicler', 'independent');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: leaveLabel }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  expect(screen.getByText(stop.debrief.lesson)).toBeInTheDocument();
  for (const p of stop.debrief.prompts) expect(screen.getByText(p)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: content.interstitial.continueLabel }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
});

test('fair use walks four factors, then the assessment, then records a fair-use cart note', async () => {
  const user = await startAs('chronicler');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: fairUseLabel }));
  for (const f of content.fairUse.factors) {
    expect(screen.getByText(f.description)).toBeInTheDocument();
    expect(screen.getByText(f.text.free.chronicler)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /supports fair use/ }));
  }
  expect(screen.getByText(content.fairUse.assessments.free.chronicler.text)).toBeInTheDocument();
  expect(cartButton(0)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Add to cart on a fair use basis/ }));
  expect(cartButton(1)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: content.interstitial.waitTitle })).toBeInTheDocument();
});

test('going back from the fair use assessment returns to the choices with the cart unchanged', async () => {
  const user = await startAs('artificer');
  await enterStop(user);
  await user.click(screen.getByRole('button', { name: fairUseLabel }));
  for (let i = 0; i < 4; i++) await user.click(screen.getByRole('button', { name: /Not sure yet/ }));
  await user.click(screen.getByRole('button', { name: /Go back to the choices/ }));
  const choices = screen.getByRole('group', { name: /What do you do/ });
  expect(within(choices).getByRole('button', { name: leaveLabel })).toBeInTheDocument();
  expect(cartButton(0)).toBeInTheDocument();
});
