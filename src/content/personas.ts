import { Brief, Persona } from './types';

// PLACEHOLDER briefs until Task 7 writes them (revision spec §3). `npm run validate -- --allow-placeholder` allows them.
const tbdBrief = (): Brief => ({
  making: 'PLACEHOLDER (Task 7): what you’re making',
  answersTo: 'PLACEHOLDER (Task 7): who you answer to',
  deadline: 'PLACEHOLDER (Task 7): your deadline',
  items: ['PLACEHOLDER (Task 7): item 1', 'PLACEHOLDER (Task 7): item 2', 'PLACEHOLDER (Task 7): item 3'],
});

export const personas: Persona[] = [
  {
    id: 'chronicler',
    name: 'THE CHRONICLER',
    medium: 'Short documentary film',
    description:
      "You’re finishing a short documentary for a student film festival. If it does well, you’d like to see it on a streaming service someday, so anything you borrow for it has to hold up there too.",
    brief: tbdBrief(),
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 3, budget: 4, exposure: 1, vision: 5 },
  },
  {
    id: 'herald',
    name: 'THE HERALD',
    medium: 'Social media: short video and graphics',
    description:
      'You make posts for a campus organization and for your own account, which has a real following. Some of your posts are sponsored. Your posts spread quickly, and so does anything you borrow for them.',
    brief: tbdBrief(),
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 5, budget: 5, exposure: 2, vision: 4 },
  },
  {
    id: 'naturalist',
    name: 'THE NATURALIST',
    medium: 'Nature and science channel',
    description:
      'You run a channel of explainer videos, with a blog and your own wildlife photos. It earns money from ads, but the mission is educational: you want people to understand the living world, accurately.',
    brief: tbdBrief(),
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 4, budget: 3, exposure: 1, vision: 5 },
  },
  {
    id: 'artificer',
    name: 'THE ARTIFICER',
    medium: 'Zines, collages, and prints',
    description:
      'You cut, paste, scan, and print, and you sell your zines and prints at a campus market. Your work is built out of other people’s images, so every source raises the question of who made it and what you may do with it.',
    brief: tbdBrief(),
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 4, budget: 2, exposure: 1, vision: 6 },
  },
  {
    id: 'bard',
    name: 'THE BARD',
    medium: 'Music: samples, covers, and remixes',
    description:
      "You make tracks out of other tracks, and you’re about to release them on streaming services. Once they’re released, they’ll be everywhere.",
    brief: tbdBrief(),
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 4, budget: 2, exposure: 2, vision: 6 },
  },
  {
    id: 'conjurer',
    name: 'THE CONJURER',
    medium: 'Indie game',
    description:
      "You’re building a small game to post on itch.io, either free or for a few dollars. Whether you charge for it changes more than you’d think.",
    brief: tbdBrief(),
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 5, budget: 2, exposure: 1, vision: 5 },
  },
];
