import {
  Choice,
  Effects,
  FateId,
  GameContent,
  LICENSE_IDS,
  METER_IDS,
  PERSONA_IDS,
  PersonaId,
  StandardStop,
  StandardStopId,
  FairUseFactor,
  VisionBand,
} from '../content/types';

function rec<K extends string, V>(keys: readonly K[], fn: (k: K) => V): Record<K, V> {
  return Object.fromEntries(keys.map((k) => [k, fn(k)])) as Record<K, V>;
}
const STD: StandardStopId[] = ['free', 'layers', 'permission'];
const ASK_RESPONSE_IDS = ['yes', 'conditional', 'no', 'silence'] as const;
const FATES: FateId[] = ['pulled', 'asPlanned', 'underCloud', 'late', 'smaller', 'compromised'];
const VISION: VisionBand[] = ['intact', 'compromised', 'lost'];
const persona = () => rec(PERSONA_IDS, () => 'x');
const outcome = () => ({ text: 'x', cartNote: 'x' });
/** One gain (exposure down) and one cost (time down): passes the gain-and-cost rule. */
const effects = (): Effects => [
  { meter: 'time', delta: -1 },
  { meter: 'exposure', delta: -1 },
];

function stdStop(id: StandardStopId): StandardStop {
  const choices: Choice[] = [
    { id: 'a', label: 'x', outcome: outcome(), effects: effects() }, // the one choice with no requires
    { id: 'b', label: 'x', outcome: rec(PERSONA_IDS, outcome), effects: effects(), requires: ['budget'] },
    { id: 'c', label: 'x', mechanic: 'fairUse', effects: effects(), requires: ['time'] },
  ];
  const stop: StandardStop = {
    id,
    title: 'x',
    clerkIntro: 'x',
    setup: persona(),
    debrief: { lesson: 'x', prompts: ['x'] },
    complication: 'x',
    choices,
  };
  if (id === 'free') {
    stop.coached = true;
    choices.push({ id: 'd', label: 'x', mechanic: 'search', effects: effects(), requires: ['time'] });
    stop.searchFindChance = rec(PERSONA_IDS, () => 0.5);
    stop.searchFail = persona();
    stop.searchFound = persona();
  }
  if (id === 'permission') choices.push({ id: 'd', label: 'x', mechanic: 'ask', effects: effects(), requires: ['time'] });
  return stop;
}
const factor = (): FairUseFactor => ({
  title: 'x',
  description: 'x',
  text: rec(STD, () => persona()),
});
const terms = () =>
  rec(PERSONA_IDS, () => [{ kind: 'smallFee' as const, text: 'x', cartNote: 'x', effects: [{ meter: 'budget' as const, delta: -1 }], weight: 1 }]);
const askResponses = () =>
  rec(PERSONA_IDS, () => rec(ASK_RESPONSE_IDS, () => ({ ...outcome(), effects: effects() })));

export function makeValidContent(): GameContent {
  return {
    personas: PERSONA_IDS.map((id: PersonaId) => ({
      id,
      name: 'x',
      medium: 'x',
      description: 'x',
      brief: { making: 'x', answersTo: 'x', deadline: 'x', items: ['x', 'x', 'x'] },
      startMeters: rec(METER_IDS, () => 3),
    })),
    onboarding: { lines: [[{ kind: 'narration', text: 'x' }, { kind: 'clerk', text: 'x' }]] },
    stops: {
      free: stdStop('free'),
      layers: stdStop('layers'),
      permission: stdStop('permission'),
      flip: {
        id: 'flip',
        title: 'x',
        clerkIntro: 'x',
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
        responses: rec(['takedown', 'credit', 'negotiate', 'let-go'] as const, () => ({
          label: 'x',
          cartNote: 'x',
          effects: effects(),
        })),
      },
    },
    fairUse: {
      factors: [factor(), factor(), factor(), factor()],
      coaching: ['x', 'x', 'x', 'x'],
      assessments: rec(STD, () => rec(PERSONA_IDS, () => ({ text: 'x', strength: 'moderate' as const }))),
    },
    ask: {
      intro: 'x',
      fieldOptions: rec(['what', 'how', 'where', 'howLong'] as const, () => ({ label: 'x', options: ['x'] })),
      afterPrompt: 'x',
      responses: { free: askResponses(), permission: askResponses() },
      terms: { free: terms(), permission: terms() },
      acceptLabel: 'x',
      declineLabel: 'x',
      declineNote: 'x',
      followUps: rec(['use', 'useAnyway', 'dont', 'fairUse'] as const, () => ({ label: 'x', note: 'x', effects: [] })),
    },
    clerk: {
      briefIntro: 'x',
      coachInvite: 'x',
      shelf: {
        intro: ['x'],
        fate: rec(PERSONA_IDS, () => rec(FATES, () => 'x')),
        scenes: rec(PERSONA_IDS, () => rec(LICENSE_IDS, () => 'x')),
        outsideDetail: rec(['takedown', 'credit', 'negotiate', 'let-go'] as const, () => 'x'),
        lastWord: rec(PERSONA_IDS, () => rec(VISION, () => 'x')),
        othersOffer: 'x',
        altFrame: 'x {license}',
        backToYours: 'x',
        closingLine: 'x',
      },
    },
    reference: [{ id: 'x', title: 'x', body: 'x' }],
    resources: [{ name: 'x', url: 'x', description: 'x' }],
    interstitial: { waitTitle: 'x', waitLead: 'x', waitBody: 'x', continueLabel: 'x', pauseLabel: 'x', pauseLabels: { fairUse: 'x', askUse: 'x', askUseAnyway: 'x', askDont: 'x', askAccept: 'x' }, confirmMoveOn: { question: 'x', confirm: 'x', cancel: 'x' } },
  };
}
