import { ReactNode, useId, useRef } from 'react';
import { Check } from 'lucide-react';
import { ui } from '../content/ui';

/**
 * A button that fires once per mount, so a fast double-click can't register two choices.
 * With `lockedReason` it stays visible and focusable but does nothing: it carries `aria-disabled="true"`
 * (never the native `disabled`), and the reason shows under it, linked by `aria-describedby`.
 * With `chosen` (a page revisited with Back) it is marked “Your choice” the same way, and stays usable.
 */
export function ChoiceButton({
  onSelect,
  lockedReason,
  chosen = false,
  children,
  className = 'choice-btn',
  ariaLabel,
}: {
  onSelect: () => void;
  lockedReason?: string;
  chosen?: boolean;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const fired = useRef(false);
  const noteId = useId();
  const locked = Boolean(lockedReason);
  const note = locked ? lockedReason : chosen ? ui.yourChoice : undefined;
  const button = (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-disabled={locked ? 'true' : undefined}
      aria-describedby={note ? noteId : undefined}
      className={locked ? `${className} opacity-60 cursor-not-allowed` : chosen ? `${className} border-amber-500` : className}
      onClick={() => {
        if (fired.current || locked) return;
        fired.current = true;
        onSelect();
      }}
    >
      {children}
    </button>
  );
  if (!note) return button;
  return (
    <div className="flex flex-col gap-2">
      {button}
      <span id={noteId} className={`text-sm font-sans pl-6 ${chosen && !locked ? 'text-amber-300 font-bold inline-flex items-center gap-2' : 'text-amber-200/80'}`}>
        {chosen && !locked && <Check size={14} aria-hidden="true" />}
        {note}
      </span>
    </div>
  );
}

/**
 * Props for one option on a page that may already be decided (`made` is the value chosen there, if any):
 * the chosen option stays usable and is marked, every other one locks with “You’ve already decided this one.”
 * Undecided, an option keeps its own lock reason, if it has one.
 */
export function decidedProps(made: string | undefined, value: string, lockedReason?: string): { chosen?: boolean; lockedReason?: string } {
  if (made === undefined) return { lockedReason };
  return made === value ? { chosen: true } : { lockedReason: ui.lockReasons.decided };
}
