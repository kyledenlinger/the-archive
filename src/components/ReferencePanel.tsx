import { ReferenceEntry, Resource } from '../content/types';
import { Dialog, PanelTitle } from './Dialog';

interface Props {
  entries: ReferenceEntry[];
  resources: Resource[];
  open: boolean;
  onClose: () => void;
}

/** Slide-over reference desk, opened from the header (or the license picker). Its open state lives in App. */
export function ReferencePanel({ entries, resources, open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="reference-title">
      <PanelTitle id="reference-title" title="The Reference Desk" closeLabel="Close reference" onClose={onClose} />
      <div className="space-y-8 font-serif">
        {entries.map((e) => (
          <section key={e.id} data-testid={`ref-${e.id}`}>
            <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">{e.title}</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">{e.body}</p>
          </section>
        ))}
        <section>
          <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Resources</h3>
          <ul className="space-y-3">
            {resources.map((r) => (
              <li key={r.name} className="bg-stone-800/50 p-4 rounded-lg border border-amber-900/20">
                <div className="flex flex-wrap justify-between gap-2 items-baseline mb-1">
                  <span className="text-amber-200 font-bold text-sm">{r.name}</span>
                  <span className="text-[11px] text-amber-500 font-mono">{r.url}</span>
                </div>
                <p className="text-xs text-amber-50/75 leading-relaxed">{r.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Dialog>
  );
}
