import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, eyebrow, page } from '../components/styles';
import { CartSoFar } from '../components/CartSoFar';
import { STOP_ORDER } from '../content/types';
import { ScreenProps } from './types';

export function Ending({ state, dispatch, content }: ScreenProps) {
  const [phase, setPhase] = useState<'scene' | 'after'>('scene');
  // revision-2 stub: the three endings are gone; only the closing line remains. Task 12 replaces this screen.
  const shelf = content.clerk.shelf;
  const flip = content.stops.flip;
  const advance = (
    <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'ADVANCE' })}>
      {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
    </ChoiceButton>
  );

  // Each phase gets its own key so its one-shot Continue button is never reused from the previous phase.
  if (phase === 'scene') {
    return (
      <div key="scene" className={`${page} space-y-10`}>
        <ScreenHeading className="font-serif text-2xl text-amber-200 text-center py-6 border-y border-amber-900/30">{shelf.closingLine}</ScreenHeading>
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
      <div key="debrief" className={`${page} space-y-10`}>
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
        <CartSoFar cart={state.cart} content={content} stops={STOP_ORDER} />
        <div className="flex justify-center">{advance}</div>
      </div>
    );
  }

  return (
    <div key="wait" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl space-y-10">
        <ScreenHeading className="text-5xl font-serif italic text-amber-100">{content.interstitial.waitTitle}</ScreenHeading>
        <p className="text-amber-50/80 font-serif text-lg italic leading-relaxed">{content.interstitial.waitBody}</p>
        <CartSoFar cart={state.cart} content={content} stops={STOP_ORDER} />
        <div className="flex justify-center">{advance}</div>
      </div>
    </div>
  );
}
