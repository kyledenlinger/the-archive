import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';
import { METER_IDS, PERSONA_IDS, PersonaId } from '../content/types';
import { ui } from '../content/ui';
import { meterGlyph, meterWord } from '../components/MeterDisplay';

/** From a fresh game, through onboarding, to the brief for one persona. */
async function toBrief(persona: PersonaId) {
  const user = userEvent.setup();
  render(<App seed={1} />);
  await user.click(screen.getByRole('button', { name: /In a class/ }));
  for (let i = 1; i < content.onboarding.lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
  await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
  const name = content.personas.find((p) => p.id === persona)!.name;
  await user.click(screen.getByRole('button', { name: new RegExp(name) }));
  return user;
}

const section = (label: string) => screen.getByRole('region', { name: label });

describe('the brief', () => {
  test.each(PERSONA_IDS)('%s: shows the making, answers-to, deadline, three items, and starting meter words', async (id) => {
    await toBrief(id);
    const persona = content.personas.find((p) => p.id === id)!;
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(ui.briefHeading);
    expect(screen.getByText(content.clerk.briefIntro)).toBeInTheDocument();

    expect(section(ui.brief.making)).toHaveTextContent(persona.brief.making);
    expect(section(ui.brief.answersTo)).toHaveTextContent(persona.brief.answersTo);
    expect(section(ui.brief.deadline)).toHaveTextContent(persona.brief.deadline);

    const items = within(section(ui.brief.items)).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    items.forEach((li, i) => expect(li).toHaveTextContent(persona.brief.items[i]));

    const start = section(ui.brief.start);
    for (const m of METER_IDS) {
      const meter = within(start).getByTestId(`brief-meter-${m}`);
      expect(meter).toHaveTextContent(ui.meterLabels[m]);
      expect(meter).toHaveTextContent(meterWord(m, persona.startMeters[m]));
      expect(meter).toHaveTextContent(meterGlyph(m, persona.startMeters[m]));
    }
  });

  test('the header meters match the brief’s starting meters', async () => {
    await toBrief('chronicler');
    const persona = content.personas.find((p) => p.id === 'chronicler')!;
    const header = within(screen.getByRole('banner'));
    for (const m of METER_IDS) {
      const word = meterWord(m, persona.startMeters[m]);
      expect(header.getByText(`${ui.meterLabels[m]}: ${word}`)).toBeInTheDocument();
      expect(within(section(ui.brief.start)).getByTestId(`brief-meter-${m}`)).toHaveTextContent(word);
    }
    // Chronicler starts Tight on time, Stretched on budget (revision spec §4.5).
    expect(header.getByText('Time: Tight')).toBeInTheDocument();
    expect(header.getByText('Budget: Stretched')).toBeInTheDocument();
  });

  test('Continue goes to stop 1', async () => {
    const user = await toBrief('bard');
    const bar = screen.getByTestId('continue-bar');
    await user.click(within(bar).getByRole('button', { name: /^Continue/ }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 1 of 4');
  });
});
