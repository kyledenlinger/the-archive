import { ClerkContent } from './types';

export const clerk: ClerkContent = {
  askForHelp:
    'He has been watching the whole time. When you finish, he steps closer and holds out his ink-stained hands, palms up, as if there were something in them. “Could you do that for me? Put a name on me. A license. Anything.”',

  guessPrompt:
    'Before you answer him, a question of your own. All along, the Clerk has been dropping hints about what he is. What do you think he is?',
  guessOptions: [
    { id: 'photograph', label: 'A photograph' },
    { id: 'song', label: 'A song' },
    { id: 'letter', label: 'A letter' },
    { id: 'film', label: 'A film' },
    { id: 'other', label: 'Something else' },
  ],

  reveal: [
    'You want to say yes. But you know the answer now, and so does he. You can’t license a work you don’t own, and you can’t release it, either. Only its creator can do that. Or time, when the term finally runs out.',
    'He nods slowly, as if he’d known all along. “Nobody’s ever been able to tell me who made me,” he says. “I suppose that’s the whole trouble.”',
    'Then he opens his jacket, and there is no jacket. There never was. He is pages: a scrapbook, its spine cracked and mended with tape. Unlabeled photographs held in by paper corners. Letters in three different hands. Newspaper clippings with the dates torn off. And, pressed flat between two pages, a concert program from a night nobody remembers.',
    'Every clue was true. The tune he couldn’t place comes from the program. He was developed, once: the photographs. Somebody wrote to him: the letters. No name tag, because none of his makers ever signed him. He is a stack of orphan works, bound together, every layer with its own missing creator.',
    '“That’s not advice, obviously,” he says. “Just what I am.”',
  ],

  endings: {
    search: {
      label: 'Search for his compiler.',
      scene:
        'You start a diligent search: library catalogs, the newspapers his clippings came from, the venue printed on the concert program. It takes weeks. And you find a name: the woman who assembled him, in an estate-sale listing from 1989. Her heirs might be able to license the scrapbook as a compilation, since the selection and arrangement were hers. But every photograph, letter, and clipping inside him still has its own missing creator. The search answered one question and uncovered forty. The trade-off: real progress at a real cost, and a much clearer record for the next person who looks.',
    },
    shelf: {
      label: 'Leave him on the shelf.',
      scene:
        'You walk him back to his camp in the deep stacks, where he sorts things nobody asked him to sort. This is where most orphan works end up: not lost, exactly, just unusable, known to a few people who can’t do anything with them. He seems all right. He says he’s used to it. The trade-off: no cost and no risk, and nothing changes, for him or for anyone who might have wanted him.',
    },
    wait: {
      label: 'Wait with him.',
      scene:
        'You sit down beside him to wait for his term to run out. It’s a long wait. For unpublished work by makers nobody can name, U.S. copyright can last as long as 120 years from the day it was made, and for some of the pieces inside him, no one can say when that was. You talk. He hums the tune. The trade-off: certainty, eventually, at the price of a very long time in which nobody can use him.',
    },
  },

  codaShade: {
    arr: 'Your own work is out there under all rights reserved. Anyone who wants to use it will have to find you and ask, so you’ll want to stay findable.',
    'cc-by': 'Your own work is out there under CC BY. Anyone can use it, as long as your name travels with it.',
    'cc-by-sa': 'Your own work is out there under CC BY-SA. Your name travels with it, and so do your terms, into everything built from it.',
    'cc-by-nc': 'Your own work is out there under CC BY-NC. People can share it with your name on it, and anyone who wants to make money from it knows to come to you.',
    cc0: 'Your own work is out there under CC0. You let it go entirely, on purpose, and said so clearly. Nobody will ever have to wonder whether they can use it.',
  },

  closingLine: 'A clear license and your name on your work keep it from becoming him.',
};
