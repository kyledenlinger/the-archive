import { AskContent, Effects } from './types';

// Default response effects (revision spec §5.4).
const YES: Effects = [{ meter: 'exposure', delta: -2 }, { meter: 'vision', delta: 1 }];
const NO: Effects = [{ meter: 'vision', delta: -1 }];
const SILENCE: Effects = [{ meter: 'time', delta: -1 }];

export const ask: AskContent = {
  intro: 'You start drafting a message. The clearer it is about what you want, the easier it is for someone to say yes. You can leave any part blank.',
  fieldOptions: {
    what: { label: 'What you want to use', options: ['The whole thing', 'A short excerpt or clip', 'One image or one track', 'Part of it, adapted'] },
    how: { label: 'How you’ll use it', options: ['Unchanged, with credit', 'Edited or remixed', 'In the background', 'As the centerpiece'] },
    where: { label: 'Where it will appear', options: ['One event or screening', 'My own channel or account', 'Something I’ll sell', 'Anywhere online'] },
    howLong: { label: 'For how long', options: ['Just this once', 'One year', 'For as long as the work exists'] },
  },
  afterPrompt: 'What do you do with this answer?',
  // Stop 1 (Unmarked) responses, after a search finds the owner. Effects per revision spec §5.4. A conditional
  // yes has no effects of its own: Task 10 applies Exposure −1 and the drawn terms' effects only if accepted.
  responses: {
    free: {
      chronicler: {
        yes: {
          text: 'The library writes back. The station signed the rights over to them along with the tapes, and they’re glad to see the footage used. They send a better copy and a short permission letter.',
          cartNote: 'Traced the station’s tapes to a university library that holds the rights. Asked; permission granted in writing, with a better copy. Letter saved.',
          effects: YES,
        },
        conditional: {
          text: 'The library writes back. The station signed the rights over to them, and they’re willing to say yes, on terms.',
          cartNote: 'Traced the station’s tapes to a university library that holds the rights. Asked; offered permission on terms.',
          effects: [],
        },
        no: {
          text: 'The library, which holds the station’s rights, writes back. They don’t license the news footage for films made outside the university, and they’re sorry.',
          cartNote:
            'Traced the station’s tapes to a university library that holds the rights. Asked; declined. A no doesn’t end the fair use question, but you’d be using the clip over the owner’s stated objection.',
          effects: NO,
        },
        silence: {
          text: 'You send your request to the library’s special collections desk. Two weeks pass without a reply, and your deadline doesn’t move.',
          cartNote: 'Traced the station’s tapes to a university library. Asked; no reply. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      herald: {
        yes: {
          text: 'The photographer answers within the hour: of course you can, and thanks for asking. They’d like a credit in the caption.',
          cartNote: 'Traced the raccoon photo to its photographer by reverse image search. Asked; yes in writing, with credit in the caption. Message saved.',
          effects: YES,
        },
        conditional: {
          text: 'The photographer writes back that you can use the photo, on terms.',
          cartNote: 'Traced the photo to its photographer. Asked; offered permission on terms.',
          effects: [],
        },
        no: {
          text: 'The photographer writes back politely: so many brands have used the photo without asking that they’ve stopped allowing promotional use.',
          cartNote:
            'Traced the photo to its photographer. Asked; declined for promotional use. The post needs a different image, or you’d be using this one over the owner’s stated objection.',
          effects: NO,
        },
        silence: {
          text: 'You send a message through the photographer’s portfolio. A week goes by. The raccoon keeps going viral without you.',
          cartNote: 'Traced the photo to its photographer. Asked; no reply. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      naturalist: {
        yes: {
          text: 'The blogger replies the next morning, delighted. They spent three winters trying to get that shot. Use it, they say, and link back to the blog.',
          cartNote: 'Contacted the birding blogger through the site. Asked; yes in writing, with a credit and a link back. Message saved.',
          effects: YES,
        },
        conditional: {
          text: 'The blogger replies that they’re happy for the photo to be used, on terms.',
          cartNote: 'Contacted the birding blogger through the site. Asked; offered permission on terms.',
          effects: [],
        },
        no: {
          text: 'The blogger replies kindly but firmly: they’re putting together a book of their owl photos and don’t want them used anywhere else first.',
          cartNote:
            'Contacted the birding blogger. Asked; declined because of a planned book. A monetized post using the whole photo would compete with that book, which weakens any fair use argument further.',
          effects: NO,
        },
        silence: {
          text: 'You send a note through the blog’s contact form. A few days pass, then a week. The last post on the blog was in the spring.',
          cartNote: 'Contacted the birding blogger through the site’s form. Asked; no reply. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      artificer: {
        yes: {
          text: 'The illustrator writes back: yes, cut it up, and she’d love to see what you make.',
          cartNote: 'Traced the moth to its illustrator through an old portfolio site. Asked; yes in writing, including cutting it up for prints. Message saved.',
          effects: YES,
        },
        conditional: {
          text: 'The illustrator writes back that you can use the moth, on terms.',
          cartNote: 'Traced the moth to its illustrator. Asked; offered permission on terms.',
          effects: [],
        },
        no: {
          text: 'The illustrator writes back: the moth is part of a set she still sells as prints, and she’d rather it didn’t turn up in someone else’s.',
          cartNote:
            'Traced the moth to its illustrator. Asked; declined, because the drawing is part of a print set she sells. A transformative collage might still have a fair use argument, but you’d be using it over her stated objection, in a market she’s active in.',
          effects: NO,
        },
        silence: {
          text: 'You write to the address on the illustrator’s portfolio site. Nothing bounces back, and nothing else comes either.',
          cartNote: 'Traced the moth to an illustrator’s old portfolio site. Asked; no reply. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      bard: {
        yes: {
          text: 'The label owns both the recording and the song, and its clearance team approves your sample in writing, as long as the original is credited.',
          cartNote: 'Traced the break to a 1984 single; its label owns the recording and the song. Asked; sample approved in writing, with credit to the original. Clearance letter saved.',
          effects: YES,
        },
        conditional: {
          text: 'The label’s clearance team writes back. They’ll approve your sample, on terms.',
          cartNote: 'Traced the break to a 1984 single and its label. Asked; offered clearance on terms.',
          effects: [],
        },
        no: {
          text: 'The label writes back that they don’t clear that record for samples.',
          cartNote:
            'Traced the break to a 1984 single and its label. Asked; declined. The sample can’t be cleared, and a recognizable sample on a commercial release is a weak fair use case.',
          effects: NO,
        },
        silence: {
          text: 'You fill in the label’s sample-clearance form. It says to allow eight weeks. Your release date is in four.',
          cartNote: 'Traced the break to a 1984 single and its label. Submitted a clearance request; no answer before the deadline. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      conjurer: {
        yes: {
          text: 'Three days after you message them: “oh wow yeah go for it, just credit me as pixelpotion.” You save the message.',
          cartNote:
            'Reached the sprite creator through the forum. Asked; yes in writing, with credit as “pixelpotion.” Message saved. The scope (selling the game? modifying the sprites?) is informal, which is why the saved message matters.',
          effects: YES,
        },
        conditional: {
          text: 'The poster writes back that they’re open to it, on terms.',
          cartNote: 'Reached the sprite creator through the forum. Asked; offered permission on terms.',
          effects: [],
        },
        no: {
          text: 'The poster replies that the sprites were free for hobby projects, and they’d rather not see them in a game that’s for sale.',
          cartNote:
            'Reached the sprite creator through the forum. Asked; declined for a commercial game. The old “free to use” post didn’t cover what you’re doing, and now that’s in writing.',
          effects: NO,
        },
        silence: {
          text: 'You message the poster through the forum. It shows as delivered, and the account stays as quiet as it has been for four years.',
          cartNote: 'Reached the sprite creator’s account on the forum. Asked; no reply. Silence isn’t a yes, and “free to use lol” is still all you have.',
          effects: SILENCE,
        },
      },
    },
    // Stop 3 (Strings Attached) responses. Task 10 adds effects, odds, and terms.
    permission: {
      chronicler: {
        yes: {
          text: 'The stock agency replies within a day: a sponsored festival screening is fine, and they add a note to your license file.',
          cartNote: 'Asked the stock agency about the sponsored screening; approved in writing and noted on the license. Covered for the festival. Streaming would need a new request.',
        },
        conditional: {
          text: 'The agency will cover the sponsored screening and streaming, with an upgrade to a commercial license, for a fee.',
          cartNote: 'Asked; offered a commercial-license upgrade for a fee. The terms are clear now; the decision is about budget.',
        },
        no: {
          text: 'The agency declines: this clip can’t be licensed beyond editorial use because it shows recognizable private property.',
          cartNote: 'Asked; the agency declined. The license doesn’t cover this use. Fair use can answer a copyright claim, but not a breach of the license you agreed to.',
        },
        silence: {
          text: 'Two weeks go by with no reply, and the festival is in three. Silence isn’t a yes, and the license still says editorial only.',
          cartNote: 'Asked; no reply. Silence isn’t a yes, and the license still says editorial use only.',
        },
      },
      herald: {
        yes: {
          text: 'The artist’s team writes back: they love the video and are fine with the cross-post and the promotion. You save the email.',
          cartNote: 'Asked the song’s rights holders; approved in writing for cross-posting and paid promotion. Message saved.',
        },
        conditional: {
          text: 'The label will license the song for the paid promotion, for a fee and a 90-day window.',
          cartNote: 'Asked; yes with conditions: a fee and a 90-day window for paid promotion. Clear terms, with a clock on them.',
        },
        no: {
          text: 'The label declines: they don’t license this song for brand promotions.',
          cartNote: 'Asked; declined. The promoted version needs a different track. A no doesn’t end the fair use question, but a song used as an ad’s soundtrack is a weak fair use case.',
        },
        silence: {
          text: 'Your message goes to a general inbox, and nothing comes back. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes.',
        },
      },
      naturalist: {
        yes: {
          text: 'The tool’s support team replies that educational channels can join a creator program that allows monetized use of free-tier images, and they confirm it in writing.',
          cartNote: 'Asked the AI tool’s support; confirmed in writing that its creator program covers monetized use. The terms now allow it. The accuracy question is still yours.',
        },
        conditional: {
          text: 'Support replies: upgrade to a paid plan, regenerate the image, and commercial use is covered.',
          cartNote: 'Asked; commercial rights are available on a paid plan. Pay, regenerate, keep the receipt, and check the image for accuracy.',
        },
        no: {
          text: 'Support points you back to the terms: free-tier output is for non-commercial use, no exceptions.',
          cartNote: 'Asked; declined. The tool’s terms govern here; fair use doesn’t override a contract you accepted.',
        },
        silence: {
          text: 'An automatic reply promises an answer in five to seven business days. It never arrives. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes, and the terms still say non-commercial.',
        },
      },
      artificer: {
        yes: {
          text: 'The artist writes back the same day: “Absolutely, I’d love to see it. Tag me?”',
          cartNote: 'Asked the artist; an enthusiastic yes, with a request for credit. Email saved.',
        },
        conditional: {
          text: 'The artist agrees, for a small fee per print run and a credit on the back of each print.',
          cartNote: 'Asked; yes for a fee per print run plus credit. Clear terms.',
        },
        no: {
          text: 'The artist politely declines: that photograph is part of a series they’re publishing as a book.',
          cartNote:
            'Asked; politely declined. Permission is off the table. A genuinely transformative collage might still have a fair use argument, but you’d be using the work over the artist’s stated objection.',
        },
        silence: {
          text: 'Two weeks pass with no reply. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes.',
        },
      },
      bard: {
        yes: {
          text: 'Support replies that your track qualifies for their student-release program, which grants commercial rights, and confirms it in writing.',
          cartNote: 'Asked the generator’s support; commercial rights confirmed in writing under a student program. You may still not hold copyright in the purely AI-generated part.',
        },
        conditional: {
          text: 'Support says commercial rights apply only to tracks generated on a paid plan. Upgrade, regenerate, and you’re covered.',
          cartNote: 'Asked; commercial rights only on a paid plan. Upgrade and regenerate. Copyright in purely AI-generated material is still doubtful.',
        },
        no: {
          text: 'Support points you to the terms: free-plan output is for non-commercial use only.',
          cartNote: 'Asked; declined. The contract governs here; fair use doesn’t override terms you agreed to.',
        },
        silence: {
          text: 'Your support ticket sits at “open” for weeks. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes.',
        },
      },
      conjurer: {
        yes: {
          text: 'The asset creator and the font foundry both say yes in writing, as long as their license files ship with the repository.',
          cartNote: 'Asked both; written yes, on condition that their license files stay in the repository. Both emails saved.',
        },
        conditional: {
          text: 'The asset creator says yes, with credit. The foundry says you’ll need to buy an app license that allows embedding the font.',
          cartNote: 'Asked; assets approved with credit. The font needs an app (embedding) license purchase.',
        },
        no: {
          text: 'The asset creator declines: free copies in a public repository would undercut their sales.',
          cartNote:
            'Asked; the asset creator declined redistribution. Keep the assets out of the public repository. Fair use is weak where your use stands in for buying the pack.',
        },
        silence: {
          text: 'The asset store shows your message as delivered, and that’s all. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes, and the license still forbids redistribution.',
        },
      },
    },
  },
  // PLACEHOLDER until Task 10: at least one term per persona (the validator flags these as empty).
  terms: { chronicler: [], herald: [], naturalist: [], artificer: [], bard: [], conjurer: [] },
  acceptLabel: 'Accept the terms',
  declineLabel: 'Turn them down',
};

/** Added to the response's cart note after the player decides what to do with the answer. */
export const askFollowUps = {
  use: 'Then: used it.',
  dont: 'Then: chose not to use it.',
  fairUse: 'Then: ran a fair use analysis.',
};
