import { AskField, AskOdds, AskResponse, PersonaId, StandardStopId, Term } from '../content/types';
import { fnv1a, mulberry32 } from './rng';

/** Used when content doesn't set odds for a persona and stop. */
export const DEFAULT_ODDS: AskOdds = {
  wellFormed: { yes: 35, conditional: 35, no: 15, silence: 15 },
  poor: { yes: 15, conditional: 25, no: 25, silence: 35 },
};
const ORDER: AskResponse[] = ['yes', 'conditional', 'no', 'silence'];

export function isWellFormed(request: Partial<Record<AskField, string>>): boolean {
  return Object.values(request).filter((v) => typeof v === 'string' && v.trim() !== '').length >= 3;
}

/**
 * Derives a roll's seed from the session seed, persona, stop, and a salt naming the roll.
 * Every hidden roll is a pure function of these, so going back or retrying never rerolls.
 */
export function rollSeed(seed: number, persona: PersonaId, stopId: StandardStopId, salt: string): number {
  return (fnv1a(`${persona}|${stopId}|${salt}`) ^ seed) >>> 0;
}

function draw(seed: number, persona: PersonaId, stopId: StandardStopId, salt: string): number {
  return mulberry32(rollSeed(seed, persona, stopId, salt))();
}

/** Picks one item by weight; zero-weight items are never picked (unless every weight is zero). */
function pickWeighted<T>(r: number, items: T[], weightOf: (item: T) => number): T {
  const total = items.reduce((n, it) => n + Math.max(0, weightOf(it)), 0);
  if (total <= 0) return items[items.length - 1];
  let acc = 0;
  for (const it of items) {
    const w = Math.max(0, weightOf(it));
    if (w === 0) continue;
    acc += w / total;
    if (r < acc) return it;
  }
  for (let i = items.length - 1; i >= 0; i--) if (weightOf(items[i]) > 0) return items[i];
  return items[items.length - 1];
}

export function dealAskResponse(
  seed: number,
  persona: PersonaId,
  stopId: StandardStopId,
  wellFormed: boolean,
  odds: AskOdds = DEFAULT_ODDS,
): AskResponse {
  const weights = wellFormed ? odds.wellFormed : odds.poor;
  return pickWeighted(draw(seed, persona, stopId, 'response'), ORDER, (k) => weights[k]);
}

/** True when the search finds the owner. */
export function rollSearch(seed: number, persona: PersonaId, stopId: StandardStopId, findChance: number): boolean {
  return draw(seed, persona, stopId, 'search') < findChance;
}

export function rollTerms(seed: number, persona: PersonaId, stopId: StandardStopId, terms: Term[]): Term {
  return pickWeighted(draw(seed, persona, stopId, 'terms'), terms, (t) => t.weight);
}
