import { ChevronRight } from 'lucide-react';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnPrimary, narration, page } from '../components/styles';
import { ScreenProps } from './types';

/** revision-2 stub: the guess is gone. It shows the shelf intro and passes through; Task 12 deletes this screen. */
export function Guess({ dispatch, content }: ScreenProps) {
  const [first, ...rest] = content.clerk.shelf.intro;
  return (
    <div className={`${page} space-y-10`}>
      <ScreenHeading className={narration}>{first}</ScreenHeading>
      {rest.map((p) => <p key={p} className={narration}>{p}</p>)}
      <div className="flex justify-center">
        <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'SET_GUESS', guess: 'other' })}>
          Continue <ChevronRight aria-hidden="true" />
        </ChoiceButton>
      </div>
    </div>
  );
}
