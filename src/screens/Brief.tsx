import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { METER_IDS } from '../content/types';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ContinueBar } from '../components/ContinueBar';
import { meterGlyph, meterWord } from '../components/MeterDisplay';
import { btnPrimary, narrativePage } from '../components/styles';
import { ui } from '../content/ui';
import { band } from '../lib/meters';
import { ScreenProps } from './types';

const label = 'text-amber-400 font-bold uppercase tracking-widest text-xs mb-2';

/** One labeled part of the card, exposed as a named region so it reads as its own section. */
function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className={label}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** The project brief (revision spec §3): the Clerk presents a card with the project, its stakes, three items, and the starting meters. */
export function Brief({ state, dispatch, content }: ScreenProps) {
  const persona = content.personas.find((p) => p.id === state.persona);
  const b = ui.brief;
  return (
    <div className={`${narrativePage} space-y-10`}>
      <ScreenHeading className="text-3xl sm:text-4xl font-serif italic text-amber-100">{ui.briefHeading}</ScreenHeading>
      <ClerkSpeech text={content.clerk.briefIntro} />

      {persona && (
        <article aria-label={ui.briefHeading} className="bg-stone-900/50 border border-amber-900/20 p-6 sm:p-8 rounded-2xl space-y-8">
          <div>
            <div className="text-amber-400 font-bold tracking-widest text-sm mb-1">{persona.name}</div>
            <div className="text-amber-100 text-xl font-serif italic">{persona.medium}</div>
          </div>

          <div className="space-y-6 font-serif text-amber-50/90 text-lg leading-relaxed">
            <Part id="brief-making" title={b.making}>
              <p>{persona.brief.making}</p>
            </Part>
            <Part id="brief-answers-to" title={b.answersTo}>
              <p>{persona.brief.answersTo}</p>
            </Part>
            <Part id="brief-deadline" title={b.deadline}>
              <p>{persona.brief.deadline}</p>
            </Part>
            <Part id="brief-items" title={b.items}>
              <ol className="space-y-3">
                {persona.brief.items.map((item, i) => (
                  <li key={i} className="flex gap-4 bg-stone-800/50 p-4 rounded-lg border border-amber-900/20 text-amber-100">
                    <span aria-hidden="true" className="font-mono text-sm text-amber-500 pt-1">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </Part>
          </div>

          <Part id="brief-start" title={b.start}>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4 pt-1">
              {METER_IDS.map((m) => {
                const value = state.meters[m];
                const worst = band(m, value) === 'worst';
                return (
                  <li key={m} data-testid={`brief-meter-${m}`} className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500">{ui.meterLabels[m]}</span>
                    <span className="sr-only">: </span>
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className={`font-mono text-sm tracking-tight ${worst ? 'text-orange-300' : 'text-amber-200'}`}>
                        {meterGlyph(m, value)}
                      </span>
                      <span className="font-serif text-amber-100">{meterWord(m, value)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Part>
        </article>
      )}

      <ContinueBar>
        <ChoiceButton className={btnPrimary} onSelect={() => dispatch({ type: 'FINISH_BRIEF' })}>
          {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
        </ChoiceButton>
      </ContinueBar>
    </div>
  );
}
