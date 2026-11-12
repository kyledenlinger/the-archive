import { isWellFormed, dealAskResponse, rollSeed, rollSearch, rollTerms, DEFAULT_ODDS } from './ask';
import { AskOdds, AskResponse, Term, TermKind } from '../content/types';

test('isWellFormed needs 3 of 4 non-blank fields', () => {
  expect(isWellFormed({ what: 'a', how: 'b', where: 'c' })).toBe(true);
  expect(isWellFormed({ what: 'a', how: 'b' })).toBe(false);
  expect(isWellFormed({ what: 'a', how: 'b', where: '   ' })).toBe(false);
});

test('DEFAULT_ODDS match the spec defaults', () => {
  expect(DEFAULT_ODDS).toEqual({
    wellFormed: { yes: 35, conditional: 35, no: 15, silence: 15 },
    poor: { yes: 15, conditional: 25, no: 25, silence: 35 },
  });
});

const TERMS: Term[] = (['smallFee', 'largeFee', 'restriction', 'credit'] as TermKind[]).map((kind) => ({
  kind,
  text: kind,
  cartNote: kind,
  effects: [],
  weight: 1,
}));

test('every roll is deterministic for the same inputs', () => {
  for (let s = 1; s <= 20; s++) {
    expect(rollSeed(s, 'bard', 'free', 'search')).toBe(rollSeed(s, 'bard', 'free', 'search'));
    expect(dealAskResponse(s, 'bard', 'permission', true)).toBe(dealAskResponse(s, 'bard', 'permission', true));
    expect(rollSearch(s, 'bard', 'free', 0.5)).toBe(rollSearch(s, 'bard', 'free', 0.5));
    expect(rollTerms(s, 'bard', 'permission', TERMS)).toBe(rollTerms(s, 'bard', 'permission', TERMS));
  }
});

test('rollSeed is an unsigned 32-bit integer', () => {
  for (let s = 0; s <= 20; s++) {
    const r = rollSeed(s * 0x1234567, 'conjurer', 'layers', 'terms');
    expect(Number.isInteger(r)).toBe(true);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThan(2 ** 32);
  }
});

test('rollSearch finds at roughly the stated chance', () => {
  let found = 0;
  for (let s = 1; s <= 4000; s++) if (rollSearch(s, 'naturalist', 'free', 0.3)) found++;
  const rate = found / 4000;
  expect(rate).toBeGreaterThanOrEqual(0.27);
  expect(rate).toBeLessThanOrEqual(0.33);
});

test('rollSearch with 0 never finds, with 1 always finds', () => {
  for (let s = 1; s <= 500; s++) {
    expect(rollSearch(s, 'herald', 'free', 0)).toBe(false);
    expect(rollSearch(s, 'herald', 'free', 1)).toBe(true);
  }
});

test('rollTerms with equal weights deals every kind', () => {
  const seen = new Set<TermKind>();
  for (let s = 1; s <= 2000; s++) seen.add(rollTerms(s, 'chronicler', 'permission', TERMS).kind);
  expect(seen.size).toBe(4);
});

test('rollTerms respects weights', () => {
  const weighted = TERMS.map((t) => ({ ...t, weight: t.kind === 'credit' ? 1 : 0 }));
  for (let s = 1; s <= 200; s++) expect(rollTerms(s, 'chronicler', 'permission', weighted).kind).toBe('credit');
});

test('custom odds are honored', () => {
  const odds: AskOdds = {
    wellFormed: { yes: 100, conditional: 0, no: 0, silence: 0 },
    poor: { yes: 0, conditional: 0, no: 0, silence: 100 },
  };
  for (let s = 1; s <= 500; s++) {
    expect(dealAskResponse(s, 'artificer', 'permission', true, odds)).toBe('yes');
    expect(dealAskResponse(s, 'artificer', 'permission', false, odds)).toBe('silence');
  }
});

test('default odds shift but never guarantee', () => {
  const tally = (wf: boolean) => {
    const t: Record<AskResponse, number> = { yes: 0, conditional: 0, no: 0, silence: 0 };
    for (let s = 1; s <= 2000; s++) t[dealAskResponse(s, 'artificer', 'permission', wf)]++;
    return t;
  };
  const good = tally(true), poor = tally(false);
  for (const k of ['yes', 'conditional', 'no', 'silence'] as const) expect(good[k]).toBeGreaterThan(0);
  expect(good.yes + good.conditional).toBeGreaterThan(poor.yes + poor.conditional);
});

test('persona is mixed into the seed', () => {
  let differs = false;
  for (let s = 1; s <= 50; s++)
    if (dealAskResponse(s, 'bard', 'permission', true) !== dealAskResponse(s, 'herald', 'permission', true)) differs = true;
  expect(differs).toBe(true);
});

test('stop id is mixed into the seed', () => {
  let response = false, search = false, terms = false;
  for (let s = 1; s <= 50; s++) {
    if (dealAskResponse(s, 'bard', 'free', true) !== dealAskResponse(s, 'bard', 'permission', true)) response = true;
    if (rollSearch(s, 'bard', 'free', 0.5) !== rollSearch(s, 'bard', 'layers', 0.5)) search = true;
    if (rollTerms(s, 'bard', 'free', TERMS) !== rollTerms(s, 'bard', 'permission', TERMS)) terms = true;
  }
  expect(response && search && terms).toBe(true);
});
