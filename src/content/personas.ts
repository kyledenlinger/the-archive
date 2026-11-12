import { Persona } from './types';

// Each brief (revision spec §3) names the three items so the player recognizes them at stops 1–3;
// check any change against that stop's setup[persona].

export const personas: Persona[] = [
  {
    id: 'chronicler',
    name: 'THE CHRONICLER',
    medium: 'Short documentary film',
    description:
      "You’re finishing a short documentary for a student film festival. If it does well, you’d like to see it on a streaming service someday, so anything you borrow for it has to hold up there too.",
    brief: {
      making: 'A short documentary about the 1970s flood that reshaped your town, told through footage from that week and the people who remember it.',
      answersTo:
        'The student film festival you’re entering, which asks you to confirm you’ve cleared everything on screen, and its sponsor, a regional bank whose logo opens every program. If the film does well, a streaming service may want it next.',
      deadline: 'The festival’s submission deadline is three weeks away, and your cut isn’t locked yet.',
      items: [
        'Local TV news footage from the week of the flood',
        '1920s newsreel footage of Main Street, before the flood',
        'The stock clip of floodwater in a culvert, cleared for a sponsored screening',
      ],
    },
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 3, budget: 4, exposure: 1, vision: 5 },
  },
  {
    id: 'herald',
    name: 'THE HERALD',
    medium: 'Social media: short video and graphics',
    description:
      'You make posts for a campus organization and for your own account, which has a real following. Some of your posts are sponsored. Your posts spread quickly, and so does anything you borrow for them.',
    brief: {
      making: 'This term’s posts for your campus organization: graphics and short videos, some paid for by a sponsor and some shared to your own account.',
      answersTo: 'Your organization, which wants people at its events, and a sponsor that is paying for its spring campaign and signs off on every post with its name on it.',
      deadline: 'The spring campaign launches in a month, and the organization wants a post up every few days until then.',
      items: [
        'The image everyone’s sharing this week, for your post about late-night study hours',
        'A cartoon character everyone knows, for the sponsor’s playful spring post',
        'The trending song from your latest video, cleared to run as a sponsor’s paid promotion',
      ],
    },
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 5, budget: 5, exposure: 2, vision: 4 },
  },
  {
    id: 'naturalist',
    name: 'THE NATURALIST',
    medium: 'Nature and science channel',
    description:
      'You run a channel of explainer videos, with a blog and your own wildlife photos. It earns money from ads, but the mission is educational: you want people to understand the living world, accurately.',
    brief: {
      making: 'This month’s work for your channel: a blog post on how owls hunt in snow, an explainer video on the Moon’s craters, and another on a rare salamander.',
      answersTo: 'Your audience, who count on you to get the science right, and the ad revenue that keeps the channel going.',
      deadline: 'You post something new every Friday, and your audience notices when you miss one.',
      items: [
        'A photo of a great gray owl hunting in snow, for the blog post',
        'Images of the Moon’s craters, for the crater video',
        'The salamander illustration for your next explainer, cleared for a channel that earns ad revenue',
      ],
    },
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 4, budget: 3, exposure: 1, vision: 5 },
  },
  {
    id: 'artificer',
    name: 'THE ARTIFICER',
    medium: 'Zines, collages, and prints',
    description:
      'You cut, paste, scan, and print, and you sell your zines and prints at a campus market. Your work is built out of other people’s images, so every source raises the question of who made it and what you may do with it.',
    brief: {
      making: 'A new collage zine and a series of prints to go with it, to sell at your table at the campus market.',
      answersTo: 'The print shop, which won’t start your run until it has final files, and the regulars at the market, who come to your table expecting something new.',
      deadline: 'The campus market is in three weeks, and the print shop needs your files ten days before that.',
      items: [
        'An ink drawing of a moth, for the cover collage',
        'A 19th-century botanical illustration of a foxglove, for the print series',
        'A photograph for the centerfold collage: you’re picturing a flooded greenhouse',
      ],
    },
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 4, budget: 2, exposure: 1, vision: 6 },
  },
  {
    id: 'bard',
    name: 'THE BARD',
    medium: 'Music: samples, covers, and remixes',
    description:
      "You make tracks out of other tracks, and you’re about to release them on streaming services. Once they’re released, they’ll be everywhere.",
    brief: {
      making: 'Your first EP: four tracks built out of samples, an old classic, and a new song of your own.',
      answersTo: 'Your distributor, which sends the EP to the streaming services and asks you to confirm you hold the rights to every sound on it.',
      deadline: 'The release date you set with your distributor is four weeks out, and the final files are due two weeks before that.',
      items: [
        'A drum break with the right feel, for the opening track',
        'A recording of Beethoven’s Für Elise to build a track on',
        'The backing track for your new song, cleared for release on streaming services',
      ],
    },
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 4, budget: 2, exposure: 2, vision: 6 },
  },
  {
    id: 'conjurer',
    name: 'THE CONJURER',
    medium: 'Indie game',
    description:
      "You’re building a small game to post on itch.io, either free or for a few dollars. Whether you charge for it changes more than you’d think.",
    brief: {
      making: 'A small detective mystery game for itch.io. You haven’t decided yet whether it will be free or cost a few dollars.',
      answersTo: 'The players following your devlog, who have seen the launch date you announced on your itch.io page.',
      deadline: 'Launch day on itch.io is five weeks away, and you’ve already announced it.',
      items: [
        'Animated sprites for the potions in your game',
        'A famous detective to base your hero on: Sherlock Holmes, ideally',
        'Your game’s tile art and font, cleared for open-sourcing the whole game on GitHub',
      ],
    },
    // Starting meters: revision spec §4.5 (drafts to tune in playtesting).
    startMeters: { time: 5, budget: 2, exposure: 1, vision: 5 },
  },
];
