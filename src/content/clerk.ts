import { ClerkContent } from './types';
import { placeholderClerk } from './placeholders';

// Guess, reveal, endings, and codas are written in Task 10.
export const clerk: ClerkContent = {
  ...placeholderClerk,
  askForHelp:
    'He has been watching the whole time. When you finish, he steps closer and holds out his ink-stained hands, palms up, as if there were something in them. “Could you do that for me? Put a name on me. A license. Anything.”',
};
