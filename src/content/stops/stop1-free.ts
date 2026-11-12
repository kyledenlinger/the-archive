import { StandardStop } from '../types';

export const stop1Free: StandardStop = {
  id: 'free',
  title: 'Unmarked',
  clerkIntro:
    'First stop. This section gets a lot of visitors. Everything on these shelves was posted and reposted so many times that nobody remembers where it started. People assume that if they can reach something, they can use it. It’s a very understandable assumption.',
  setup: {
    chronicler:
      'Your documentary is about a 1970s flood that reshaped your town, and you need footage from that week. On this shelf you find exactly that: a local TV news clip, with water in the streets and a reporter in a soaked raincoat. Its tag says it was uploaded to a video site by an account called vhs_rescues_77, which has nothing to do with the station. The station itself closed in 1994.',
    herald:
      'You need an image for your organization’s post about late-night study hours, and this shelf has the one everyone is sharing this week: a raccoon staring into a vending machine, captioned a hundred different ways. Nobody seems to know who took it. Every copy credits a different account, or no one.',
    naturalist:
      'You’re writing a blog post about how owls hunt in snow, and here is the photo you were hoping for: a great gray owl diving headfirst into a snowbank. Its tag says it comes from a hobbyist’s birding blog. The blog has a name and a few years of posts, but no license anywhere on the page.',
    artificer:
      'For a new collage you want a delicate ink drawing of a moth, and you find one here. Its tag shows it was pinned and re-pinned on a pinboard site so many times that the trail back to whoever drew it has gone cold. The file is called moth_final_FINAL.jpg.',
    bard:
      'Your track needs a drum break, and this one has exactly the right feel. Its tag says it came from a site called FreeLoopsForever, which calls it “royalty free!” But the snare, the room, and the faint tape hiss sound a lot like a 1980s record, and the uploader doesn’t say where it came from.',
    conjurer:
      'Your game needs art for its potions, and here is a sprite sheet of pixel-art potions, beautifully animated. Its tag says it was posted on a game-dev forum, and the whole post read: “made these a while back, free to use lol.” The account hasn’t posted in four years.',
  },
  complication:
    'It’s right there, free for anyone to look at, and copying it would take a moment. But nothing on it tells you who made it or what they allow. When there’s no license, the default is all rights reserved: the creator, whoever they are, still holds the copyright.',
  // Stop 1 is coached: the fair use analysis runs first for everyone, then these four decisions (revision spec §5.2).
  choices: [
    {
      id: 'rely',
      label: 'Use it, relying on your fair use analysis.',
      // Effects come from the assessment's strength (fairUseEffects): Vision +1, and Exposure +1 (moderate) or
      // +2 (weak), tagged legal. Chronicler is moderate, Artificer strong, the rest weak.
      effectsFrom: 'fairUse',
      outcome: {
        chronicler: {
          text: 'You keep the clip and write your narration so it talks about the coverage itself: how the station framed the flood, and what it left out. You use only the twenty seconds you need. It’s a reasonable argument, but it’s an argument, not permission. If whoever holds the station’s rights turns up, a streaming deal is the kind of use that could bring a legal claim.',
          cartNote:
            'Used the clip on a fair use basis (a moderate case): commentary on the coverage, about twenty seconds, for a festival screening. Fair use is a defense, decided only if someone challenges the use. Legal exposure: a rights holder could still claim or ask for a fee, more likely if the film streams or sells.',
        },
        herald: {
          text: 'You post the raccoon with your caption, and it does well. Your fair use case is thin, though: the whole photo, used for the same laugh, in a promotional post. If the photographer finds it, this is the kind of use that gets a takedown notice or an invoice.',
          cartNote:
            'Used the photo on a fair use basis (a weak case): the whole image, the same joke, in a promotional post. No license and no identified owner. Legal exposure: a takedown or a demand for a licensing fee is possible if the photographer finds the post.',
        },
        naturalist: {
          text: 'The owl goes at the top of your post, and it’s the best thing on the page. Your fair use case is thin, though: the whole photo, used for the reason it was taken, on a site that earns money. If the photographer sees it, this is the kind of use that gets a takedown request or a bill.',
          cartNote:
            'Used the photo on a fair use basis (a weak case): the whole photo, used for its original purpose, on a monetized site. No license. Legal exposure: the blogger could ask for removal or a fee.',
        },
        artificer: {
          text: 'You cut the moth’s wings apart and set them into the collage, where they read as something new. You take only what you need, and your fair use argument is about as good as these get. It still isn’t a license, so you keep notes on how you changed the drawing, in case anyone ever asks.',
          cartNote:
            'Used the illustration on a fair use basis (a strong case): cut up and transformed in a collage, using only parts. Fair use is a defense, not permission, and it’s decided only if someone challenges the use. Kept notes on the transformation. Prints that keep the moth recognizable would weaken the argument.',
        },
        bard: {
          text: 'You loop the break and build the track on it, and it sounds exactly the way you heard it in your head. But the fair use case is about as hard as they come: a recognizable sample, used as a beat, on a commercial release. If the owners of the original recording hear it, this is the kind of use that gets a track pulled from streaming.',
          cartNote:
            'Used the break on a fair use basis (a weak case): a recognizable sample, looped as a beat, on a commercial release, where a market for clearing samples exists. “Royalty free” on the upload site granted nothing. Legal exposure: a takedown or a claim on the track’s earnings is possible if the original’s owners notice.',
        },
        conjurer: {
          text: 'The potions go into your game, animated and gleaming. Fair use doesn’t carry much weight here, since you’re using game art as game art in a game you plan to sell. What you’re really leaning on is a four-year-old post that said “free to use lol.” If the creator meant something narrower, this is the kind of use that gets a takedown request sent to your store page.',
          cartNote:
            'Used the sprite sheet on a fair use basis (a weak case), backed by the creator’s informal “free to use lol” post. Game art used as game art, in a game for sale. Legal exposure: the post says nothing about selling or modifying the sprites, and nothing is in writing between you and the creator.',
        },
      },
    },
    {
      id: 'free',
      label: 'Find a free alternative.',
      // Looking takes time, and the replacement is never quite the thing you wanted; the rights are clear.
      effects: [{ meter: 'time', delta: -1 }, { meter: 'vision', delta: -1 }, { meter: 'exposure', delta: -1 }],
      outcome: {
        chronicler: {
          text: 'You spend a day in the Internet Archive’s film collection and find flood footage that a federal agency shot the same week. There’s no reporter in a soaked raincoat, but it’s the same flood, and it’s free to use.',
          cartNote:
            'Passed on the unlicensed clip. Used federal-agency flood footage from the Internet Archive (a U.S. government work, in the public domain). Less exact than the station’s footage, with clear rights. Cost a day of searching.',
        },
        herald: {
          text: 'Openverse turns up a CC BY photo of a raccoon peering out of a recycling bin. It takes an hour to find, and it isn’t quite the same joke, but it’s close. You’ll credit the photographer in the caption.',
          cartNote:
            'Passed on the viral photo. Used a CC BY alternative from Openverse, credited in the caption. Clear rights; the meme’s particular joke is lost.',
        },
        naturalist: {
          text: 'Wikimedia Commons has a CC BY-SA photo of a great gray owl hunting, from a named photographer. It takes most of an evening to find. Honestly, the blog photo was better.',
          cartNote:
            'Passed on the blog photo. Used a CC BY-SA photo from Wikimedia Commons with credit. ShareAlike applies to adaptations of the photo, not to the whole blog post. A less striking image, with clear rights.',
        },
        artificer: {
          text: 'After an afternoon of looking, you find a 19th-century plate of moths in the Smithsonian’s open access collection, released under CC0. It’s stiffer than the ink drawing, but you can cut it up however you like.',
          cartNote:
            'Passed on the untraceable illustration. Used a CC0 moth plate from Smithsonian Open Access. No conditions and no credit required, though crediting the source is still good practice. Less delicate than the drawing you wanted.',
        },
        bard: {
          text: 'You record your own break on a friend’s drum kit with a borrowed microphone. It takes an afternoon and sounds different, but it’s yours.',
          cartNote: 'Passed on the lifted break. Recorded an original drum break instead. Full rights; the cost was an afternoon and the exact sound.',
        },
        conjurer: {
          text: 'You find a CC0 potion pack on OpenGameArt. It isn’t animated, so you spend two evenings animating it yourself, and it never looks quite as good as the sprites you found.',
          cartNote:
            'Passed on the forum sprites. Used a CC0 pack and added original animation. No conditions, and the animation is new work of your own. Cost two evenings, and the art is plainer.',
        },
      },
    },
    {
      id: 'licensed',
      label: 'Pay for a licensed alternative.',
      requires: ['budget'],
      // The fee comes out of the budget; the license makes the rights clear in writing.
      effects: [{ meter: 'budget', delta: -2 }, { meter: 'exposure', delta: -1 }],
      outcome: {
        chronicler: {
          text: 'The county historical society holds news film of the same flood, shot by a different crew, and licenses it for documentaries. The fee takes a real bite out of your budget, but the license covers festivals and streaming, in writing.',
          cartNote:
            'Passed on the unlicensed clip. Licensed flood footage from the county historical society for festival screenings and streaming. Paid from the budget. Clear rights in writing; a different crew’s footage, not the station’s.',
        },
        herald: {
          text: 'A stock photo site has a sharp, well-lit raccoon raiding a snack bin, licensed for social media and promotion. It costs more than your organization usually spends on a post, but the license is clear.',
          cartNote:
            'Passed on the viral photo. Licensed a stock raccoon photo that covers social media and promotional use. Paid from the budget. Clear rights; the license terms (where, and for how long) are saved with the post.',
        },
        naturalist: {
          text: 'A wildlife photo agency has a great gray owl plunging into snow, by a photographer who spent weeks on the shot. The license for a monetized site isn’t cheap, but it covers exactly what you’re doing.',
          cartNote:
            'Passed on the blog photo. Licensed a comparable owl photo from a wildlife agency for use on a monetized site, with credit. Paid from the budget. Clear rights, and the photographer got paid.',
        },
        artificer: {
          text: 'An illustrator sells licenses to her insect drawings through her online shop, and her moth is nearly as fine as the one you found. The license allows altered versions in prints you sell, for a fee that stretches your budget.',
          cartNote:
            'Passed on the untraceable illustration. Licensed a moth drawing directly from its illustrator, covering altered versions in prints for sale. Paid from the budget. Clear rights, and a creator you can credit by name.',
        },
        bard: {
          text: 'A sample library sells a pack of drum breaks recorded for sampling, with a license that covers commercial releases. The one you pick is close to the feel you wanted, and the pack costs more than you’d hoped.',
          cartNote:
            'Passed on the lifted break. Bought a sample pack whose license covers commercial releases, from the company that recorded it. Paid from the budget. Clear rights, close to the original feel.',
        },
        conjurer: {
          text: 'An asset store sells an animated potion pack with a commercial license. It’s polished, and the price makes a real dent in your budget.',
          cartNote:
            'Passed on the forum sprites. Bought an animated potion pack with a commercial game license. Paid from the budget. Clear rights for selling the game; check what the license says about modifying the files.',
        },
      },
    },
    // Runs a search (Time −2 either way), then the Ask if the owner is found (revision spec §5.4).
    { id: 'search', label: 'Track down the owner and ask.', mechanic: 'search', requires: ['time'] },
  ],
  coached: true,
  // How traceable each item really is: a forum sprite sheet from a quiet account is hard; a blog with a
  // contact form is easy.
  searchFindChance: {
    chronicler: 0.4, // the station closed decades ago; its tapes went somewhere
    herald: 0.5, // a viral photo, but reverse image search sometimes finds the original
    naturalist: 0.7, // a named blog with a contact form
    artificer: 0.3, // pinned until the trail went cold
    bard: 0.6, // a drum break off a real record can be identified
    conjurer: 0.3, // a forum account silent for four years
  },
  // Shown above the Ask form after a search that finds the owner: who, and how. The reply itself comes later.
  searchFound: {
    chronicler:
      'You trace the station’s tapes to a university library that took them in when the station closed. Its special collections desk handles requests to use them.',
    herald:
      'A reverse image search reaches past the reposts to a photographer’s portfolio from three years ago, with the original, uncropped raccoon and their name on it.',
    naturalist:
      'The blog’s contact form works, and its about page gives the photographer’s first name. You can write to them directly.',
    artificer:
      'A reverse image search of one cropped wing turns up the illustrator’s old portfolio site, with the moth on it and an email address at the bottom.',
    bard:
      'A crate-digging forum thread names the source: a 1984 funk single. The label that released it still exists, and it has a sample-clearance process.',
    conjurer:
      'The forum still lets you message the poster, who goes by pixelpotion. The account hasn’t posted in four years, but it’s there.',
  },
  searchFail: {
    chronicler:
      'You trace the station’s tapes as far as a university library that took some of them in when it closed. The librarian is helpful, but nobody there can say who holds the rights now. The company that last owned the station was dissolved years ago, and no one answers for it.',
    herald:
      'Reverse image searches turn up thousands of copies, cropped, captioned, and recompressed, all posted within a day of each other. Whoever took the photo isn’t among them.',
    naturalist:
      'The blog’s contact form returns an error, and the about page gives only a first name and a town. The last post is from six years ago, and the comments stop there too.',
    artificer:
      'You follow the pins back eleven steps and lose the trail at a dead link. A reverse image search finds the moth on six other sites, none of them the source.',
    bard:
      'FreeLoopsForever has no contact page, and the uploader’s profile is empty. You listen through every 1980s funk compilation you can find and don’t hear the break on any of them.',
    conjurer:
      'The forum account’s profile now says “user deleted.” Nobody else in the thread knows who made the sprites, and the username leads nowhere else.',
  },
  debrief: {
    lesson:
      'Being able to see, download, or share something doesn’t mean you’re allowed to reuse it. Copyright attaches automatically when a work is created, and without a license the default is all rights reserved, even when nobody is around to enforce it. Some cases sit in between: “free to use lol” is a kind of permission, just a vague one, while “royalty free” on a site that didn’t make the work grants nothing. Searching for the owner doesn’t make a use safe, but it tells you what you’re dealing with, and sometimes it turns up a better source or a yes.',
    prompts: [
      'Which choice felt most like what you would really do on a deadline? Why?',
      'If you search for the owner and find no one, does that change what you’re allowed to do? Does it change what feels fair?',
      'Who could be affected if you used the work anyway, and how would you ever know?',
    ],
  },
};
