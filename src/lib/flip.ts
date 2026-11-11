import { FlipStop, LicenseId, PersonaId, ReuseEventKind, ReuseResponse } from '../content/types';

export const REUSE_ORDER: ReuseEventKind[] = ['within', 'outside', 'beyond'];

export function resolveReuse(flip: FlipStop, persona: PersonaId, kind: ReuseEventKind, license: LicenseId): string {
  return flip.events[persona][kind].situation[license];
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
