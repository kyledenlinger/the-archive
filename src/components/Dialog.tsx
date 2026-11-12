import { ReactNode, RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A modal dialog or slide-over panel. While open it traps Tab inside itself and closes on Escape;
 * when it closes, focus goes back to whatever opened it (if that element is still on the page).
 * App makes the rest of the page inert while any of these is open.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  role = 'dialog',
  variant = 'panel',
  initialFocus,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  role?: 'dialog' | 'alertdialog';
  variant?: 'panel' | 'center';
  initialFocus?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const openerRef = useRef<HTMLElement | null>(null);

  // Note the opener synchronously, before the browser can move focus off the now-inert page.
  useLayoutEffect(() => {
    if (open) openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    const focusables = () => Array.from(box.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    (initialFocus?.current ?? focusables()[0] ?? box.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = box.current?.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opener?.isConnected) opener.focus();
    };
    // Runs on open/close only; initialFocus is a ref, and onClose is read through `close`.
  }, [open]);

  if (!open) return null;
  const frame =
    variant === 'panel'
      ? 'fixed right-0 top-0 h-full w-full max-w-md border-l overflow-y-auto p-6 sm:p-8'
      : 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md rounded-2xl border p-6 sm:p-8';
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" aria-hidden="true" />
      <div
        ref={box}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`${frame} bg-stone-900 border-amber-900/30 shadow-2xl z-50 text-amber-50/90 outline-none`}
      >
        {children}
      </div>
    </>
  );
}

/** Title row with a close button, shared by the slide-over panels. */
export function PanelTitle({ id, title, closeLabel, onClose }: { id: string; title: string; closeLabel: string; onClose: () => void }) {
  return (
    <div className="flex justify-between items-center gap-4 mb-8 border-b border-amber-900/20 pb-4">
      <h2 id={id} className="text-2xl font-serif italic text-amber-200">
        {title}
      </h2>
      <button type="button" onClick={onClose} aria-label={closeLabel} className="text-amber-400 hover:text-amber-200 transition-colors p-1">
        <X size={24} aria-hidden="true" />
      </button>
    </div>
  );
}
