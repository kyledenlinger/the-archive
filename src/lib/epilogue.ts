import { FateId, LicenseId, Meters, PersonaId, ReuseResponse, ShelfContent } from '../content/types';
import { band, visionBand } from './meters';

/**
 * What became of the project (revision spec §7.2). Exposure is read at the end of stop 4 (`final`);
 * time, budget, and vision are read at the end of stop 3 (`atFlip`).
 */
export function fateModifiers(atFlip: Meters, final: Meters, legal: number, reputational: number): FateId[] {
  const exposureHigh = band('exposure', final.exposure) === 'worst';
  if (exposureHigh && legal >= reputational) return ['pulled'];
  const mods: FateId[] = [];
  if (exposureHigh && reputational > legal) mods.push('underCloud');
  if (band('time', atFlip.time) === 'worst') mods.push('late');
  if (band('budget', atFlip.budget) === 'worst') mods.push('smaller');
  if (band('vision', atFlip.vision) === 'worst') mods.push('compromised');
  return mods.length ? mods : ['asPlanned'];
}

export function assembleShelf(
  shelf: ShelfContent,
  persona: PersonaId,
  fate: FateId[],
  license: LicenseId,
  outside: ReuseResponse | undefined,
  finalVision: number,
): { fate: string; scene: string; lastWord: string } {
  const base = shelf.scenes[persona][license];
  return {
    fate: fate.map((f) => shelf.fate[persona][f]).join(' '),
    scene: outside === undefined ? base : `${base} ${shelf.outsideDetail[outside]}`,
    lastWord: shelf.lastWord[persona][visionBand(finalVision)],
  };
}

/** A hypothetical future under another license: base scene only, no response details. */
export function alternateScene(
  shelf: ShelfContent,
  persona: PersonaId,
  license: LicenseId,
  licenseLabel: string,
): { heading: string; scene: string } {
  return {
    heading: shelf.altFrame.replace('{license}', licenseLabel),
    scene: shelf.scenes[persona][license],
  };
}
