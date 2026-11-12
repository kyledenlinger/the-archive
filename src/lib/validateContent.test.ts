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
  const i = c.stops.free.choices.push({ id: 'z', label: 'x' }) - 1;
  expect(validateContent(c).errors).toContain(`stops.free.choices[${i}].outcome: outcome missing`);
});

// --- revision 2 ---

const hasEnding = (errs: string[], suffix: string) => errs.some((e) => e.endsWith(suffix));

test('a choice whose effects are all costs needs a gain', () => {
  const c = makeValidContent();
  c.stops.layers.choices[0].effects = [
    { meter: 'time', delta: -1 },
    { meter: 'budget', delta: -1 },
  ];
  expect(validateContent(c).errors).toContain('stops.layers.choices[0]: effects need at least one gain and one cost');
});

test('a choice whose effects come from the fair use strength skips the static gain-and-cost rule, and only it', () => {
  const c = makeValidContent();
  c.stops.free.choices[0] = { id: 'rely', label: 'x', outcome: { text: 'x', cartNote: 'x' }, effectsFrom: 'fairUse' };
  expect(validateContent(c).errors).toEqual([]);
  // Static effects alongside it are a mistake: the strength decides them.
  c.stops.free.choices[0].effects = [{ meter: 'vision', delta: 1 }];
  expect(validateContent(c).errors).toContain('stops.free.choices[0].effects: a choice with effectsFrom has no static effects');
  // Without the marker, a plain choice with no effects still fails the rule.
  c.stops.free.choices[0] = { id: 'rely', label: 'x', outcome: { text: 'x', cartNote: 'x' } };
  expect(validateContent(c).errors).toContain('stops.free.choices[0]: effects need at least one gain and one cost');
});

test('a choice that moves only one meter fails the gain-and-cost rule', () => {
  const c = makeValidContent();
  c.stops.layers.choices[0].effects = [
    { meter: 'vision', delta: 1 },
    { meter: 'vision', delta: -1 },
  ];
  expect(hasEnding(validateContent(c).errors, ': effects need at least one gain and one cost')).toBe(true);
});

test('a per-persona effect set is checked for each persona', () => {
  const c = makeValidContent();
  const per = Object.fromEntries(
    (['chronicler', 'herald', 'naturalist', 'artificer', 'bard', 'conjurer'] as PersonaId[]).map((p) => [
      p,
      [
        { meter: 'time' as const, delta: -1 },
        { meter: 'vision' as const, delta: 1 },
      ],
    ]),
  ) as Record<PersonaId, { meter: 'time' | 'vision'; delta: number }[]>;
  per.bard = [{ meter: 'time', delta: -1 }];
  c.stops.free.choices[0].effects = per;
  const errs = validateContent(c).errors;
  expect(errs).toContain('stops.free.choices[0].effects.bard: effects need at least one gain and one cost');
  expect(errs.filter((e) => e.includes('gain and one cost'))).toHaveLength(1);
});

test('an exposure increase needs a tag', () => {
  const c = makeValidContent();
  c.stops.free.choices[0].effects = [
    { meter: 'exposure', delta: 1 },
    { meter: 'vision', delta: 1 },
  ];
  expect(hasEnding(validateContent(c).errors, ': exposure increase needs a tag')).toBe(true);
  c.stops.free.choices[0].effects = [
    { meter: 'exposure', delta: 1, tag: 'legal' },
    { meter: 'vision', delta: 1 },
  ];
  expect(validateContent(c).errors).toEqual([]);
});

test('every stop needs a choice with no requires', () => {
  const c = makeValidContent();
  for (const ch of c.stops.free.choices) ch.requires = ['time'];
  expect(validateContent(c).errors).toContain('stops.free: needs at least one choice with no requires');
});

test('start meters must be within 0–6', () => {
  const c = makeValidContent();
  c.personas[0].startMeters.time = 7;
  expect(validateContent(c).errors).toContain('personas[0].startMeters.time: out of range 0–6');
});

test('effect deltas must be within -2..2', () => {
  const c = makeValidContent();
  c.stops.permission.choices[0].effects = [
    { meter: 'time', delta: 3 },
    { meter: 'exposure', delta: -1 },
  ];
  expect(hasEnding(validateContent(c).errors, ': delta out of range -2..2')).toBe(true);
});

test('a search choice needs a find chance for every persona', () => {
  const c = makeValidContent();
  delete c.stops.free.searchFindChance!.bard;
  expect(validateContent(c).errors).toContain('stops.free.searchFindChance.bard: missing');
});

test('a search choice needs a found line for every persona', () => {
  const c = makeValidContent();
  delete c.stops.free.searchFound!.herald;
  expect(validateContent(c).errors).toContain('stops.free.searchFound.herald: missing');
  delete c.stops.free.searchFound;
  expect(validateContent(c).errors).toContain('stops.free.searchFound: missing');
});

test('a stop with a search or ask choice needs its ask responses', () => {
  const c = makeValidContent();
  delete c.ask.responses.free;
  expect(validateContent(c).errors).toContain('ask.responses.free: missing');
});

test('every persona needs at least one term', () => {
  const c = makeValidContent();
  c.ask.terms.herald = [];
  expect(validateContent(c).errors).toContain('ask.terms.herald: needs at least one term');
});

test('the alternate-future frame must contain {license}', () => {
  const c = makeValidContent();
  c.clerk.shelf.altFrame = 'If you had chosen differently';
  expect(validateContent(c).errors).toContain('clerk.shelf.altFrame: must contain {license}');
});

test('fair use assessments need a valid strength', () => {
  const c = makeValidContent();
  (c.fairUse.assessments.free.bard as { strength: string }).strength = 'meh';
  expect(hasEnding(validateContent(c).errors, ': invalid strength')).toBe(true);
});

test('group-size and verdict checks cover the brief and the shelf', () => {
  const c = makeValidContent();
  c.personas[2].brief.making = 'A video you two make together.';
  c.clerk.shelf.scenes.bard.cc0 = 'Both of you watch it travel.';
  c.clerk.shelf.closingLine = 'You chose wrong.';
  c.personas[1].brief.items[1] = 'The correct cartoon.';
  const errs = validateContent(c).errors;
  expect(errs.some((e) => e.startsWith('personas[2].brief.making: assumes group size'))).toBe(true);
  expect(errs).toContain('clerk.shelf.closingLine: verdict word "wrong"');
  expect(errs).toContain('personas[1].brief.items[1]: verdict word "correct"');
  expect(errs.some((e) => e.startsWith('clerk.shelf.scenes.bard.cc0: assumes group size'))).toBe(true);
});

test('ABOUT_LICENSE_TBD is a warning, not an error', () => {
  const c = makeValidContent();
  c.reference[0].body = 'Licensed under ABOUT_LICENSE_TBD.';
  const r = validateContent(c);
  expect(r.errors).toEqual([]);
  expect(r.warnings).toContain('reference[0].body: contains ABOUT_LICENSE_TBD');
});

test('valid content has no warnings', () => {
  expect(validateContent(makeValidContent()).warnings).toEqual([]);
});

test('revision-2 placeholder text is an error (the CLI’s --allow-placeholder downgrades it)', () => {
  const c = makeValidContent();
  c.clerk.coachInvite = 'PLACEHOLDER (Task 9): coach invite';
  expect(validateContent(c).errors).toContain('clerk.coachInvite: placeholder text');
});

test('onboarding needs at least one beat', () => {
  const c = makeValidContent();
  c.onboarding.lines = [];
  expect(validateContent(c).errors).toContain('onboarding.lines: needs at least one beat');
});

test('an empty onboarding beat is an error', () => {
  const c = makeValidContent();
  c.onboarding.lines.push([]);
  expect(validateContent(c).errors).toContain('onboarding.lines[1]: needs at least one piece');
});

test('an onboarding piece needs a valid kind', () => {
  const c = makeValidContent();
  (c.onboarding.lines[0][1] as { kind: string }).kind = 'aside';
  expect(validateContent(c).errors).toContain('onboarding.lines[0][1].kind: invalid kind');
});

test('onboarding piece text is checked for emptiness, group size, and placeholders', () => {
  const c = makeValidContent();
  c.onboarding.lines[0][0].text = ' ';
  c.onboarding.lines[0][1].text = 'Both of you, come with me. PLACEHOLDER';
  const errs = validateContent(c).errors;
  expect(errs).toContain('onboarding.lines[0][0].text: empty');
  expect(errs.some((e) => e.startsWith('onboarding.lines[0][1].text: assumes group size'))).toBe(true);
  expect(errs).toContain('onboarding.lines[0][1].text: placeholder text');
});
