import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { FlipStop, LICENSE_IDS, LicenseId } from '../content/types';
import { ChoiceButton, decidedProps } from '../components/ChoiceButton';
import { ClerkSpeech } from '../components/ClerkSpeech';

interface Props {
  flip: FlipStop;
  onChoose: (license: LicenseId) => void;
  openReference?: () => void;
  /** The license already picked (from `state.flip.license`), if any. The pick is final. */
  chosen?: LicenseId | null;
}

export function LicensePicker({ flip, onChoose, openReference, chosen }: Props) {
  const [shown, setShown] = useState<Partial<Record<LicenseId, boolean>>>({});
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-baseline gap-4">
        <h2 className="text-amber-200 text-sm uppercase tracking-widest font-bold">Choose a license</h2>
        {openReference && (
          <button type="button" onClick={openReference} className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-200 text-sm">
            <BookOpen size={16} aria-hidden="true" /> Open the reference desk
          </button>
        )}
      </div>
      <ul className="space-y-4">
        {LICENSE_IDS.map((id) => {
          const l = flip.licenses[id];
          const summaryId = `license-summary-${id}`;
          return (
            <li key={id} className="bg-stone-900/50 border border-amber-900/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-amber-100 font-serif text-2xl">{l.label}</h3>
              <ClerkSpeech compact text={l.clerkGloss} />
              <button
                type="button"
                aria-expanded={Boolean(shown[id])}
                aria-controls={summaryId}
                aria-label={`What ${l.label} actually means`}
                onClick={() => setShown((s) => ({ ...s, [id]: !s[id] }))}
                className="text-sm text-amber-400 hover:text-amber-200 underline underline-offset-4"
              >
                {shown[id] ? 'Hide' : 'What this actually means'}
              </button>
              {shown[id] && (
                <p id={summaryId} className="text-sm text-amber-50/90 bg-stone-950/60 border-l-2 border-amber-600 p-4">
                  {l.summary}
                </p>
              )}
              <div>
                <ChoiceButton
                  className="choice-btn !w-auto !p-4"
                  ariaLabel={`Choose ${l.label}`}
                  {...decidedProps(chosen ?? undefined, id)}
                  onSelect={() => onChoose(id)}
                >
                  Choose this license
                </ChoiceButton>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
