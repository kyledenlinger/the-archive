import { ui } from '../content/ui';
import { Dialog, PanelTitle } from './Dialog';

/** What the game is, who made it, its license, and where its source lives (revision spec §2.1). */
export function AboutPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const a = ui.about;
  return (
    <Dialog open={open} onClose={onClose} labelledBy="about-title">
      <PanelTitle id="about-title" title={a.heading} closeLabel={a.close} onClose={onClose} />
      <div className="space-y-5 font-serif leading-relaxed">
        {a.what.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="font-bold text-amber-200">{a.notAdvice}</p>
        <p>{a.credit}</p>
        <p>{a.license}</p>
        <p>
          <a href={a.sourceUrl} className="text-amber-400 underline underline-offset-4 hover:text-amber-200">
            {a.sourceLabel}
          </a>
        </p>
      </div>
    </Dialog>
  );
}
