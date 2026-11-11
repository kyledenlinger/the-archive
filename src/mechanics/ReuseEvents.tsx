import { useState } from 'react';
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
  onRespond: (index: number, response: ReuseResponse) => void;
  onComplete: () => void;
}

/** The three reuse events, in order. There is no way back to the license picker from here. */
export function ReuseEvents({ flip, persona, license, onRespond, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<ReuseResponse | null>(null);
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
            <ChoiceButton
              key={`${index}-${r}`}
              onSelect={() => {
                setChosen(r);
                onRespond(index, r);
              }}
            >
              {flip.responses[r].label}
            </ChoiceButton>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <p className="font-mono text-sm text-amber-200">You chose: {flip.responses[chosen].label}.</p>
          <ChoiceButton
            className={btnPrimary}
            onSelect={() => {
              if (index < 2) {
                setIndex(index + 1);
                setChosen(null);
              } else onComplete();
            }}
          >
            Next <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        </div>
      )}
    </motion.div>
  );
}
