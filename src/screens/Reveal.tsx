import { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, narration, page } from '../components/styles';
import { ScreenProps } from './types';

/** revision-2 stub: the reveal is gone. It passes straight through to the ending; Task 12 deletes this screen. */
export function Reveal({ state, dispatch, content }: ScreenProps) {
  useEffect(() => {
    if (!state.revealed) dispatch({ type: 'REVEAL' });
  }, [state.revealed, dispatch]);

  return (
    <div className={`${page} space-y-10`}>
      <ScreenHeading className={narration}>{content.clerk.shelf.othersOffer}</ScreenHeading>
      {state.revealed && (
        <div className="flex justify-center">
          <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'SET_ENDING', ending: 'shelf' })}>
            Continue <ChevronRight aria-hidden="true" />
          </ChoiceButton>
        </div>
      )}
    </div>
  );
}
