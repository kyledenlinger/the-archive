import { useEffect, useRef } from 'react';
import { BookOpen, X } from 'lucide-react';
import { ReferenceEntry, Resource } from '../content/types';

interface Props {
  entries: ReferenceEntry[];
  resources: Resource[];
  revealed: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/** Slide-over reference desk. Its open state lives in App, so opening it never disturbs the screen beneath. */
export function ReferencePanel({ entries, resources, revealed, open, onOpen, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (wasOpen.current) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const visible = entries.filter((e) => !e.unlockAfterReveal || revealed);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-amber-900/80 text-amber-100 p-3 rounded-l-xl border-l border-y border-amber-700/50 shadow-xl z-40 hover:bg-amber-800 transition-colors flex flex-col items-center gap-2"
      >
        <BookOpen size={20} aria-hidden="true" />
        <span className="[writing-mode:vertical-rl] text-xs font-medium tracking-widest uppercase">Reference</span>
      </button>

      {open && (
        <>
          <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="The Reference Desk"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-stone-900 border-l border-amber-900/30 shadow-2xl z-50 overflow-y-auto p-6 sm:p-8 text-amber-50/90"
          >
            <div className="flex justify-between items-center mb-8 border-b border-amber-900/20 pb-4">
              <h2 className="text-2xl font-serif italic text-amber-200">The Reference Desk</h2>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close reference" className="text-amber-400 hover:text-amber-200 transition-colors p-1">
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-8 font-serif">
              {visible.map((e) => (
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
          </div>
        </>
      )}
    </>
  );
}
