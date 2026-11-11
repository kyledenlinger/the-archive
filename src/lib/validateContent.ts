import { GameContent, LICENSE_IDS, PERSONA_IDS, ReviewFlag } from '../content/types';

export const STANDARD_STOP_IDS = ['free', 'layers', 'permission'] as const;
export const REUSE_KINDS = ['within', 'outside', 'beyond'] as const;
export const REUSE_RESPONSES = ['takedown', 'credit', 'negotiate', 'let-go'] as const;
export const ASK_FIELDS = ['what', 'how', 'where', 'howLong'] as const;
export const ASK_RESPONSES = ['yes', 'conditional', 'no', 'silence'] as const;
export const ENDING_IDS = ['search', 'shelf', 'wait'] as const;

export const GROUP_SIZE_RE = /\b(you two|both of you|your partner|each pair|your pair|the pair)\b/i;
const VERDICT_RE = /\b(correct|incorrect|right answer|wrong)\b/i;

export interface ReviewItem { where: string; date: string; note: string }
export interface ValidationResult { errors: string[]; reviewItems: ReviewItem[] }

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

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

  // --- structural completeness ---
  const stops = keys(c.stops, 'stops', [...STANDARD_STOP_IDS, 'flip']);
  each(stops, 'stops', [...STANDARD_STOP_IDS, 'flip'], (s, p) => {
    const stop = s as Obj;
    keys(stop.setup, `${p}.setup`, PERSONA_IDS);
    if (!isObj(stop.debrief)) errors.push(`${p}.debrief: missing`);
    if (stop.id === 'flip') return;
    const choices = Array.isArray(stop.choices) ? (stop.choices as Obj[]) : [];
    if (!Array.isArray(stop.choices)) errors.push(`${p}.choices: missing`);
    choices.forEach((ch, i) => {
      const cp = `${p}.choices[${i}]`;
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
  const as = keys(fu.assessments, 'fairUse.assessments', STANDARD_STOP_IDS);
  each(as, 'fairUse.assessments', STANDARD_STOP_IDS, (v, p) => keys(v, p, PERSONA_IDS));

  const ask = (isObj(c.ask) ? c.ask : {}) as unknown as Obj;
  keys(ask.fieldOptions, 'ask.fieldOptions', ASK_FIELDS);
  const ar = keys(ask.responses, 'ask.responses', PERSONA_IDS);
  each(ar, 'ask.responses', PERSONA_IDS, (v, p) => keys(v, p, ASK_RESPONSES));

  const clerk = (isObj(c.clerk) ? c.clerk : {}) as unknown as Obj;
  keys(clerk.endings, 'clerk.endings', ENDING_IDS);
  keys(clerk.codaShade, 'clerk.codaShade', LICENSE_IDS);

  const personaIds = (c.personas ?? []).map((p) => p.id);
  for (const id of PERSONA_IDS) if (!personaIds.includes(id)) errors.push(`personas.${id}: missing`);

  // --- every string: non-empty, no group-size wording; outcomes: no verdict words ---
  const walk = (v: unknown, path: string, key: string, parent: unknown) => {
    if (typeof v === 'string') {
      if (v.trim() === '') errors.push(`${path}: empty`);
      const g = v.match(GROUP_SIZE_RE);
      if (g) errors.push(`${path}: assumes group size (“${g[0]}”)`);
      const isOutcomeText = key === 'cartNote' || (key === 'text' && isObj(parent) && 'cartNote' in parent);
      const w = isOutcomeText ? v.match(VERDICT_RE) : null;
      if (w) errors.push(`${path}: verdict word "${w[0].toLowerCase()}"`);
      return;
    }
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

  return { errors, reviewItems };
}
