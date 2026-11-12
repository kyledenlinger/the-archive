import { Dispatch } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Pause } from 'lucide-react';
import { AskField, AskFollowUpId, Effects, GameContent, StandardStopId } from '../content/types';
import { ui } from '../content/ui';
import { DEFAULT_ODDS, dealAskResponse, isWellFormed, rollTerms } from '../lib/ask';
import { band } from '../lib/meters';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton, decidedProps } from '../components/ChoiceButton';
import { btnPrimary, choicePause, eyebrow } from '../components/styles';
import { Action, GameState, decisionKey, isReviewing, onward } from '../state';

const FIELDS: AskField[] = ['what', 'how', 'where', 'howLong'];
type FollowUp = AskFollowUpId;

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
  content: GameContent;
  stopId: StandardStopId;
  /** After a search that found the owner: who you found, and how. Shown above the form. */
  found?: string;
  /** What sending costs, paid once (`APPLY_EFFECTS` key 'send'). Empty after a search, which already paid. */
  sendCost?: Effects;
  /** In a coached stop the factors were already answered, so the follow-up analysis opens on its summary. */
  coached?: boolean;
  /** Records the stop with a cart note and the effects of the reply plus the accepted terms or the follow-up. */
  onRecord: (cartNote: string, effects: Effects) => void;
}

const SEND_COST: Effects = [{ meter: 'time', delta: -1 }];

/**
 * The Ask form (`askForm` page) and the reply (`askReply` page). Once sent, the request is final: revisited
 * with Back, the form shows what was sent, and the reply shows the follow-up chosen with the others locked.
 * A conditional yes shows its drawn terms on the reply, to accept (recording the stop) or turn down, which
 * leads to the follow-ups on the `askDeclined` page. The follow-up fair use analysis is the stop's `fairUse`
 * page with `via: 'ask'`.
 */
export function AskRequest({ state, dispatch, content, stopId, found, sendCost = SEND_COST, coached = false, onRecord }: Props) {
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
        {found && <p className="font-serif text-amber-50/90 text-lg leading-relaxed" data-testid="search-found">{found}</p>}
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
  const { answer, term, declined, note, effects } = askBasis(state, content, stopId);
  const pause = state.mode === 'class';
  const pl = content.interstitial.pauseLabels;
  const fu = ask.followUps;

  const reply = (
    <>
      <ScreenHeading level={2} focusKey={state.page.kind === 'askDeclined' ? 'ask-declined' : 'ask-response'} className={eyebrow}>
        The reply
      </ScreenHeading>
      <div className="font-serif text-amber-50/90 text-lg leading-relaxed bg-stone-900/50 border border-amber-900/20 p-6 rounded-2xl space-y-4">
        <p>{answer.text}</p>
        {term && <p data-testid="ask-terms">{term.text}</p>}
      </div>
    </>
  );

  // A conditional yes: accept the drawn terms (which records the stop) or turn them down (on to the follow-ups).
  if (term && state.page.kind === 'askReply') {
    const made = state.decisions[decisionKey.askTerms(stopId)];
    const fee = term.effects.some((e) => e.meter === 'budget' && e.delta < 0);
    const broke = fee && band('budget', state.meters.budget) === 'worst' ? ui.lockReasons.budget : undefined;
    const accept = () => {
      if (isReviewing(state)) return dispatch({ type: 'FORWARD' });
      dispatch({ type: 'DECIDE', key: decisionKey.askTerms(stopId), value: 'accept' });
      onRecord(`${answer.cartNote} ${term.cartNote}`, [...(answer.effects ?? []), ...term.effects, { meter: 'exposure', delta: -1 }]);
    };
    const decline = () =>
      dispatch(onward(state, { type: 'DECIDE', key: decisionKey.askTerms(stopId), value: 'decline', page: { kind: 'askDeclined' } }));
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {reply}
        <div role="group" aria-labelledby="ask-terms-label" className="flex flex-col gap-4">
          <h3 id="ask-terms-label" className="text-amber-200 text-sm uppercase tracking-widest font-bold">
            {ask.afterPrompt}
          </h3>
          {/* Class mode: accepting records the stop and goes straight to the pause card, so it looks and reads as a pause. */}
          {pause ? (
            <ChoiceButton className={choicePause} {...decidedProps(made, 'accept', broke)} onSelect={accept}>
              <Pause size={20} aria-hidden="true" /> {pl.askAccept}
            </ChoiceButton>
          ) : (
            <ChoiceButton {...decidedProps(made, 'accept', broke)} onSelect={accept}>
              {ask.acceptLabel}
            </ChoiceButton>
          )}
          <ChoiceButton {...decidedProps(made, 'decline')} onSelect={decline}>
            {ask.declineLabel}
          </ChoiceButton>
        </div>
      </motion.div>
    );
  }

  // The follow-ups: after a yes, “Use it”; after a no, silence, or terms turned down, “Use it anyway”.
  const useId: FollowUp = sent.response === 'yes' ? 'use' : 'useAnyway';
  const made = state.decisions[decisionKey.askFollowUp(stopId)];
  const follow = (f: FollowUp) => {
    if (isReviewing(state)) return dispatch({ type: 'FORWARD' });
    if (f === 'fairUse') {
      dispatch({ type: 'DECIDE', key: decisionKey.askFollowUp(stopId), value: f, page: { kind: 'fairUse', factor: coached ? 4 : 0, via: 'ask' } });
      return;
    }
    // The follow-up is kept so the reply can show it if revisited; recording moves on to the pause or debrief.
    dispatch({ type: 'DECIDE', key: decisionKey.askFollowUp(stopId), value: f });
    onRecord(`${note} ${fu[f].note}`, [...effects, ...fu[f].effects]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {reply}
      {declined && <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{ask.declineNote}</p>}
      <div role="group" aria-labelledby="after-ask" className="flex flex-col gap-4">
        <h3 id="after-ask" className="text-amber-200 text-sm uppercase tracking-widest font-bold">
          {ask.afterPrompt}
        </h3>
        {/* Class mode: these two record the stop and go straight to the pause card, so they look and read as pauses. */}
        {pause ? (
          <>
            <ChoiceButton className={choicePause} {...decidedProps(made, useId)} onSelect={() => follow(useId)}>
              <Pause size={20} aria-hidden="true" /> {useId === 'use' ? pl.askUse : pl.askUseAnyway}
            </ChoiceButton>
            <ChoiceButton className={choicePause} {...decidedProps(made, 'dont')} onSelect={() => follow('dont')}>
              <Pause size={20} aria-hidden="true" /> {pl.askDont}
            </ChoiceButton>
          </>
        ) : (
          <>
            <ChoiceButton {...decidedProps(made, useId)} onSelect={() => follow(useId)}>
              {fu[useId].label}
            </ChoiceButton>
            <ChoiceButton {...decidedProps(made, 'dont')} onSelect={() => follow('dont')}>
              {fu.dont.label}
            </ChoiceButton>
          </>
        )}
        <ChoiceButton {...decidedProps(made, 'fairUse')} onSelect={() => follow('fairUse')}>
          {fu.fairUse.label}
        </ChoiceButton>
      </div>
    </motion.div>
  );
}

/**
 * What a sent request comes to before any follow-up: the response, its drawn terms (a conditional yes only;
 * seeded, so the same every time), whether they were turned down, and the cart note and effects so far.
 */
export function askBasis(state: GameState, content: GameContent, stopId: StandardStopId) {
  const sent = state.asks[stopId]!;
  const persona = state.persona!;
  const answer = content.ask.responses[stopId]![persona][sent.response];
  const terms = content.ask.terms[stopId]?.[persona];
  const term = sent.response === 'conditional' && terms?.length ? rollTerms(state.seed, persona, stopId, terms) : undefined;
  const declined = Boolean(term) && state.decisions[decisionKey.askTerms(stopId)] === 'decline';
  const note = declined ? `${answer.cartNote} ${content.ask.declineNote}` : answer.cartNote;
  return { answer, term, declined, note, effects: answer.effects ?? [] };
}
