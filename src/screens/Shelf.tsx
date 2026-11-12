import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, page } from '../components/styles';
import { ScreenProps } from './types';

/** revision-2 stub: Task 12 builds the real shelf (fate, scene, last word, other futures). */
export function Shelf({ dispatch, content }: ScreenProps) {
  return (
    <div className={`${page} space-y-10`}>
      <ScreenHeading className="font-serif text-2xl text-amber-200 text-center py-6 border-y border-amber-900/30">
        {content.clerk.shelf.closingLine}
      </ScreenHeading>
      <div className="flex justify-center">
        <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'ADVANCE' })}>
          {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
        </ChoiceButton>
      </div>
    </div>
  );
}
