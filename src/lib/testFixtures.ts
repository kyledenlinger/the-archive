import {
  GameContent,
  LICENSE_IDS,
  PERSONA_IDS,
  PersonaId,
  StandardStop,
  StandardStopId,
  FairUseFactor,
} from '../content/types';

function rec<K extends string, V>(keys: readonly K[], fn: (k: K) => V): Record<K, V> {
  return Object.fromEntries(keys.map((k) => [k, fn(k)])) as Record<K, V>;
}
const STD: StandardStopId[] = ['free', 'layers', 'permission'];
const persona = () => rec(PERSONA_IDS, () => 'x');
const outcome = () => ({ text: 'x', cartNote: 'x' });

function stdStop(id: StandardStopId): StandardStop {
  return {
    id,
    title: 'x',
    clerkIntro: 'x',
    clerkClue: 'x',
    setup: persona(),
    debrief: { lesson: 'x', prompts: ['x'] },
    complication: 'x',
    choices: [
      { id: 'a', label: 'x', outcome: outcome() },
      { id: 'b', label: 'x', outcome: rec(PERSONA_IDS, outcome) },
      { id: 'c', label: 'x', mechanic: 'fairUse' },
    ],
  };
}
const factor = (): FairUseFactor => ({
  title: 'x',
  description: 'x',
  text: rec(STD, () => persona()),
});

export function makeValidContent(): GameContent {
  return {
    personas: PERSONA_IDS.map((id) => ({ id, name: 'x', medium: 'x', description: 'x' })),
    onboarding: { lines: ['x'] },
    stops: {
      free: stdStop('free'),
      layers: stdStop('layers'),
      permission: stdStop('permission'),
      flip: {
        id: 'flip',
        title: 'x',
        clerkIntro: 'x',
        clerkClue: 'x',
        setup: persona(),
        debrief: { lesson: 'x', prompts: ['x'] },
        work: persona(),
        licenses: rec(LICENSE_IDS, () => ({ label: 'x', clerkGloss: 'x', summary: 'x' })),
        events: rec(PERSONA_IDS, () =>
          rec(['within', 'outside', 'beyond'] as const, () => ({
            setup: 'x',
            situation: rec(LICENSE_IDS, () => 'x'),
          })),
        ),
        responses: rec(['takedown', 'credit', 'negotiate', 'let-go'] as const, () => ({ label: 'x', cartNote: 'x' })),
      },
    },
    fairUse: {
      factors: [factor(), factor(), factor(), factor()],
      assessments: rec(STD, () => persona()),
    },
    ask: {
      intro: 'x',
      fieldOptions: rec(['what', 'how', 'where', 'howLong'] as const, () => ({ label: 'x', options: ['x'] })),
      responses: rec(PERSONA_IDS, () => rec(['yes', 'conditional', 'no', 'silence'] as const, outcome)),
      afterPrompt: 'x',
    },
    clerk: {
      askForHelp: 'x',
      guessPrompt: 'x',
      guessOptions: [{ id: 'photograph', label: 'x' }],
      reveal: ['x'],
      endings: rec(['search', 'shelf', 'wait'] as const, () => ({ label: 'x', scene: 'x' })),
      codaShade: rec(LICENSE_IDS, () => 'x'),
      closingLine: 'x',
    },
    reference: [{ id: 'x', title: 'x', body: 'x' }],
    resources: [{ name: 'x', url: 'x', description: 'x' }],
    interstitial: { waitTitle: 'x', waitBody: 'x', continueLabel: 'x' },
  };
}

