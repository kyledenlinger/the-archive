import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { ReuseEventKind, ReuseResponse } from '../content/types';
import { flipCartNote, REUSE_ORDER } from '../lib/flip';
import { ScreenHeading } from '../components/ScreenHeading';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnLink, btnPrimary, eyebrow, page } from '../components/styles';
import { LicensePicker } from '../mechanics/LicensePicker';
import { ReuseEvents } from '../mechanics/ReuseEvents';
import { flipNoteLabels } from '../content/ui';
import { ScreenProps } from './types';

type Phase = 'intro' | 'license' | 'events' | 'askForHelp';

export function Flip({ state, dispatch, content, openReference }: ScreenProps) {
  const flip = content.stops.flip;
  const persona = state.persona!;
  const [phase, setPhase] = useState<Phase>('intro');
  const license = state.flip.license;

  const finish = () => {
    const r = state.flip.responses;
    if (!license || !r.within || !r.outside || !r.beyond) return;
    dispatch({ type: 'FINISH_FLIP', cartNote: flipCartNote(flip, license, r as Record<ReuseEventKind, ReuseResponse>, flipNoteLabels) });
  };

  return (
    <div className={page}>
      <ScreenHeading focusKey={phase} className="mb-10">
        <span className={`block ${eyebrow} mb-3`}>Stop 4 of 4</span>
        <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{flip.title}</span>
      </ScreenHeading>

      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <ClerkSpeech text={flip.clerkIntro} />
          <div className="flex justify-end">
            <button type="button" className={btnLink} onClick={() => setPhase('license')}>
              Start with your work <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}

      {phase === 'license' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{flip.setup[persona]}</p>
          <div className="bg-amber-900/10 border border-amber-900/30 p-6 rounded-2xl">
            <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-2">Your work</div>
            <p className="font-serif text-2xl text-amber-100">{flip.work[persona]}</p>
          </div>
          <LicensePicker
            flip={flip}
            openReference={openReference}
            onChoose={(l) => {
              dispatch({ type: 'SET_LICENSE', license: l });
              setPhase('events');
            }}
          />
        </motion.div>
      )}

      {phase === 'events' && license && (
        <ReuseEvents
          flip={flip}
          persona={persona}
          license={license}
          onRespond={(i, response) => dispatch({ type: 'RECORD_REUSE', kind: REUSE_ORDER[i], response })}
          onComplete={() => setPhase('askForHelp')}
        />
      )}

      {phase === 'askForHelp' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
          {/* revision-2: the Clerk's askForHelp line is gone; Task 11 removes this phase. */}
          <div className="flex justify-center">
            <ChoiceButton className={btnPrimary} onSelect={finish}>
              Continue <ChevronRight aria-hidden="true" />
            </ChoiceButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}
