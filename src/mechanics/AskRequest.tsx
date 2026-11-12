import { Dispatch } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Pause } from 'lucide-react';
import { AskField, Effects, GameContent, StandardStopId } from '../content/types';
import { askFollowUps } from '../content/ask';
import { DEFAULT_ODDS, dealAskResponse, isWellFormed } from '../lib/ask';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton, decidedProps } from '../components/ChoiceButton';
import { btnPrimary, choicePause, eyebrow } from '../components/styles';
import { Action, GameState, decisionKey, isReviewing, onward } from '../state';

const FIELDS: AskField[] = ['what', 'how', 'where', 'howLong'];
type FollowUp = 'use' | 'dont' | 'fairUse';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
  content: GameContent;
  stopId: StandardStopId;
  /** What sending costs, paid once (`APPLY_EFFECTS` key 'send'). Empty after a search, which already paid. */
  sendCost?: Effects;
  /** In a coached stop the factors were already answered, so the follow-up analysis opens on its summary. */
  coached?: boolean;
  /** Records the stop with a cart note and the effects of the reply (and, from Task 10, of the follow-up). */
  onRecord: (cartNote: string, effects: Effects) => void;
}

const SEND_COST: Effects = [{ meter: 'time', delta: -1 }];

/**
 * The Ask form (`askForm` page) and the reply (`askReply` page). Once sent, the request is final: revisited
 * with Back, the form shows what was sent, and the reply shows the follow-up chosen with the others locked.
 * The follow-up fair use analysis is the stop's `fairUse` page with `via: 'ask'`.
 */
export function AskRequest({ state, dispatch, content, stopId, sendCost = SEND_COST, coached = false, onRecord }: Props) {
  const ask = content.ask;
  const persona = state.persona!;
  const sent = state.asks[stopId];

  if (state.page.kind === 'askForm') {
    const draft = state.page.draft;
    return (
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (isReviewing(state)) return dispatch({ type: 'FORWARD' });
          if (sendCost.length) dispatch({ type: 'APPLY_EFFECTS', effects: sendCost, key: 'send' });
          const response = dealAskResponse(state.seed, persona, stopId, isWellFormed(draft), ask.odds?.[stopId]?.[persona] ?? DEFAULT_ODDS);
          dispatch(onward(state, { type: 'SEND_ASK', stopId, request: draft, response }));
        }}
      >
        <ScreenHeading level={2} focusKey="ask-form" className={eyebrow}>
          Ask for permission
        </ScreenHeading>
        <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{ask.intro}</p>
        {sent ? (
          <dl className="grid gap-6 sm:grid-cols-2" aria-label="The request you sent">
            {FIELDS.map((f) => (
              <div key={f} className="flex flex-col gap-2">
                <dt className="text-sm text-amber-200 font-bold uppercase tracking-widest">{ask.fieldOptions[f].label}</dt>
                <dd className="font-serif text-base text-amber-50">{sent.request[f] || '(left blank)'}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {FIELDS.map((f) => {
              const { label, options } = ask.fieldOptions[f];
              return (
                <label key={f} className="flex flex-col gap-2 text-sm text-amber-200 font-bold uppercase tracking-widest">
                  {label}
                  <select
                    value={draft[f] ?? ''}
                    onChange={(e) => dispatch({ type: 'SET_ASK_DRAFT', draft: { ...draft, [f]: e.target.value } })}
                    className="normal-case tracking-normal font-normal font-serif text-base text-amber-50 bg-stone-900 border border-amber-900/40 rounded-lg p-3"
                  >
                    <option value="">(leave blank)</option>
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>
        )}
        <div className="flex justify-end">
          <button type="submit" className={btnPrimary}>
            {sent ? (
              <>
                {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
              </>
            ) : (
              'Send the request'
            )}
          </button>
        </div>
      </form>
    );
  }

  if (!sent) return null;
  // revision-2: Task 10 adds a conditional yes's terms (accept / turn down) before these follow-ups.
  const answer = ask.responses[stopId]![persona][sent.response];
  const answerEffects = answer.effects ?? [];
  const made = state.decisions[decisionKey.askFollowUp(stopId)];
  const pause = state.mode === 'class';
  const pl = content.interstitial.pauseLabels;
  const follow = (f: FollowUp) => {
    if (isReviewing(state)) return dispatch({ type: 'FORWARD' });
    if (f === 'fairUse') {
      dispatch({ type: 'DECIDE', key: decisionKey.askFollowUp(stopId), value: f, page: { kind: 'fairUse', factor: coached ? 4 : 0, via: 'ask' } });
      return;
    }
    // The follow-up is kept so the reply can show it if revisited; recording moves on to the pause or debrief.
    dispatch({ type: 'DECIDE', key: decisionKey.askFollowUp(stopId), value: f });
    // revision-2: Task 10 adds each follow-up's own effects.
    onRecord(`${answer.cartNote} ${askFollowUps[f]}`, answerEffects);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <ScreenHeading level={2} focusKey="ask-response" className={eyebrow}>
        The reply
      </ScreenHeading>
      <p className="font-serif text-amber-50/90 text-lg leading-relaxed bg-stone-900/50 border border-amber-900/20 p-6 rounded-2xl">{answer.text}</p>
      <div role="group" aria-labelledby="after-ask" className="flex flex-col gap-4">
        <h3 id="after-ask" className="text-amber-200 text-sm uppercase tracking-widest font-bold">
          {ask.afterPrompt}
        </h3>
        {/* Class mode: these two record the stop and go straight to the pause card, so they look and read as pauses. */}
        {pause ? (
          <>
            <ChoiceButton className={choicePause} {...decidedProps(made, 'use')} onSelect={() => follow('use')}>
              <Pause size={20} aria-hidden="true" /> {pl.askUse}
            </ChoiceButton>
            <ChoiceButton className={choicePause} {...decidedProps(made, 'dont')} onSelect={() => follow('dont')}>
              <Pause size={20} aria-hidden="true" /> {pl.askDont}
            </ChoiceButton>
          </>
        ) : (
          <>
            <ChoiceButton {...decidedProps(made, 'use')} onSelect={() => follow('use')}>Use it</ChoiceButton>
            <ChoiceButton {...decidedProps(made, 'dont')} onSelect={() => follow('dont')}>Don’t use it</ChoiceButton>
          </>
        )}
        <ChoiceButton {...decidedProps(made, 'fairUse')} onSelect={() => follow('fairUse')}>Run a fair use analysis</ChoiceButton>
      </div>
    </motion.div>
  );
}
