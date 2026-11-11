import { useCallback, useReducer, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { content as defaultContent } from './content';
import { GameContent } from './content/types';
import { initialState, reducer } from './state';
import { CartBar } from './components/CartBar';
import { ReferencePanel } from './components/ReferencePanel';
import { ScreenHeading } from './components/ScreenHeading';
import { ModeSelect } from './screens/ModeSelect';
import { Onboarding } from './screens/Onboarding';
import { PersonaSelect } from './screens/PersonaSelect';
import { Stop } from './screens/Stop';
import { Interstitial } from './screens/Interstitial';
import { ScreenProps } from './screens/types';

function NotYetBuilt(_: ScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ScreenHeading className="text-2xl font-serif italic text-amber-100">Under construction</ScreenHeading>
    </div>
  );
}

function CurrentScreen(props: ScreenProps) {
  switch (props.state.screen) {
    case 'mode':
      return <ModeSelect {...props} />;
    case 'onboarding':
      return <Onboarding {...props} />;
    case 'persona':
      return <PersonaSelect {...props} />;
    case 'stop':
      return <Stop {...props} />;
    case 'interstitial':
      return <Interstitial {...props} />;
    default:
      return <NotYetBuilt {...props} />;
  }
}

export default function App({ seed, content = defaultContent }: { seed?: number; content?: GameContent }) {
  const [state, dispatch] = useReducer(reducer, seed ?? Date.now(), initialState);
  const [refOpen, setRefOpen] = useState(false);
  const openRef = useCallback(() => setRefOpen(true), []);
  const closeRef = useCallback(() => setRefOpen(false), []);
  const showCart = !['mode', 'onboarding', 'persona'].includes(state.screen);
  const persona = content.personas.find((p) => p.id === state.persona);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-stone-950 text-amber-50 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
        {showCart && <CartBar cart={state.cart} content={content} personaName={persona?.name} />}
        <main className="relative z-10" key={`${state.screen}-${state.stopIndex}`}>
          <CurrentScreen state={state} dispatch={dispatch} content={content} />
        </main>
        <ReferencePanel entries={content.reference} resources={content.resources} revealed={state.revealed} open={refOpen} onOpen={openRef} onClose={closeRef} />
        <div className="fixed inset-0 pointer-events-none opacity-20" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#292524_0%,transparent_70%)]" />
        </div>
      </div>
    </MotionConfig>
  );
}
