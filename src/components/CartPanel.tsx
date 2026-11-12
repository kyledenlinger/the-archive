import { GameContent, METER_IDS, STOP_ORDER, StandardStopId } from '../content/types';
import { ui } from '../content/ui';
import { GameState } from '../state';
import { Dialog, PanelTitle } from './Dialog';
import { meterGlyph, meterWord } from './MeterDisplay';

const ITEM_STOPS = STOP_ORDER.filter((id) => id !== 'flip') as StandardStopId[];

/** How many of the brief's three items are in the cart. */
export const foundCount = (cart: GameState['cart']) => ITEM_STOPS.filter((id) => cart[id]).length;

/** The brief made concrete (revision spec §2.4): what you're making, the three items and their status, then your own work. */
export function CartPanel({ state, content, open, onClose }: { state: GameState; content: GameContent; open: boolean; onClose: () => void }) {
  const persona = content.personas.find((p) => p.id === state.persona);
  const c = ui.cartPanel;
  const license = state.cart.flip && state.flip.license ? content.stops.flip.licenses[state.flip.license].label : null;
  const label = 'text-amber-400 font-bold uppercase tracking-widest text-xs mb-2';

  return (
    <Dialog open={open} onClose={onClose} labelledBy="cart-title">
      <PanelTitle id="cart-title" title={c.heading} closeLabel={c.close} onClose={onClose} />
      {persona && (
        <div className="space-y-8 font-serif">
          <dl className="space-y-4">
            <div>
              <dt className={label}>{c.making}</dt>
              <dd className="leading-relaxed">{persona.brief.making}</dd>
            </div>
            <div>
              <dt className={label}>{c.answersTo}</dt>
              <dd className="leading-relaxed">{persona.brief.answersTo}</dd>
            </div>
          </dl>

          <section>
            <h3 className={label}>{c.items}</h3>
            <ol className="space-y-3">
              {ITEM_STOPS.map((id, i) => {
                const note = state.cart[id];
                return (
                  <li key={id} data-testid={`cart-item-${id}`} data-found={Boolean(note)} className="bg-stone-800/50 p-4 rounded-lg border border-amber-900/20 space-y-2">
                    <div className="text-amber-100">
                      <span aria-hidden="true" className="mr-2">{note ? '■' : '□'}</span>
                      {persona.brief.items[i]}
                    </div>
                    <div className="text-[11px] text-amber-500 font-mono uppercase tracking-widest">{c.stop(i + 1, content.stops[id].title)}</div>
                    {note ? (
                      <p className="font-mono text-xs leading-relaxed text-amber-100/85">{note}</p>
                    ) : (
                      <p className="text-sm italic text-amber-50/70">{c.notFound}</p>
                    )}
                  </li>
                );
              })}
              {license && (
                <li data-testid="cart-item-flip" className="bg-amber-900/10 p-4 rounded-lg border border-amber-900/40 space-y-2">
                  <div className="text-amber-100">{c.yourWork}</div>
                  <p className="text-sm">{content.stops.flip.work[persona.id]}</p>
                  <p className="font-mono text-xs text-amber-100/85">{c.license(license)}</p>
                </li>
              )}
            </ol>
          </section>

          <section>
            <h3 className={label}>{c.meters}</h3>
            <ul className="space-y-1 text-sm">
              {METER_IDS.map((m) => (
                <li key={m} className="flex items-center gap-3">
                  <span aria-hidden="true" className="font-mono text-xs text-amber-200 tracking-tight">{meterGlyph(m, state.meters[m])}</span>
                  <span>{`${ui.meterLabels[m]}: ${meterWord(m, state.meters[m])}`}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Dialog>
  );
}
