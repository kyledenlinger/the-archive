import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';
import { GameContent, LicenseId, Mode, PersonaId, ReuseResponse, StopId } from '../content/types';

export async function startAs(persona: PersonaId, mode: Mode = 'class', testContent: GameContent = content) {
  const user = userEvent.setup();
  render(<App seed={1} content={testContent} />);
  await user.click(screen.getByRole('button', { name: mode === 'class' ? /In a class/ : /On my own/ }));
  for (let i = 1; i < content.onboarding.lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
  const name = testContent.personas.find((p) => p.id === persona)!.name;
  await user.click(screen.getByRole('button', { name: new RegExp(name) }));
  // Pass the brief.
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  return user;
}

/** The header's Cart button, by its count (“2 of 3 found”). */
export const cartButton = (found?: number) => screen.getByRole('button', { name: found === undefined ? /of 3 found/ : new RegExp(`${found} of 3 found`) });

/** Open the Cart panel, read one item's text (empty if it isn't there), and close the panel again. */
export async function cartItemText(user: ReturnType<typeof userEvent.setup>, id: StopId): Promise<string> {
  await user.click(cartButton());
  const text = screen.queryByTestId(`cart-item-${id}`)?.textContent ?? '';
  await user.keyboard('{Escape}');
  return text;
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

/** Play the flip with one license and the same response for every event, ending on the shelf. */
export async function throughFlip(user: ReturnType<typeof userEvent.setup>, license: LicenseId = 'cc-by', response: ReuseResponse = 'credit') {
  const flip = content.stops.flip;
  await user.click(screen.getByRole('button', { name: /Start with your work/ }));
  await user.click(screen.getByRole('button', { name: `Choose ${flip.licenses[license].label}` }));
  for (let i = 0; i < 3; i++) {
    await user.click(screen.getByRole('button', { name: flip.responses[response].label }));
    await user.click(screen.getByRole('button', { name: /^Next/ }));
  }
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
}
