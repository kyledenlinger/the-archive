import { Effects, FlipStop, LicenseId, PersonaId, ReuseEventKind, ReuseResponse } from '../content/types';

export const REUSE_ORDER: ReuseEventKind[] = ['within', 'outside', 'beyond'];

export function resolveReuse(flip: FlipStop, persona: PersonaId, kind: ReuseEventKind, license: LicenseId): string {
  return flip.events[persona][kind].situation[license];
}

/** What a response to one reuse event does to the meters: the event's own override, or the response's default. */
export function reuseEffects(flip: FlipStop, persona: PersonaId, kind: ReuseEventKind, response: ReuseResponse): Effects {
  return flip.events[persona][kind].effects?.[response] ?? flip.responses[response].effects;
}

export function flipCartNote(
  flip: FlipStop,
  license: LicenseId,
  responses: Record<ReuseEventKind, ReuseResponse>,
  labels?: Record<ReuseEventKind, string>,
): string {
  const notes = REUSE_ORDER.map((k) => (labels ? `${labels[k]} ` : '') + flip.responses[responses[k]].cartNote);
  return [flip.licenses[license].label + '.', ...notes].join(' ');
}
