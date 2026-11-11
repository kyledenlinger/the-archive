import { FairUseContent, PersonaId } from './types';

// `layers` and `permission` entries are filled in Tasks 7 and 8.
const todo = (): Record<PersonaId, string> => ({ chronicler: '', herald: '', naturalist: '', artificer: '', bard: '', conjurer: '' });

export const fairUse: FairUseContent = {
  factors: [
    {
      title: 'Purpose and Character of the Use',
      description:
        'Is your use transformative? Are you doing something new with this material — commenting on it, criticizing it, analyzing it, parodying it — or reproducing it for essentially the same purpose it was originally made for?',
      text: {
        free: {
          chronicler:
            'Your film would use the clip to show what the flood looked like and how the town saw it at the time. The clip becomes evidence in your story, which leans transformative, especially if your narration comments on the coverage itself. As pure atmosphere, less so. A festival screening is close to noncommercial; a later streaming deal is not.',
          herald:
            'Your post would use the photo as a joke about late-night studying. Memes can add new meaning through captions, which can be transformative. But the joke leans on the same thing that made the photo funny in the first place, and it’s a promotional post.',
          naturalist:
            'You’d illustrate an article about owl hunting with a photo of an owl hunting. Educational, yes, but that’s the same reason the photographer took it. Not much of a new purpose, and your channel earns money.',
          artificer:
            'Collage can be strongly transformative: you’d cut the moth apart, combine it with other material, and give it a new meaning. How much of the original survives, and how recognizable it stays, matters. You’d also be selling prints.',
          bard:
            'You’d loop the break as the rhythmic foundation of a new track. Courts have been tough on music sampling, and using a beat as a beat is close to its original purpose. A commercial release adds weight.',
          conjurer:
            'The sprites would be the potions in your game. That’s game art used as game art, exactly what it was made for. Not transformative, and commercial if you charge for the game.',
        },
        layers: todo(),
        permission: todo(),
      },
    },
    {
      title: 'Nature of the Copyrighted Work',
      description:
        'Is the original work more factual or more creative? Courts give more leeway when using factual works. A news broadcast is more fair-use-friendly than a pop song.',
      text: {
        free: {
          chronicler: 'News footage is mostly factual, which helps you. The camera work and editing still involve creative choices, but factual works get thinner protection.',
          herald: 'A candid snapshot is creative, but not elaborately so. Photos are treated as creative works; a casual one, somewhat less.',
          naturalist: 'The owl is real, but the timing, framing, and technique are the photographer’s creative choices. This is treated as a creative work.',
          artificer: 'An original ink illustration is highly creative. This factor leans against fair use, though it rarely decides a case on its own.',
          bard: 'A drum performance on a record is creative expression. This leans against you.',
          conjurer: 'Original pixel art is creative work. This leans against fair use.',
        },
        layers: todo(),
        permission: todo(),
      },
    },
    {
      title: 'Amount and Substantiality',
      description: "How much of the original are you using? And is what you're using the 'heart' of the work — the most memorable, recognizable part?",
      text: {
        free: {
          chronicler: 'About twenty seconds of a report several minutes long. If those seconds are its most dramatic shot, they may be the heart of it.',
          herald: 'The whole photo. With images that’s often unavoidable, and courts sometimes accept it when the purpose requires it. It’s still the whole thing.',
          naturalist: 'The whole photo. For an illustration, there isn’t another way to use it.',
          artificer: 'Maybe just the wings, cut up and recombined. Smaller, less recognizable portions help your argument.',
          bard: 'Two bars, looped. Small in seconds, but if it’s the most distinctive part of the record, it may be the heart of it.',
          conjurer: 'The whole sheet: every sprite.',
        },
        layers: todo(),
        permission: todo(),
      },
    },
    {
      title: 'Effect on the Market',
      description:
        'Does your use harm the market for the original — or for licensed versions of it? If your use substitutes for buying or licensing the original, that’s the strongest strike against fair use.',
      text: {
        free: {
          chronicler: 'Archives do license old news footage. Using it without paying could stand in for a license, if anyone still holds the rights to sell one.',
          herald: 'Viral photos sometimes get licensed, and this photographer could have sold this one. Your use, multiplied by everyone else reposting it, could undercut that.',
          naturalist: 'Hobbyist photographers do license their photos to publications. A monetized channel using it for free could stand in for a sale.',
          artificer: 'A collage that transforms the moth probably doesn’t replace demand for the illustration. A print that reproduces it recognizably might.',
          bard: 'Sample clearance is an established market. An uncleared sample on a commercial release takes the place of paying for one.',
          conjurer: 'The creator gave the sprites away, so there’s little market to harm. That’s one reason their “free to use” matters more here than fair use does.',
        },
        layers: todo(),
        permission: todo(),
      },
    },
  ],
  assessments: {
    free: {
      chronicler:
        'A reasonable argument, strongest if your film comments on the coverage and uses only what it needs. A later streaming deal would weaken it. Defensible, with honest uncertainty.',
      herald: 'A weak-to-moderate argument. Memes can be transformative, but a promotional post using the whole photo for the same laugh is a hard case to make.',
      naturalist: 'A weak argument. The photo would do the job it was made for, in full, on a channel that earns money. Not impossible, but thin.',
      artificer:
        'A moderate-to-strong argument, if the moth is genuinely transformed and you take only what you need. Prints that keep the original recognizable would weaken it.',
      bard: 'A weak argument. A recognizable sample, used as a beat, on a commercial release, in a market where clearance exists, is about the hardest version of this question.',
      conjurer:
        'Fair use is thin here, but you may not need it. “Free to use” from the creator is a kind of permission, just a vague one. Getting it in writing is the stronger move.',
    },
    layers: todo(),
    permission: todo(),
  },
};
