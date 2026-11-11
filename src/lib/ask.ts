import { AskField, AskResponse, PersonaId } from '../content/types';
import { fnv1a, mulberry32 } from './rng';

export const ASK_WEIGHTS: { wellFormed: Record<AskResponse, number>; poor: Record<AskResponse, number> } = {
  wellFormed: { yes: 35, conditional: 35, no: 15, silence: 15 },
  poor: { yes: 15, conditional: 25, no: 25, silence: 35 },
};
const ORDER: AskResponse[] = ['yes', 'conditional', 'no', 'silence'];

export function isWellFormed(request: Partial<Record<AskField, string>>): boolean {
  return Object.values(request).filter((v) => typeof v === 'string' && v.trim() !== '').length >= 3;
}

/** Pure function of (seed, persona, wellFormed): backing out and re-asking can't reroll. */
export function dealAskResponse(seed: number, persona: PersonaId, wellFormed: boolean): AskResponse {
  const draw = mulberry32((seed ^ fnv1a(persona)) >>> 0)();
  const weights = wellFormed ? ASK_WEIGHTS.wellFormed : ASK_WEIGHTS.poor;
  const total = ORDER.reduce((n, k) => n + weights[k], 0);
  let acc = 0;
  for (const k of ORDER) {
    acc += weights[k] / total;
    if (draw < acc) return k;
  }
  return ORDER[ORDER.length - 1];
}
