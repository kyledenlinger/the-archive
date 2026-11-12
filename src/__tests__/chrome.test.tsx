import { useReducer, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { content } from '../content';
import { Meters } from '../content/types';
import { ui } from '../content/ui';
import { GameState, initialState, reducer, Action } from '../state';
import { ChoiceButton } from '../components/ChoiceButton';
import { Header, PanelId } from '../components/Header';
import { MeterDisplay } from '../components/MeterDisplay';
import { ReferencePanel } from '../components/ReferencePanel';
import { enterStop, passStopWithFirstChoice, startAs, throughFlip, toFlip } from './helpers';

const START: Meters = { time: 5, budget: 4, exposure: 1, vision: 5 };
const run = (s: GameState, ...actions: Action[]) => actions.reduce(reducer, s);
const atStop = (): GameState =>
  run(
    initialState(1),
    { type: 'SET_MODE', mode: 'class' },
    { type: 'FINISH_ONBOARDING' },
    { type: 'CHOOSE_PERSONA', persona: 'bard', startMeters: START },
    { type: 'FINISH_BRIEF' },
  );

/** Mirrors App's chrome: the real Header and Reference panel, plus a button that records stop 1 with two meter changes. */
function LiveHarness() {
  const [state, dispatch] = useReducer(reducer, undefined, atStop);
  const [open, setOpen] = useState<PanelId | null>(null);
  return (
    <>
      <Header state={state} content={content} openPanel={open} onOpen={setOpen} />
      <ReferencePanel entries={content.reference} resources={content.resources} open={open === 'reference'} onClose={() => setOpen(null)} />
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: 'RECORD_STOP',
            stopId: 'free',
            cartNote: 'n',
            effects: [
              { meter: 'time', delta: -3 },
              { meter: 'exposure', delta: 1, tag: 'legal' },
            ],
          })
        }
      >
        record
      </button>
    </>
  );
}

const liveLines = () => Array.from(screen.getByTestId('meter-live').querySelectorAll('p')).map((p) => p.textContent);

describe('header: Home', () => {
  test('Home on stop 2 opens a confirmation; Keep playing keeps the game; Start over goes back to mode select', async () => {
    const user = await startAs('bard');
    await passStopWithFirstChoice(user);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
    expect(screen.getByRole('button', { name: /1 of 3 found/ })).toBeInTheDocument();

    const home = screen.getByRole('button', { name: ui.header.home });
    await user.click(home);
    const dialog = screen.getByRole('alertdialog', { name: ui.confirmReset.question });
    await user.click(within(dialog).getByRole('button', { name: ui.confirmReset.cancel }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
    expect(screen.getByRole('button', { name: /1 of 3 found/ })).toBeInTheDocument();
    expect(document.activeElement).toBe(home);

    await user.click(home);
    await user.click(screen.getByRole('button', { name: ui.confirmReset.confirm }));
    expect(screen.getByText(ui.modeQuestion)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /of 3 found/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: ui.header.home })).not.toBeInTheDocument();
  });

  test('after starting over, a new game starts with an empty cart', async () => {
    const user = await startAs('bard');
    await passStopWithFirstChoice(user);
    await user.click(screen.getByRole('button', { name: ui.header.home }));
    await user.click(screen.getByRole('button', { name: ui.confirmReset.confirm }));
    await user.click(screen.getByRole('button', { name: /In a class/ }));
    for (let i = 1; i < content.onboarding.lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
    await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
    await user.click(screen.getByRole('button', { name: /THE HERALD/ }));
    expect(screen.getByRole('button', { name: /0 of 3 found/ })).toBeInTheDocument();
  });

  test('Home is hidden on mode select; Reference and About are not', () => {
    render(<App seed={1} />);
    expect(screen.queryByRole('button', { name: ui.header.home })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: ui.header.reference })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: ui.header.about })).toBeInTheDocument();
  });
});

describe('header: About', () => {
  test('About opens, holds its copy, closes with Escape, and returns focus to the About button', async () => {
    const user = userEvent.setup();
    render(<App seed={1} />);
    const about = screen.getByRole('button', { name: ui.header.about });
    await user.click(about);
    const dialog = screen.getByRole('dialog', { name: ui.about.heading });
    expect(within(dialog).getByText(ui.about.notAdvice)).toBeInTheDocument();
    expect(dialog).toHaveTextContent('ABOUT_LICENSE_TBD');
    expect(dialog).toHaveTextContent('Kyle Denlinger');
    expect(within(dialog).getByRole('link')).toHaveAttribute('href', 'https://github.com/kyledenlinger/the-archive');
    expect(document.querySelector('main')).toHaveAttribute('inert');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(about);
  });

  test('focus stays inside an open panel when tabbing', async () => {
    const user = userEvent.setup();
    render(<App seed={1} />);
    await user.click(screen.getByRole('button', { name: ui.header.about }));
    const dialog = screen.getByRole('dialog');
    for (let i = 0; i < 6; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    for (let i = 0; i < 6; i++) {
      await user.tab({ shift: true });
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });
});

describe('locked choices (Review Focus 3)', () => {
  test('click, Enter, and Space do nothing, and the reason is the description', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ChoiceButton onSelect={onSelect} lockedReason={ui.lockReasons.time}>
        Track down the owner
      </ChoiceButton>,
    );
    const button = screen.getByRole('button', { description: /out of time/ });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).not.toHaveAttribute('disabled');
    expect(screen.getByText(ui.lockReasons.time)).toBeVisible();
    await user.click(button);
    button.focus();
    expect(document.activeElement).toBe(button);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('an unlocked ChoiceButton still fires once', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ChoiceButton onSelect={onSelect}>Go</ChoiceButton>);
    await user.click(screen.getByRole('button', { name: 'Go' }));
    await user.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe('meters', () => {
  test('the header shows four meters with their state words', () => {
    render(<MeterDisplay meters={START} lastChanges={null} />);
    for (const [label, word] of [
      ['Time', 'Plenty'],
      ['Budget', 'Stretched'],
      ['Exposure', 'Low'],
      ['Vision', 'Intact'],
    ]) {
      expect(screen.getByText(`${label}: ${word}`)).toBeInTheDocument();
    }
  });

  test('glyphs fill by band (exposure counts risk)', () => {
    render(<MeterDisplay meters={{ time: 6, budget: 3, exposure: 0, vision: 0 }} lastChanges={null} />);
    expect(screen.getByTestId('meter-glyph-time')).toHaveTextContent('■■■');
    expect(screen.getByTestId('meter-glyph-budget')).toHaveTextContent('■■□');
    expect(screen.getByTestId('meter-glyph-exposure')).toHaveTextContent('■□□');
    expect(screen.getByTestId('meter-glyph-vision')).toHaveTextContent('■□□');
  });

  test('one RECORD_STOP that changes two meters announces exactly two lines, once (Review Focus 5)', async () => {
    const user = userEvent.setup();
    render(<LiveHarness />);
    const region = screen.getByTestId('meter-live');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(liveLines()).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'record' }));
    expect(liveLines()).toEqual([ui.meterChange('Time', 'Plenty', 'Tight'), ui.meterChange('Exposure', 'Low', 'Some')]);
    const node = region.querySelector('p')!.firstChild;

    await user.click(screen.getByRole('button', { name: ui.header.reference }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(liveLines()).toHaveLength(2);
    expect(region.querySelector('p')!.firstChild).toBe(node);
  });

  test('a same-band change is a nudge, with its exposure tag', () => {
    const before = { ...START, exposure: 2 };
    const { rerender } = render(<MeterDisplay meters={before} lastChanges={null} />);
    rerender(
      <MeterDisplay
        meters={{ ...before, exposure: 3 }}
        lastChanges={{ id: 1, changes: [{ meter: 'exposure', from: 'middle', to: 'middle', direction: 'up', tag: 'legal' }] }}
      />,
    );
    expect(liveLines()).toEqual(['Exposure rises (legal)']);
  });

  test('mounting with an old change does not announce it', () => {
    render(
      <MeterDisplay meters={START} lastChanges={{ id: 4, changes: [{ meter: 'time', from: 'best', to: 'middle', direction: 'down' }] }} />,
    );
    expect(liveLines()).toEqual([]);
  });
});

describe('Continue bar (Review Focus 4)', () => {
  const expectNarrative = () => {
    expect(document.querySelector('main .pb-28')).not.toBeNull();
    const bar = screen.getByTestId('continue-bar');
    expect(bar).toHaveClass('fixed', 'bottom-0', 'inset-x-0', 'h-20');
    return bar;
  };

  test('narrative screens put their primary Continue in a fixed bar and pad for it', async () => {
    const user = userEvent.setup();
    render(<App seed={1} />);
    await user.click(screen.getByRole('button', { name: /On my own/ }));
    expect(within(expectNarrative()).getByRole('button', { name: /Continue/ })).toBeInTheDocument(); // onboarding
    for (let i = 1; i < content.onboarding.lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
    expect(within(expectNarrative()).getByRole('button', { name: /Choose who you are/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
    await user.click(screen.getByRole('button', { name: /THE BARD/ }));
    expect(within(expectNarrative()).getByRole('button', { name: /^Continue/ })).toBeInTheDocument(); // brief
    await user.click(screen.getByRole('button', { name: /^Continue/ }));
    expect(within(expectNarrative()).getByRole('button', { name: /Look closer/ })).toBeInTheDocument(); // stop intro
    await enterStop(user);
    expect(screen.queryByTestId('continue-bar')).not.toBeInTheDocument(); // choices stay inline
    await user.click(screen.getByRole('button', { name: content.stops.free.choices.find((c) => !c.mechanic)!.label }));
    expect(within(expectNarrative()).getByRole('button', { name: /Add to cart/ })).toBeInTheDocument(); // outcome
    await user.click(screen.getByRole('button', { name: /Add to cart/ }));
    expect(within(expectNarrative()).getByRole('button', { name: content.interstitial.continueLabel })).toBeInTheDocument(); // debrief
  });

  test('the flip intro and the shelf use the bar too', async () => {
    const user = await toFlip('herald');
    expect(within(expectNarrative()).getByRole('button', { name: /Start with your work/ })).toBeInTheDocument();
    await throughFlip(user);
    expect(within(expectNarrative()).getByRole('button', { name: /^Continue/ })).toBeInTheDocument(); // shelf
  });
});

describe('cart panel', () => {
  test('before stop 1 it shows the brief and three items, none found yet', async () => {
    const user = await startAs('naturalist');
    const persona = content.personas.find((p) => p.id === 'naturalist')!;
    const cart = screen.getByRole('button', { name: /0 of 3 found/ });
    await user.click(cart);
    const panel = screen.getByRole('dialog', { name: ui.cartPanel.heading });
    expect(within(panel).getByText(persona.brief.making)).toBeInTheDocument();
    expect(within(panel).getByText(persona.brief.answersTo)).toBeInTheDocument();
    for (const item of persona.brief.items) expect(within(panel).getByText(item)).toBeInTheDocument();
    expect(within(panel).getAllByText(ui.cartPanel.notFound)).toHaveLength(3);
    expect(within(panel).queryByText(ui.cartPanel.yourWork)).not.toBeInTheDocument();
    expect(panel).toHaveTextContent(`${ui.meterLabels.time}: ${ui.meterWords.time.middle}`);
    await user.keyboard('{Escape}');
    expect(document.activeElement).toBe(cart);
  });

  test('after the flip it shows Your work with the chosen license', async () => {
    const user = await toFlip('bard');
    await throughFlip(user, 'cc-by-sa');
    await user.click(screen.getByRole('button', { name: /3 of 3 found/ }));
    const panel = screen.getByRole('dialog', { name: ui.cartPanel.heading });
    expect(within(panel).getByText(ui.cartPanel.yourWork)).toBeInTheDocument();
    expect(panel).toHaveTextContent(content.stops.flip.licenses['cc-by-sa'].label);
    expect(within(panel).queryByText(ui.cartPanel.notFound)).not.toBeInTheDocument();
  });
});

describe('the Clerk speaks in his own block', () => {
  const expectClerk = (text: string) => {
    const block = screen.getByText(text).closest('figure');
    expect(block).not.toBeNull();
    expect(within(block!).getByText('The Clerk')).toBeInTheDocument();
  };

  test('brief, stop intro, and fair use read', async () => {
    const user = userEvent.setup();
    render(<App seed={1} />);
    await user.click(screen.getByRole('button', { name: /In a class/ }));
    for (let i = 1; i < content.onboarding.lines.length; i++) await user.click(screen.getByRole('button', { name: /Continue/ }));
    await user.click(screen.getByRole('button', { name: /Choose who you are/ }));
    await user.click(screen.getByRole('button', { name: /THE CHRONICLER/ }));
    expectClerk(content.clerk.briefIntro);
    await user.click(screen.getByRole('button', { name: /^Continue/ }));
    expectClerk(content.stops.free.clerkIntro);
    await enterStop(user);
    await user.click(screen.getByRole('button', { name: content.stops.free.choices.find((c) => c.mechanic === 'fairUse')!.label }));
    for (let i = 0; i < 4; i++) await user.click(screen.getByRole('button', { name: /Not sure yet/ }));
    expectClerk(content.fairUse.assessments.free.chronicler.text);
  });

  test('flip intro, license glosses, and the shelf', async () => {
    const user = await toFlip('artificer');
    expectClerk(content.stops.flip.clerkIntro);
    await user.click(screen.getByRole('button', { name: /Start with your work/ }));
    for (const l of Object.values(content.stops.flip.licenses)) expectClerk(l.clerkGloss);
    await user.click(screen.getByRole('button', { name: `Choose ${content.stops.flip.licenses.cc0.label}` }));
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getByRole('button', { name: content.stops.flip.responses['let-go'].label }));
      await user.click(screen.getByRole('button', { name: /^Next/ }));
    }
    await user.click(screen.getByRole('button', { name: /^Continue/ }));
    expectClerk(content.clerk.shelf.closingLine);
  });
});
