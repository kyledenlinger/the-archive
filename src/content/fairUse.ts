import { FairUseContent } from './types';

export const fairUse: FairUseContent = {
  factors: [
    {
      title: 'Purpose and Character of the Use',
      description:
        'Is your use transformative? Are you doing something new with this material — commenting on it, criticizing it, analyzing it, parodying it — or reproducing it for essentially the same purpose it was originally made for?',
      text: {
        free: {
          chronicler:
            'Your film would use the clip to show what the flood looked like and how the town saw it at the time. The clip becomes evidence in your story, which leans transformative, especially if your narration comments on the coverage itself. If it’s only there for atmosphere, less so. A festival screening is close to noncommercial; a later streaming deal is not.',
          herald:
            'Your post would use the photo for a joke about late-night studying. Memes can add new meaning through their captions, which can be transformative. But your joke depends on the same thing that made the photo funny in the first place, and the post is promotional.',
          naturalist:
            'You’d illustrate an article about owl hunting with a photo of an owl hunting. That’s educational, but it’s also the reason the photographer took the picture, so it isn’t much of a new purpose. And your channel earns money.',
          artificer:
            'Collage can be strongly transformative: you’d cut the moth apart, combine it with other material, and give it a new meaning. How much of the original survives, and how recognizable it stays, matters. You’d also be selling prints.',
          bard:
            'You’d loop the break as the rhythmic foundation of a new track. Courts have been tough on music sampling, and using a beat as a beat is close to its original purpose. A commercial release adds weight.',
          conjurer:
            'The sprites would be the potions in your game: game art used as game art, exactly what it was made for. That isn’t transformative, and it’s commercial if you charge for the game.',
        },
        layers: {
          chronicler: "The newsreel would establish what the town looked like before the flood: historical context in a documentary, a reasonably strong purpose. But the layer that’s still protected is the 2010 score, and using a score as a score isn’t transformative.",
          herald: "A sponsored post that uses Mickey to sell something isn’t commentary on Mickey. A post that parodied Disney, or commented on Mickey entering the public domain, would be a different case. And fair use doesn’t answer the trademark question at all.",
          naturalist: "An educational explainer that uses a space-agency image to show a crater. That’s informational, but it’s close to the reason the image was released in the first place.",
          artificer: "The colorized image would sit in your prints as the image itself. Unless you transform it substantially, you’d be using the colorist’s work for the same visual appeal they created.",
          bard: "You’d sample the 2019 orchestral recording as raw material for a new track. Some transformation, but it’s music used as music, on a commercial release.",
          conjurer: "You’d borrow the TV series’ look for your own story. A new game is a new work, but borrowing a character design to play the same role isn’t strongly transformative.",
        },
        permission: {
          chronicler: "The clip would illustrate your film’s account of the flood, which is documentary use. But you already licensed this clip. The real question is whether the license covers you, and fair use can’t cure a breach of a license you agreed to.",
          herald: "The song would play as the soundtrack to a promotion. That’s music used for exactly what music is for, in an ad.",
          naturalist: "Fair use is a defense for using someone else’s copyrighted work. With an AI image, the limit comes mostly from the tool’s terms, not from copyright. Your purpose is educational, but the contract governs.",
          artificer: "A collage that recontextualizes the greenhouse photo, or comments on it, could be transformative. A print that keeps it mostly intact, less so.",
          bard: "As with an AI image, the limit on the AI track comes from the terms you accepted. Fair use doesn’t override a contract.",
          conjurer: "Putting the assets in an open-source repository isn’t a new purpose. It’s redistributing the same files.",
        },
      },
    },
    {
      title: 'Nature of the Copyrighted Work',
      description:
        'Is the original work more factual or more creative? Courts give more leeway when using factual works. A news broadcast is more fair-use-friendly than a pop song.',
      text: {
        free: {
          chronicler: 'News footage is mostly factual, which helps you. The camera work and editing still involve creative choices, but factual works get thinner protection.',
          herald: 'Photos are treated as creative works, though a casual snapshot like this one counts as somewhat less creative than an elaborately staged one.',
          naturalist: 'The owl is real, but the timing, framing, and technique are the photographer’s creative choices. This is treated as a creative work.',
          artificer: 'An original ink illustration is highly creative. This factor leans against fair use, though it rarely decides a case on its own.',
          bard: 'A drum performance on a record is creative expression. This leans against you.',
          conjurer: 'Original pixel art is creative work. This leans against fair use.',
        },
        layers: {
          chronicler: "The newsreel is factual. The new score is creative, and it’s the protected layer.",
          herald: "The later Mickey designs are highly creative works.",
          naturalist: "Space imagery is largely factual and scientific, though processing an image involves choices. This leans toward fair use.",
          artificer: "The colorization is creative work layered over a public-domain base. The new color choices are exactly what’s protected.",
          bard: "A recorded orchestral performance is creative expression.",
          conjurer: "A TV series’ character designs are highly creative.",
        },
        permission: {
          chronicler: "Footage of water in a culvert: fairly factual.",
          herald: "A popular song is highly creative.",
          naturalist: "If purely AI-generated output isn’t protected by copyright at all, there may be little here to weigh. The terms remain.",
          artificer: "An artistic photograph is creative work.",
          bard: "As with an AI image: copyright in purely AI-generated material is doubtful, and the terms remain.",
          conjurer: "Art assets are creative. In the U.S., typeface designs get little protection, but font files are protected as software.",
        },
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
          conjurer: 'The whole sheet, every sprite on it.',
        },
        layers: {
          chronicler: "A few seconds of footage, but the score runs under all of it.",
          herald: "If you use the later look, you’d take its most recognizable features: the heart of the character design.",
          naturalist: "One full image.",
          artificer: "The whole colorized image.",
          bard: "Several bars of the recording, maybe its most memorable passage.",
          conjurer: "The look of the character: the elements that make this adaptation’s Holmes recognizable.",
        },
        permission: {
          chronicler: "One short clip, used whole.",
          herald: "Probably the hook: the part that’s trending.",
          naturalist: "One full image.",
          artificer: "Possibly the whole photograph, or a recognizable part of it.",
          bard: "The whole backing track.",
          conjurer: "Every file in the pack, plus the font file itself.",
        },
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
        layers: {
          chronicler: "The label licenses this release, footage and score together. Using it without a license could stand in for a sale.",
          herald: "Disney licenses Mickey widely. A sponsored post using the protected look competes with that market.",
          naturalist: "Space-agency images are often released for public outreach under stated conditions. Following those conditions does little harm to any market.",
          artificer: "The colorist could sell prints or license the image, and your prints could compete with theirs directly.",
          bard: "Labels license recordings for sampling. An unlicensed sample takes the place of that license.",
          conjurer: "Studios license their character designs for games. Using them takes that market.",
        },
        permission: {
          chronicler: "The agency sells commercial licenses for exactly this situation.",
          herald: "Labels license songs for ads. An unlicensed promotion takes the place of that license.",
          naturalist: "The tool sells paid plans that include commercial rights. Using free output commercially stands in for that.",
          artificer: "The artist may license or sell this photo, and your prints could compete.",
          bard: "The generator sells plans with commercial rights. Using free output commercially stands in for that.",
          conjurer: "Free copies in a public repository directly replace sales of the pack and the font.",
        },
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
    layers: {
      chronicler: "A moderate argument for the footage and a weak one for the score. The layers point to an easier path: keep the old, drop the new.",
      herald: "Weak for the later Mickey, and fair use doesn’t resolve trademark at all. The 1928 version needs no fair use argument; it’s free. The exposure lives in the later design and in any hint of Disney’s involvement.",
      naturalist: "A moderate argument, but you may not need one: the partner agency’s own terms may already allow your use with credit. Read them first.",
      artificer: "A weak argument for the colorized version used as it is. The underlying public-domain illustration needs no argument at all.",
      bard: "A weak argument for sampling the 2019 recording on a commercial release. The public-domain composition and the 1924 recording need none.",
      conjurer: "A weak argument for the TV series’ designs. The original Holmes is free; the adaptation’s additions are where the exposure is.",
    },
    permission: {
      chronicler: "Fair use isn’t the main question. You hold a license with limits; staying within it, or upgrading it, is the cleaner path.",
      herald: "A weak argument. A hit song in a paid promotion is a classic licensing situation.",
      naturalist: "Fair use doesn’t fit well here. The tool’s terms decide this, and they say non-commercial. Upgrade, ask, or replace.",
      artificer: "A moderate argument if the collage genuinely transforms the photograph, weaker for prints that keep it recognizable. The artist is reachable, which makes asking easy.",
      bard: "Fair use doesn’t fit well here. The generator’s terms decide this. Upgrade, ask, or replace.",
      conjurer: "A weak argument. Redistributing the assets themselves is exactly what both licenses forbid.",
    },
  },
};
