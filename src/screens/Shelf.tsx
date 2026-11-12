import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LICENSE_IDS } from '../content/types';
import { ScreenHeading } from '../components/ScreenHeading';
import { ClerkSpeech } from '../components/ClerkSpeech';
import { ContinueBar } from '../components/ContinueBar';
import { btnPrimary, eyebrow, narrativePage } from '../components/styles';
import { shelfUi, ui } from '../content/ui';
import { alternateScene, assembleShelf, fateModifiers } from '../lib/epilogue';
import { Page } from '../state';
import { ScreenProps } from './types';

const prose = 'font-serif text-amber-50/90 text-lg leading-relaxed';
const label = `${eyebrow} mb-3`;

/**
 * The shelf where your work ends up (revision spec §7): the Clerk's intro, your shelf (fate, scene, last word,
 * and the offer of other futures), any alternate future, then the closing line. Every page lives in
 * `state.page`, so Back covers them; viewing an alternate never touches the license, cart, or meters.
 */
export function Shelf({ state, dispatch, content }: ScreenProps) {
  const shelf = content.clerk.shelf;
  const persona = state.persona!;
  const license = state.flip.license!;
  const labelOf = (l: typeof license) => content.stops.flip.licenses[l].label;
  const go = (page: Page) => dispatch({ type: 'GO_TO', page });
  const page = state.page;

  if (page.kind === 'shelfMine') {
    const fate = fateModifiers(state.atFlip ?? state.meters, state.meters, state.exposureLegal, state.exposureReputational);
    const mine = assembleShelf(shelf, persona, fate, license, state.flip.responses.outside, state.meters.vision);
    return (
      <div className={`${narrativePage} space-y-10`}>
        <ScreenHeading focusKey="mine">
          <span className={`block ${eyebrow} mb-3`}>{ui.shelfHeading}</span>
          <span className="block text-3xl sm:text-4xl font-serif italic text-amber-100">{shelfUi.yourShelf}</span>
        </ScreenHeading>
        <section aria-labelledby="shelf-fate">
          <h2 id="shelf-fate" className={label}>{shelfUi.fate}</h2>
          <p data-testid="shelf-fate" className={prose}>{mine.fate}</p>
        </section>
        <section aria-labelledby="shelf-scene">
          <h2 id="shelf-scene" className={label}>{shelfUi.scene}</h2>
          <p className="text-amber-200/80 font-mono text-xs uppercase tracking-widest mb-2">{labelOf(license)}</p>
          <p data-testid="shelf-scene" className={prose}>{mine.scene}</p>
        </section>
        <section aria-labelledby="shelf-last">
          <h2 id="shelf-last" className={label}>{shelfUi.lastWord}</h2>
          <blockquote data-testid="shelf-last-word" className="font-serif italic text-amber-100 text-xl leading-relaxed border-l-2 border-amber-700/60 pl-6">
            {mine.lastWord}
          </blockquote>
        </section>
        <section aria-labelledby="shelf-others" className="space-y-6">
          <h2 id="shelf-others" className={label}>{shelfUi.otherFutures}</h2>
          <ClerkSpeech text={shelf.othersOffer} />
          <div role="group" aria-labelledby="shelf-others" className="flex flex-wrap gap-3">
            {LICENSE_IDS.filter((l) => l !== license).map((l) => (
              <button
                key={l}
                type="button"
                className="px-5 py-3 rounded-lg border border-dashed border-amber-700/60 text-amber-200 font-serif hover:bg-amber-900/20 transition-colors"
                onClick={() => go({ kind: 'shelfAlt', license: l })}
              >
                {shelfUi.see(labelOf(l))}
              </button>
            ))}
          </div>
        </section>
        <ContinueBar>
          <button type="button" className={btnPrimary} onClick={() => go({ kind: 'closing' })}>
            {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
          </button>
        </ContinueBar>
      </div>
    );
  }

  if (page.kind === 'shelfAlt') {
    const alt = alternateScene(shelf, persona, page.license, labelOf(page.license));
    return (
      <div className={narrativePage}>
        <div data-testid="shelf-alt" className="opacity-80 saturate-50 border-2 border-dashed border-amber-700/60 rounded-2xl p-6 sm:p-10 space-y-8">
          <ScreenHeading focusKey={page.license} className="text-3xl sm:text-4xl font-serif italic text-amber-100">
            {alt.heading}
          </ScreenHeading>
          <p className={prose}>{alt.scene}</p>
        </div>
        <ContinueBar>
          <button type="button" className={btnPrimary} onClick={() => go({ kind: 'shelfMine' })}>
            <ChevronLeft aria-hidden="true" /> {shelf.backToYours}
          </button>
        </ContinueBar>
      </div>
    );
  }

  if (page.kind === 'closing') {
    return (
      <div className={`${narrativePage} space-y-10`}>
        <ScreenHeading focusKey="closing" className="text-3xl sm:text-4xl font-serif italic text-amber-100">
          {ui.shelfHeading}
        </ScreenHeading>
        <ClerkSpeech text={shelf.closingLine} />
        <ContinueBar>
          <button type="button" className={btnPrimary} onClick={() => dispatch({ type: 'ADVANCE' })}>
            {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
          </button>
        </ContinueBar>
      </div>
    );
  }

  // The Clerk walks you to the shelf.
  return (
    <div className={`${narrativePage} space-y-8`}>
      <ScreenHeading focusKey="intro" className="text-3xl sm:text-4xl font-serif italic text-amber-100">
        {ui.shelfHeading}
      </ScreenHeading>
      {shelf.intro.map((p) => (
        <ClerkSpeech key={p} text={p} />
      ))}
      <ContinueBar>
        <button type="button" className={btnPrimary} onClick={() => go({ kind: 'shelfMine' })}>
          {content.interstitial.continueLabel} <ChevronRight aria-hidden="true" />
        </button>
      </ContinueBar>
    </div>
  );
}
