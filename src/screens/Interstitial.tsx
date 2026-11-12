import { useState } from 'react';
import { ChevronRight, Pause } from 'lucide-react';
import { STOP_ORDER, StandardStopId } from '../content/types';
import { review } from '../content/review';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { CartSoFar } from '../components/CartSoFar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ContinueBar } from '../components/ContinueBar';
import { btnPrimary, eyebrow, narrativePage, page } from '../components/styles';
import { isReviewing, onward } from '../state';
import { CaseNote } from './Stop';
import { ScreenProps } from './types';

/** The choice just made and earlier cart notes. Choices are final, so there is no way to redo this one. */
function ReviewPanel({ state, content }: ScreenProps) {
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
  // Opening the dialog is a display toggle, not a page, so it stays local.
  const [confirming, setConfirming] = useState(false);

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
        <ContinueBar>
          <ChoiceButton className={btnPrimary} onSelect={() => dispatch(onward(state, { type: 'ADVANCE' }))}>
            {copy.continueLabel} <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        </ContinueBar>
      </div>
    );
  }

  // Class mode: a full-screen pause card with no Continue bar. Leaving it asks first, unless the player has
  // already moved on once and came back with Back.
  const leave = () => (isReviewing(state) ? dispatch({ type: 'FORWARD' }) : setConfirming(true));
  return (
    <div className={page}>
      <div data-testid="pause-card" className="border-2 border-dashed border-amber-500/60 rounded-3xl bg-stone-900/60 p-6 sm:p-10 space-y-10">
        <div className="text-center space-y-6">
          <Pause size={72} strokeWidth={1.5} aria-hidden="true" className="mx-auto text-amber-300" />
          <div className={eyebrow}>
            Stop {state.stopIndex + 1} of 4: {stop.title}
          </div>
          <ScreenHeading className="text-5xl sm:text-6xl font-serif italic text-amber-100">{copy.waitTitle}</ScreenHeading>
          <p className="text-amber-100 font-serif text-2xl">{copy.waitLead}</p>
          <p className="text-amber-50/80 font-serif text-lg italic leading-relaxed">{copy.waitBody}</p>
        </div>
        <ReviewPanel {...props} />
        <div className="flex justify-center pt-2">
          <button type="button" className={btnPrimary} onClick={leave}>
            {copy.continueLabel} <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={confirming}
        question={copy.confirmMoveOn.question}
        confirmLabel={copy.confirmMoveOn.confirm}
        cancelLabel={copy.confirmMoveOn.cancel}
        onConfirm={() => {
          setConfirming(false);
          dispatch({ type: 'ADVANCE' });
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
