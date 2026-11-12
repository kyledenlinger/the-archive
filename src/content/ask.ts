import { AskContent, Effects, Term, TermKind } from './types';

// Default response effects (revision spec §5.4).
const YES: Effects = [{ meter: 'exposure', delta: -2 }, { meter: 'vision', delta: 1 }];
const NO: Effects = [{ meter: 'vision', delta: -1 }];
const SILENCE: Effects = [{ meter: 'time', delta: -1 }];

// What each kind of term does when accepted (revision spec §5.4). Accepting also lowers Exposure by 1.
const TERM_EFFECTS: Record<TermKind, Effects> = {
  smallFee: [{ meter: 'budget', delta: -1 }],
  largeFee: [{ meter: 'budget', delta: -2 }],
  restriction: [{ meter: 'vision', delta: -1 }],
  credit: [], // no meter change, but a real obligation
};
const term = (kind: TermKind) => (text: string, cartNote: string, weight: number): Term => ({ kind, text, cartNote, effects: TERM_EFFECTS[kind], weight });
const smallFee = term('smallFee');
const largeFee = term('largeFee');
const restriction = term('restriction');
const credit = term('credit');

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
  // yes has no effects of its own: accepting its terms applies Exposure −1 and the drawn terms' effects.
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
    // Stop 3 (Strings Attached) responses. Effects as for stop 1; a conditional yes's terms are in `terms`.
    permission: {
      chronicler: {
        yes: {
          text: 'The stock agency replies within a day: a sponsored festival screening is fine, and they add a note to your license file.',
          cartNote: 'Asked the stock agency about the sponsored screening; approved in writing and noted on the license. Covered for the festival. Streaming would need a new request.',
          effects: YES,
        },
        conditional: {
          text: 'The agency writes back. They can extend your license to cover the sponsored screening, on terms.',
          cartNote: 'Asked the stock agency about the sponsored screening; offered an extended license on terms.',
          effects: [],
        },
        no: {
          text: 'The agency declines: this clip can’t be licensed beyond editorial use because it shows recognizable private property.',
          cartNote: 'Asked; the agency declined. The license doesn’t cover this use. Fair use can answer a copyright claim, but not a breach of the license you agreed to.',
          effects: NO,
        },
        silence: {
          text: 'Two weeks go by with no reply, and the festival is in three. Silence isn’t a yes, and the license still says editorial only.',
          cartNote: 'Asked; no reply. Silence isn’t a yes, and the license still says editorial use only.',
          effects: SILENCE,
        },
      },
      herald: {
        yes: {
          text: 'The artist’s team writes back: they love the video and are fine with the cross-post and the promotion. You save the email.',
          cartNote: 'Asked the song’s rights holders; approved in writing for cross-posting and paid promotion. Message saved.',
          effects: YES,
        },
        conditional: {
          text: 'The label writes back. They’ll license the song for the cross-post and the paid promotion, on terms.',
          cartNote: 'Asked the song’s rights holders; offered a license for the cross-post and the promotion on terms.',
          effects: [],
        },
        no: {
          text: 'The label declines: they don’t license this song for brand promotions.',
          cartNote: 'Asked; declined. The promoted version needs a different track. A no doesn’t end the fair use question, but a song used as an ad’s soundtrack is a weak fair use case.',
          effects: NO,
        },
        silence: {
          text: 'Your message goes to a general inbox, and nothing comes back. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      naturalist: {
        yes: {
          text: 'The tool’s support team replies that educational channels can join a creator program that allows monetized use of free-tier images, and they confirm it in writing.',
          cartNote: 'Asked the AI tool’s support; confirmed in writing that its creator program covers monetized use. The terms now allow it. The accuracy question is still yours.',
          effects: YES,
        },
        conditional: {
          text: 'The tool’s support team replies that commercial use of your illustration can be covered, on terms.',
          cartNote: 'Asked the AI tool’s support; offered commercial use on terms. The accuracy question is still yours.',
          effects: [],
        },
        no: {
          text: 'Support points you back to the terms: free-tier output is for non-commercial use, no exceptions.',
          cartNote: 'Asked; declined. The tool’s terms govern here; fair use doesn’t override a contract you accepted.',
          effects: NO,
        },
        silence: {
          text: 'An automatic reply promises an answer in five to seven business days. It never arrives. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes, and the terms still say non-commercial.',
          effects: SILENCE,
        },
      },
      artificer: {
        yes: {
          text: 'The artist writes back the same day: “Absolutely, I’d love to see it. Tag me?”',
          cartNote: 'Asked the artist; an enthusiastic yes, with a request for credit. Email saved.',
          effects: YES,
        },
        conditional: {
          text: 'The artist writes back within the week. They’re willing, on terms.',
          cartNote: 'Asked the artist; offered permission on terms.',
          effects: [],
        },
        no: {
          text: 'The artist politely declines: that photograph is part of a series they’re publishing as a book.',
          cartNote:
            'Asked; politely declined. Permission is off the table. A genuinely transformative collage might still have a fair use argument, but you’d be using the work over the artist’s stated objection.',
          effects: NO,
        },
        silence: {
          text: 'Two weeks pass with no reply. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      bard: {
        yes: {
          text: 'Support replies that your track qualifies for their student-release program, which grants commercial rights, and confirms it in writing.',
          cartNote: 'Asked the generator’s support; commercial rights confirmed in writing under a student program. You may still not hold copyright in the purely AI-generated part.',
          effects: YES,
        },
        conditional: {
          text: 'The generator’s support team replies that commercial rights for your track are possible, on terms.',
          cartNote: 'Asked the generator’s support; offered commercial rights on terms. Copyright in purely AI-generated material is still doubtful.',
          effects: [],
        },
        no: {
          text: 'Support points you to the terms: free-plan output is for non-commercial use only.',
          cartNote: 'Asked; declined. The contract governs here; fair use doesn’t override terms you agreed to.',
          effects: NO,
        },
        silence: {
          text: 'Your support ticket sits at “open” for weeks. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes.',
          effects: SILENCE,
        },
      },
      conjurer: {
        yes: {
          text: 'The asset creator and the font foundry both say yes in writing, as long as their license files ship with the repository.',
          cartNote: 'Asked both; written yes, on condition that their license files stay in the repository. Both emails saved.',
          effects: YES,
        },
        conditional: {
          text: 'The asset creator and the font foundry both write back. Each will say yes, on terms.',
          cartNote: 'Asked the asset creator and the font foundry; offered permission on terms.',
          effects: [],
        },
        no: {
          text: 'The asset creator declines: free copies in a public repository would undercut their sales.',
          cartNote:
            'Asked; the asset creator declined redistribution. Keep the assets out of the public repository. Fair use is weak where your use stands in for buying the pack.',
          effects: NO,
        },
        silence: {
          text: 'The asset store shows your message as delivered, and that’s all. Silence isn’t a yes.',
          cartNote: 'Asked; no reply. Silence isn’t a yes, and the license still forbids redistribution.',
          effects: SILENCE,
        },
      },
    },
  },
  // Who the counterpart is decides how likely an answer is. Anything not listed uses DEFAULT_ODDS
  // (well formed 35/35/15/15, poorly formed 15/25/25/35, as yes/conditional/no/silence). A well-formed
  // request always does better than a poor one, and nothing here is a sure thing.
  odds: {
    free: {
      // A university library's special collections desk answers its requests, and archives usually attach
      // conditions (a use fee, a set credit), so a plain yes is rarer than a conditional one and silence is rare.
      chronicler: { wellFormed: { yes: 25, conditional: 45, no: 15, silence: 15 }, poor: { yes: 10, conditional: 35, no: 25, silence: 30 } },
      // The blog's last post was in the spring: the blogger may not be checking the contact form, so more silence.
      naturalist: { wellFormed: { yes: 30, conditional: 25, no: 10, silence: 35 }, poor: { yes: 10, conditional: 15, no: 15, silence: 60 } },
      // A label's sample-clearance team clears samples for money: a free, plain yes is unusual, conditions are
      // the norm, and the queue is long (the silence response is an eight-week wait).
      bard: { wellFormed: { yes: 10, conditional: 45, no: 20, silence: 25 }, poor: { yes: 5, conditional: 30, no: 25, silence: 40 } },
      // The forum account hasn't posted in four years, so silence is the likeliest answer.
      conjurer: { wellFormed: { yes: 25, conditional: 15, no: 10, silence: 50 }, poor: { yes: 10, conditional: 10, no: 15, silence: 65 } },
    },
    permission: {
      // A stock agency's business is licensing: it answers, and it answers with an upgrade to sell you.
      chronicler: { wellFormed: { yes: 20, conditional: 55, no: 15, silence: 10 }, poor: { yes: 10, conditional: 45, no: 20, silence: 25 } },
      // A record label asked to license a hit song for brand promotion: rarely free, often no, often no reply.
      herald: { wellFormed: { yes: 10, conditional: 40, no: 25, silence: 25 }, poor: { yes: 5, conditional: 25, no: 30, silence: 40 } },
      // An AI tool's support team answers, usually by pointing to a paid plan; an exception is rare.
      naturalist: { wellFormed: { yes: 20, conditional: 45, no: 25, silence: 10 }, poor: { yes: 10, conditional: 35, no: 30, silence: 25 } },
      // A living artist who posted last week and lists a contact email is more likely than most to write back.
      artificer: { wellFormed: { yes: 40, conditional: 35, no: 15, silence: 10 }, poor: { yes: 20, conditional: 30, no: 20, silence: 30 } },
      // An AI music generator's support team, like the image tool's: an answer, usually a paid plan.
      bard: { wellFormed: { yes: 20, conditional: 45, no: 25, silence: 10 }, poor: { yes: 10, conditional: 35, no: 30, silence: 25 } },
      // A seller of an asset pack and a font foundry both sell licenses, so a request usually comes back with a price.
      conjurer: { wellFormed: { yes: 20, conditional: 45, no: 20, silence: 15 }, poor: { yes: 10, conditional: 30, no: 25, silence: 35 } },
    },
  },
  // A conditional yes draws one of these (revision spec §5.4). They're per stop because the counterpart differs:
  // at stop 1, the owner a search turned up; at stop 3, the rights holder or the company whose terms apply.
  // Weights: individual creators rarely ask a large fee; labels, stock agencies, and companies often do.
  terms: {
    free: {
      chronicler: [
        smallFee('Their terms: a $100 use fee for up to one minute of footage.', 'Accepted: a $100 use fee for up to one minute, paid from the budget.', 3),
        largeFee(
          'Their terms: a $600 commercial use fee, because a festival film may go on to stream or sell. It’s their standard rate.',
          'Accepted: a $600 commercial use fee, the library’s standard rate, paid from the budget.',
          2,
        ),
        restriction(
          'Their terms: no more than fifteen seconds, run as the station aired it, with no cuts and no narration over it.',
          'Accepted: no more than fifteen seconds, run unedited as the station aired it. The scene is shorter and plainer than planned.',
          2,
        ),
        credit(
          'Their terms: an end-titles credit worded exactly as they give it, “Footage courtesy of the University Library, Special Collections,” and a copy of the finished film for their collection.',
          'Accepted: an end-titles credit in the library’s exact wording, and a copy of the finished film for their collection. Both are obligations to meet before the film goes out.',
          3,
        ),
      ],
      herald: [
        smallFee('Their terms: a $50 fee for one post on your organization’s accounts.', 'Accepted: a $50 fee for one post on the organization’s accounts, paid from the budget. Reposting elsewhere would need another ask.', 3),
        largeFee(
          'Their terms: $400, their rate for any organization’s use since the photo went viral. They’ve had a lot of requests this week.',
          'Accepted: a $400 fee, the photographer’s rate for organizations, paid from the budget.',
          1,
        ),
        restriction(
          'Their terms: the photo runs as it is, with no crop and no caption laid over it. Your joke goes in the post text instead.',
          'Accepted: the photo runs uncropped, with nothing laid over it. The joke moved to the post text, where it lands less well.',
          3,
        ),
        credit(
          'Their terms: credit by name in the first line of the post, with a link to their portfolio, not just a tag.',
          'Accepted: credit by name in the first line of the post, with a link to the portfolio. Any repost has to carry it too.',
          3,
        ),
      ],
      naturalist: [
        smallFee('Their terms: a $40 fee for use in one post.', 'Accepted: a $40 fee for use in one post, paid from the budget.', 3),
        largeFee(
          'Their terms: because your blog runs ads, they charge their commercial rate, $250, the same as a magazine would pay.',
          'Accepted: a $250 commercial-rate fee, since the blog earns ad revenue, paid from the budget.',
          1,
        ),
        restriction(
          'Their terms: a small, watermarked copy only, uncropped. The full-size photo stays with them for their own book.',
          'Accepted: a small, watermarked copy, uncropped. The owl is less striking at the top of the post than planned.',
          3,
        ),
        credit(
          'Their terms: a credit and a link back to their blog, directly under the photo, in their wording.',
          'Accepted: a credit and a link back to the blog directly under the photo, in the photographer’s wording.',
          3,
        ),
      ],
      artificer: [
        smallFee('Their terms: $60, about the price of one of her prints.', 'Accepted: a $60 fee for using the moth in the collage, paid from the budget.', 3),
        largeFee(
          'Their terms: since you sell your prints, $300 up front, her usual fee for commercial use.',
          'Accepted: a $300 commercial-use fee up front, paid from the budget.',
          1,
        ),
        restriction(
          'Their terms: the moth stays whole. You can place it in the collage, but not cut it apart or recolor it.',
          'Accepted: the moth appears whole, not cut apart or recolored. The collage was rebuilt around it.',
          3,
        ),
        credit(
          'Their terms: her name and her portfolio address printed on the back of every print.',
          'Accepted: the illustrator’s name and portfolio address on the back of every print.',
          3,
        ),
      ],
      bard: [
        smallFee('Their terms: a flat $250 clearance fee, since the break is short and the release is small.', 'Accepted: a flat $250 clearance fee, paid from the budget. Clearance letter saved.', 2),
        largeFee(
          'Their terms: $1,500 up front, plus a share of the track’s earnings. Clearing samples is part of how the label earns from its catalog.',
          'Accepted: $1,500 up front, paid from the budget, plus a share of the track’s earnings. Clearance letter saved.',
          4,
        ),
        restriction(
          'Their terms: you can’t loop the break under the whole song. You can use it for eight bars at most, in the intro and one bridge.',
          'Accepted: the break appears for eight bars at most, in the intro and one bridge. The rest of the beat had to be rebuilt without it.',
          2,
        ),
        credit(
          'Their terms: the original single, its artist, and the label credited in your release notes on every streaming service, in their exact wording.',
          'Accepted: a sample credit for the original single, its artist, and the label, in their exact wording, on every streaming service.',
          1,
        ),
      ],
      conjurer: [
        smallFee('Their terms: $30, “because it’s for sale now.”', 'Accepted: a $30 fee for use in a game that’s for sale, paid from the budget. Message saved.', 3),
        largeFee(
          'Their terms: $200 up front. They’ve seen their potions in other games for sale and never got anything.',
          'Accepted: a $200 fee up front for use in a game that’s for sale, paid from the budget. Message saved.',
          1,
        ),
        restriction(
          'Their terms: use the sprites as they are, with no recoloring and no new frames, so they still look like their work.',
          'Accepted: the sprites stay as drawn, with no recoloring or new frames. The game’s other art had to bend to match them.',
          3,
        ),
        credit(
          'Their terms: credit as “pixelpotion” on your store page and in the game’s credits, with a link to their forum profile.',
          'Accepted: credit as “pixelpotion” on the store page and in the credits screen, with a link to the forum profile. Message saved.',
          3,
        ),
      ],
    },
    permission: {
      chronicler: [
        smallFee(
          'Their terms: a $150 upgrade that adds sponsored screenings to your license. Streaming would need its own request.',
          'Accepted: a $150 license upgrade for sponsored screenings, paid from the budget. Streaming would need another.',
          2,
        ),
        largeFee(
          'Their terms: an upgrade to a full commercial license for $900, covering the sponsored screening and streaming. It’s the only upgrade they offer.',
          'Accepted: a $900 upgrade to a commercial license, covering the sponsored screening and streaming, paid from the budget. New license saved.',
          4,
        ),
        restriction(
          'Their terms: the sponsored screening is fine, but the clip can’t appear in your trailer or in anything that carries the sponsor’s logo.',
          'Accepted: approved for the sponsored screening, but not for the trailer or anything with the sponsor’s logo. The trailer was recut without the flood’s best shot.',
          2,
        ),
        credit(
          'Their terms: an on-screen credit for the agency and the filmmaker who shot the clip, shown while the clip plays, not only in the end titles.',
          'Accepted: an on-screen credit for the agency and the clip’s filmmaker while the clip plays, as the extended license now requires.',
          1,
        ),
      ],
      herald: [
        smallFee(
          'Their terms: a $200 fee for the cross-post and the paid promotion, for one campaign.',
          'Accepted: a $200 fee covering the cross-post and the paid promotion, one campaign only, paid from the budget.',
          2,
        ),
        largeFee(
          'Their terms: $1,200, their standard rate for brand promotion, for a 90-day window.',
          'Accepted: a $1,200 fee for paid promotion, with a 90-day window, paid from the budget. After 90 days, the promoted version comes down.',
          4,
        ),
        restriction(
          'Their terms: the cross-post and the promotion can use fifteen seconds of the song, unedited, and no more.',
          'Accepted: the cross-post and the promotion use fifteen seconds of the song, unedited. The video was recut to fit.',
          2,
        ),
        credit(
          'Their terms: the song title and the artist credited in every post’s caption, with a link to the track on a streaming service.',
          'Accepted: the song and the artist credited in every post’s caption, with a link to the track.',
          1,
        ),
      ],
      naturalist: [
        smallFee(
          'Their terms: a month on a paid plan, $12. Regenerate the illustration while you’re on it, and commercial use of the new image is covered.',
          'Accepted: paid $12 for a month on a paid plan and regenerated the illustration, which that plan covers for commercial use. Receipt saved. The accuracy question is still yours.',
          3,
        ),
        largeFee(
          'Their terms: commercial rights for channels that earn money come only with the business plan, billed for a year up front.',
          'Accepted: a year of the business plan, paid up front from the budget, and regenerated the illustration under it. Receipt saved. The accuracy question is still yours.',
          2,
        ),
        restriction(
          'Their terms: their creator program covers monetized use, as long as the tool’s watermark stays visible on the image.',
          'Accepted: the creator program covers monetized use, with the tool’s watermark visible on the illustration. The accuracy question is still yours.',
          2,
        ),
        credit(
          'Their terms: their creator program covers monetized use, as long as the video says on screen, while the image shows, that it was made with their tool.',
          'Accepted: the creator program covers monetized use, on condition that the video says on screen that the illustration was made with the tool. The accuracy question is still yours.',
          1,
        ),
      ],
      artificer: [
        smallFee('Their terms: $40 for each print run.', 'Accepted: a $40 fee for each print run, paid from the budget each time.', 3),
        largeFee(
          'Their terms: a flat $350 for use in a print series, paid before the first run.',
          'Accepted: a flat $350 for use in the print series, paid from the budget before the first run.',
          1,
        ),
        restriction(
          'Their terms: the greenhouse can be part of the collage, but not its center, and not so whole that it reads as their photograph on its own.',
          'Accepted: the photograph appears in the collage, but not at its center or as a recognizable whole. The composition changed around it.',
          3,
        ),
        credit(
          'Their terms: their name and the photograph’s title on the back of each print, and a tag whenever you post the collage online.',
          'Accepted: the artist’s name and the photograph’s title on the back of each print, and a tag on every online post.',
          3,
        ),
      ],
      bard: [
        smallFee(
          'Their terms: a month on the paid plan, $12. Regenerate the backing track while you’re on it, and the new version comes with commercial rights.',
          'Accepted: paid $12 for a month on the paid plan and regenerated the backing track, which comes with commercial rights. Receipt saved.',
          3,
        ),
        largeFee(
          'Their terms: commercial rights for releases on streaming services come only with the pro plan, billed for a year up front.',
          'Accepted: a year of the pro plan, paid up front from the budget, and regenerated the track under it. Receipt saved.',
          2,
        ),
        restriction(
          'Their terms: under their student program, the track can go on the streaming services they partner with, and not in ads, films, or anything else.',
          'Accepted: the student program allows release only on its partner streaming services, not in ads or films. The release is narrower than planned.',
          2,
        ),
        credit(
          'Their terms: under their student program, the release notes on every service have to say that the backing track was made with their generator.',
          'Accepted: the release notes on every service say the backing track was made with the generator, as the student program requires.',
          1,
        ),
      ],
      conjurer: [
        smallFee(
          'Their terms: the asset creator says yes, with credit, and the foundry sells you an app license for the font, $60, which allows shipping the font file.',
          'Accepted: the assets with credit, and a $60 app license for the font, paid from the budget. Both license files go in the repository.',
          2,
        ),
        largeFee(
          'Their terms: the asset creator wants $400 for a license that allows sharing the pack in a public repository, and the foundry sells you an app license for the font.',
          'Accepted: a $400 redistribution license for the asset pack and an app license for the font, paid from the budget. Both license files go in the repository.',
          3,
        ),
        restriction(
          'Their terms: both say yes to the game, but the tile art and the font file can’t sit in a public repository. The open-source release has to ship without them, with instructions for getting them separately.',
          'Accepted: the game’s code is open-source, but the tile art and the font file stay out of the public repository, and players get them separately.',
          3,
        ),
        credit(
          'Their terms: both say yes, as long as each one’s license file and a credit line in their wording ship in the repository and in the game’s credits.',
          'Accepted: written yes from both, on condition that each license file and a credit line in their wording ship in the repository and the credits. Both emails saved.',
          2,
        ),
      ],
    },
  },
  acceptLabel: 'Accept the terms',
  declineLabel: 'Turn them down',
  declineNote: 'Turned down the terms.',
  // Added to the response's cart note and effects, whatever the response was (revision spec §5.4).
  followUps: {
    // After a yes: you have permission, so using it adds nothing.
    use: { label: 'Use it', note: 'Then: used it, as agreed.', effects: [] },
    // After a no, silence, or terms turned down: you keep what you wanted, without permission (a legal risk).
    useAnyway: {
      label: 'Use it anyway',
      note: 'Then: used it anyway, without permission, which is a legal risk if they object.',
      effects: [
        { meter: 'exposure', delta: 2, tag: 'legal' },
        { meter: 'vision', delta: 1 },
      ],
    },
    dont: {
      label: 'Don’t use it',
      note: 'Then: chose not to use it, and the project went ahead without it.',
      effects: [
        { meter: 'vision', delta: -1 },
        { meter: 'exposure', delta: -1 },
      ],
    },
    // Opens the stop's fair use analysis; relying on it then adds the assessment's own effects (see Stop.tsx).
    fairUse: { label: 'Run a fair use analysis', note: 'Then: ran a fair use analysis.', effects: [] },
  },
};

/** The follow-ups, outside `ask` for convenience. */
export const askFollowUps = ask.followUps;
