import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { EndingId } from '../content/types';
import { endUi } from '../content/ui';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnLink, eyebrow, narration, page } from '../components/styles';
import { ScreenProps } from './types';

const ENDINGS: EndingId[] = ['search', 'shelf', 'wait'];

/** Reveal paragraphs one at a time (as v2's RevealScreen staged it); REVEAL fires on the last one. */
export function Reveal({ state, dispatch, content }: ScreenProps) {
  const paras = content.clerk.reveal;
  const [step, setStep] = useState(0);
  const last = step >= paras.length - 1;

  useEffect(() => {
    if (last && !state.revealed) dispatch({ type: 'REVEAL' });
  }, [last, state.revealed, dispatch]);

  return (
    <div className={`${page} space-y-10`}>
      <ScreenHeading focusKey={step} className={eyebrow}>
        {endUi.revealHeading} <span className="sr-only">({step + 1} of {paras.length})</span>
      </ScreenHeading>
      <div className="space-y-6">
        {paras.slice(0, step + 1).map((p, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${narration} text-xl ${i < step ? 'opacity-60' : ''}`}>
            {p}
          </motion.p>
        ))}
      </div>
      {!last ? (
        <div className="flex justify-end">
          <button type="button" className={btnLink} onClick={() => setStep((s) => s + 1)}>
            Continue <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      ) : (
        state.revealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="group" aria-labelledby="ending-q" className="flex flex-col gap-4 pt-6">
            <h2 id="ending-q" className="text-amber-200 text-sm uppercase tracking-widest font-bold">
              {endUi.endingQuestion}
            </h2>
            {ENDINGS.map((e) => (
              <ChoiceButton key={e} onSelect={() => dispatch({ type: 'SET_ENDING', ending: e })}>
                {content.clerk.endings[e].label}
              </ChoiceButton>
            ))}
          </motion.div>
        )
      )}
    </div>
  );
}
