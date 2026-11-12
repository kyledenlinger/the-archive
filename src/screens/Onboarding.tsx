import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ui } from '../content/ui';
import { ScreenHeading } from '../components/ScreenHeading';
import { btnPrimary, eyebrow, narration } from '../components/styles';
import { ChoiceButton } from '../components/ChoiceButton';
import { ContinueBar } from '../components/ContinueBar';
import { ScreenProps } from './types';

export function Onboarding({ dispatch, content }: ScreenProps) {
  const [step, setStep] = useState(0);
  const lines = content.onboarding.lines;
  const last = step >= lines.length - 1;

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-28 max-w-3xl mx-auto">
      <ScreenHeading className={`${eyebrow} mb-8`} focusKey={step}>
        {ui.onboardingHeading} <span className="sr-only">({step + 1} of {lines.length})</span>
      </ScreenHeading>
      <motion.p key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`${narration} text-xl`} data-testid="onboarding-line">
        {lines[step]}
      </motion.p>
      <ContinueBar>
        {last ? (
          <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'FINISH_ONBOARDING' })}>
            {ui.onboardingFinish} <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        ) : (
          <button type="button" className={btnPrimary} onClick={() => setStep((s) => Math.min(s + 1, lines.length - 1))}>
            Continue <ArrowRight size={20} aria-hidden="true" />
          </button>
        )}
      </ContinueBar>
    </div>
  );
}
