import { ChevronRight } from 'lucide-react';
import { STOP_ORDER, StandardStopId } from '../content/types';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, eyebrow, page } from '../components/styles';
import { ScreenProps } from './types';

export function Interstitial({ state, dispatch, content }: ScreenProps) {
  const stop = content.stops[STOP_ORDER[state.stopIndex] as StandardStopId];
  const copy = content.interstitial;
  const advance = <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'ADVANCE' })}>{copy.continueLabel} <ChevronRight aria-hidden="true" /></ChoiceButton>;

  if (state.mode === 'independent') {
    return (
      <div className={`${page} space-y-10`}>
        <ScreenHeading>
          <span className={`block ${eyebrow} mb-3`}>Debrief</span>
          <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{stop.title}</span>
        </ScreenHeading>
        <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{stop.debrief.lesson}</p>
        <section className="bg-stone-900/50 border border-amber-900/20 p-6 sm:p-8 rounded-2xl">
          <h2 className="text-amber-400 uppercase tracking-widest text-xs font-bold mb-4">Think it over</h2>
          <ul className="space-y-4 font-serif italic text-amber-50/85 text-lg list-disc pl-5">
            {stop.debrief.prompts.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
        <div className="flex justify-center">{advance}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl space-y-10">
        <div className={eyebrow}>Stop {state.stopIndex + 1} of 4: {stop.title}</div>
        <ScreenHeading className="text-5xl font-serif italic text-amber-100">{copy.waitTitle}</ScreenHeading>
        <p className="text-amber-50/80 font-serif text-lg italic leading-relaxed">{copy.waitBody}</p>
        <div className="flex justify-center">{advance}</div>
      </div>
    </div>
  );
}
