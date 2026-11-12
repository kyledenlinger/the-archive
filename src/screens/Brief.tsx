import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, narration, page } from '../components/styles';
import { ScreenProps } from './types';

/** revision-2 stub: Task 7 builds the real brief (making, answers-to, deadline, items, meters). */
export function Brief({ dispatch, content }: ScreenProps) {
  return (
    <div className={`${page} space-y-10`}>
      <ScreenHeading className={narration}>{content.clerk.briefIntro}</ScreenHeading>
      <div className="flex justify-center">
        <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'FINISH_BRIEF' })}>
          {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
        </ChoiceButton>
      </div>
    </div>
  );
}
