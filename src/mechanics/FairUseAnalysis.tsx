import { motion } from 'motion/react';
import { Effects, GameContent, Meters, PersonaId, StandardStopId } from '../content/types';
import { fairUseEffects, previewChanges } from '../lib/meters';
import { ChangeLines } from '../components/MeterDisplay';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton, decidedProps } from '../components/ChoiceButton';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { Pause } from 'lucide-react';
import { btnPause, eyebrow } from '../components/styles';
import { Lean } from '../state';

const LEAN_LABEL: Record<Lean, string> = {
  supports: 'This supports fair use',
  complicates: 'This complicates fair use',
  unsure: 'Not sure yet',
};

interface Props {
  stopId: StandardStopId;
  persona: PersonaId;
  content: GameContent;
  /** Which factor is showing (0–3), or 4 for the summary. Lives in `state.page`. */
  factor: number;
  /** The answer given for each factor so far (from `state.decisions`); an answered factor is final. */
  answers: (Lean | undefined)[];
  /** True on a page revisited with Back: the summary's button only moves forward. */
  reviewing: boolean;
  /** Current meters; when given, the summary previews what relying on the analysis changes. */
  meters?: Meters;
  /** Class mode: the summary's button label, styled as a pause, since it leads straight to the pause card. */
  pauseLabel?: string;
  onAnswer: (lean: Lean) => void;
  onDone: (cartNote: string, effects: Effects) => void;
}

/** The four factors, one page each, then the summary. There is no way out but through: starting it is a choice. */
export function FairUseAnalysis({ stopId, persona, content, factor, answers, reviewing, meters, pauseLabel, onAnswer, onDone }: Props) {
  const { factors, assessments } = content.fairUse;
  const step = Math.min(factor, 4);
  const assessment = assessments[stopId][persona];
  const effects = fairUseEffects(assessment.strength);

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
              <ChoiceButton
                key={`${step}-${lean}`}
                className="choice-btn justify-center text-center"
                {...decidedProps(answers[step], lean)}
                onSelect={() => onAnswer(lean)}
              >
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
                <td className="p-4">{answers[i] ? LEAN_LABEL[answers[i]] : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ClerkSpeech text={assessment.text} />
      {meters && <ChangeLines changes={previewChanges(meters, effects)} />}
      <div className="flex flex-col gap-4">
        {pauseLabel && !reviewing ? (
          // Class mode: this records the stop and goes straight to the pause card.
          <ChoiceButton className={`${btnPause} justify-center text-center`} onSelect={() => onDone('Fair use basis. ' + assessment.text, effects)}>
            <Pause aria-hidden="true" /> {pauseLabel}
          </ChoiceButton>
        ) : (
          <ChoiceButton className="choice-btn bg-amber-900/20 border-amber-500/50 justify-center text-center" onSelect={() => onDone('Fair use basis. ' + assessment.text, effects)}>
            {reviewing ? 'Continue' : 'Add to cart on a fair use basis'}
          </ChoiceButton>
        )}
      </div>
    </div>
  );
}
