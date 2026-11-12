import { Choice, Effects, LockMeter, METER_IDS, MeterBand, MeterId, Meters, PersonaId, VisionBand } from '../content/types';

const MIN = 0;
const MAX = 6;
const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));

/** Exposure is inverted: low values are the best band. */
export function band(meter: MeterId, value: number): MeterBand {
  const v = meter === 'exposure' ? MAX - value : value;
  if (v >= 5) return 'best';
  if (v >= 2) return 'middle';
  return 'worst';
}

/** Pure: returns new meters plus the exposure actually added (after clamping), by tag. */
export function applyEffects(meters: Meters, effects: Effects): { meters: Meters; legal: number; reputational: number } {
  const next: Meters = { ...meters };
  let legal = 0;
  let reputational = 0;
  for (const e of effects) {
    const before = next[e.meter];
    next[e.meter] = clamp(before + e.delta);
    const added = next[e.meter] - before;
    if (e.meter === 'exposure' && added > 0) {
      if (e.tag === 'legal') legal += added;
      else if (e.tag === 'reputational') reputational += added;
    }
  }
  return { meters: next, legal, reputational };
}

export function effectsFor(e: Effects | Record<PersonaId, Effects> | undefined, persona: PersonaId): Effects {
  if (!e) return [];
  return Array.isArray(e) ? e : e[persona];
}

/** The first required meter that sits in its worst band, or null if the choice is open. */
export function lockReason(choice: Choice, meters: Meters): LockMeter | null {
  return choice.requires?.find((m) => band(m, meters[m]) === 'worst') ?? null;
}

export function meterChanges(
  before: Meters,
  after: Meters,
): { meter: MeterId; from: MeterBand; to: MeterBand; direction: 'up' | 'down' }[] {
  return METER_IDS.filter((m) => before[m] !== after[m]).map((m) => ({
    meter: m,
    from: band(m, before[m]),
    to: band(m, after[m]),
    direction: after[m] > before[m] ? 'up' : 'down',
  }));
}

const VISION: Record<MeterBand, VisionBand> = { best: 'intact', middle: 'compromised', worst: 'lost' };

export function visionBand(v: number): VisionBand {
  return VISION[band('vision', v)];
}
