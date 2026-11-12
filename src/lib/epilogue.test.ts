import { alternateScene, assembleShelf, fateModifiers } from './epilogue';
import {
  FateId,
  LICENSE_IDS,
  LicenseId,
  Meters,
  PERSONA_IDS,
  PersonaId,
  ReuseResponse,
  ShelfContent,
  VisionBand,
} from '../content/types';

const GOOD: Meters = { time: 6, budget: 6, exposure: 0, vision: 6 };
const M = (over: Partial<Meters> = {}): Meters => ({ ...GOOD, ...over });

const FATES: FateId[] = ['pulled', 'asPlanned', 'underCloud', 'late', 'smaller', 'compromised'];
const RESPONSES: ReuseResponse[] = ['takedown', 'credit', 'negotiate', 'let-go'];
const BANDS: VisionBand[] = ['intact', 'compromised', 'lost'];

const byPersona = <T>(f: (p: PersonaId) => T) =>
  Object.fromEntries(PERSONA_IDS.map((p) => [p, f(p)])) as Record<PersonaId, T>;

function makeShelf(): ShelfContent {
  return {
    intro: ['intro'],
    fate: byPersona((p) => Object.fromEntries(FATES.map((f) => [f, `FATE-${p}-${f}.`])) as Record<FateId, string>),
    scenes: byPersona(
      (p) => Object.fromEntries(LICENSE_IDS.map((l) => [l, `SCENE-${p}-${l}.`])) as Record<LicenseId, string>,
    ),
    outsideDetail: Object.fromEntries(RESPONSES.map((r) => [r, `OUTSIDE-${r}.`])) as Record<ReuseResponse, string>,
    lastWord: byPersona((p) => Object.fromEntries(BANDS.map((b) => [b, `LAST-${p}-${b}`])) as Record<VisionBand, string>),
    othersOffer: 'offer',
    altFrame: 'What might have been: {license}.',
    backToYours: 'back',
    closingLine: 'closing',
  };
}

describe('fateModifiers', () => {
  test('high exposure, legal >= reputational → pulled only, even when out of time', () => {
    expect(fateModifiers(M({ time: 0 }), M({ exposure: 6, time: 0 }), 3, 1)).toEqual(['pulled']);
  });

  test('legal equal to reputational still pulls', () => {
    expect(fateModifiers(GOOD, M({ exposure: 6 }), 2, 2)).toEqual(['pulled']);
  });

  test('high exposure, reputational larger → underCloud combined with late', () => {
    expect(fateModifiers(M({ time: 0 }), M({ exposure: 6, time: 0 }), 1, 3)).toEqual(['underCloud', 'late']);
  });

  test('all good → asPlanned', () => {
    expect(fateModifiers(GOOD, GOOD, 0, 0)).toEqual(['asPlanned']);
  });

  test('time/budget/vision come from atFlip, not final', () => {
    expect(fateModifiers(M({ budget: 1 }), M({ budget: 3 }), 0, 0)).toEqual(['smaller']);
    expect(fateModifiers(GOOD, M({ budget: 0, time: 0, vision: 0 }), 0, 0)).toEqual(['asPlanned']);
  });

  test('exposure comes from final, not atFlip', () => {
    expect(fateModifiers(M({ exposure: 6 }), GOOD, 3, 0)).toEqual(['asPlanned']);
  });

  test('all modifiers, in order', () => {
    expect(fateModifiers(M({ time: 0, budget: 0, vision: 0 }), M({ exposure: 5 }), 0, 1)).toEqual([
      'underCloud',
      'late',
      'smaller',
      'compromised',
    ]);
  });
});

describe('assembleShelf', () => {
  const shelf = makeShelf();

  test('single paragraph for pulled and asPlanned', () => {
    expect(assembleShelf(shelf, 'bard', ['pulled'], 'cc0', undefined, 6).fate).toBe('FATE-bard-pulled.');
    expect(assembleShelf(shelf, 'bard', ['asPlanned'], 'cc0', undefined, 6).fate).toBe('FATE-bard-asPlanned.');
  });

  test('modifier sentences joined with a space', () => {
    expect(assembleShelf(shelf, 'herald', ['underCloud', 'late'], 'arr', undefined, 6).fate).toBe(
      'FATE-herald-underCloud. FATE-herald-late.',
    );
  });

  test('outside undefined → scene equals the base scene exactly', () => {
    expect(assembleShelf(shelf, 'naturalist', ['asPlanned'], 'cc-by-sa', undefined, 6).scene).toBe(
      shelf.scenes.naturalist['cc-by-sa'],
    );
  });

  test('outside defined → base scene plus the outside detail', () => {
    expect(assembleShelf(shelf, 'naturalist', ['asPlanned'], 'cc-by', 'takedown', 6).scene).toBe(
      'SCENE-naturalist-cc-by. OUTSIDE-takedown.',
    );
  });

  test('last word chosen by the final vision band', () => {
    expect(assembleShelf(shelf, 'conjurer', ['asPlanned'], 'arr', undefined, 6).lastWord).toBe('LAST-conjurer-intact');
    expect(assembleShelf(shelf, 'conjurer', ['asPlanned'], 'arr', undefined, 3).lastWord).toBe(
      'LAST-conjurer-compromised',
    );
    expect(assembleShelf(shelf, 'conjurer', ['asPlanned'], 'arr', undefined, 0).lastWord).toBe('LAST-conjurer-lost');
  });
});

describe('alternateScene', () => {
  const shelf = makeShelf();

  test('heading fills in the license label; scene is the base scene', () => {
    expect(alternateScene(shelf, 'artificer', 'cc-by-nc', 'CC BY-NC')).toEqual({
      heading: 'What might have been: CC BY-NC.',
      scene: 'SCENE-artificer-cc-by-nc.',
    });
  });

  test('never includes any outsideDetail text', () => {
    for (const p of PERSONA_IDS) {
      for (const l of LICENSE_IDS) {
        const { heading, scene } = alternateScene(shelf, p, l, l);
        for (const detail of Object.values(shelf.outsideDetail)) {
          expect(scene).not.toContain(detail);
          expect(heading).not.toContain(detail);
        }
      }
    }
  });
});

it.todo('every 2⁴ combination of underCloud/late/smaller/compromised gives non-empty text for every persona in real content');
