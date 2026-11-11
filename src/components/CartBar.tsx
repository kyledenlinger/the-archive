import { User } from 'lucide-react';
import { GameContent, STOP_ORDER, StopId } from '../content/types';

/** Four slots, one per stop. Filled/empty is shown by glyph and text, not color alone. */
export function CartBar({ cart, content, personaName }: { cart: Partial<Record<StopId, string>>; content: GameContent; personaName?: string }) {
  const filled = STOP_ORDER.filter((id) => cart[id]).length;
  return (
    <header className="fixed top-0 left-0 w-full bg-stone-950/85 backdrop-blur-md border-b border-amber-900/20 py-3 px-4 sm:px-6 z-30 flex flex-wrap gap-3 justify-between items-center">
      <div className="flex items-center gap-2 text-amber-200/70 uppercase tracking-[0.2em] text-[10px] font-bold">
        <User size={12} aria-hidden="true" />
        <span>{personaName ?? ''}</span>
      </div>
      <ol aria-label={`Cart: ${filled} of 4 items`} className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-amber-200/80">
        {STOP_ORDER.map((id, i) => {
          const has = Boolean(cart[id]);
          return (
            <li key={id} className={`flex items-center gap-1.5 ${has ? 'text-amber-300' : 'text-amber-200/50'}`} data-testid={`cart-slot-${id}`} data-filled={has}>
              <span aria-hidden="true">{has ? '■' : '□'}</span>
              <span>
                {i + 1}. {content.stops[id].title}
              </span>
              <span className="sr-only">{has ? '(filled)' : '(empty)'}</span>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
