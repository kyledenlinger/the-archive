import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { content as defaultContent } from './content';
import { GameContent } from './content/types';
import { initialState, reducer } from './state';
import { ui } from './content/ui';
import { Header, PanelId } from './components/Header';
import { ReferencePanel } from './components/ReferencePanel';
import { AboutPanel } from './components/AboutPanel';
import { CartPanel } from './components/CartPanel';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ModeSelect } from './screens/ModeSelect';
import { Onboarding } from './screens/Onboarding';
import { PersonaSelect } from './screens/PersonaSelect';
import { Stop } from './screens/Stop';
import { Interstitial } from './screens/Interstitial';
import { Flip } from './screens/Flip';
import { Brief } from './screens/Brief';
import { Shelf } from './screens/Shelf';
import { ProjectSummary } from './screens/ProjectSummary';
import { ScreenProps } from './screens/types';

function CurrentScreen(props: ScreenProps) {
  switch (props.state.screen) {
    case 'mode':
      return <ModeSelect {...props} />;
    case 'onboarding':
      return <Onboarding {...props} />;
    case 'persona':
      return <PersonaSelect {...props} />;
    case 'brief':
      return <Brief {...props} />;
    case 'stop':
      return <Stop {...props} />;
    case 'interstitial':
      return <Interstitial {...props} />;
    case 'flip':
      return <Flip {...props} />;
    case 'shelf':
      return <Shelf {...props} />;
    case 'project':
      return <ProjectSummary {...props} />;
  }
}

export default function App({ seed, content = defaultContent }: { seed?: number; content?: GameContent }) {
  const [state, dispatch] = useReducer(reducer, seed ?? Date.now(), initialState);
  // At most one panel or dialog is open; everything behind it is inert.
  const [panel, setPanel] = useState<PanelId | null>(null);
  const openRef = useCallback(() => setPanel('reference'), []);
  const close = useCallback(() => setPanel(null), []);
  const startOver = useCallback(() => {
    setPanel(null);
    dispatch({ type: 'RESET', seed: Date.now() });
  }, []);
  const covered = panel !== null;
  // After Back, focus goes to the restored page's main heading (nested headings focus first; this runs last).
  const mainRef = useRef<HTMLElement>(null);
  const focusAfterBack = useRef(false);
  const goBack = useCallback(() => {
    focusAfterBack.current = true;
    dispatch({ type: 'BACK' });
  }, []);
  useEffect(() => {
    if (!focusAfterBack.current) return;
    focusAfterBack.current = false;
    mainRef.current?.querySelector<HTMLElement>('h1')?.focus();
  }, [state]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-stone-950 text-amber-50 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
        <div inert={covered}>
          <Header state={state} content={content} openPanel={panel} onOpen={setPanel} onBack={goBack} />
        </div>
        <main ref={mainRef} className="relative z-10" key={`${state.screen}-${state.stopIndex}`} inert={covered}>
          <CurrentScreen state={state} dispatch={dispatch} content={content} openReference={openRef} />
        </main>
        <ReferencePanel entries={content.reference} resources={content.resources} open={panel === 'reference'} onClose={close} />
        <AboutPanel open={panel === 'about'} onClose={close} />
        <CartPanel state={state} content={content} open={panel === 'cart'} onClose={close} />
        <ConfirmDialog
          open={panel === 'home'}
          question={ui.confirmReset.question}
          confirmLabel={ui.confirmReset.confirm}
          cancelLabel={ui.confirmReset.cancel}
          onConfirm={startOver}
          onCancel={close}
        />
        <div className="fixed inset-0 pointer-events-none opacity-20" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#292524_0%,transparent_70%)]" />
        </div>
      </div>
    </MotionConfig>
  );
}
