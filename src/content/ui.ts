// Player-facing framing text that sits outside GameContent's schema (mode select, persona select).
export const ui = {
  title: 'The Archive',
  tagline: 'A text RPG about copyright, fair use, the public domain, and the rights you hold in your own work.',
  modeQuestion: 'Are you playing this in a class, or on your own?',
  classLabel: 'In a class',
  classHint: 'You’ll pause after each stop until your facilitator brings everyone back together.',
  independentLabel: 'On my own',
  independentHint: 'After each stop you’ll get a short debrief and a few questions to think over.',
  onboardingHeading: 'Into the Archive',
  onboardingFinish: 'Choose who you are',
  personaHeading: 'Who are you?',
  personaIntro: 'Pick the creator you’ll play. It decides what you’re looking for, and what’s at stake when you find it.',
};

// End-of-game framing text (cart review).
export const endUi = {
  revealHeading: 'The answer',
  endingQuestion: 'What do you do for him?',
  guessHeading: 'What is the Clerk?',
  cartHeading: 'Your cart',
  guessLine: (guess: string) => `Your guess: ${guess}. The Clerk was a scrapbook.`,
  facilitatorLine: 'Facilitator: use these cart notes as case documents for the full-room debrief.',
  independentSummary:
    'You filled your cart with four decisions, each with a reason behind it. None of them is the answer; each is a position you could explain and defend, which is most of what working with copyright comes down to.',
  resourcesHeading: 'Where to find work you can use',
};

/** Labels for the flip's cart note, one per reuse event. */
export const flipNoteLabels = {
  within: 'When someone used it within your terms:',
  outside: 'When someone went outside them:',
  beyond: 'When someone asked for more:',
};
