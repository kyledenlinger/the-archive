import { resolveReuse, flipCartNote } from './flip';
import { makeValidContent } from './testFixtures';

test('resolveReuse returns the situation cell', () => {
  const flip = makeValidContent().stops.flip;
  flip.events.bard.outside.situation['cc-by-sa'] = 'the cell';
  expect(resolveReuse(flip, 'bard', 'outside', 'cc-by-sa')).toBe('the cell');
});

test('flipCartNote lists the license and the three notes in order', () => {
  const flip = makeValidContent().stops.flip;
  flip.licenses['cc-by'].label = 'CC BY';
  flip.responses.credit.cartNote = 'CREDIT.';
  flip.responses.takedown.cartNote = 'TAKEDOWN.';
  flip.responses.negotiate.cartNote = 'NEGOTIATE.';
  const note = flipCartNote(flip, 'cc-by', { within: 'credit', outside: 'takedown', beyond: 'negotiate' });
  expect(note).toContain('CC BY');
  expect(note.indexOf('CREDIT.')).toBeLessThan(note.indexOf('TAKEDOWN.'));
  expect(note.indexOf('TAKEDOWN.')).toBeLessThan(note.indexOf('NEGOTIATE.'));
});

test('flipCartNote labels each response with its event when labels are given', () => {
  const flip = makeValidContent().stops.flip;
  flip.licenses.cc0.label = 'CC0';
  flip.responses.negotiate.cartNote = 'Negotiated.';
  const note = flipCartNote(flip, 'cc0', { within: 'negotiate', outside: 'negotiate', beyond: 'negotiate' }, { within: 'W:', outside: 'O:', beyond: 'B:' });
  expect(note).toBe('CC0. W: Negotiated. O: Negotiated. B: Negotiated.');
});
