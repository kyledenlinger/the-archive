import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ui } from '../content/ui';
import { ScreenHeading } from '../components/ScreenHeading';
import { btnPrimary, eyebrow, narration } from '../components/styles';
import { ChoiceButton } from '../components/ChoiceButton';
import { ContinueBar } from '../components/ContinueBar';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { onward } from '../state';
import { ScreenProps } from './types';

export function Onboarding({ state, dispatch, content }: ScreenProps) {
  const lines = content.onboarding.lines;
  const step = state.page.kind === 'beat' ? Math.min(state.page.index, lines.length - 1) : 0;
  const last = step >= lines.length - 1;

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-28 max-w-3xl mx-auto">
      <ScreenHeading className={`${eyebrow} mb-8`} focusKey={step}>
        {ui.onboardingHeading} <span className="sr-only">({step + 1} of {lines.length})</span>
      </ScreenHeading>
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6" data-testid="onboarding-line">
        {lines[step].map((piece, i) =>
          piece.kind === 'clerk' ? (
            <ClerkSpeech key={i} text={piece.text} />
          ) : (
            <p key={i} className={`${narration} text-xl`}>
              {piece.text}
            </p>
          ),
        )}
      </motion.div>
      <ContinueBar>
        {last ? (
          <ChoiceButton className={btnPrimary} onSelect={() => dispatch(onward(state, { type: 'FINISH_ONBOARDING' }))}>
            {ui.onboardingFinish} <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        ) : (
          <button type="button" className={btnPrimary} onClick={() => dispatch(onward(state, { type: 'GO_TO', page: { kind: 'beat', index: step + 1 } }))}>
            Continue <ArrowRight size={20} aria-hidden="true" />
          </button>
        )}
      </ContinueBar>
    </div>
  );
}
