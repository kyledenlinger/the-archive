import { ui } from '../content/ui';

/**
 * Every line the Clerk speaks (revision spec §2.3): its own block with a left rule, the “The Clerk” label,
 * and a typewriter face (`--font-clerk`), so it never depends on color to set him apart from the narrator.
 */
export function ClerkSpeech({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <figure className={`clerk-box bg-stone-800/40 border-l-4 border-amber-600 ${compact ? 'p-4' : 'p-6 sm:p-8'}`}>
      <figcaption className="text-[10px] font-bold font-sans tracking-[0.3em] text-amber-500 uppercase mb-3">{ui.clerkLabel}</figcaption>
      <p className={`font-clerk text-amber-100 leading-relaxed ${compact ? 'text-base' : 'text-lg'}`}>{text}</p>
    </figure>
  );
}
