import { GameContent, LICENSE_IDS, METER_IDS, MeterId, PERSONA_IDS, ReviewFlag } from '../content/types';

export const STANDARD_STOP_IDS = ['free', 'layers', 'permission'] as const;
export const REUSE_KINDS = ['within', 'outside', 'beyond'] as const;
export const REUSE_RESPONSES = ['takedown', 'credit', 'negotiate', 'let-go'] as const;
export const ASK_FIELDS = ['what', 'how', 'where', 'howLong'] as const;
export const ASK_RESPONSES = ['yes', 'conditional', 'no', 'silence'] as const;
export const FATE_IDS = ['pulled', 'asPlanned', 'underCloud', 'late', 'smaller', 'compromised'] as const;
export const VISION_BANDS = ['intact', 'compromised', 'lost'] as const;
export const STRENGTHS = ['strong', 'moderate', 'weak'] as const;
export const TERM_KINDS = ['smallFee', 'largeFee', 'restriction', 'credit'] as const;
export const ASK_FOLLOW_UPS = ['use', 'useAnyway', 'dont', 'fairUse'] as const;
export const LOCK_METERS = ['time', 'budget'] as const;
export const EXPOSURE_TAGS = ['legal', 'reputational'] as const;
export const ONBOARDING_KINDS = ['narration', 'clerk'] as const;
const BRIEF_KEYS = ['making', 'answersTo', 'deadline', 'items'] as const;
const SHELF_KEYS = ['intro', 'fate', 'scenes', 'outsideDetail', 'lastWord', 'othersOffer', 'altFrame', 'backToYours', 'closingLine'] as const;

/** Kyle supplies the game's license for the About panel; until then this marker is a warning, not an error. */
export const ABOUT_LICENSE_TBD = 'ABOUT_LICENSE_TBD';
/** Revision-2 build only: stand-in text written before its task fills it in. An error; `--allow-placeholder` downgrades it. */
export const PLACEHOLDER_MARK = 'PLACEHOLDER';

export const GROUP_SIZE_RE = /\b(you two|both of you|your partner|each pair|your pair|the pair)\b/i;
const VERDICT_RE = /\b(correct|incorrect|right answer|wrong)\b/i;
/** Strings under these paths are checked for verdict words everywhere, not only in outcomes. */
const VERDICT_SCOPE_RE = /^(personas\[\d+\]\.brief|clerk\.shelf)\b/;

export interface ReviewItem { where: string; date: string; note: string }
export interface ValidationResult { errors: string[]; warnings: string[]; reviewItems: ReviewItem[] }

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

/** “Better” is up for time, budget, and vision, and down for exposure. */
const isGain = (meter: MeterId, delta: number) => (meter === 'exposure' ? delta < 0 : delta > 0);

/** Warnings for any string under `v` (e.g. the ABOUT_LICENSE_TBD marker). Exported so the CLI can scan `ui` too. */
export function collectWarnings(v: unknown, path = ''): string[] {
  const out: string[] = [];
  const go = (x: unknown, p: string) => {
    if (typeof x === 'string') {
      if (x.includes(ABOUT_LICENSE_TBD)) out.push(`${p}: contains ${ABOUT_LICENSE_TBD}`);
    } else if (Array.isArray(x)) x.forEach((item, i) => go(item, `${p}[${i}]`));
    else if (isObj(x)) for (const [k, child] of Object.entries(x)) go(child, p ? `${p}.${k}` : k);
  };
  go(v, path);
  return out;
}

export function validateContent(c: GameContent): ValidationResult {
  const errors: string[] = [];
  const reviewItems: ReviewItem[] = [];

  /** Require every key in `keys`; return the record (or {} if absent) so callers can descend. */
  const keys = (rec: unknown, path: string, ks: readonly string[]): Obj => {
    if (!isObj(rec)) {
      errors.push(`${path}: missing`);
      return {};
    }
    for (const k of ks) if (!(k in rec) || rec[k] === undefined) errors.push(`${path}.${k}: missing`);
    return rec;
  };
  const each = (rec: Obj, path: string, ks: readonly string[], fn: (v: unknown, p: string) => void) => {
    for (const k of ks) if (rec[k] !== undefined) fn(rec[k], `${path}.${k}`);
  };
  const gainAndCost = (effects: Obj[], path: string) => {
    const moved = effects.filter((e) => typeof e.delta === 'number' && e.delta !== 0);
    const meters = new Set(moved.map((e) => e.meter));
    const gain = moved.some((e) => isGain(e.meter as MeterId, e.delta as number));
    const cost = moved.some((e) => !isGain(e.meter as MeterId, e.delta as number));
    if (meters.size < 2 || !gain || !cost) errors.push(`${path}: effects need at least one gain and one cost`);
  };
  /** Each effect: a known meter, an integer delta in -2..2, and a tag on any exposure increase. */
  const checkEffects = (v: unknown, path: string) => {
    if (isObj(v)) {
      for (const [k, set] of Object.entries(v)) checkEffects(set, `${path}.${k}`);
      return;
    }
    if (!Array.isArray(v)) {
      errors.push(`${path}: missing`);
      return;
    }
    v.forEach((e: Obj, i) => {
      const ep = `${path}[${i}]`;
      if (!(METER_IDS as unknown[]).includes(e.meter)) errors.push(`${ep}: invalid meter`);
      const d = e.delta;
      if (typeof d !== 'number' || !Number.isInteger(d) || d < -2 || d > 2) errors.push(`${ep}: delta out of range -2..2`);
      if (e.tag !== undefined && !(EXPOSURE_TAGS as readonly unknown[]).includes(e.tag)) errors.push(`${ep}: invalid tag`);
      if (e.meter === 'exposure' && typeof d === 'number' && d > 0 && e.tag === undefined) errors.push(`${ep}: exposure increase needs a tag`);
    });
  };

  // --- structural completeness ---
  // Onboarding: at least one beat; each beat a non-empty list of narration/Clerk pieces with text.
  const ob = (isObj(c.onboarding) ? c.onboarding : {}) as unknown as Obj;
  if (!Array.isArray(ob.lines) || ob.lines.length === 0) errors.push('onboarding.lines: needs at least one beat');
  else {
    (ob.lines as unknown[]).forEach((beat, b) => {
      const bp = `onboarding.lines[${b}]`;
      if (!Array.isArray(beat) || beat.length === 0) {
        errors.push(`${bp}: needs at least one piece`);
        return;
      }
      beat.forEach((piece: unknown, i) => {
        const pp = `${bp}[${i}]`;
        if (!isObj(piece)) {
          errors.push(`${pp}: missing`);
          return;
        }
        if (!(ONBOARDING_KINDS as readonly unknown[]).includes(piece.kind)) errors.push(`${pp}.kind: invalid kind`);
        if (typeof piece.text !== 'string') errors.push(`${pp}.text: missing`);
      });
    });
  }

  const stops = keys(c.stops, 'stops', [...STANDARD_STOP_IDS, 'flip']);
  each(stops, 'stops', [...STANDARD_STOP_IDS, 'flip'], (s, p) => {
    const stop = s as Obj;
    keys(stop.setup, `${p}.setup`, PERSONA_IDS);
    if (!isObj(stop.debrief)) errors.push(`${p}.debrief: missing`);
    if (stop.id === 'flip') return;
    const choices = Array.isArray(stop.choices) ? (stop.choices as Obj[]) : [];
    if (!Array.isArray(stop.choices)) errors.push(`${p}.choices: missing`);
    if (choices.length && !choices.some((ch) => !Array.isArray(ch.requires) || ch.requires.length === 0)) {
      errors.push(`${p}: needs at least one choice with no requires`);
    }
    if (choices.some((ch) => ch.mechanic === 'search')) {
      const fc = keys(stop.searchFindChance, `${p}.searchFindChance`, PERSONA_IDS);
      each(fc, `${p}.searchFindChance`, PERSONA_IDS, (v, fp) => {
        if (typeof v !== 'number' || v < 0 || v > 1) errors.push(`${fp}: out of range 0–1`);
      });
      keys(stop.searchFail, `${p}.searchFail`, PERSONA_IDS);
      keys(stop.searchFound, `${p}.searchFound`, PERSONA_IDS);
    }
    choices.forEach((ch, i) => {
      const cp = `${p}.choices[${i}]`;
      if (Array.isArray(ch.requires)) {
        for (const r of ch.requires) if (!(LOCK_METERS as readonly unknown[]).includes(r)) errors.push(`${cp}.requires: invalid meter "${String(r)}"`);
      }
      // Every choice must move two meters, one for the better and one for the worse. Mechanic choices
      // (fair use, ask, search) take their effects from the mechanic, so theirs are checked only if present.
      // A choice marked `effectsFrom: 'fairUse'` takes its effects from the assessment's strength instead.
      if (ch.effectsFrom !== undefined) {
        if (ch.effectsFrom !== 'fairUse') errors.push(`${cp}.effectsFrom: invalid value`);
        if (ch.effects !== undefined) errors.push(`${cp}.effects: a choice with effectsFrom has no static effects`);
      } else if (Array.isArray(ch.effects) || (!ch.mechanic && ch.effects === undefined)) {
        gainAndCost((ch.effects ?? []) as Obj[], cp);
      } else if (isObj(ch.effects)) {
        const per = keys(ch.effects, `${cp}.effects`, PERSONA_IDS);
        each(per, `${cp}.effects`, PERSONA_IDS, (v, ep) => gainAndCost(Array.isArray(v) ? (v as Obj[]) : [], ep));
      }
      if (ch.mechanic) return;
      if (!ch.outcome) {
        errors.push(`${cp}.outcome: outcome missing`);
        return;
      }
      const o = ch.outcome as Obj;
      if (!('cartNote' in o)) keys(o, `${cp}.outcome`, PERSONA_IDS);
    });
  });

  const flip = stops.flip as Obj | undefined;
  if (flip) {
    keys(flip.work, 'stops.flip.work', PERSONA_IDS);
    keys(flip.licenses, 'stops.flip.licenses', LICENSE_IDS);
    keys(flip.responses, 'stops.flip.responses', REUSE_RESPONSES);
    const events = keys(flip.events, 'stops.flip.events', PERSONA_IDS);
    each(events, 'stops.flip.events', PERSONA_IDS, (pe, pp) => {
      const kinds = keys(pe, pp, REUSE_KINDS);
      each(kinds, pp, REUSE_KINDS, (ev, ep) => keys((ev as Obj).situation, `${ep}.situation`, LICENSE_IDS));
    });
  }

  const fu = isObj(c.fairUse) ? (c.fairUse as unknown as Obj) : (errors.push('fairUse: missing'), {});
  const factors = Array.isArray(fu.factors) ? (fu.factors as Obj[]) : [];
  if (factors.length !== 4) errors.push('fairUse.factors: expected 4');
  factors.forEach((f, i) => {
    const tp = `fairUse.factors[${i}].text`;
    const t = keys(f.text, tp, STANDARD_STOP_IDS);
    each(t, tp, STANDARD_STOP_IDS, (v, p) => keys(v, p, PERSONA_IDS));
  });
  if (!Array.isArray(fu.coaching) || fu.coaching.length !== 4) errors.push('fairUse.coaching: expected 4');
  const as = keys(fu.assessments, 'fairUse.assessments', STANDARD_STOP_IDS);
  each(as, 'fairUse.assessments', STANDARD_STOP_IDS, (v, p) => {
    const per = keys(v, p, PERSONA_IDS);
    each(per, p, PERSONA_IDS, (a, ap) => {
      const o = keys(a, ap, ['text']);
      if (isObj(a) && !(STRENGTHS as readonly unknown[]).includes(o.strength)) errors.push(`${ap}.strength: invalid strength`);
    });
  });

  const ask = (isObj(c.ask) ? c.ask : {}) as unknown as Obj;
  keys(ask, 'ask', ['acceptLabel', 'declineLabel', 'declineNote']);
  keys(ask.fieldOptions, 'ask.fieldOptions', ASK_FIELDS);
  const ar = isObj(ask.responses) ? ask.responses : (errors.push('ask.responses: missing'), {});
  // A stop needs responses when any of its choices asks (directly, or after a search).
  const askStops = STANDARD_STOP_IDS.filter((id) => {
    const st = stops[id];
    return isObj(st) && Array.isArray(st.choices) && (st.choices as Obj[]).some((ch) => ch.mechanic === 'ask' || ch.mechanic === 'search');
  });
  for (const id of STANDARD_STOP_IDS) {
    const p = `ask.responses.${id}`;
    if (ar[id] === undefined) {
      if (askStops.includes(id)) errors.push(`${p}: missing`);
      continue;
    }
    const per = keys(ar[id], p, PERSONA_IDS);
    each(per, p, PERSONA_IDS, (v, pp) => keys(v, pp, ASK_RESPONSES));
  }
  if (ask.odds !== undefined) {
    const odds = keys(ask.odds, 'ask.odds', []);
    for (const [sid, per] of Object.entries(odds)) {
      for (const [pid, o] of Object.entries(isObj(per) ? per : {})) {
        const op = `ask.odds.${sid}.${pid}`;
        const both = keys(o, op, ['wellFormed', 'poor']);
        each(both, op, ['wellFormed', 'poor'], (w, wp) => {
          const ws = keys(w, wp, ASK_RESPONSES);
          const nums = ASK_RESPONSES.map((r) => ws[r]);
          if (nums.some((n) => n !== undefined && (typeof n !== 'number' || n < 0))) errors.push(`${wp}: weights must be non-negative numbers`);
          else if (nums.reduce<number>((a, n) => a + ((n as number) ?? 0), 0) <= 0) errors.push(`${wp}: weights must sum above 0`);
        });
      }
    }
  }
  // Terms, like responses, are per stop: needed wherever a stop asks, and checked wherever given.
  const at = isObj(ask.terms) ? ask.terms : (errors.push('ask.terms: missing'), {});
  for (const id of STANDARD_STOP_IDS) {
    const p = `ask.terms.${id}`;
    if (at[id] === undefined) {
      if (askStops.includes(id)) errors.push(`${p}: missing`);
      continue;
    }
    const terms = keys(at[id], p, PERSONA_IDS);
    each(terms, p, PERSONA_IDS, (v, pp) => {
      if (!Array.isArray(v) || v.length === 0) {
        errors.push(`${pp}: needs at least one term`);
        return;
      }
      (v as Obj[]).forEach((t, i) => {
        const tp = `${pp}[${i}]`;
        keys(t, tp, ['text', 'cartNote', 'effects']);
        if (!(TERM_KINDS as readonly unknown[]).includes(t.kind)) errors.push(`${tp}.kind: invalid kind`);
        if (typeof t.weight !== 'number' || t.weight <= 0) errors.push(`${tp}.weight: must be positive`);
      });
    });
  }
  const fus = keys(ask.followUps, 'ask.followUps', ASK_FOLLOW_UPS);
  each(fus, 'ask.followUps', ASK_FOLLOW_UPS, (v, p) => keys(v, p, ['label', 'note', 'effects']));

  const clerk = keys(c.clerk, 'clerk', ['briefIntro', 'coachInvite', 'shelf']);
  if (isObj(clerk.shelf)) {
    const shelf = keys(clerk.shelf, 'clerk.shelf', SHELF_KEYS);
    if (shelf.intro !== undefined && (!Array.isArray(shelf.intro) || shelf.intro.length === 0)) {
      errors.push('clerk.shelf.intro: needs at least one paragraph');
    }
    const fate = keys(shelf.fate, 'clerk.shelf.fate', PERSONA_IDS);
    each(fate, 'clerk.shelf.fate', PERSONA_IDS, (v, p) => keys(v, p, FATE_IDS));
    const scenes = keys(shelf.scenes, 'clerk.shelf.scenes', PERSONA_IDS);
    each(scenes, 'clerk.shelf.scenes', PERSONA_IDS, (v, p) => keys(v, p, LICENSE_IDS));
    keys(shelf.outsideDetail, 'clerk.shelf.outsideDetail', REUSE_RESPONSES);
    const lastWord = keys(shelf.lastWord, 'clerk.shelf.lastWord', PERSONA_IDS);
    each(lastWord, 'clerk.shelf.lastWord', PERSONA_IDS, (v, p) => keys(v, p, VISION_BANDS));
    if (typeof shelf.altFrame === 'string' && !shelf.altFrame.includes('{license}')) {
      errors.push('clerk.shelf.altFrame: must contain {license}');
    }
  }

  const personaIds = (c.personas ?? []).map((p) => p.id);
  for (const id of PERSONA_IDS) if (!personaIds.includes(id)) errors.push(`personas.${id}: missing`);
  (c.personas ?? []).forEach((p, i) => {
    const pp = `personas[${i}]`;
    const brief = keys(p.brief, `${pp}.brief`, BRIEF_KEYS);
    if (brief.items !== undefined && (!Array.isArray(brief.items) || brief.items.length !== 3)) errors.push(`${pp}.brief.items: expected 3`);
    const sm = keys(p.startMeters, `${pp}.startMeters`, METER_IDS);
    each(sm, `${pp}.startMeters`, METER_IDS, (v, mp) => {
      if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > 6) errors.push(`${mp}: out of range 0–6`);
    });
  });

  // --- every string: non-empty, no group-size wording; outcomes: no verdict words ---
  const walk = (v: unknown, path: string, key: string, parent: unknown) => {
    if (typeof v === 'string') {
      if (v.trim() === '') errors.push(`${path}: empty`);
      if (v.includes(PLACEHOLDER_MARK)) errors.push(`${path}: placeholder text`);
      const g = v.match(GROUP_SIZE_RE);
      if (g) errors.push(`${path}: assumes group size (“${g[0]}”)`);
      const isOutcomeText = key === 'cartNote' || (key === 'text' && isObj(parent) && 'cartNote' in parent);
      const w = isOutcomeText || VERDICT_SCOPE_RE.test(path) ? v.match(VERDICT_RE) : null;
      if (w) errors.push(`${path}: verdict word "${w[0].toLowerCase()}"`);
      return;
    }
    if (key === 'effects' && !Array.isArray(parent)) checkEffects(v, path);
    if (Array.isArray(v)) {
      v.forEach((item, i) => walk(item, `${path}[${i}]`, key, v));
      return;
    }
    if (isObj(v)) {
      if (key === 'reviewBy') {
        const f = v as unknown as ReviewFlag;
        reviewItems.push({ where: path, date: f.date, note: f.note });
      } else if (key === 'personaReviewBy') {
        for (const [pid, f] of Object.entries(v as Record<string, ReviewFlag>)) {
          reviewItems.push({ where: `${path}.${pid}`, date: f.date, note: f.note });
        }
      }
      for (const [k, child] of Object.entries(v)) walk(child, path ? `${path}.${k}` : k, k, v);
    }
  };
  walk(c, '', '', null);

  return { errors, warnings: collectWarnings(c), reviewItems };
}
