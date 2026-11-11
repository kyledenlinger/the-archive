import { readFileSync, existsSync } from 'node:fs';

// Requires `npm run build` first (CI builds before testing).
test('built index.html references assets under /the-archive/', () => {
  expect(existsSync('dist/index.html')).toBe(true);
  const html = readFileSync('dist/index.html', 'utf8');
  expect(html).toMatch(/src="\/the-archive\/assets\//);
  expect(html).not.toMatch(/src="\/assets\//);
});
