import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { ReuseEventKind, ReuseResponse } from '../content/types';
import { flipCartNote, REUSE_ORDER, reuseEffects } from '../lib/flip';
import { ScreenHeading } from '../components/ScreenHeading';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ContinueBar } from '../components/ContinueBar';
import { btnPrimary, eyebrow, narrativePage, page as pageClass } from '../components/styles';
import { LicensePicker } from '../mechanics/LicensePicker';
import { ReuseEvents } from '../mechanics/ReuseEvents';
import { flipNoteLabels } from '../content/ui';
import { isReviewing, onward } from '../state';
import { ScreenProps } from './types';

export function Flip({ state, dispatch, content, openReference }: ScreenProps) {
  const flip = content.stops.flip;
  const persona = state.persona!;
  const page = state.page;
  const license = state.flip.license;
  const reviewing = isReviewing(state);

  /** After the last reuse event: record the flip's cart note (“Your work”: license and responses) and go to the shelf. */
  const finish = () => {
    const r = state.flip.responses;
    if (!license || !r.within || !r.outside || !r.beyond) return;
    dispatch(onward(state, { type: 'FINISH_FLIP', cartNote: flipCartNote(flip, license, r as Record<ReuseEventKind, ReuseResponse>, flipNoteLabels) }));
  };

  return (
    <div className={page.kind === 'intro' ? narrativePage : pageClass}>
      <ScreenHeading focusKey={page.kind} className="mb-10">
        <span className={`block ${eyebrow} mb-3`}>Stop 4 of 4</span>
        <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{flip.title}</span>
      </ScreenHeading>

      {page.kind === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <ClerkSpeech text={flip.clerkIntro} />
          <ContinueBar>
            <button type="button" className={btnPrimary} onClick={() => dispatch(onward(state, { type: 'GO_TO', page: { kind: 'license' } }))}>
              Start with your work <ChevronRight aria-hidden="true" />
            </button>
          </ContinueBar>
        </motion.div>
      )}

      {page.kind === 'license' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{flip.setup[persona]}</p>
          <div className="bg-amber-900/10 border border-amber-900/30 p-6 rounded-2xl">
            <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-2">Your work</div>
            <p className="font-serif text-2xl text-amber-100">{flip.work[persona]}</p>
          </div>
          <LicensePicker
            flip={flip}
            openReference={openReference}
            chosen={license}
            onChoose={(l) => dispatch(onward(state, { type: 'SET_LICENSE', license: l }))}
          />
        </motion.div>
      )}

      {page.kind === 'reuse' && license && (
        <ReuseEvents
          flip={flip}
          persona={persona}
          license={license}
          index={page.index}
          chosen={state.flip.responses[REUSE_ORDER[page.index]] ?? null}
          changes={reviewing ? null : (state.lastChanges?.changes ?? null)}
          onRespond={(response) =>
            dispatch(
              onward(state, {
                type: 'RECORD_REUSE',
                kind: REUSE_ORDER[page.index],
                response,
                effects: reuseEffects(flip, persona, REUSE_ORDER[page.index], response),
              }),
            )
          }
          onNext={() =>
            page.index < REUSE_ORDER.length - 1 ? dispatch(onward(state, { type: 'GO_TO', page: { kind: 'reuse', index: page.index + 1 } })) : finish()
          }
        />
      )}
    </div>
  );
}
