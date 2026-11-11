export function ClerkSpeech({ text, label = 'The Clerk' }: { text: string; label?: string }) {
  return (
    <div className="clerk-box bg-stone-800/40 border-l-4 border-amber-600 p-6 sm:p-8 italic font-serif text-amber-100 text-xl leading-relaxed">
      <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-3 not-italic">{label}</div>
      <p>{text}</p>
    </div>
  );
}
