import { ReactNode, useId, useRef } from 'react';

/**
 * A button that fires once per mount, so a fast double-click can't register two choices.
 * With `lockedReason` it stays visible and focusable but does nothing: it carries `aria-disabled="true"`
 * (never the native `disabled`), and the reason shows under it, linked by `aria-describedby`.
 */
export function ChoiceButton({
  onSelect,
  lockedReason,
  children,
  className = 'choice-btn',
  ariaLabel,
}: {
  onSelect: () => void;
  lockedReason?: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const fired = useRef(false);
  const reasonId = useId();
  const locked = Boolean(lockedReason);
  const button = (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-disabled={locked ? 'true' : undefined}
      aria-describedby={locked ? reasonId : undefined}
      className={locked ? `${className} opacity-60 cursor-not-allowed` : className}
      onClick={() => {
        if (fired.current || locked) return;
        fired.current = true;
        onSelect();
      }}
    >
      {children}
    </button>
  );
  if (!locked) return button;
  return (
    <div className="flex flex-col gap-2">
      {button}
      <span id={reasonId} className="text-sm font-sans text-amber-200/80 pl-6">
        {lockedReason}
      </span>
    </div>
  );
}
