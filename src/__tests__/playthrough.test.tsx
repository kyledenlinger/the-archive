import { screen } from '@testing-library/react';
import { Mode, PERSONA_IDS, PersonaId } from '../content/types';
import { GROUP_SIZE_RE } from '../lib/validateContent';
import { content } from '../content';
import { projectUi } from '../content/ui';
import { cartButton, cartItemText, choiceCost, leaveInterstitial, passStopWith, startAs, throughFlip } from './helpers';

const cases: [PersonaId, Mode][] = PERSONA_IDS.flatMap((p) => (['class', 'independent'] as Mode[]).map((m): [PersonaId, Mode] => [p, m]));

test.each(cases)('%s in %s mode plays start to finish', async (persona, mode) => {
  // Record the page text on every DOM change, so every screen and sub-step gets checked.
  const seen: string[] = [];
  // Join text nodes with spaces: textContent glues adjacent elements ("Wait hereYou two") and hides word boundaries.
  const snap = () => {
    const parts: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) parts.push(walker.currentNode.nodeValue ?? '');
    seen.push(parts.join(' '));
  };
  const observer = new MutationObserver(snap);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  const user = await startAs(persona, mode);
  snap();
  for (let i = 0; i < 3; i++) {
    // The first unlocked choice, whatever the persona's meters have locked.
    await passStopWith(user, (unlocked) => unlocked[0]);
    snap();
  }
  await throughFlip(user, 'cc-by', 'credit');
  snap();
  if (mode === 'independent') await leaveInterstitial(user);
  // The shelf: the Clerk's intro, your shelf, one alternate future and back, the closing line.
  expect(screen.getByText(content.clerk.shelf.intro[0])).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  snap();
  await user.click(screen.getByRole('button', { name: /^See CC0/ }));
  snap();
  await user.click(screen.getByRole('button', { name: content.clerk.shelf.backToYours }));
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  snap();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  snap();

  expect(screen.getByRole('heading', { level: 1, name: projectUi.heading })).toBeInTheDocument();
  expect(cartButton(3)).toBeInTheDocument();
  expect(await cartItemText(user, 'flip')).not.toBe('');
  const notes = [...screen.getAllByTestId('project-item'), screen.getByTestId('project-work')];
  expect(notes).toHaveLength(4);
  for (const n of notes) expect((n.textContent ?? '').trim().length).toBeGreaterThan(0);
  observer.disconnect();
  expect(seen.length).toBeGreaterThan(30);
  for (const text of seen) expect(text).not.toMatch(GROUP_SIZE_RE);
}, 20000);

// Review Focus 2: spending as much Time and Budget as possible must never leave a stop with nothing to choose.
test.each(PERSONA_IDS)('%s taking the most expensive unlocked option at every step reaches the project summary', async (persona) => {
  const user = await startAs(persona, 'independent');
  for (let i = 0; i < 3; i++) {
    await passStopWith(user, (unlocked) => {
      const plain = unlocked.filter((c) => !c.mechanic);
      return plain.reduce((best, c) => (choiceCost(c, persona) > choiceCost(best, persona) ? c : best));
    });
  }
  // The flip's costliest response is the takedown (Time −1, nothing back).
  await throughFlip(user, 'cc-by', 'takedown');
  await leaveInterstitial(user);
  for (let i = 0; i < 2; i++) await user.click(screen.getByRole('button', { name: /^Continue/ }));
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  expect(screen.getByRole('heading', { level: 1, name: projectUi.heading })).toBeInTheDocument();
  for (const n of screen.getAllByTestId('project-item')) expect((n.textContent ?? '').trim().length).toBeGreaterThan(0);
}, 20000);
