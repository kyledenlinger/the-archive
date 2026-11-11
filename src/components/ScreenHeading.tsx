import { ReactNode, useEffect, useRef } from 'react';

/**
 * A heading that takes focus on mount, and again whenever `focusKey` changes, so keyboard
 * users never sit on a removed button. Each screen renders exactly one level-1 instance;
 * mechanics nested inside a screen use level 2 for their own sub-steps.
 */
export function ScreenHeading({
  children,
  className = '',
  focusKey,
  level = 1,
}: {
  children: ReactNode;
  className?: string;
  focusKey?: string | number;
  level?: 1 | 2;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [focusKey]);
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <Tag ref={ref} tabIndex={-1} className={`outline-none ${className}`}>
      {children}
    </Tag>
  );
}
