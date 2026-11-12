import { content } from '../src/content/index';
import * as ui from '../src/content/ui';
import { collectWarnings, validateContent } from '../src/lib/validateContent';

// Checks every player-facing string in GameContent, then lists time-sensitive items to re-check each term.
//
// --allow-placeholder: temporary, revision-2 branch only (removed in Task 13). Errors that come from
// revision-2 content not yet written (placeholder text, missing effects, briefs, coaching, terms,
// strengths, the shelf) are listed as placeholder warnings instead of failing the run.
const PLACEHOLDER_PATTERNS: RegExp[] = [
  /: placeholder text$/,
  /: effects need at least one gain and one cost$/,
  /^personas\[\d+\]\.(brief|startMeters)\b/,
  /^stops\.\w+\.(searchFindChance|searchFail)\b/,
  /^stops\.\w+: needs at least one choice with no requires$/,
  /^fairUse\.coaching\b/,
  /^fairUse\.assessments\..*: invalid strength$/,
  /^ask\.(responses|terms|odds|acceptLabel|declineLabel)\b/,
  /^clerk\b/,
];
const allowPlaceholder = process.argv.includes('--allow-placeholder');

const { errors, warnings, reviewItems } = validateContent(content);
// The About panel copy lives in `ui`, outside GameContent; scan it for the license marker too.
const allWarnings = [...warnings, ...collectWarnings(ui, 'ui')];
const isPlaceholder = (e: string) => PLACEHOLDER_PATTERNS.some((re) => re.test(e));
const hard = allowPlaceholder ? errors.filter((e) => !isPlaceholder(e)) : errors;
const placeholders = allowPlaceholder ? errors.filter(isPlaceholder) : [];

if (hard.length) {
  console.log(`Errors (${hard.length}):`);
  for (const e of hard) console.log(`  ✗ ${e}`);
} else {
  console.log('Content OK: no errors.');
}

if (placeholders.length) {
  console.log(`\nPlaceholder warnings (${placeholders.length}), allowed by --allow-placeholder:`);
  for (const w of placeholders) console.log(`  ~ ${w}`);
}
if (allWarnings.length) {
  console.log(`\nWarnings (${allWarnings.length}):`);
  for (const w of allWarnings) console.log(`  ! ${w}`);
}

console.log('\nReview each term:');
for (const r of [...reviewItems].sort((a, b) => a.date.localeCompare(b.date))) {
  console.log(`  ${r.date}  ${r.where}\n              ${r.note}`);
}

process.exit(hard.length ? 1 : 0);
