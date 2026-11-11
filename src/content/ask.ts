import { AskContent } from './types';

export const ask: AskContent = {
  intro: 'You start drafting a message. The clearer it is about what you want, the easier it is to say yes to. Leave anything blank you like.',
  fieldOptions: {
    what: { label: 'What you want to use', options: ['The whole thing', 'A short excerpt or clip', 'One image or one track', 'Part of it, adapted'] },
    how: { label: 'How you’ll use it', options: ['Unchanged, with credit', 'Edited or remixed', 'In the background', 'As the centerpiece'] },
    where: { label: 'Where it will appear', options: ['One event or screening', 'My own channel or account', 'Something I’ll sell', 'Anywhere online'] },
    howLong: { label: 'For how long', options: ['Just this once', 'One year', 'For as long as the work exists'] },
  },
  afterPrompt: 'What do you do with this answer?',
  responses: {
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
        text: 'Two weeks, no reply. The festival is in three. Silence isn’t a yes, and the license still says editorial only.',
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
        text: 'Your message goes to a general inbox. Nothing comes back. Silence isn’t a yes.',
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
        text: 'A week passes. Then two. Silence isn’t a yes.',
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
        text: 'The asset store shows your message as delivered. That’s all. Silence isn’t a yes.',
        cartNote: 'Asked; no reply. Silence isn’t a yes, and the license still forbids redistribution.',
      },
    },
  },
};

/** Added to the response's cart note after the player decides what to do with the answer. */
export const askFollowUps = {
  use: 'Then: used it.',
  dont: 'Then: chose not to use it.',
  fairUse: 'Then: ran a fair use analysis.',
};
