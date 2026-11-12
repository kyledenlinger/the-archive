import { band, applyEffects, effectsFor, lockReason, meterChanges, visionBand } from './meters';
import { content } from '../content';
import { Choice, Effects, Meters, PERSONA_IDS, PersonaId } from '../content/types';

const M = (over: Partial<Meters> = {}): Meters => ({ time: 3, budget: 3, exposure: 3, vision: 3, ...over });

test('band: time/budget/vision are best high, worst low', () => {
  expect(band('time', 5)).toBe('best');
  expect(band('time', 4)).toBe('middle');
  expect(band('time', 1)).toBe('worst');
});

test('band: exposure is inverted', () => {
  expect(band('exposure', 1)).toBe('best');
  expect(band('exposure', 5)).toBe('worst');
});

test('applyEffects clamps at 0', () => {
  expect(applyEffects(M({ time: 1 }), [{ meter: 'time', delta: -2 }]).meters.time).toBe(0);
});

test('applyEffects counts no legal exposure when already at the cap', () => {
  const r = applyEffects(M({ exposure: 6 }), [{ meter: 'exposure', delta: 2, tag: 'legal' }]);
  expect(r.meters.exposure).toBe(6);
  expect(r.legal).toBe(0);
});

test('applyEffects counts legal exposure actually added', () => {
  const r = applyEffects(M({ exposure: 4 }), [{ meter: 'exposure', delta: 2, tag: 'legal' }]);
  expect(r.meters.exposure).toBe(6);
  expect(r.legal).toBe(2);
  expect(r.reputational).toBe(0);
});

test('applyEffects splits clamped exposure by tag, in order, without mutating', () => {
  const start = M({ exposure: 5 });
  const r = applyEffects(start, [
    { meter: 'exposure', delta: 1, tag: 'reputational' },
    { meter: 'exposure', delta: 2, tag: 'legal' },
  ]);
  expect(r.meters.exposure).toBe(6);
  expect(r.reputational).toBe(1);
  expect(r.legal).toBe(0);
  expect(start.exposure).toBe(5);
});

test('lockReason returns the meter in its worst band', () => {
  const c: Choice = { id: 'c', label: 'C', requires: ['time'] };
  expect(lockReason(c, M({ time: 1 }))).toBe('time');
  expect(lockReason(c, M({ time: 2 }))).toBeNull();
  expect(lockReason({ id: 'd', label: 'D' }, M({ time: 0, budget: 0 }))).toBeNull();
});

test('Review Focus 2: out of time and broke still leaves a choice at every stop', () => {
  const stops = [content.stops.free, content.stops.layers, content.stops.permission];
  for (const p of content.personas) {
    const meters = { ...p.startMeters, time: 0, budget: 0 };
    for (const stop of stops) {
      expect(stop.choices.some((c) => lockReason(c, meters) === null)).toBe(true);
    }
  }
});

test('meterChanges lists bands and direction, omitting unchanged meters', () => {
  const changes = meterChanges(M({ time: 5, exposure: 1 }), M({ time: 4, exposure: 2, vision: 3 }));
  expect(changes).toEqual([
    { meter: 'time', from: 'best', to: 'middle', direction: 'down' },
    { meter: 'exposure', from: 'best', to: 'middle', direction: 'up' },
  ]);
});

test('effectsFor returns the persona entry for records and arrays as-is', () => {
  const arr: Effects = [{ meter: 'time', delta: -1 }];
  expect(effectsFor(arr, 'bard')).toBe(arr);
  const rec = Object.fromEntries(PERSONA_IDS.map((p) => [p, [{ meter: 'budget', delta: 1 }]])) as Record<PersonaId, Effects>;
  expect(effectsFor(rec, 'herald')).toBe(rec.herald);
  expect(effectsFor(undefined, 'bard')).toEqual([]);
});

test('visionBand maps bands to vision words', () => {
  expect(visionBand(6)).toBe('intact');
  expect(visionBand(3)).toBe('compromised');
  expect(visionBand(0)).toBe('lost');
});
