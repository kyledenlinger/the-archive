import { validateContent } from './validateContent';
import { makeValidContent } from './testFixtures';
import { PersonaId } from '../content/types';

test('valid content has no errors', () => {
  expect(validateContent(makeValidContent()).errors).toEqual([]);
});

test('flags missing persona setup', () => {
  const c = makeValidContent();
  delete (c.stops.free.setup as Partial<Record<PersonaId, string>>).bard;
  expect(validateContent(c).errors).toContain('stops.free.setup.bard: missing');
});

test('flags empty strings', () => {
  const c = makeValidContent();
  c.stops.layers.complication = '  ';
  expect(validateContent(c).errors).toContain('stops.layers.complication: empty');
});

test('flags missing fair use text', () => {
  const c = makeValidContent();
  delete (c.fairUse.factors[2].text.permission as Partial<Record<PersonaId, string>>).herald;
  expect(validateContent(c).errors).toContain('fairUse.factors[2].text.permission.herald: missing');
});

test('flags flip event cell', () => {
  const c = makeValidContent();
  delete (c.stops.flip.events.naturalist.beyond.situation as Partial<Record<string, string>>)['cc-by-nc'];
  expect(validateContent(c).errors).toContain('stops.flip.events.naturalist.beyond.situation.cc-by-nc: missing');
});

test('flags group-size wording', () => {
  const c = makeValidContent();
  c.stops.free.setup.chronicler = 'You two find a reel.';
  const errs = validateContent(c).errors;
  expect(errs.some((e) => e.startsWith('stops.free.setup.chronicler: assumes group size'))).toBe(true);
});

test('flags verdict words in cart notes', () => {
  const c = makeValidContent();
  c.stops.free.choices[0].outcome = { text: 'x', cartNote: 'Correct choice.' };
  const errs = validateContent(c).errors;
  expect(errs.some((e) => e.endsWith(': verdict word "correct"'))).toBe(true);
});

test('collects review items', () => {
  const c = makeValidContent();
  c.stops.permission.personaReviewBy = { bard: { date: '2027-01-01', note: 'check generator terms' } };
  expect(validateContent(c).reviewItems).toContainEqual({
    where: 'stops.permission.personaReviewBy.bard',
    date: '2027-01-01',
    note: 'check generator terms',
  });
});

test('mechanic choices need no outcome; others do', () => {
  const c = makeValidContent();
  expect(validateContent(c).errors).toEqual([]); // choice 'c' is fairUse with no outcome
  c.stops.free.choices.push({ id: 'd', label: 'x' });
  expect(validateContent(c).errors).toContain('stops.free.choices[3].outcome: outcome missing');
});
