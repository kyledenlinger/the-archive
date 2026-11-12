import { screen } from '@testing-library/react';
import { Mode, PERSONA_IDS, PersonaId } from '../content/types';
import { GROUP_SIZE_RE } from '../lib/validateContent';
import { content } from '../content';
import { projectUi } from '../content/ui';
import { cartButton, cartItemText, leaveInterstitial, passStopWithFirstChoice, startAs, throughFlip } from './helpers';

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
    await passStopWithFirstChoice(user);
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
