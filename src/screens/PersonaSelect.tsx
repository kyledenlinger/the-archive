import { User } from 'lucide-react';
import { ui } from '../content/ui';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton, decidedProps } from '../components/ChoiceButton';
import { onward } from '../state';
import { ScreenProps } from './types';

/** Revisited with Back, your persona is marked and the others are locked: the choice is final. */
export function PersonaSelect({ state, dispatch, content }: ScreenProps) {
  return (
    <div className="min-h-screen py-20 px-6 sm:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <ScreenHeading className="text-4xl font-serif italic text-amber-100 mb-4">{ui.personaHeading}</ScreenHeading>
        <p className="text-amber-50/70 font-serif">{ui.personaIntro}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.personas.map((p) => (
          <ChoiceButton
            key={p.id}
            {...decidedProps(state.persona ?? undefined, p.id)}
            onSelect={() => dispatch(onward(state, { type: 'CHOOSE_PERSONA', persona: p.id, startMeters: p.startMeters }))}
            className="bg-stone-900/50 border border-amber-900/20 p-8 rounded-2xl text-left hover:border-amber-500/50 hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <span className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity" aria-hidden="true">
              <User size={80} />
            </span>
            <span className="block text-amber-400 font-bold tracking-widest text-sm mb-2">{p.name}</span>
            <span className="block text-amber-100 text-xl font-serif italic mb-4">{p.medium}</span>
            <span className="block text-amber-50/75 text-sm leading-relaxed font-serif">{p.description}</span>
          </ChoiceButton>
        ))}
      </div>
    </div>
  );
}
