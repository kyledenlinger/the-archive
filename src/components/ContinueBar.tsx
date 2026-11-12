import { ReactNode } from 'react';

/**
 * The primary Continue on narrative screens, fixed to the bottom of the viewport on a solid background
 * so text never shows through. Screens that use it add `pb-28` to their page container.
 */
export function ContinueBar({ children }: { children: ReactNode }) {
  return (
    <div data-testid="continue-bar" className="fixed bottom-0 inset-x-0 h-20 z-20 bg-stone-950 border-t border-amber-900/30">
      <div className="h-full max-w-3xl mx-auto px-6 sm:px-8 flex items-center justify-end gap-6">{children}</div>
    </div>
  );
}
