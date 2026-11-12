import { content } from '../src/content/index';
import * as ui from '../src/content/ui';
import { collectWarnings, validateContent } from '../src/lib/validateContent';

// Checks every player-facing string in GameContent, then lists time-sensitive items to re-check each term.

const { errors, warnings, reviewItems } = validateContent(content);
// The About panel copy lives in `ui`, outside GameContent; scan it for the license marker too.
const allWarnings = [...warnings, ...collectWarnings(ui, 'ui')];

if (errors.length) {
  console.log(`Errors (${errors.length}):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
} else {
  console.log('Content OK: no errors.');
}

if (allWarnings.length) {
  console.log(`\nWarnings (${allWarnings.length}):`);
  for (const w of allWarnings) console.log(`  ! ${w}`);
}

console.log('\nReview each term:');
for (const r of [...reviewItems].sort((a, b) => a.date.localeCompare(b.date))) {
  console.log(`  ${r.date}  ${r.where}\n              ${r.note}`);
}

process.exit(errors.length ? 1 : 0);
