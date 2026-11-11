import { content } from '../src/content/index';
import { validateContent } from '../src/lib/validateContent';

// Checks every player-facing string in GameContent, then lists time-sensitive items to re-check each term.
const { errors, reviewItems } = validateContent(content);

if (errors.length) {
  console.log(`Errors (${errors.length}):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
} else {
  console.log('Content OK: no errors.');
}

console.log('\nReview each term:');
for (const r of [...reviewItems].sort((a, b) => a.date.localeCompare(b.date))) {
  console.log(`  ${r.date}  ${r.where}\n              ${r.note}`);
}

process.exit(errors.length ? 1 : 0);
