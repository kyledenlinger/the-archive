import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, eyebrow, narration, page } from '../components/styles';
import { ScreenProps } from './types';

export function Ending({ state, dispatch, content }: ScreenProps) {
  const [phase, setPhase] = useState<'scene' | 'after'>('scene');
  const clerk = content.clerk;
  const ending = clerk.endings[state.ending!];
  const flip = content.stops.flip;
  const advance = (
    <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'ADVANCE' })}>
      {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
    </ChoiceButton>
  );

  if (phase === 'scene') {
    return (
      <div className={`${page} space-y-10`}>
        <ScreenHeading className="text-3xl sm:text-4xl font-serif italic text-amber-100">{ending.label}</ScreenHeading>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={narration}>{ending.scene}</motion.p>
        {state.flip.license && <p className={narration}>{clerk.codaShade[state.flip.license]}</p>}
        <p className="font-serif text-2xl text-amber-200 text-center py-6 border-y border-amber-900/30">{clerk.closingLine}</p>
        <div className="flex justify-center">
          <ChoiceButton className={btnPrimary} onSelect={() => setPhase('after')}>
            {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        </div>
      </div>
    );
  }

  if (state.mode === 'independent') {
    return (
      <div className={`${page} space-y-10`}>
        <ScreenHeading>
          <span className={`block ${eyebrow} mb-3`}>Debrief</span>
          <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{flip.title}</span>
        </ScreenHeading>
        <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{flip.debrief.lesson}</p>
        <section className="bg-stone-900/50 border border-amber-900/20 p-6 sm:p-8 rounded-2xl">
          <h2 className="text-amber-400 uppercase tracking-widest text-xs font-bold mb-4">Think it over</h2>
          <ul className="space-y-4 font-serif italic text-amber-50/85 text-lg list-disc pl-5">
            {flip.debrief.prompts.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
        <div className="flex justify-center">{advance}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl space-y-10">
        <ScreenHeading className="text-5xl font-serif italic text-amber-100">{content.interstitial.waitTitle}</ScreenHeading>
        <p className="text-amber-50/80 font-serif text-lg italic leading-relaxed">{content.interstitial.waitBody}</p>
        <div className="flex justify-center">{advance}</div>
      </div>
    </div>
  );
}
