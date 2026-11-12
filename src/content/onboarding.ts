import { OnboardingContent } from './types';

// Each beat of the opening scene is shown one at a time. A beat is a list of pieces:
// narration in the narrator's voice, or the Clerk speaking (rendered in ClerkSpeech).
export const onboarding: OnboardingContent = {
  lines: [
    [
      {
        kind: 'narration',
        text: 'You’re in the middle of a project, and you need material for it: a clip, an image, a sound. Someone told you to try the Archive, where a copy of almost everything ends up sooner or later, including most of what’s ever been posted online. Now you’re standing just inside the doors with an empty cart, looking up at shelves that rise higher than you can see. None of them have labels.',
      },
    ],
    [
      {
        kind: 'narration',
        text: 'Before you can pick an aisle, a small man in a suit that has seen better days hurries around the corner and nearly walks into your cart. He looks at the cart, which is empty, and then at you.',
      },
      { kind: 'clerk', text: 'Ah. New arrivals.' },
    ],
    [
      { kind: 'narration', text: 'He checks a clipboard, nods as if it told him something, and tucks it under his arm.' },
      {
        kind: 'clerk',
        text: 'Don’t worry, everyone gets lost in here at first. There’s no catalog, so it isn’t you. That’s why I’m here. I know where nearly everything is.',
      },
    ],
    [
      {
        kind: 'clerk',
        text: 'Whether you’re allowed to use what you find is a different question, and honestly not one I can always answer for certain.',
      },
      { kind: 'narration', text: 'He holds out a hand. His fingers are stained with ink.' },
      { kind: 'clerk', text: 'Everyone calls me the Clerk. I’ll show you around.' },
    ],
    [
      { kind: 'narration', text: 'You ask whether he’s a lawyer.' },
      {
        kind: 'clerk',
        text: 'Oh, goodness, no. I just know the shelves. If I’m not sure about something, I’ll tell you, and honestly, that happens more than I’d like.',
      },
    ],
    [
      { kind: 'narration', text: 'He sets off down an aisle, and you follow with your cart.' },
      {
        kind: 'clerk',
        text: 'Here’s the main thing. Everything in here exists, and you can see it or hear it or play it. That isn’t the same as permission to use it. Some of it is under copyright, and its creator decides who uses it and how. Some of it has entered the public domain. Some of it comes with a license that spells out what you may do. And some of it is just… unclear. That’s where it gets interesting.',
      },
      { kind: 'narration', text: 'He nods at your cart.' },
      {
        kind: 'clerk',
        text: 'You’ll want three things in there. Three you can stand behind. That’s not advice, obviously. It’s just how it tends to go.',
      },
    ],
  ],
};
