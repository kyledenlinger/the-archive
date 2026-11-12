import { screen, within } from '@testing-library/react';
import { content } from '../content';
import { btnPrimary } from '../components/styles';
import { cartButton, enterStop, passStopWithFirstChoice, seedWhereSearch, startAs, toChoices } from './helpers';

const copy = content.interstitial;
const plain = content.stops.free.choices.find((c) => !c.mechanic)!.label;
const searchLabel = content.stops.free.choices.find((c) => c.mechanic === 'search')!.label;

test('class mode: the outcome button reads “Add to cart and pause”, with a pause icon and its own style', async () => {
  const user = await startAs('bard', 'class');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: plain }));
  const button = screen.getByRole('button', { name: copy.pauseLabel });
  expect(button.querySelector('svg.lucide-pause')).not.toBeNull();
  expect(button.className).not.toBe(btnPrimary);
  expect(button).toHaveClass('border-dashed');
  expect(screen.queryByRole('button', { name: /^Add to cart$/ })).not.toBeInTheDocument();
});

test('class mode: the pause card says to stop, has no Continue bar, and keeps your choice and cart', async () => {
  const user = await startAs('bard', 'class');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: plain }));
  await user.click(screen.getByRole('button', { name: copy.pauseLabel }));
  expect(screen.getByRole('heading', { level: 1, name: copy.waitTitle })).toBeInTheDocument();
  expect(copy.waitTitle).toBe('Stop here');
  expect(screen.getByText(copy.waitLead)).toBeInTheDocument();
  expect(screen.getByTestId('pause-card').querySelector('svg.lucide-pause')).not.toBeNull();
  expect(screen.queryByTestId('continue-bar')).not.toBeInTheDocument();
  expect(screen.getByText('Your choice')).toBeInTheDocument();
  expect(cartButton(1)).toBeInTheDocument();
});

test('class mode: leaving the pause needs the facilitator confirm; Not yet stays put, Yes moves on', async () => {
  const user = await startAs('bard', 'class');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: plain }));
  await user.click(screen.getByRole('button', { name: copy.pauseLabel }));
  const go = within(screen.getByTestId('pause-card')).getByRole('button', { name: copy.continueLabel });
  await user.click(go);
  const dialog = screen.getByRole('alertdialog', { name: copy.confirmMoveOn.question });
  expect(copy.confirmMoveOn.question).toBe('Has your facilitator said it’s time to move on?');
  const notYet = within(dialog).getByRole('button', { name: copy.confirmMoveOn.cancel });
  expect(document.activeElement).toBe(notYet);
  await user.click(notYet);
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: copy.waitTitle })).toBeInTheDocument();
  await user.click(go);
  await user.keyboard('{Escape}');
  expect(screen.getByRole('heading', { level: 1, name: copy.waitTitle })).toBeInTheDocument();
  await user.click(go);
  await user.click(screen.getByRole('button', { name: copy.confirmMoveOn.confirm }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
});

test('independent mode has neither the pause button nor the confirm', async () => {
  const user = await startAs('bard', 'independent');
  await toChoices(user);
  await user.click(screen.getByRole('button', { name: plain }));
  expect(screen.queryByRole('button', { name: copy.pauseLabel })).not.toBeInTheDocument();
  const add = screen.getByRole('button', { name: /^Add to cart/ });
  expect(add.querySelector('svg.lucide-pause')).toBeNull();
  await user.click(add);
  expect(screen.queryByText(copy.waitLead)).not.toBeInTheDocument();
  expect(screen.getByTestId('continue-bar')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: copy.continueLabel }));
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop 2 of 4');
});

describe('every route into the class pause uses the pause button', () => {
  type User = Awaited<ReturnType<typeof startAs>>;
  const pauseStyled = (button: HTMLElement) => {
    expect(button.querySelector('svg.lucide-pause')).not.toBeNull();
    expect(button).toHaveClass('border-dashed');
  };
  /** From the start, to stop 3's Ask reply (passing stops 1 and 2 with their first plain choice). */
  async function toAskReply(mode: 'class' | 'independent') {
    const user = await startAs('artificer', mode);
    await passStopWithFirstChoice(user);
    await passStopWithFirstChoice(user);
    await enterStop(user);
    await user.click(screen.getByRole('button', { name: /Ask for permission/ }));
    await user.click(screen.getByRole('button', { name: /Send the request/ }));
    return user;
  }
  async function throughFairUse(user: User) {
    for (let i = 0; i < 4; i++) await user.click(screen.getByRole('button', { name: /Not sure yet/ }));
  }
  const expectPause = () => expect(screen.getByRole('heading', { level: 1, name: copy.waitTitle })).toBeInTheDocument();

  test('a plain choice’s outcome', async () => {
    const user = await startAs('herald', 'class');
    await toChoices(user);
    await user.click(screen.getByRole('button', { name: plain }));
    const button = screen.getByRole('button', { name: copy.pauseLabel });
    pauseStyled(button);
    await user.click(button);
    expectPause();
  });

  test.each(content.stops.free.choices.filter((c) => !c.mechanic).map((c) => [c.label]))('stop 1’s decision “%s”', async (label) => {
    const user = await startAs('herald', 'class');
    await toChoices(user);
    await user.click(screen.getByRole('button', { name: label }));
    const button = screen.getByRole('button', { name: copy.pauseLabel });
    pauseStyled(button);
    await user.click(button);
    expectPause();
  });

  test('the fair use summary (stop 2’s fair use choice)', async () => {
    const user = await startAs('herald', 'class');
    await passStopWithFirstChoice(user);
    await enterStop(user);
    await user.click(screen.getByRole('button', { name: content.stops.layers.choices.find((c) => c.mechanic === 'fairUse')!.label }));
    await throughFairUse(user);
    expect(screen.queryByRole('button', { name: /^Add to cart on a fair use basis$/ })).not.toBeInTheDocument();
    const button = screen.getByRole('button', { name: copy.pauseLabels.fairUse });
    pauseStyled(button);
    await user.click(button);
    expectPause();
  });

  /** Stop 1's search, with a seed that finds the owner, to the Ask reply. */
  async function toStop1AskReply(mode: 'class' | 'independent') {
    const user = await startAs('naturalist', mode, content, seedWhereSearch('naturalist', true));
    await toChoices(user);
    await user.click(screen.getByRole('button', { name: searchLabel }));
    await user.click(screen.getByRole('button', { name: /Send the request/ }));
    return user;
  }

  test.each([
    ['use it', copy.pauseLabels.askUse],
    ['don’t use it', copy.pauseLabels.askDont],
  ])('stop 1’s search, then the Ask follow-up “%s”', async (_, name) => {
    const user = await toStop1AskReply('class');
    expect(screen.queryByRole('button', { name: /^Use it$/ })).not.toBeInTheDocument();
    const button = screen.getByRole('button', { name });
    pauseStyled(button);
    expect(screen.getByRole('button', { name: /Run a fair use analysis/ }).querySelector('svg.lucide-pause')).toBeNull();
    await user.click(button);
    expectPause();
  });

  test('stop 1’s search, then the Ask’s fair use follow-up, which opens on the summary already answered', async () => {
    const user = await toStop1AskReply('class');
    await user.click(screen.getByRole('button', { name: /Run a fair use analysis/ }));
    expect(screen.getByRole('heading', { name: /Fair use summary/ })).toBeInTheDocument();
    const button = screen.getByRole('button', { name: copy.pauseLabels.fairUse });
    pauseStyled(button);
    await user.click(button);
    expectPause();
  });

  test.each([
    ['use it', copy.pauseLabels.askUse],
    ['don’t use it', copy.pauseLabels.askDont],
  ])('the Ask follow-up “%s”', async (_, name) => {
    const user = await toAskReply('class');
    expect(screen.queryByRole('button', { name: /^Use it$/ })).not.toBeInTheDocument();
    const button = screen.getByRole('button', { name });
    pauseStyled(button);
    // Running a fair use analysis doesn't pause yet, so it keeps its plain look.
    expect(screen.getByRole('button', { name: /Run a fair use analysis/ }).querySelector('svg.lucide-pause')).toBeNull();
    await user.click(button);
    expectPause();
  });

  test('the fair use summary reached from the Ask', async () => {
    const user = await toAskReply('class');
    await user.click(screen.getByRole('button', { name: /Run a fair use analysis/ }));
    await throughFairUse(user);
    const button = screen.getByRole('button', { name: copy.pauseLabels.fairUse });
    pauseStyled(button);
    await user.click(button);
    expectPause();
  });

  test('independent mode keeps the plain labels and no pause icons', async () => {
    const user = await toAskReply('independent');
    for (const name of [/^Use it$/, /^Don’t use it$/]) expect(screen.getByRole('button', { name }).querySelector('svg.lucide-pause')).toBeNull();
    await user.click(screen.getByRole('button', { name: /Run a fair use analysis/ }));
    await throughFairUse(user);
    const button = screen.getByRole('button', { name: /^Add to cart on a fair use basis$/ });
    expect(button.querySelector('svg.lucide-pause')).toBeNull();
    expect(document.querySelector('svg.lucide-pause')).toBeNull();
  });
});
