import { ReactNode, useRef } from 'react';

/** A button that fires once per mount, so a fast double-click can't register two choices. */
export function ChoiceButton({
  onSelect,
  disabled,
  children,
  className = 'choice-btn',
  ariaLabel,
}: {
  onSelect: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const fired = useRef(false);
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        if (fired.current || disabled) return;
        fired.current = true;
        onSelect();
      }}
    >
      {children}
    </button>
  );
}
