import { StandardStop } from '../types';

export const stop2Layers: StandardStop = {
  id: 'layers',
  title: 'Old Bones',
  clerkIntro:
    'This one’s tricky. The works at the heart of this wing are old, and they’re in the public domain by any measure: the copyright ran out long ago. That part is genuinely free. Anyone can use it, build on it, or remake it. But old things get handled. People restore them, record them, scan them, colorize them, adapt them, and put them on lunchboxes, and each of those can be a separate thing, legally speaking, with its own rights and its own clock. A century-old work can sit inside something made last Tuesday, and the new part is protected. I probably should have mentioned this earlier. Sorry.',
  setup: {
    chronicler:
      'Your film needs a shot of the town before the flood, and on this shelf you find 1920s newsreel footage of Main Street, old enough to be in the public domain. The only copy here is a 2010 remastered release. It has been cleaned up and stabilized, and it’s set to a new orchestral score composed for that release.',
    herald:
      'A sponsor wants a playful post for its spring campaign, and a film reel on this shelf gives you an idea: Mickey Mouse at the wheel of a steamboat, whistling. Since January 1, 2024, the Mickey of the 1928 cartoon Steamboat Willie has been in the U.S. public domain. But the Mickey most people picture, with red shorts, white gloves, and big shiny eyes, came later. And Disney still uses Mickey as its brand.',
    naturalist:
      'For a video about the Moon’s craters, you find a folder of images copied from a NASA web page. Most are images NASA made, and works made by the U.S. federal government have no copyright at all. But one striking image from the same page carries a different credit line: a partner agency, the European Space Agency.',
    artificer:
      'You want a 19th-century botanical illustration of a foxglove for a series of prints. The original has been in the public domain for a very long time. The best copy on this shelf is a scan from a stock image site, stamped “© PlateHouse Images. All rights reserved.” Next to it is a gorgeous colorized version, made in 2020 by a digital artist.',
    bard:
      'You want to build a track on Beethoven’s Für Elise, and this shelf holds several recordings of it. The composition has been in the public domain for well over a century. The recording you love is a 2019 orchestral version, which is protected. There’s also a piano recording published in 1924, and as of January 1, 2026, U.S. sound recordings published in 1925 or earlier are in the public domain.',
    conjurer:
      'Your game is a small detective mystery, and you want Sherlock Holmes as the lead. The original stories on this shelf are in the U.S. public domain; the last of them entered it in 2023. But the Holmes you picture looks a lot like the one from a recent TV series, with the long coat, the scarf, and the smartphone.',
  },
  complication:
    'The oldest layer is free. The question is what has been added on top of it, and whether you can reach the old layer without taking the new one along with it.',
  choices: [
    {
      id: 'clean',
      label: 'Find a version that’s clean all the way down.',
      // Clean costs looking time or the version you wanted, and takes the protected layers off the table.
      effects: {
        chronicler: [{ meter: 'time', delta: -1 }, { meter: 'vision', delta: -1 }, { meter: 'exposure', delta: -1 }],
        herald: [{ meter: 'vision', delta: -1 }, { meter: 'exposure', delta: -1 }],
        naturalist: [{ meter: 'time', delta: -1 }, { meter: 'exposure', delta: -1 }],
        artificer: [{ meter: 'time', delta: -1 }, { meter: 'exposure', delta: -1 }],
        bard: [{ meter: 'vision', delta: -1 }, { meter: 'exposure', delta: -1 }],
        conjurer: [{ meter: 'time', delta: -1 }, { meter: 'exposure', delta: -1 }],
      },
      outcome: {
        chronicler: {
          text: 'A film archive holds an earlier transfer of the same newsreel. It’s silent, unrestored, and a little shaky, but it’s public domain all the way down. You add your own sound.',
          cartNote:
            'Clean version: an unrestored public-domain transfer of the 1920s newsreel, with no new score. Avoided the 2010 release’s new soundtrack (protected) and any question about the restoration. Rougher picture, clear rights.',
        },
        herald: {
          text: 'You work only from the 1928 film itself, with its black-and-white, pie-eyed, rubber-limbed Mickey and no gloves or red shorts. Your post makes clear that it’s yours and your sponsor’s, not Disney’s, and Mickey isn’t standing in as the sponsor’s mascot.',
          cartNote:
            'Clean version: used only the 1928 Steamboat Willie Mickey (public domain since 2024), not later protected designs. Avoided suggesting Disney made or endorsed the post, and didn’t use Mickey as a brand. Trademark exposure reduced, not erased: a sponsored post invites a closer look.',
        },
        naturalist: {
          text: 'You keep the NASA-made images, drop the one credited to ESA, and swap in a NASA image of the same crater from a lunar orbiter.',
          cartNote:
            'Clean version: used only NASA-made images (U.S. government works, no copyright) and dropped the partner-credited one. Noted for next time: a .gov page can host material that isn’t a government work. The credit line tells you.',
        },
        artificer: {
          text: 'A museum has digitized the same book and released its scans under CC0. You use the museum’s scan and leave the colorized version for another day.',
          cartNote:
            'Clean version: used a museum’s CC0 scan of the public-domain illustration. A faithful scan of a 2D public-domain work likely carries no new U.S. copyright (Bridgeman v. Corel), and the CC0 scan also sidesteps the stock site’s terms of use. The 2020 colorization is new work and stays off-limits.',
        },
        bard: {
          text: 'You build the track on the 1924 piano recording, which is public domain as of this year, playing a composition that has been free for over a century.',
          cartNote:
            'Clean version: used a 1924 recording (U.S. public domain as of 2026) of a public-domain composition. Both layers free. The 2019 orchestral recording stays protected even though the music it plays is not.',
        },
        conjurer: {
          text: 'You go back to the stories and design your own Holmes from the text and its original illustrations, with a deerstalker cap, a pipe, and gaslit London. You take nothing from the TV series.',
          cartNote:
            'Clean version: built Holmes from the public-domain stories and their original illustrations. Avoided the TV series’ designs and new story elements, which are protected. The character is free; a particular adaptation’s additions are not.',
        },
      },
    },
    {
      id: 'contact',
      label: 'Contact the rights holder.',
      requires: ['time'],
      // Writing and waiting costs Time. A paid license (chronicler, artificer, bard) costs Budget and keeps the
      // version you wanted. A no or silence (herald, conjurer) still settles where the line is.
      effects: {
        chronicler: [{ meter: 'time', delta: -1 }, { meter: 'budget', delta: -1 }, { meter: 'exposure', delta: -1 }, { meter: 'vision', delta: 1 }],
        herald: [{ meter: 'time', delta: -1 }, { meter: 'exposure', delta: -1 }],
        naturalist: [{ meter: 'time', delta: -1 }, { meter: 'exposure', delta: -1 }, { meter: 'vision', delta: 1 }],
        artificer: [{ meter: 'time', delta: -1 }, { meter: 'budget', delta: -1 }, { meter: 'exposure', delta: -1 }, { meter: 'vision', delta: 1 }],
        bard: [{ meter: 'time', delta: -2 }, { meter: 'budget', delta: -1 }, { meter: 'exposure', delta: -1 }, { meter: 'vision', delta: 1 }],
        conjurer: [{ meter: 'time', delta: -2 }, { meter: 'exposure', delta: -1 }],
      },
      outcome: {
        chronicler: {
          text: 'You write to the label that issued the 2010 release. They offer a festival-only license for a fee you can just about manage, and quote a separate, larger fee for streaming.',
          cartNote:
            'Contacted the rights holder of the 2010 release. Offered a festival-only license, with a separate streaming fee. Pays for the protected layers (the new score, and any creative restoration) on top of public-domain footage. Budget for the streaming fee if the film goes further.',
        },
        herald: {
          text: 'You write to Disney’s licensing department about using Mickey in a sponsored post. A form reply arrives, and the answer is no.',
          cartNote:
            'Asked Disney; declined by form reply. Permission isn’t needed for the 1928 Mickey itself, but the reply is a reminder that the trademark layer is actively guarded. Going ahead would mean staying strictly within the public-domain version and away from any hint of endorsement.',
        },
        naturalist: {
          text: 'The credit line leads you to ESA’s terms for its images, which allow reuse under stated conditions, including credit. Their media team confirms by email that your video fits.',
          cartNote:
            'Checked the partner agency’s own terms and confirmed by email. Using the ESA image under its conditions, with the required credit; the NASA images need none. Different layers on one page, different rules.',
        },
        artificer: {
          text: 'You email the stock site about the scan; they want a license fee. You email the colorist too. The colorist says yes, for a small fee and a credit line.',
          cartNote:
            'Contacted both. The stock site wants a fee for a scan of a public-domain work, a copyright claim that may not hold up for a faithful 2D reproduction, though its terms of use may still bind anyone who downloads from it. The colorist, who does own new work, agreed for a small fee and credit.',
        },
        bard: {
          text: 'You email the label behind the 2019 recording. They point you to a sample-licensing form, a fee schedule, and a long review queue.',
          cartNote:
            'Contacted the label for the 2019 recording. Licensing is available for a fee, after review. Paying would cover the recording layer; the composition needs no permission.',
        },
        conjurer: {
          text: 'You write to the studio behind the TV series. Two weeks pass with no reply.',
          cartNote:
            'Contacted the studio about the series’ Holmes designs. No reply. Silence isn’t permission: the series’ designs stay off-limits, while the public-domain Holmes stays available.',
        },
      },
    },
    { id: 'fair-use', label: 'Run a fair use analysis.', mechanic: 'fairUse' },
    {
      id: 'pass',
      label: 'Pass on it.',
      effects: [{ meter: 'time', delta: -1 }, { meter: 'vision', delta: -1 }, { meter: 'exposure', delta: -1 }],
      outcome: {
        text: 'You put it back on the shelf. There will be something else, somewhere, with fewer layers.',
        cartNote:
          'Passed. The layers made the rights picture too tangled for the time available. The cost: time, and a lost opportunity, since the public-domain layer was free all along.',
      },
    },
  ],
  debrief: {
    lesson:
      'A public-domain work doesn’t make everything built on it public domain. New contributions (a recording, a new score, a restoration with creative choices, a colorization, an adaptation’s characters and designs) have their own copyrights and their own clocks. A faithful copy of a two-dimensional public-domain work generally adds none: that’s the Bridgeman v. Corel decision, from a federal district court and widely followed in the U.S. Photos of 3D objects can be different, and a website’s terms of use can still restrict you by contract, which is the next stop. Trademark is another layer, one that lasts as long as the mark is in use: you can use the 1928 Mickey, but not in a way that suggests Disney made or sponsored your work. Sound recordings run on their own clock: as of 2026, U.S. recordings published in 1925 or earlier are public domain, and another year opens up every January 1. And not everything on a .gov site is a government work; read the credit line.',
    prompts: [
      'Which layer in your scenario was hardest to spot? What gave it away?',
      'Was a version that’s clean all the way down worth what it cost in quality or time?',
      'When the oldest layer is free, who should benefit from the new layers built on top of it?',
    ],
  },
  personaReviewBy: {
    bard: { date: '2027-01-01', note: 'Sound-recording PD cutoff moves each Jan 1 (MMA): update the named year.' },
  },
};
