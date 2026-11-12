import { motion } from 'motion/react';
import { ChevronRight, FileText, Pause } from 'lucide-react';
import { Choice, Effects, Outcome, PersonaId, STOP_ORDER, StandardStop, StandardStopId } from '../content/types';
import { ScreenHeading } from '../components/ScreenHeading';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ChoiceButton, decidedProps } from '../components/ChoiceButton';
import { ContinueBar } from '../components/ContinueBar';
import { ChangeLines } from '../components/MeterDisplay';
import { ui } from '../content/ui';
import { askFollowUps } from '../content/ask';
import { FAIR_USE_TIME_COST, effectsFor, lockReason, previewChanges } from '../lib/meters';
import { btnPause, btnPrimary, caseNote, eyebrow, narrativePage, page as pageClass } from '../components/styles';
import { FairUseAnalysis } from '../mechanics/FairUseAnalysis';
import { AskRequest } from '../mechanics/AskRequest';
import { Lean, Page, decisionKey, isReviewing, onward } from '../state';
import { ScreenProps } from './types';

export function outcomeFor(choice: Choice, persona: PersonaId): Outcome {
  const o = choice.outcome!;
  return 'cartNote' in o ? (o as Outcome) : (o as Record<PersonaId, Outcome>)[persona];
}

const FACTORS = [0, 1, 2, 3];

/**
 * One standard stop. Which page shows (intro, choices, outcome, fair use, Ask) is `state.page`, so Back can
 * return to any of them. Choices are final: picking one is recorded as a decision, and a page revisited with
 * Back shows what was chosen, with every other option locked. Forward buttons there only move forward.
 */
export function Stop(props: ScreenProps) {
  const { state, dispatch, content } = props;
  const stopId = STOP_ORDER[state.stopIndex] as StandardStopId;
  const stop: StandardStop = content.stops[stopId];
  const persona = state.persona!;
  const page = state.page;
  const reviewing = isReviewing(state);
  const pause = state.mode === 'class';
  const made = state.decisions[decisionKey.choice(stopId)];

  // Effects are applied only on “Add to cart”; outcome screens preview them.
  const record = (cartNote: string, effects: Effects = []) => dispatch(onward(state, { type: 'RECORD_STOP', stopId, cartNote, effects }));
  const choose = (choice: Choice, next: Page) =>
    dispatch(onward(state, { type: 'DECIDE', key: decisionKey.choice(stopId), value: choice.id, page: next }));

  const pick = (choice: Choice) => {
    if (choice.mechanic === 'fairUse') {
      // The time spent on the analysis is sunk once per stop; the reducer ignores it while reviewing.
      dispatch({ type: 'APPLY_EFFECTS', effects: FAIR_USE_TIME_COST, key: 'fairUse' });
      choose(choice, { kind: 'fairUse', factor: 0 });
    } else if (choice.mechanic === 'ask') choose(choice, { kind: 'askForm', draft: {} });
    else choose(choice, { kind: 'outcome', choiceId: choice.id });
  };

  const narrative = page.kind === 'intro' || page.kind === 'outcome';

  return (
    <div className={narrative ? narrativePage : pageClass}>
      <ScreenHeading focusKey={page.kind} className="mb-10">
        <span className={`block ${eyebrow} mb-3`}>Stop {state.stopIndex + 1} of 4</span>
        <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{stop.title}</span>
      </ScreenHeading>

      {page.kind === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <ClerkSpeech text={stop.clerkIntro} />
          <ContinueBar>
            <button type="button" className={btnPrimary} onClick={() => dispatch(onward(state, { type: 'GO_TO', page: { kind: 'choices' } }))}>
              Look closer <ChevronRight aria-hidden="true" />
            </button>
          </ContinueBar>
        </motion.div>
      )}

      {page.kind === 'choices' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 font-serif text-amber-50/90 text-lg leading-relaxed">
          <p>{stop.setup[persona]}</p>
          <div className="h-px bg-amber-900/30" aria-hidden="true" />
          <p>{stop.complication}</p>
          <div role="group" aria-labelledby="choices-label" className="flex flex-col gap-4">
            <h2 id="choices-label" className="text-amber-200 text-sm uppercase tracking-widest font-bold font-sans">
              What do you do?
            </h2>
            {stop.choices.map((c) => {
              const lock = lockReason(c, state.meters);
              return (
                <ChoiceButton key={c.id} onSelect={() => pick(c)} {...decidedProps(made, c.id, lock ? ui.lockReasons[lock] : undefined)}>
                  {c.label}
                </ChoiceButton>
              );
            })}
          </div>
        </motion.div>
      )}

      {page.kind === 'outcome' && <OutcomePage {...props} choiceId={page.choiceId} record={record} pause={pause} reviewing={reviewing} />}

      {page.kind === 'fairUse' && (
        <FairUseAnalysis
          stopId={stopId}
          persona={persona}
          content={content}
          factor={page.factor}
          answers={FACTORS.map((i) => state.decisions[decisionKey.factor(stopId, i)] as Lean | undefined)}
          reviewing={reviewing}
          meters={page.via === 'ask' || reviewing ? undefined : state.meters}
          onAnswer={(lean) =>
            dispatch(
              onward(state, {
                type: 'DECIDE',
                key: decisionKey.factor(stopId, page.factor),
                value: lean,
                page: { kind: 'fairUse', factor: page.factor + 1, via: page.via },
              }),
            )
          }
          onDone={(note, effects) => {
            const ask = state.asks[stopId];
            if (page.via === 'ask' && ask) {
              const answer = content.ask.responses.permission![persona][ask.response]; // revision-2: Task 9/10 make this stop-aware
              record(`${answer.cartNote} ${askFollowUps.fairUse} ${note}`);
            } else record(note, effects);
          }}
        />
      )}

      {(page.kind === 'askForm' || page.kind === 'askReply') && (
        <AskRequest state={state} dispatch={dispatch} content={content} stopId={stopId} onRecord={(note) => record(note)} />
      )}
    </div>
  );
}

/** A plain choice's outcome. At the frontier it previews the meter changes and records on its primary button. */
function OutcomePage({
  state,
  content,
  choiceId,
  record,
  pause,
  reviewing,
}: ScreenProps & { choiceId: string; record: (note: string, effects: Effects) => void; pause: boolean; reviewing: boolean }) {
  const stop = content.stops[STOP_ORDER[state.stopIndex] as StandardStopId];
  const choice = stop.choices.find((c) => c.id === choiceId);
  if (!choice?.outcome) return null;
  const outcome = outcomeFor(choice, state.persona!);
  const effects = effectsFor(choice.effects, state.persona!);
  const copy = content.interstitial;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{outcome.text}</p>
      {!reviewing && <ChangeLines changes={previewChanges(state.meters, effects)} />}
      <CaseNote note={outcome.cartNote} />
      <ContinueBar>
        {reviewing ? (
          <ChoiceButton className={btnPrimary} onSelect={() => record(outcome.cartNote, effects)}>
            {copy.continueLabel} <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        ) : pause ? (
          // Class mode: the next screen is the pause card, so this button looks and reads differently (not by color alone).
          <ChoiceButton className={btnPause} onSelect={() => record(outcome.cartNote, effects)}>
            <Pause aria-hidden="true" /> {copy.pauseLabel}
          </ChoiceButton>
        ) : (
          <ChoiceButton className={btnPrimary} onSelect={() => record(outcome.cartNote, effects)}>
            Add to cart <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        )}
      </ContinueBar>
    </motion.div>
  );
}

export function CaseNote({ note }: { note: string }) {
  return (
    <div className="bg-stone-900 border border-amber-900/30 p-6 sm:p-10 rounded-2xl shadow-2xl">
      <h3 className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
        <FileText size={14} aria-hidden="true" /> Cart note
      </h3>
      <p className={caseNote}>{note}</p>
    </div>
  );
}
