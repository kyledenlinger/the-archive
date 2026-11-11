import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, FileText } from 'lucide-react';
import { Choice, Outcome, PersonaId, STOP_ORDER, StandardStop, StandardStopId } from '../content/types';
import { ScreenHeading } from '../components/ScreenHeading';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnLink, btnPrimary, caseNote, eyebrow, page } from '../components/styles';
import { FairUseAnalysis } from '../mechanics/FairUseAnalysis';
import { AskRequest } from '../mechanics/AskRequest';
import { ScreenProps } from './types';

type Sub = { kind: 'intro' } | { kind: 'choices' } | { kind: 'outcome'; outcome: Outcome } | { kind: 'fairUse' } | { kind: 'ask' };

export function outcomeFor(choice: Choice, persona: PersonaId): Outcome {
  const o = choice.outcome!;
  return 'cartNote' in o ? (o as Outcome) : (o as Record<PersonaId, Outcome>)[persona];
}

export function Stop({ state, dispatch, content }: ScreenProps) {
  const stopId = STOP_ORDER[state.stopIndex] as StandardStopId;
  const stop: StandardStop = content.stops[stopId];
  const persona = state.persona!;
  // Revisiting a stop already in the cart opens straight on the choices.
  const [sub, setSub] = useState<Sub>(state.cart[stopId] ? { kind: 'choices' } : { kind: 'intro' });
  const record = (cartNote: string) => dispatch({ type: 'RECORD_STOP', stopId, cartNote });
  const back = () => setSub({ kind: 'choices' });

  const pick = (choice: Choice) => {
    if (choice.mechanic === 'fairUse') setSub({ kind: 'fairUse' });
    else if (choice.mechanic === 'ask') setSub({ kind: 'ask' });
    else setSub({ kind: 'outcome', outcome: outcomeFor(choice, persona) });
  };

  return (
    <div className={page}>
      <ScreenHeading focusKey={sub.kind} className="mb-10">
        <span className={`block ${eyebrow} mb-3`}>Stop {state.stopIndex + 1} of 4</span>
        <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{stop.title}</span>
      </ScreenHeading>

      {sub.kind === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <ClerkSpeech text={stop.clerkIntro} />
          <p className="font-serif text-amber-50/85 italic text-lg leading-relaxed">{stop.clerkClue}</p>
          <div className="flex justify-end">
            <button type="button" className={btnLink} onClick={() => setSub({ kind: 'choices' })}>
              Look closer <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}

      {sub.kind === 'choices' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 font-serif text-amber-50/90 text-lg leading-relaxed">
          <p>{stop.setup[persona]}</p>
          <div className="h-px bg-amber-900/30" aria-hidden="true" />
          <p>{stop.complication}</p>
          <div role="group" aria-labelledby="choices-label" className="flex flex-col gap-4">
            <h2 id="choices-label" className="text-amber-200 text-sm uppercase tracking-widest font-bold font-sans">
              What do you do?
            </h2>
            {stop.choices.map((c) => (
              <ChoiceButton key={c.id} onSelect={() => pick(c)}>
                {c.label}
              </ChoiceButton>
            ))}
          </div>
        </motion.div>
      )}

      {sub.kind === 'outcome' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
          <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{sub.outcome.text}</p>
          <CaseNote note={sub.outcome.cartNote} />
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <button type="button" className={btnLink} onClick={back}>
              Choose again
            </button>
            <ChoiceButton className={btnPrimary} onSelect={() => record(sub.outcome.cartNote)}>
              Add to cart <ChevronRight aria-hidden="true" />
            </ChoiceButton>
          </div>
        </motion.div>
      )}

      {sub.kind === 'fairUse' && <FairUseAnalysis stopId={stopId} persona={persona} content={content} onDone={record} onBack={back} />}

      {sub.kind === 'ask' && <AskRequest content={content} persona={persona} seed={state.seed} onDone={record} onBack={back} />}
    </div>
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
