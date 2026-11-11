import { RotateCcw } from 'lucide-react';
import { STOP_ORDER } from '../content/types';
import { endUi } from '../content/ui';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { ScreenProps } from './types';

export function CartReview({ state, dispatch, content }: ScreenProps) {
  const persona = content.personas.find((p) => p.id === state.persona);
  const guess = content.clerk.guessOptions.find((g) => g.id === state.guess);
  return (
    <div className="min-h-screen py-24 px-6 sm:px-8 max-w-5xl mx-auto space-y-14">
      <div className="text-center space-y-4">
        <ScreenHeading className="text-5xl font-serif italic text-amber-100">{endUi.cartHeading}</ScreenHeading>
        {persona && (
          <p className="text-amber-50/70 font-serif uppercase tracking-widest text-sm">
            {persona.name} · {persona.medium}
          </p>
        )}
        {guess && <p className="font-serif italic text-amber-200 text-lg">{endUi.guessLine(guess.label)}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STOP_ORDER.map((id, i) => (
          <section key={id} className="bg-stone-900/50 border border-amber-900/30 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em]">
              Item {i + 1}: {content.stops[id].title}
            </h2>
            <p data-testid="cart-review-note" className="font-mono text-amber-100/85 text-xs leading-relaxed border-l border-amber-900/40 pl-4 py-1">
              {state.cart[id]}
            </p>
          </section>
        ))}
      </div>

      <p className="max-w-2xl mx-auto text-center font-serif italic text-amber-50/85 text-lg">
        {state.mode === 'class' ? endUi.facilitatorLine : endUi.independentSummary}
      </p>

      <section className="max-w-3xl mx-auto">
        <h2 className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-4">{endUi.resourcesHeading}</h2>
        <ul className="divide-y divide-amber-900/20">
          {content.resources.map((r) => (
            <li key={r.name} className="py-4 flex flex-col gap-1">
              <div className="flex flex-wrap justify-between gap-2 items-baseline">
                <span className="text-amber-200 font-bold font-serif">{r.name}</span>
                <span className="text-amber-500 text-xs font-mono">{r.url}</span>
              </div>
              <p className="text-sm text-amber-50/70 font-serif">{r.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-center">
        <ChoiceButton
          className="px-10 py-4 border border-amber-900/40 text-amber-300 rounded-full font-serif text-lg hover:bg-amber-900/10 transition-all inline-flex items-center gap-3"
          onSelect={() => dispatch({ type: 'RESET', seed: Date.now() })}
        >
          <RotateCcw size={18} aria-hidden="true" /> Play again
        </ChoiceButton>
      </div>
    </div>
  );
}
