import { RotateCcw } from 'lucide-react';
import { METER_IDS, STOP_ORDER, StandardStopId } from '../content/types';
import { projectUi, ui } from '../content/ui';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { meterWord } from '../components/MeterDisplay';
import { eyebrow, page } from '../components/styles';
import { ScreenProps } from './types';

const ITEM_STOPS = STOP_ORDER.filter((id) => id !== 'flip') as StandardStopId[];
const label = `${eyebrow} mb-3`;
const card = 'bg-stone-900/50 border border-amber-900/30 p-6 rounded-2xl space-y-3';
const note = 'font-mono text-amber-100/85 text-xs leading-relaxed border-l border-amber-900/40 pl-4 py-1 whitespace-pre-line';

/** Your project (revision spec §7.6): the brief, what you found and on what terms, your work, and where it ended up. */
export function ProjectSummary({ state, dispatch, content }: ScreenProps) {
  const persona = content.personas.find((p) => p.id === state.persona)!;
  const license = state.flip.license ? content.stops.flip.licenses[state.flip.license].label : '';

  return (
    <div className={`${page} space-y-12`}>
      <div className="space-y-3">
        <ScreenHeading className="text-4xl sm:text-5xl font-serif italic text-amber-100">{projectUi.heading}</ScreenHeading>
        <p className="text-amber-50/70 font-serif uppercase tracking-widest text-sm">
          {persona.name} · {persona.medium}
        </p>
      </div>

      <dl className="space-y-4 font-serif">
        <div>
          <dt className={label}>{projectUi.making}</dt>
          <dd className="text-amber-50/90 leading-relaxed">{persona.brief.making}</dd>
        </div>
        <div>
          <dt className={label}>{projectUi.answersTo}</dt>
          <dd className="text-amber-50/90 leading-relaxed">{persona.brief.answersTo}</dd>
        </div>
      </dl>

      <section aria-labelledby="project-items" className="space-y-4">
        <h2 id="project-items" className={label}>{projectUi.items}</h2>
        <ol className="space-y-4">
          {ITEM_STOPS.map((id, i) => (
            <li key={id} data-testid="project-item" className={card}>
              <div className="text-amber-100 font-serif">{persona.brief.items[i]}</div>
              <div className="text-[11px] text-amber-500 font-mono uppercase tracking-widest">{projectUi.stop(i + 1, content.stops[id].title)}</div>
              <p className={note}>{state.cart[id]}</p>
            </li>
          ))}
          <li data-testid="project-work" className={`${card} bg-amber-900/10 border-amber-900/40`}>
            <div className="text-amber-100 font-serif">{projectUi.yourWork}</div>
            <p className="font-serif text-sm text-amber-50/85">{content.stops.flip.work[persona.id]}</p>
            <p className="font-mono text-xs text-amber-100/85">{projectUi.license(license)}</p>
            <p className={note}>{state.cart.flip}</p>
          </li>
        </ol>
      </section>

      <section aria-labelledby="project-meters">
        <h2 id="project-meters" className={label}>{projectUi.meters}</h2>
        <ul className="space-y-1 font-serif text-amber-50/90">
          {METER_IDS.map((m) => (
            <li key={m}>{`${ui.meterLabels[m]}: ${meterWord(m, state.meters[m])}`}</li>
          ))}
        </ul>
      </section>

      {state.mode === 'class' ? (
        <div className="space-y-3 font-serif italic text-amber-50/85 text-lg">
          <p>{projectUi.facilitatorLine}</p>
          <p>{projectUi.debriefPrompt}</p>
        </div>
      ) : (
        <p className="font-serif italic text-amber-50/85 text-lg leading-relaxed">{projectUi.independentSummary}</p>
      )}

      <section aria-labelledby="project-resources">
        <h2 id="project-resources" className={label}>{projectUi.resourcesHeading}</h2>
        <ul className="divide-y divide-amber-900/20">
          {content.resources.map((r) => (
            <li key={r.name} className="py-4 flex flex-col gap-1">
              <div className="flex flex-wrap justify-between gap-2 items-baseline">
                <span className="text-amber-200 font-bold font-serif">{r.name}</span>
                <span className="text-amber-500 text-xs font-mono">{r.url}</span>
              </div>
              <p className="text-sm text-amber-50/70 font-serif">{r.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-center">
        <ChoiceButton
          className="px-10 py-4 border border-amber-900/40 text-amber-300 rounded-full font-serif text-lg hover:bg-amber-900/10 transition-all inline-flex items-center gap-3"
          onSelect={() => dispatch({ type: 'RESET', seed: Date.now() })}
        >
          <RotateCcw size={18} aria-hidden="true" /> {projectUi.playAgain}
        </ChoiceButton>
      </div>
    </div>
  );
}
