import { ReactNode, useEffect, useRef } from 'react';

/**
 * The screen's single h1. Takes focus on mount, and again whenever `focusKey` changes
 * (for sub-steps within a screen), so keyboard users never sit on a removed button.
 */
export function ScreenHeading({ children, className = '', focusKey }: { children: ReactNode; className?: string; focusKey?: string | number }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [focusKey]);
  return (
    <h1 ref={ref} tabIndex={-1} className={`outline-none ${className}`}>
      {children}
    </h1>
  );
}
