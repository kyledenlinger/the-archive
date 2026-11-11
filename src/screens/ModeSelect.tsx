import { motion } from 'motion/react';
import { ui } from '../content/ui';
import { ChoiceButton } from '../components/ChoiceButton';
import { ScreenHeading } from '../components/ScreenHeading';
import { ScreenProps } from './types';

export function ModeSelect({ dispatch }: ScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full">
        <ScreenHeading className="text-5xl sm:text-6xl font-serif italic text-amber-100 mb-6 tracking-tight">{ui.title}</ScreenHeading>
        <p className="text-lg text-amber-50/80 font-serif italic leading-relaxed mb-12">{ui.tagline}</p>
        <h2 className="text-amber-200 font-serif text-2xl mb-6">{ui.modeQuestion}</h2>
        <div className="grid gap-4 sm:grid-cols-2 text-left">
          <ChoiceButton className="choice-btn flex-col !items-start gap-2" onSelect={() => dispatch({ type: 'SET_MODE', mode: 'class' })}>
            <span className="text-xl">{ui.classLabel}</span>
            <span className="text-sm text-amber-50/65 font-sans">{ui.classHint}</span>
          </ChoiceButton>
          <ChoiceButton className="choice-btn flex-col !items-start gap-2" onSelect={() => dispatch({ type: 'SET_MODE', mode: 'independent' })}>
            <span className="text-xl">{ui.independentLabel}</span>
            <span className="text-sm text-amber-50/65 font-sans">{ui.independentHint}</span>
          </ChoiceButton>
        </div>
      </motion.div>
    </div>
  );
}
