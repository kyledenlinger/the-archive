import { ExposureTag, MeterBand, MeterId } from './types';

// Player-facing framing text that sits outside GameContent's schema (mode select, persona select, site chrome).
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
  briefHeading: 'Your brief',
  /** Section labels on the brief card (revision spec §3). */
  brief: {
    making: 'What you’re making',
    answersTo: 'Who you answer to',
    deadline: 'Your deadline',
    items: 'What you need',
    start: 'Where you’re starting',
  },
  shelfHeading: 'The shelf',

  /** The Clerk's label on every line he speaks. */
  clerkLabel: 'The Clerk',

  /** Meter names and state words (revision spec §4.1). Never show the numbers. */
  meterLabels: { time: 'Time', budget: 'Budget', exposure: 'Exposure', vision: 'Vision' } as Record<MeterId, string>,
  meterWords: {
    time: { best: 'Plenty', middle: 'Tight', worst: 'Out of time' },
    budget: { best: 'Comfortable', middle: 'Stretched', worst: 'Broke' },
    exposure: { best: 'Low', middle: 'Some', worst: 'High' },
    vision: { best: 'Intact', middle: 'Compromised', worst: 'Lost' },
  } as Record<MeterId, Record<MeterBand, string>>,
  metersLabel: 'Your project',
  /** A meter moved into a new band, e.g. “Time: Plenty → Tight”. */
  meterChange: (label: string, from: string, to: string) => `${label}: ${from} → ${to}`,
  /** A meter moved within its band, e.g. “Exposure rises (legal)”. */
  meterNudge: (label: string, direction: 'up' | 'down', tag?: ExposureTag) =>
    `${label} ${direction === 'up' ? 'rises' : 'falls'}${tag ? ` (${tag})` : ''}`,

  /** Label for the list of meter changes on an outcome screen. */
  changesLabel: 'What this does to your project',

  /** Why a choice is locked (plan Global Constraints), verbatim. */
  lockReasons: {
    time: 'You’re out of time for this.',
    budget: 'You’re already over budget.',
    searched: 'You already looked. No luck.',
    /** On a page revisited with Back: choices are final. */
    decided: 'You’ve already decided this one.',
  },

  /** Buttons in the coached stop (stop 1) and after a search that found no one. */
  coached: {
    toComplication: 'Continue',
    toInvite: 'Continue',
    startAnalysis: 'Think it through',
    toDecision: 'Decide what to do',
    afterSearchFail: 'Return to your choices',
    searchFailHeading: 'No luck',
  },

  /** Marks the option you chose, on a page revisited with Back. */
  yourChoice: 'Your choice',

  header: {
    back: 'Back',
    home: 'Home',
    cart: 'Cart',
    cartCount: (found: number) => `${found} of 3 found`,
    reference: 'Reference',
    about: 'About',
  },

  /** Home's confirmation (revision spec §2.1). */
  confirmReset: {
    question: 'Start over? You’ll lose your progress in this game.',
    confirm: 'Start over',
    cancel: 'Keep playing',
  },

  /** The cart, as the brief made concrete (revision spec §2.4). */
  cartPanel: {
    heading: 'Your cart',
    close: 'Close cart',
    making: 'What you’re making',
    answersTo: 'Who you answer to',
    items: 'What you need',
    stop: (n: number, title: string) => `Stop ${n}: ${title}`,
    notFound: 'Not yet found',
    yourWork: 'Your work',
    license: (label: string) => `License: ${label}`,
    meters: 'Where your project stands',
  },

  /** About panel (revision spec §2.1). Kyle supplies the license and confirms the credit line before launch. */
  about: {
    heading: 'About The Archive',
    close: 'Close about',
    what: [
      'The Archive is a text game about copyright, fair use, the public domain, and the rights you hold in your own work.',
      'You play a creator gathering material for a project, and the choices you make about what to use shape how that project turns out.',
    ],
    notAdvice: 'This is a learning game, not legal advice.',
    credit: 'Made by Kyle Denlinger, Z. Smith Reynolds Library, Wake Forest University.',
    license: 'License: ABOUT_LICENSE_TBD',
    sourceLabel: 'Source code on GitHub',
    sourceUrl: 'https://github.com/kyledenlinger/the-archive',
  },
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
    'You filled your cart with three things and chose how to share your own work, each with a reason behind it. None of them is the answer; each is a position you could explain and defend, which is most of what working with copyright comes down to.',
  resourcesHeading: 'Where to find work you can use',
};

/** Labels for the flip's cart note, one per reuse event. */
export const flipNoteLabels = {
  within: 'When someone used it within your terms:',
  outside: 'When someone went outside them:',
  beyond: 'When someone asked for more:',
};
