import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ContinueBar } from '../components/ContinueBar';
import { btnPrimary, narrativePage } from '../components/styles';
import { ui } from '../content/ui';
import { ScreenProps } from './types';

/** revision-2 stub: Task 7 builds the real brief (making, answers-to, deadline, items, meters). */
export function Brief({ dispatch, content }: ScreenProps) {
  return (
    <div className={`${narrativePage} space-y-10`}>
      <ScreenHeading className="text-3xl sm:text-4xl font-serif italic text-amber-100">{ui.briefHeading}</ScreenHeading>
      <ClerkSpeech text={content.clerk.briefIntro} />
      <ContinueBar>
        <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'FINISH_BRIEF' })}>
          {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
        </ChoiceButton>
      </ContinueBar>
    </div>
  );
}
