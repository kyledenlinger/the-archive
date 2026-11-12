import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';
import { ui } from '../content/ui';
import { DEFAULT_ODDS, dealAskResponse, rollSearch, rollTerms } from '../lib/ask';
import { AskResponse, GameContent, LicenseId, Mode, PersonaId, ReuseResponse, StandardStopId, StopId, Term } from '../content/types';

export async function startAs(persona: PersonaId, mode: Mode = 'class', testContent: GameContent = content, seed = 1) {
  const user = userEvent.setup();
  render(<App seed={seed} content={testContent} />);
  await user.click(screen.getByRole('button', { name: mode === 'class' ? /In a class/ : /On my own/ }));
  for (let i = 1; i < content.onboarding.lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
  const name = testContent.personas.find((p) => p.id === persona)!.name;
  await user.click(screen.getByRole('button', { name: new RegExp(name) }));
  // Pass the brief.
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  return user;
}

/** The first session seed whose stop 1 search for `persona` finds the owner (`found`) or doesn't. */
export function seedWhereSearch(persona: PersonaId, found: boolean, testContent: GameContent = content): number {
  const chance = testContent.stops.free.searchFindChance![persona]!;
  for (let seed = 1; seed < 10000; seed++) if (rollSearch(seed, persona, 'free', chance) === found) return seed;
  throw new Error(`no seed where the search ${found ? 'finds' : 'misses'}`);
}

/**
 * The first session seed where an Ask at `stopId` (well formed or not) gets a response, and for a conditional
 * yes the drawn terms, that `want` accepts. At stop 1 the search must also find the owner first.
 */
export function seedWhereAsk(
  persona: PersonaId,
  stopId: StandardStopId,
  want: (response: AskResponse, term?: Term) => boolean,
  { wellFormed = false, testContent = content }: { wellFormed?: boolean; testContent?: GameContent } = {},
): number {
  const odds = testContent.ask.odds?.[stopId]?.[persona] ?? DEFAULT_ODDS;
  const terms = testContent.ask.terms[stopId]?.[persona] ?? [];
  for (let seed = 1; seed < 10000; seed++) {
    if (stopId === 'free' && !rollSearch(seed, persona, 'free', testContent.stops.free.searchFindChance![persona]!)) continue;
    const r = dealAskResponse(seed, persona, stopId, wellFormed, odds);
    if (want(r, r === 'conditional' ? rollTerms(seed, persona, stopId, terms) : undefined)) return seed;
  }
  throw new Error('no seed with that response');
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

/**
 * Stop 1 is coached: from its setup page (after “Look closer”), step through the complication and the Clerk's
 * invitation, answer every factor with `lean`, and leave the summary for the decision choices.
 */
export async function throughCoaching(user: ReturnType<typeof userEvent.setup>, lean: RegExp = /Not sure yet/) {
  await user.click(screen.getByRole('button', { name: ui.coached.toComplication }));
  await user.click(screen.getByRole('button', { name: ui.coached.toInvite }));
  await user.click(screen.getByRole('button', { name: ui.coached.startAnalysis }));
  for (let i = 0; i < 4; i++) await user.click(screen.getByRole('button', { name: lean }));
  await user.click(screen.getByRole('button', { name: ui.coached.toDecision }));
}

/** From a stop's Clerk intro to its choices, through the coached analysis in stop 1. */
export async function toChoices(user: ReturnType<typeof userEvent.setup>) {
  await enterStop(user);
  if (!screen.queryByRole('group', { name: /What do you do/ })) await throughCoaching(user);
}

/**
 * Leave the between-stops screen: the debrief's Continue in independent mode, or, in class mode, the pause
 * card's Continue and then “Yes, continue” in the facilitator confirm.
 */
export async function leaveInterstitial(user: ReturnType<typeof userEvent.setup>) {
  const copy = content.interstitial;
  await user.click(screen.getByRole('button', { name: copy.continueLabel }));
  const dialog = screen.queryByRole('alertdialog', { name: copy.confirmMoveOn.question });
  if (dialog) await user.click(within(dialog).getByRole('button', { name: copy.confirmMoveOn.confirm }));
}

/** Record a stop with its first plain choice and pass the wait screen (class) or debrief (independent). */
export async function passStopWithFirstChoice(user: ReturnType<typeof userEvent.setup>) {
  await toChoices(user);
  const stop = [content.stops.free, content.stops.layers, content.stops.permission].find((s) =>
    s.choices.every((c) => screen.queryByRole('button', { name: c.label })),
  )!;
  const first = stop.choices.find((c) => !c.mechanic)!;
  await user.click(screen.getByRole('button', { name: first.label }));
  await user.click(screen.getByRole('button', { name: /Add to cart/ }));
  await leaveInterstitial(user);
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
