import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { FlipStop, LicenseId, PersonaId, ReuseResponse } from '../content/types';
import { REUSE_ORDER, resolveReuse } from '../lib/flip';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, eyebrow } from '../components/styles';

const RESPONSE_ORDER: ReuseResponse[] = ['takedown', 'credit', 'negotiate', 'let-go'];

interface Props {
  flip: FlipStop;
  persona: PersonaId;
  license: LicenseId;
  /** Which event is showing (0–2); lives in `state.page`. */
  index: number;
  /** The response already given to this event (from `state.flip.responses`), if any. Answers are final. */
  chosen: ReuseResponse | null;
  onRespond: (response: ReuseResponse) => void;
  onNext: () => void;
}

/** One reuse event. Once answered, it shows the answer and Next; Back (in the header) is the only way back. */
export function ReuseEvents({ flip, persona, license, index, chosen, onRespond, onNext }: Props) {
  const kind = REUSE_ORDER[index];
  const event = flip.events[persona][kind];

  return (
    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <ScreenHeading level={2} focusKey={`${index}-${chosen ?? ''}`} className={eyebrow}>
        Reuse {index + 1} of 3 · your license: {flip.licenses[license].label}
      </ScreenHeading>
      <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{event.setup}</p>
      <p className="font-serif italic text-amber-50/85 leading-relaxed bg-stone-900/50 border-l-2 border-amber-600 p-6">{resolveReuse(flip, persona, kind, license)}</p>
      {chosen === null ? (
        <div role="group" aria-labelledby="reuse-q" className="grid gap-4 sm:grid-cols-2">
          <h3 id="reuse-q" className="sm:col-span-2 text-amber-200 text-sm uppercase tracking-widest font-bold">
            What do you do?
          </h3>
          {RESPONSE_ORDER.map((r) => (
            <ChoiceButton key={`${index}-${r}`} onSelect={() => onRespond(r)}>
              {flip.responses[r].label}
            </ChoiceButton>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <p className="font-mono text-sm text-amber-200">You chose: {flip.responses[chosen].label}.</p>
          <ChoiceButton key={`next-${index}`} className={btnPrimary} onSelect={onNext}>
            Next <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        </div>
      )}
    </motion.div>
  );
}
