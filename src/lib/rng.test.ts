import { mulberry32 } from './rng';

test('same seed, same sequence', () => {
  const a = mulberry32(123), b = mulberry32(123);
  expect([a(), a(), a(), a(), a()]).toEqual([b(), b(), b(), b(), b()]);
});
test('different seeds differ', () => {
  expect(mulberry32(1)()).not.toBe(mulberry32(2)());
});
test('values are in [0, 1)', () => {
  const r = mulberry32(99);
  for (let i = 0; i < 1000; i++) {
    const v = r();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  }
});
