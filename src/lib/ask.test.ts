import { isWellFormed, dealAskResponse } from './ask';
import { AskResponse } from '../content/types';

test('isWellFormed needs 3 of 4 non-blank fields', () => {
  expect(isWellFormed({ what: 'a', how: 'b', where: 'c' })).toBe(true);
  expect(isWellFormed({ what: 'a', how: 'b' })).toBe(false);
  expect(isWellFormed({ what: 'a', how: 'b', where: '   ' })).toBe(false);
});

test('deal is deterministic (Review Focus 3)', () => {
  expect(dealAskResponse(7, 'bard', true)).toBe(dealAskResponse(7, 'bard', true));
});

test('weights shift but never guarantee', () => {
  const tally = (wf: boolean) => {
    const t: Record<AskResponse, number> = { yes: 0, conditional: 0, no: 0, silence: 0 };
    for (let s = 1; s <= 2000; s++) t[dealAskResponse(s, 'artificer', wf)]++;
    return t;
  };
  const good = tally(true), poor = tally(false);
  for (const k of ['yes', 'conditional', 'no', 'silence'] as const) expect(good[k]).toBeGreaterThan(0);
  expect(good.yes + good.conditional).toBeGreaterThan(poor.yes + poor.conditional);
});

test('persona is mixed into the seed', () => {
  let differs = false;
  for (let s = 1; s <= 50; s++) if (dealAskResponse(s, 'bard', true) !== dealAskResponse(s, 'herald', true)) differs = true;
  expect(differs).toBe(true);
});
