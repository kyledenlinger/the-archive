import { useEffect, useRef, useState } from 'react';
import { Clock, Eye, ShieldAlert, Wallet } from 'lucide-react';
import { METER_IDS, MeterBand, MeterId, Meters } from '../content/types';
import { ui } from '../content/ui';
import { band } from '../lib/meters';
import { GameState, MeterChange } from '../state';

const ICONS: Record<MeterId, typeof Clock> = { time: Clock, budget: Wallet, exposure: ShieldAlert, vision: Eye };

/** How many of the three segments are filled. Exposure counts risk, so its best band (Low) fills one. */
export function filledSegments(meter: MeterId, b: MeterBand): number {
  const n = b === 'best' ? 3 : b === 'middle' ? 2 : 1;
  return meter === 'exposure' ? 4 - n : n;
}

export function meterGlyph(meter: MeterId, value: number): string {
  const filled = filledSegments(meter, band(meter, value));
  return '■'.repeat(filled) + '□'.repeat(3 - filled);
}

export function meterWord(meter: MeterId, value: number): string {
  return ui.meterWords[meter][band(meter, value)];
}

/** One line per changed meter: “Time: Plenty → Tight” across bands, or “Exposure rises (legal)” within one. */
export function describeChanges(changes: MeterChange[]): string[] {
  return changes.map((c) => {
    const label = ui.meterLabels[c.meter];
    return c.from === c.to
      ? ui.meterNudge(label, c.direction, c.tag)
      : ui.meterChange(label, ui.meterWords[c.meter][c.from], ui.meterWords[c.meter][c.to]);
  });
}

/** The change lines on an outcome screen, before anything is applied. Renders nothing when no meter moves. */
export function ChangeLines({ changes }: { changes: MeterChange[] }) {
  if (changes.length === 0) return null;
  return (
    <ul aria-label={ui.changesLabel} data-testid="change-lines" className="space-y-1 font-sans text-sm text-amber-200">
      {describeChanges(changes).map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

/**
 * The four meters for the header. Below `lg` they collapse to an icon and the glyph (the full words stay
 * in screen-reader text and in the Cart panel). A visually hidden polite live region announces each set of
 * changes once: only a new `lastChanges.id` replaces its contents, so re-renders never re-announce, and a
 * change that was already there when this mounted is not announced at all.
 */
export function MeterDisplay({ meters, lastChanges }: { meters: Meters; lastChanges: GameState['lastChanges'] }) {
  const seen = useRef(lastChanges?.id ?? null);
  const [announcement, setAnnouncement] = useState<{ id: number; lines: string[] } | null>(null);

  useEffect(() => {
    if (!lastChanges || lastChanges.id === seen.current) return;
    seen.current = lastChanges.id;
    setAnnouncement({ id: lastChanges.id, lines: describeChanges(lastChanges.changes) });
  }, [lastChanges]);

  return (
    <>
      <ul aria-label={ui.metersLabel} className="flex items-center justify-between md:justify-start gap-x-4 lg:gap-x-5">
        {METER_IDS.map((m) => {
          const Icon = ICONS[m];
          const word = meterWord(m, meters[m]);
          const worst = band(m, meters[m]) === 'worst';
          return (
            <li key={m} title={`${ui.meterLabels[m]}: ${word}`} data-band={band(m, meters[m])}>
              <span className="sr-only">{`${ui.meterLabels[m]}: ${word}`}</span>
              <span aria-hidden="true" className="flex items-center gap-1.5 lg:flex-col lg:items-start lg:gap-0">
                <Icon size={13} className="lg:hidden text-amber-500" />
                <span className="hidden lg:block text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500">{ui.meterLabels[m]}</span>
                <span className="flex items-center gap-1.5">
                  <span data-testid={`meter-glyph-${m}`} className={`font-mono text-xs tracking-tight ${worst ? 'text-orange-300' : 'text-amber-200'}`}>
                    {meterGlyph(m, meters[m])}
                  </span>
                  <span className="hidden lg:inline font-serif text-sm text-amber-100">{word}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite" className="sr-only" data-testid="meter-live">
        {announcement && (
          <div key={announcement.id}>
            {announcement.lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
