import { ArrowLeft, BookOpen, House, Info, ShoppingCart } from 'lucide-react';
import { GameContent } from '../content/types';
import { ui } from '../content/ui';
import { GameState } from '../state';
import { foundCount } from './CartPanel';
import { MeterDisplay } from './MeterDisplay';

export type PanelId = 'home' | 'cart' | 'reference' | 'about';

const btn =
  'inline-flex items-center gap-2 rounded-full px-2.5 py-2 sm:px-3 text-amber-200 hover:text-amber-100 hover:bg-amber-900/30 transition-colors text-xs font-medium tracking-widest uppercase';

/**
 * The slim site header (revision spec §2.1): Back, Home, the meters and Cart once a persona is chosen, Reference, About.
 * It opens panels (App owns which one is open and renders them outside the inert page) and asks App to go Back.
 * Back is always there after mode select; with nowhere to go it is `aria-disabled` (never native `disabled`) and does nothing.
 */
export function Header({
  state,
  content,
  openPanel,
  onOpen,
  onBack,
}: {
  state: GameState;
  content: GameContent;
  openPanel: PanelId | null;
  onOpen: (panel: PanelId) => void;
  onBack: () => void;
}) {
  const h = ui.header;
  const persona = content.personas.find((p) => p.id === state.persona);
  const found = foundCount(state.cart);
  const canGoBack = state.history.length > 0;
  const expanded = (p: PanelId) => ({ 'aria-haspopup': 'dialog' as const, 'aria-expanded': openPanel === p });

  return (
    <header className="fixed top-0 inset-x-0 z-30 bg-stone-950 border-b border-amber-900/30">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1">
        {state.screen !== 'mode' && (
          <>
            <button
              type="button"
              className={canGoBack ? btn : `${btn} opacity-50 cursor-not-allowed hover:bg-transparent hover:text-amber-200`}
              aria-disabled={canGoBack ? undefined : 'true'}
              onClick={() => {
                if (canGoBack) onBack();
              }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{h.back}</span>
            </button>
            <button type="button" className={btn} onClick={() => onOpen('home')} {...expanded('home')}>
              <House size={16} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{h.home}</span>
            </button>
          </>
        )}
        {persona && (
          <div className="order-last w-full pb-1 md:order-none md:w-auto md:pb-0">
            <MeterDisplay meters={state.meters} lastChanges={state.lastChanges} />
          </div>
        )}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {persona && (
            <button type="button" className={btn} onClick={() => onOpen('cart')} {...expanded('cart')}>
              <ShoppingCart size={16} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{h.cart}</span>
              <span className="normal-case tracking-normal font-mono text-amber-100">
                <span className="sr-only">, </span>
                {h.cartCount(found)}
              </span>
            </button>
          )}
          <button type="button" className={btn} onClick={() => onOpen('reference')} {...expanded('reference')}>
            <BookOpen size={16} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{h.reference}</span>
          </button>
          <button type="button" className={btn} onClick={() => onOpen('about')} {...expanded('about')}>
            <Info size={16} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">{h.about}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
