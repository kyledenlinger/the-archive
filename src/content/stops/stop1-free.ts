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
  choices: [
    {
      id: 'take',
      label: 'Take it.',
      outcome: {
        text: 'You add it to your cart. It’s exactly what you wanted, and nothing stopped you from taking it. Nothing told you that you could, either.',
        cartNote:
          'Taken without a license and without an identified creator. Default copyright applies: all rights reserved unless shown otherwise. If the owner surfaces, a takedown, a claim, or a license fee is possible, and the exposure grows the more widely the work travels and the more money it makes.',
      },
    },
    {
      id: 'find',
      label: 'Try to find out who owns it.',
      outcome: {
        chronicler: {
          text: 'You trace the station’s tapes to a university library that took them in when it closed. A librarian writes back: they hold the tapes, but not clearly the rights, which may have passed to the station’s last owner, a company that no longer exists. They can give you a much better copy for research.',
          cartNote:
            'Owner search: the station is gone; its tapes sit with a university library that isn’t sure it holds the rights. Clip on hold while rights are traced. The search documents good faith, and it turned up a better source.',
        },
        herald: {
          text: 'A reverse image search leads to a photographer’s portfolio from three years ago: the original, uncropped, with their name on it. They’re reachable. They haven’t said anything about reuse.',
          cartNote:
            'Owner search: photographer identified by reverse image search. No license stated. Use on hold pending a request. Credit and permission are now possible where before they weren’t.',
        },
        naturalist: {
          text: 'The blog has a contact form and an “about” page with the photographer’s first name. You send a short note asking about the owl photo. Two days go by without an answer.',
          cartNote:
            'Owner search: blogger identified and contacted through the site’s form. No reply yet. Photo on hold. No reply is not the same as permission.',
        },
        artificer: {
          text: 'You follow the pins back eleven steps and lose the trail at a dead link. A reverse image search finds the moth on six other sites, none of them the source.',
          cartNote:
            'Owner search: trail ends at a dead link; no creator found after a reasonable search. The illustration is still under copyright, with no one to ask. The search shows good faith, but it isn’t a license.',
        },
        bard: {
          text: 'After some digging you find the break in a crate-digging forum thread: it’s lifted from a 1984 funk single. The label still exists, and so does its sample-clearance process, with fees.',
          cartNote:
            'Owner search: break traced to a 1984 single; the label is active and clears samples for a fee. The “royalty free” site had nothing to grant. Sample on hold pending clearance or a replacement.',
        },
        conjurer: {
          text: 'The forum lets you message the poster. Three days later: “oh wow yeah go for it, just credit me as pixelpotion.” You save the message.',
          cartNote:
            'Owner search: creator found and replied in writing: free to use with credit as “pixelpotion.” Permission saved. The scope (selling the game? modifying the sprites?) is informal, which is why the saved message matters.',
        },
      },
    },
    { id: 'fair-use', label: 'Run a fair use analysis.', mechanic: 'fairUse' },
    {
      id: 'leave',
      label: 'Leave it and find something you know is usable.',
      outcome: {
        chronicler: {
          text: 'You find flood footage shot by a federal agency in the Internet Archive’s film collection, and a local historical society that licenses its news photos for a small fee. There’s no reporter in a raincoat, but it’s the same flood.',
          cartNote:
            'Passed on the unlicensed clip. Sourced federal-agency flood footage (a U.S. government work, public domain) and noted a historical society that licenses photos. Less exact than the station footage, with clear rights.',
        },
        herald: {
          text: 'Openverse turns up a CC BY photo of a raccoon peering out of a recycling bin. Not quite the same energy, but close. You’ll credit the photographer in the caption.',
          cartNote:
            'Passed on the viral photo. Used a CC BY alternative from Openverse, credited in the caption. Clear rights; the meme’s particular joke is lost.',
        },
        naturalist: {
          text: 'Wikimedia Commons has a CC BY-SA photo of a great gray owl hunting, from a named photographer. Honestly, the blog photo was better.',
          cartNote:
            'Passed on the blog photo. Used a CC BY-SA photo from Wikimedia Commons with credit. ShareAlike applies to adaptations of the photo, not to the whole blog post.',
        },
        artificer: {
          text: 'The Smithsonian’s open access collection has a 19th-century plate of moths released under CC0. You can cut it up however you like.',
          cartNote:
            'Passed on the untraceable illustration. Used a CC0 moth plate from Smithsonian Open Access. No conditions and no credit required, though crediting the source is still good practice.',
        },
        bard: {
          text: 'You record your own break on a friend’s drum kit with a borrowed microphone. It takes an afternoon and sounds different, but it’s yours.',
          cartNote: 'Passed on the lifted break. Recorded an original drum break instead. Full rights; the cost was an afternoon and the exact sound.',
        },
        conjurer: {
          text: 'You find a CC0 potion pack on OpenGameArt. It isn’t animated, so you animate it yourself.',
          cartNote: 'Passed on the forum sprites. Used a CC0 pack and added original animation. No conditions, and the animation is new work of your own.',
        },
      },
    },
  ],
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
