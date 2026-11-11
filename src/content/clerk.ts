import { ClerkContent } from './types';

export const clerk: ClerkContent = {
  askForHelp:
    'He has been watching the whole time. When you finish, he steps closer and holds out his ink-stained hands, palms up, as if he were offering you something. “Could you do that for me? Put a name on me, or a license. Anything.”',

  guessPrompt:
    'Before you answer, you think back over the things he has let slip along the way. What do you think the Clerk really is?',
  guessOptions: [
    { id: 'photograph', label: 'A photograph' },
    { id: 'song', label: 'A song' },
    { id: 'letter', label: 'A letter' },
    { id: 'film', label: 'A film' },
    { id: 'other', label: 'Something else' },
  ],

  reveal: [
    'You want to say yes, but you know the answer now, and so does he. You can’t license a work you don’t own, and you can’t release it, either. Only its creator can do that, or time, when the copyright term finally runs out.',
    'He nods slowly, as if he’d known all along. “Nobody’s ever been able to tell me who made me,” he says. “I suppose that’s the whole trouble.”',
    'Then he opens his jacket, and you see that it was never really a jacket. He’s made of pages. He’s a scrapbook, with a cracked spine mended with tape, full of unlabeled photographs held in by paper corners, letters in three different handwritings, and newspaper clippings with the dates torn off. Pressed flat between two of the pages is a concert program from a night nobody remembers.',
    'Suddenly the hints make sense. The tune he couldn’t place comes from the concert program. The photographs are why he was “developed” once, and the letters are what somebody wrote to him. He has no name tag because none of the people who made him ever signed their work. He’s a stack of orphan works, bound together, and every piece has its own missing creator.',
    '“That’s not advice, obviously,” he says. “Just what I am.”',
  ],

  endings: {
    search: {
      label: 'Search for his compiler.',
      scene:
        'You start a diligent search: library catalogs, the newspapers his clippings came from, the venue printed on the concert program. It takes weeks. And you find a name: the woman who assembled him, in an estate-sale listing from 1989. Her heirs might be able to license the scrapbook as a compilation, since the selection and arrangement were hers. But every photograph, letter, and clipping inside him still has its own missing creator. The search answered one question and raised forty more. The trade-off: real progress at a real cost, and a much clearer record for the next person who looks.',
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
