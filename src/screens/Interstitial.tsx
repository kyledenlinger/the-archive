import { ChevronRight } from 'lucide-react';
import { STOP_ORDER, StandardStopId } from '../content/types';
import { review } from '../content/review';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { CartSoFar } from '../components/CartSoFar';
import { ContinueBar } from '../components/ContinueBar';
import { btnLink, btnPrimary, eyebrow, narrativePage } from '../components/styles';
import { CaseNote } from './Stop';
import { ScreenProps } from './types';

/** The choice just made, a way back to change it, and earlier cart notes. */
function ReviewPanel({ state, dispatch, content }: ScreenProps) {
  const stopId = STOP_ORDER[state.stopIndex] as StandardStopId;
  const note = state.cart[stopId];
  return (
    <div className="space-y-6 text-left">
      {note && (
        <section aria-labelledby="your-choice" className="space-y-4">
          <h2 id="your-choice" className="text-amber-200 text-sm uppercase tracking-widest font-bold">
            {review.yourChoice}
          </h2>
          <CaseNote note={note} />
          <p className="font-serif italic text-amber-50/75">{review.goBackHint}</p>
          <button type="button" className={btnLink} onClick={() => dispatch({ type: 'REVISIT_STOP' })}>
            {review.goBack}
          </button>
        </section>
      )}
      <CartSoFar cart={state.cart} content={content} stops={STOP_ORDER.slice(0, state.stopIndex)} />
    </div>
  );
}

export function Interstitial(props: ScreenProps) {
  const { state, dispatch, content } = props;
  const stop = content.stops[STOP_ORDER[state.stopIndex] as StandardStopId];
  const copy = content.interstitial;
  const advance = <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'ADVANCE' })}>{copy.continueLabel} <ChevronRight aria-hidden="true" /></ChoiceButton>;

  if (state.mode === 'independent') {
    return (
      <div className={`${narrativePage} space-y-10`}>
        <ScreenHeading>
          <span className={`block ${eyebrow} mb-3`}>Debrief</span>
          <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{stop.title}</span>
        </ScreenHeading>
        <ReviewPanel {...props} />
        <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{stop.debrief.lesson}</p>
        <section className="bg-stone-900/50 border border-amber-900/20 p-6 sm:p-8 rounded-2xl">
          <h2 className="text-amber-400 uppercase tracking-widest text-xs font-bold mb-4">Think it over</h2>
          <ul className="space-y-4 font-serif italic text-amber-50/85 text-lg list-disc pl-5">
            {stop.debrief.prompts.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
        <ContinueBar>{advance}</ContinueBar>
      </div>
    );
  }

  return (
    <div className={`${narrativePage} space-y-10`}>
      <div className="text-center space-y-6">
        <div className={eyebrow}>Stop {state.stopIndex + 1} of 4: {stop.title}</div>
        <ScreenHeading className="text-5xl font-serif italic text-amber-100">{copy.waitTitle}</ScreenHeading>
        <p className="text-amber-50/80 font-serif text-lg italic leading-relaxed">{copy.waitBody}</p>
      </div>
      <ReviewPanel {...props} />
      <ContinueBar>{advance}</ContinueBar>
    </div>
  );
}
