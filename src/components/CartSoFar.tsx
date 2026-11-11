import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GameContent, STOP_ORDER, StopId } from '../content/types';
import { review } from '../content/review';

/** A collapsible list of the cart notes recorded so far, for the given stops. */
export function CartSoFar({ cart, content, stops }: { cart: Partial<Record<StopId, string>>; content: GameContent; stops: StopId[] }) {
  const [open, setOpen] = useState(false);
  const filled = STOP_ORDER.filter((id) => stops.includes(id) && cart[id]);
  if (!filled.length) return null;
  return (
    <section className="text-left">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="cart-so-far"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-200 font-serif text-lg"
      >
        {review.cartSoFar}
        <ChevronDown size={18} aria-hidden="true" className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {open && (
        <ol id="cart-so-far" className="mt-4 space-y-4">
          {filled.map((id) => (
            <li key={id} className="bg-stone-900/50 border border-amber-900/30 p-5 rounded-xl">
              <h3 className="text-amber-400 font-mono text-xs uppercase tracking-[0.2em] mb-2">
                {STOP_ORDER.indexOf(id) + 1}. {content.stops[id].title}
              </h3>
              <p className="font-mono text-amber-100/85 text-xs leading-relaxed">{cart[id]}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
