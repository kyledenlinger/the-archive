import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';
import { Mode, PersonaId } from '../content/types';

export async function startAs(persona: PersonaId, mode: Mode = 'class') {
  const user = userEvent.setup();
  render(<App seed={1} />);
  await user.click(screen.getByRole('button', { name: mode === 'class' ? /In a class/ : /On my own/ }));
  for (let i = 1; i < content.onboarding.lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
  const name = content.personas.find((p) => p.id === persona)!.name;
  await user.click(screen.getByRole('button', { name: new RegExp(name) }));
  return user;
}

/** From a stop's Clerk intro, step into its setup and choices. */
export async function enterStop(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Look closer/ }));
}


/** Record a stop with its first plain choice and pass the class-mode wait screen. */
export async function passStopWithFirstChoice(user: ReturnType<typeof userEvent.setup>) {
  await enterStop(user);
  const stop = [content.stops.free, content.stops.layers, content.stops.permission].find((s) =>
    screen.queryByText(s.complication),
  )!;
  const first = stop.choices.find((c) => !c.mechanic)!;
  await user.click(screen.getByRole('button', { name: first.label }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  await user.click(screen.getByRole('button', { name: content.interstitial.continueLabel }));
}

/** Play from the start through stop 3 (first plain choice each time), landing on the flip. */
export async function toFlip(persona: PersonaId, mode: Mode = 'class') {
  const user = await startAs(persona, mode);
  for (let i = 0; i < 3; i++) await passStopWithFirstChoice(user);
  return user;
}
