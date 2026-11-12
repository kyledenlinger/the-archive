import { useState } from 'react';
import { motion } from 'motion/react';
import { GameContent, PersonaId, StandardStopId } from '../content/types';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { eyebrow } from '../components/styles';

type Lean = 'supports' | 'complicates' | 'unsure';
const LEAN_LABEL: Record<Lean, string> = {
  supports: 'This supports fair use',
  complicates: 'This complicates fair use',
  unsure: 'Not sure yet',
};

interface Props {
  stopId: StandardStopId;
  persona: PersonaId;
  content: GameContent;
  onDone: (cartNote: string) => void;
  onBack: () => void;
}

export function FairUseAnalysis({ stopId, persona, content, onDone, onBack }: Props) {
  const [answers, setAnswers] = useState<Lean[]>([]);
  const { factors, assessments } = content.fairUse;
  const step = answers.length; // 0–3: factors; 4: summary
  const assessment = assessments[stopId][persona];

  if (step < 4) {
    const f = factors[step];
    return (
      <div className="space-y-10">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <ScreenHeading level={2} focusKey={step} className={eyebrow}>
              Fair use analysis: factor {step + 1} of 4
            </ScreenHeading>
          </div>
          <div className="h-1 bg-stone-900 rounded-full overflow-hidden" aria-hidden="true">
            <motion.div initial={{ width: `${step * 25}%` }} animate={{ width: `${(step + 1) * 25}%` }} className="h-full bg-amber-500" />
          </div>
        </div>
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-amber-100">{f.title}</h3>
            <p className="text-amber-50/70 font-serif italic">{f.description}</p>
          </div>
          <p className="bg-stone-900/50 border border-amber-900/20 p-6 sm:p-8 rounded-2xl font-serif text-amber-50/90 text-lg leading-relaxed">{f.text[stopId][persona]}</p>
          <div className="grid gap-4" role="group" aria-label="How does this factor lean?">
            {(Object.keys(LEAN_LABEL) as Lean[]).map((lean) => (
              <ChoiceButton key={`${step}-${lean}`} className="choice-btn justify-center text-center" onSelect={() => setAnswers((a) => (a.length === step ? [...a, lean] : a))}>
                {LEAN_LABEL[lean]}
              </ChoiceButton>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <ScreenHeading level={2} focusKey="summary" className="text-3xl font-serif italic text-amber-100">
        Fair use summary
      </ScreenHeading>
      <div className="overflow-x-auto rounded-2xl border border-amber-900/30 bg-stone-900/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-950/50 text-amber-500 uppercase tracking-widest text-[10px] font-bold">
              <th scope="col" className="p-4 border-b border-amber-900/20">Factor</th>
              <th scope="col" className="p-4 border-b border-amber-900/20">How you read it</th>
            </tr>
          </thead>
          <tbody className="text-amber-50/85 font-serif text-sm">
            {factors.map((f, i) => (
              <tr key={f.title} className="border-b border-amber-900/10">
                <th scope="row" className="p-4 font-bold text-amber-200">{f.title}</th>
                <td className="p-4">{LEAN_LABEL[answers[i]]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ClerkSpeech text={assessment.text} />
      <div className="flex flex-col gap-4">
        <ChoiceButton className="choice-btn bg-amber-900/20 border-amber-500/50 justify-center text-center" onSelect={() => onDone('Fair use basis. ' + assessment.text)}>
          Add to cart on a fair use basis
        </ChoiceButton>
        <ChoiceButton className="choice-btn justify-center text-center" onSelect={onBack}>
          Go back to the choices
        </ChoiceButton>
      </div>
    </div>
  );
}
