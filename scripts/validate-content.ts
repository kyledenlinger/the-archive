import { content } from '../src/content/index';
import { validateContent } from '../src/lib/validateContent';

// --allow-placeholder: temporary (Tasks 5–10). Errors under unfinished sections become warnings.
const PLACEHOLDER_PREFIXES = ['stops.', 'fairUse', 'ask', 'clerk'];
const allowPlaceholder = process.argv.includes('--allow-placeholder');

const { errors, reviewItems } = validateContent(content);
const isPlaceholder = (e: string) => PLACEHOLDER_PREFIXES.some((p) => e.startsWith(p));
const hard = allowPlaceholder ? errors.filter((e) => !isPlaceholder(e)) : errors;
const warnings = allowPlaceholder ? errors.filter(isPlaceholder) : [];

if (warnings.length) {
  console.log(`Placeholder warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  ~ ${w}`);
}
if (hard.length) {
  console.log(`Errors (${hard.length}):`);
  for (const e of hard) console.log(`  ✗ ${e}`);
} else {
  console.log('Content OK: no errors.');
}

console.log('\nReview each term:');
for (const r of [...reviewItems].sort((a, b) => a.date.localeCompare(b.date))) {
  console.log(`  ${r.date}  ${r.where}\n              ${r.note}`);
}

process.exit(hard.length ? 1 : 0);
