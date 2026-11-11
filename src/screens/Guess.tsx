import { endUi } from '../content/ui';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { page } from '../components/styles';
import { ScreenProps } from './types';

export function Guess({ dispatch, content }: ScreenProps) {
  const clerk = content.clerk;
  return (
    <div className={`${page} space-y-10`}>
      <ScreenHeading className="text-4xl font-serif italic text-amber-100">{endUi.guessHeading}</ScreenHeading>
      <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{clerk.guessPrompt}</p>
      <div role="group" aria-label={endUi.guessHeading} className="grid gap-4 sm:grid-cols-2">
        {clerk.guessOptions.map((g) => (
          <ChoiceButton key={g.id} onSelect={() => dispatch({ type: 'SET_GUESS', guess: g.id })}>
            {g.label}
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}
