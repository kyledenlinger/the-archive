import { FlipStop, LicenseId, PersonaId, ReuseEventKind, ReuseResponse } from '../content/types';

export const REUSE_ORDER: ReuseEventKind[] = ['within', 'outside', 'beyond'];

export function resolveReuse(flip: FlipStop, persona: PersonaId, kind: ReuseEventKind, license: LicenseId): string {
  return flip.events[persona][kind].situation[license];
}

export function flipCartNote(flip: FlipStop, license: LicenseId, responses: Record<ReuseEventKind, ReuseResponse>): string {
  return [flip.licenses[license].label + '.', ...REUSE_ORDER.map((k) => flip.responses[responses[k]].cartNote)].join(' ');
}
