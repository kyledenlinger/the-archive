import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ContinueBar } from '../components/ContinueBar';
import { btnPrimary, narrativePage } from '../components/styles';
import { ui } from '../content/ui';
import { onward } from '../state';
import { ScreenProps } from './types';

/** revision-2 stub: Task 12 builds the real shelf (fate, scene, last word, other futures). */
export function Shelf({ state, dispatch, content }: ScreenProps) {
  return (
    <div className={`${narrativePage} space-y-10`}>
      <ScreenHeading className="text-3xl sm:text-4xl font-serif italic text-amber-100">{ui.shelfHeading}</ScreenHeading>
      <ClerkSpeech text={content.clerk.shelf.closingLine} />
      <ContinueBar>
        <ChoiceButton className={btnPrimary} onSelect={() => dispatch(onward(state, { type: 'ADVANCE' }))}>
          {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
        </ChoiceButton>
      </ContinueBar>
    </div>
  );
}
