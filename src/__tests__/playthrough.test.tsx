import { screen } from '@testing-library/react';
import { Mode, PERSONA_IDS, PersonaId, STOP_ORDER } from '../content/types';
import { GROUP_SIZE_RE } from '../lib/validateContent';
import { guessAndReveal, passStopWithFirstChoice, startAs, throughFlip } from './helpers';

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
  await guessAndReveal(user); // revision-2: guess and reveal are stubs; the shelf replaces them in Task 12
  snap();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  snap();
  await user.click(screen.getByRole('button', { name: /^Continue/ }));
  snap();

  expect(screen.getByRole('heading', { level: 1, name: /Your cart/ })).toBeInTheDocument();
  for (const id of STOP_ORDER) expect(screen.getByTestId(`cart-slot-${id}`)).toHaveAttribute('data-filled', 'true');
  expect(screen.getAllByTestId('cart-review-note').every((n) => (n.textContent ?? '').trim().length > 0)).toBe(true);
  observer.disconnect();
  expect(seen.length).toBeGreaterThan(30);
  for (const text of seen) expect(text).not.toMatch(GROUP_SIZE_RE);
}, 20000);
