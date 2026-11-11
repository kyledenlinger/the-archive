import { screen } from '@testing-library/react';
import { content } from '../content';
import { PERSONA_IDS } from '../content/types';
import { validateContent } from '../lib/validateContent';
import { enterStop, passStopWithFirstChoice, startAs } from './helpers';

test.each(PERSONA_IDS)('stop 2 renders the %s setup', async (persona) => {
  const user = await startAs(persona);
  await passStopWithFirstChoice(user);
  expect(screen.getByText(content.stops.layers.clerkIntro)).toBeInTheDocument();
  await enterStop(user);
  expect(screen.getByText(content.stops.layers.setup[persona])).toBeInTheDocument();
});

test('the Bard recording year is flagged for yearly review', () => {
  const items = validateContent(content).reviewItems;
  expect(items).toContainEqual(expect.objectContaining({ where: 'stops.layers.personaReviewBy.bard', date: '2027-01-01' }));
});
