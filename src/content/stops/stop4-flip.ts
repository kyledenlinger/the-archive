import { FlipStop, LicenseId } from '../types';
import { LICENSE_DEFINITIONS } from '../reference';

/** One situation per license, in the order: all rights reserved, CC BY, CC BY-SA, CC BY-NC, CC0. */
const sit = (arr: string, by: string, bysa: string, bync: string, cc0: string): Record<LicenseId, string> => ({
  arr,
  'cc-by': by,
  'cc-by-sa': bysa,
  'cc-by-nc': bync,
  cc0,
});

export const stop4Flip: FlipStop = {
  id: 'flip',
  title: 'The Flip',
  clerkIntro:
    'Last stop, and this one’s a little different. Turn around. That’s yours, on the shelf behind you. You made something, and it ended up in here too. Everything does, eventually. The only question is what it says on the label. Choose carefully. Or don’t, honestly; they’re all defensible. That’s not advice, obviously.',
  clerkClue:
    'As you reach for the license cards, he watches more closely than he has watched anything all day. When you glance over, he looks away, embarrassed.',
  setup: {
    chronicler: 'Your documentary premiered at the festival. People cried at the flood footage. It’s out in the world now.',
    herald: 'A graphic you made, a cartoon raccoon pulling an all-nighter, has gone semi-viral.',
    naturalist: 'Your photo of a fox leaping over a snowbank went viral from your channel’s page.',
    artificer: 'Your newest collage print sold out at the campus market in an hour.',
    bard: 'Your first track is out on every major streaming service.',
    conjurer: 'Your game is live on itch.io, and a few hundred people have played it.',
  },
  work: {
    chronicler: 'Your festival documentary',
    herald: 'Your all-nighter raccoon graphic',
    naturalist: 'Your leaping-fox photo',
    artificer: 'Your collage print',
    bard: 'Your released track',
    conjurer: 'Your game',
  },
  licenses: {
    arr: {
      label: 'All rights reserved',
      clerkGloss: 'The classic. Nobody touches it. Very secure. Very lonely, sometimes.',
      summary: LICENSE_DEFINITIONS.arr,
    },
    'cc-by': {
      label: 'CC BY',
      clerkGloss: 'Anyone can use it as long as they say your name. I think. Something like that.',
      summary: LICENSE_DEFINITIONS['cc-by'],
    },
    'cc-by-sa': {
      label: 'CC BY-SA',
      clerkGloss: 'Like the last one, but it’s… contagious? In a nice way.',
      summary: LICENSE_DEFINITIONS['cc-by-sa'],
    },
    'cc-by-nc': {
      label: 'CC BY-NC',
      clerkGloss: 'Nobody makes money. Possibly including you? No. No, you can. I’m fairly sure you can.',
      summary: LICENSE_DEFINITIONS['cc-by-nc'],
    },
    cc0: {
      label: 'CC0',
      clerkGloss: 'You give it away entirely. Into the commons. Like a message in a bottle, but legal.',
      summary: LICENSE_DEFINITIONS.cc0,
    },
  },
  events: {
    chronicler: {
      within: {
        setup: 'A local TV station runs a 15-second clip from your film in a story about the festival, with your name on screen.',
        situation: sit(
          'You reserved all rights, and this still needs no permission: a short, credited clip in a news story about the festival is the kind of news reporting fair use exists for.',
          'Your license allows this outright: any use, commercial included, with credit. They credited you.',
          'Allowed. A clip shown as is, with credit, fits CC BY-SA. ShareAlike only comes into play if someone adapts it and shares the adaptation.',
          'A commercial station may fall outside your noncommercial terms. But a short, credited clip in news coverage is likely fair use, so it probably didn’t need your license at all.',
          'You waived your rights, so they didn’t even need to credit you. They did anyway.',
        ),
      },
      outside: {
        setup: 'A video channel uploads your entire film under its own title, with no credit. It’s running ads.',
        situation: sit(
          'This is copying the whole film without permission, which is a clear infringement, and video platforms have a takedown process for exactly this.',
          'Your license allowed reuploading, ads and all, but only with credit. No credit puts them outside your terms. (CC 4.0 licenses give someone 30 days to fix a lapse like this once they’re told about it.)',
          'Reuploading was allowed with credit, under the same license. No credit and a new title put them outside your terms.',
          'The ads make this commercial, and there’s no credit, so it’s outside your terms on both counts.',
          'You waived your rights, so the upload itself is allowed, ads included. Claiming they made it is a separate problem: platforms may act on that deception, but it isn’t a copyright violation.',
        ),
      },
      beyond: {
        setup: 'A streaming service wants to license the film, on one condition: exclusive rights for five years.',
        situation: sit(
          'You’ve kept every right, so an exclusive license is yours to grant. Exclusivity means you can’t license the film anywhere else for five years.',
          'A CC license can’t be revoked for copies already out there, so you can’t promise true exclusivity. You can still offer a separate deal, but the service may lose interest once it learns anyone can already stream the film with credit.',
          'Anyone can already share the film under CC BY-SA, so exclusivity isn’t yours to sell. A separate, non-exclusive deal is still possible.',
          'Commercial streaming is outside your license, so the service does need your permission. But anyone can still share the film noncommercially, so it can’t be fully exclusive.',
          'You put the film in the public domain, so there’s nothing exclusive left to sell. Some services will still pay for a quality master and your cooperation.',
        ),
      },
    },
    herald: {
      within: {
        setup: 'A student club shares your graphic with the app’s built-in repost button, which credits you automatically.',
        situation: sit(
          'No permission needed: the platform’s terms, which you accepted when you posted, let other users share posts through the app’s own features.',
          'Allowed, with credit, which the repost provides. The platform’s terms would allow it anyway.',
          'Allowed: shared unchanged, with credit.',
          'Allowed: a student club’s repost is noncommercial and credited.',
          'Allowed, as everything is under CC0.',
        ),
      },
      outside: {
        setup:
          'A clothing brand runs an ad with an AI-generated graphic that’s a near-copy of yours: same composition, same raccoon, same joke, slightly different colors. No credit.',
        situation: sit(
          'If the AI output copies your actual expression (the composition, the character, the joke as you drew it), it can infringe like any copy, however it was made. If it only borrowed your general style, it probably wouldn’t, because style alone isn’t protected. This one is a near-copy.',
          'Your license would have allowed commercial use with credit. A near-copy with no credit is outside your terms. How it was made doesn’t change the test: copying your expression is copying.',
          'Your terms required credit, and the same license on any adaptation. An uncredited ad does neither. AI or not, a near-copy of your expression is a copy.',
          'An ad is commercial, which is outside your noncommercial terms, and there’s no credit. If the graphic copies your expression, the AI step doesn’t change that.',
          'You waived your rights, so a brand may copy your graphic, even commercially, without credit. That includes copies made with AI. CC0 is generous by design.',
        ),
      },
      beyond: {
        setup: 'A nonprofit asks to adapt your graphic, with new text, for a public-health campaign.',
        situation: sit(
          'They need your permission to adapt it. You can say yes, set conditions, or decline.',
          'Your license already allows adaptation, with credit. They didn’t need to ask, but asking is courteous, and it gives you a say in how it’s used.',
          'Already allowed, with credit, as long as their adapted version is shared under CC BY-SA too.',
          'A nonprofit health campaign is very likely noncommercial, so adapting it with credit is already allowed. They asked anyway.',
          'Already allowed, with no conditions.',
        ),
      },
    },
    naturalist: {
      within: {
        setup: 'A high-school biology teacher shows your photo on the classroom screen during a lesson, with your name on the slide.',
        situation: sit(
          'No permission needed: U.S. copyright law specifically allows displaying a work during face-to-face teaching at a nonprofit school.',
          'Allowed under your license, with credit. Classroom display is allowed by law in any case.',
          'Allowed under your license, with credit. Classroom display is allowed by law in any case.',
          'Allowed: classroom teaching is noncommercial, and the display is lawful regardless.',
          'Allowed, as everything is under CC0.',
        ),
      },
      outside: {
        setup: 'A news site runs your photo at the top of an article about winter wildlife, with no credit.',
        situation: sit(
          'This uses your photo without permission. A story about the viral photo itself might support fair use, but using it simply as an illustration usually doesn’t.',
          'Your license allowed this, with credit. Without credit, they’re outside your terms.',
          'Allowed with credit; they gave none. Outside your terms.',
          'A commercial news site with no credit is outside your terms on both counts, unless the story is about the photo itself and fair use applies.',
          'Allowed. You waived the right to require credit.',
        ),
      },
      beyond: {
        setup: 'A nature magazine offers you its cover, in exchange for exclusive rights to the photo for a year.',
        situation: sit(
          'You hold every right, so exclusive cover rights are yours to grant. The photo stays off other covers for the term you agree to.',
          'A CC license can’t be pulled back, so anyone can already put the photo on a cover with credit. Exclusivity isn’t yours to promise. The magazine may still want a full-resolution file and your blessing.',
          'Anyone can already use the photo under CC BY-SA, so exclusivity isn’t yours to sell. A non-exclusive deal is still possible.',
          'A magazine cover is commercial, so they need your permission. But anyone can still use the photo noncommercially, so it can’t be fully exclusive.',
          'You put the photo in the public domain. Anyone can use it, so there’s nothing exclusive to offer.',
        ),
      },
    },
    artificer: {
      within: {
        setup: 'A fan posts a photo of your market table, your prints visible behind them, and tags you.',
        situation: sit(
          'Your prints appear incidentally in a photo of a market table, with a tag. That kind of incidental, credited use is very likely fair use. No permission needed.',
          'Allowed, with credit, which the tag provides.',
          'Allowed: shared as is, with credit.',
          'Allowed: a fan’s noncommercial post, with credit.',
          'Allowed, as everything is under CC0.',
        ),
      },
      outside: {
        setup: 'A fast-fashion site is selling T-shirts printed with your collage. You found out from a friend who bought one.',
        situation: sit(
          'This is printing and selling your collage without permission: a clear infringement, and a common one.',
          'Your license would have allowed commercial shirts, with credit. Uncredited shirts are outside your terms. CC BY is generous: with credit, this is part of what it permits.',
          'Credited shirts would be allowed, and an altered design would have to carry CC BY-SA. Uncredited shirts are outside your terms.',
          'Selling shirts is commercial: outside your terms, credit or not.',
          'Allowed. Under CC0, a company may sell your collage on shirts without paying or crediting you.',
        ),
      },
      beyond: {
        setup: 'An AI company emails: it would like to license your whole portfolio as training data, for a fee.',
        situation: sit(
          'They’re asking for a use you never granted. You can say yes, say no, or negotiate terms and a price. Whatever the law ends up saying about training without permission, a direct request is yours to answer.',
          'Whether training on CC BY work requires anything beyond the license, credit included, isn’t settled. They asked directly and offered a fee, so you can negotiate terms your license doesn’t spell out.',
          'Whether ShareAlike reaches AI training is unsettled. A direct request lets you set the terms yourself: yes, no, or a price.',
          'Training for a commercial product is likely outside your noncommercial terms, so they need your permission. You can say yes, say no, or negotiate.',
          'You waived your rights, so they could arguably use the portfolio without asking. They offered a fee anyway, which you can accept or decline.',
        ),
      },
    },
    bard: {
      within: {
        setup: 'A music blog reviews your track, embeds the official player from your streaming service, and quotes one line of your lyrics.',
        situation: sit(
          'No permission needed: the embed streams from the service you released on, under its terms, and quoting one line in a review is classic fair use.',
          'Allowed under your license, and the embed and short quote would be fine anyway.',
          'Allowed under your license, and the embed and short quote would be fine anyway.',
          'A blog with ads might count as commercial, but the official embed and a brief quote don’t need your license.',
          'Allowed, as everything is under CC0.',
        ),
      },
      outside: {
        setup: 'A brand uses your track in an online ad, without asking and without credit.',
        situation: sit(
          'Using your recording in an ad without permission is infringement, and the kind of use that normally comes with a license fee.',
          'Commercial use was allowed with credit, but they gave none. Outside your terms.',
          'Under CC licenses, setting music to video counts as an adaptation, so the ad itself would have to carry CC BY-SA, plus credit. Neither happened.',
          'An ad is commercial, so this is outside your terms.',
          'Allowed. Under CC0, a brand can use your track in an ad without paying or crediting you.',
        ),
      },
      beyond: {
        setup: 'An independent filmmaker asks to use your track in a feature film.',
        situation: sit(
          'Putting music in a film needs a license from you. You can name your terms and your price.',
          'Already allowed, with credit; they didn’t need to ask. Asking is a courtesy, and a chance to talk about how it’s used.',
          'Under CC licenses, setting music to film makes an adaptation, so the whole film would have to be released under CC BY-SA. Most filmmakers can’t do that, so they’d need a separate license from you.',
          'If the film will be sold or shown commercially, they need your permission. If it stays strictly noncommercial, it’s already allowed, with credit.',
          'Already allowed, with no conditions.',
        ),
      },
    },
    conjurer: {
      within: {
        setup: 'Players stream your game on Twitch, and one posts a review with screenshots.',
        situation: sit(
          'Reviews with screenshots are classic fair use. Streaming gameplay is a grayer area legally, which is why many developers post a streaming policy, and most welcome streams.',
          'Allowed, with credit, which a stream of your game naturally provides.',
          'Allowed, with credit.',
          'Monetized streams are arguably commercial, which strictly falls outside NC. Many developers who use NC add a note welcoming streams.',
          'Allowed, as everything is under CC0.',
        ),
      },
      outside: {
        setup: 'Someone uploads your game, unchanged, to another storefront under their own name, and charges for it.',
        situation: sit(
          'This is copying and selling your game without permission, which is infringement. Storefronts have takedown processes for it.',
          'Selling copies would have been allowed, with credit. Passing it off under their own name puts them outside your terms.',
          'Selling copies with credit, under the same license, would be allowed. Passing it off as their own isn’t.',
          'Selling it is commercial, so this is outside your terms.',
          'Allowed: CC0 lets anyone sell copies. Claiming they made it may break the storefront’s rules, but it doesn’t break your license.',
        ),
      },
      beyond: {
        setup: 'A small publisher offers a deal: it will port the game to consoles in exchange for exclusive publishing rights.',
        situation: sit(
          'You hold every right, so exclusive publishing is yours to grant. Read what “exclusive” covers: which platforms, which regions, how many years.',
          'Anyone can already distribute the game with credit, so true exclusivity is off the table. A publisher may still want a deal for the console port, which is new work.',
          'Anyone can already distribute the game under CC BY-SA, and a port would have to carry the same license. That’s a hard sell for most publishers.',
          'Console publishing is commercial, so they need your permission. But the noncommercial version stays available to everyone.',
          'You put the game in the public domain, so a publisher could port it without you. Some will still pay for your help.',
        ),
      },
    },
  },
  responses: {
    takedown: { label: 'Send a takedown', cartNote: 'Sent a takedown.' },
    credit: { label: 'Ask for credit', cartNote: 'Asked for credit.' },
    negotiate: { label: 'Negotiate', cartNote: 'Negotiated.' },
    'let-go': { label: 'Let it go', cartNote: 'Let it go.' },
  },
  debrief: {
    lesson:
      'When you make something, copyright gives you control automatically: all rights reserved. A Creative Commons license is a decision to give some of that control away in advance, on conditions you set: credit (BY), share-alike (SA), noncommercial (NC), or none at all (CC0). Those licenses can’t be taken back for copies already out there, which matters when someone later asks for exclusive rights. A license doesn’t enforce itself, either. Whether to send a takedown, ask for credit, negotiate, or let a use go is still your call, and each has costs. AI doesn’t change the basic test: copying your actual expression can infringe however it was made, while borrowing a general style usually doesn’t, because style alone isn’t protected. And when someone asks for a use your license doesn’t cover, AI training included, you can say yes, say no, or negotiate.',
    prompts: [
      'Which license did you choose, and would you choose it again after seeing what happened?',
      'Which reuse bothered you most? Was it one your license let you stop?',
      'What would you want someone to do before using your work? What would make that easy for them?',
    ],
  },
  personaReviewBy: {
    herald: { date: '2027-01-01', note: 'AI near-copy event: re-check court decisions on AI outputs that closely copy existing works.' },
    artificer: { date: '2027-01-01', note: 'AI training license request: re-check legal status of training on licensed and CC works, and CC guidance on AI.' },
  },
};
