import { StandardStop } from '../types';

export const stop3Permission: StandardStop = {
  id: 'permission',
  title: 'Permission Isn’t Only About Copyright',
  clerkIntro:
    'This wing is quieter. Everything here came with paperwork: licenses, terms of service, little boxes you ticked without reading. Copyright says what the law allows. These say what you agreed to. They don’t always line up. And sometimes (this is going to sound radical) you can simply ask.',
  clerkClue:
    'As you walk, he recites, half to himself: “Keep this safe until I come back for it.” He glances at you. “Somebody wrote that to me, once.” Further on, a brass sign reads TAKEDOWN REQUESTS. He flinches as you pass it.',
  setup: {
    chronicler:
      'You paid for a stock clip of floodwater rushing through a culvert. The license you clicked through says “editorial use only.” Your festival screening is presented by a sponsor, a regional bank, whose logo opens every program.',
    herald:
      'Your video uses a trending song from the app’s built-in sound library, which the platform has licensed for use on its own app. Now you want to cross-post the same video to another platform and run it as a paid promotion for a sponsor.',
    naturalist:
      'For an explainer about a rare salamander, you generated an illustration with an AI image tool, since no photo of it hunting exists. You used the free tier. The tool’s terms say free-tier images are for non-commercial use only. Your channel earns ad revenue.',
    artificer:
      'You want to collage a photograph from a living artist’s online portfolio: a striking image of a flooded greenhouse. No license is stated. The portfolio lists a contact email, and the artist posted something new last week.',
    bard:
      'You generated a backing track with an AI music generator. Its terms grant commercial rights to output only on paid plans, and you made the track on the free plan. You’re about to release on streaming services.',
    conjurer:
      'Your game uses an asset-store pack of tile art, licensed for use in games but not for redistributing the assets themselves, and a font whose desktop license covers print and images. Now you want to open-source the whole game on GitHub, assets and all.',
  },
  complication:
    'Copyright isn’t the only thing in play here. You agreed to terms, or someone else set them. Those terms are a contract, and they can say no where copyright law alone might say yes, or yes where it might not.',
  choices: [
    {
      id: 'use',
      label: 'Use it.',
      outcome: {
        chronicler: {
          text: 'You use it. The festival screens the film, and nobody says anything. Streaming, your next hope, would be a different screening entirely.',
          cartNote:
            'Used an “editorial use only” stock clip in a sponsored festival screening. The question here is the license, not copyright: a sponsor-presented event may fall outside “editorial,” and streaming almost certainly would. The exposure is contractual: the agency can demand a fee or end the license.',
        },
        herald: {
          text: 'You cross-post the video and run the promotion.',
          cartNote:
            'Cross-posted a video with a song from one app’s sound library and ran it as a paid promotion. That library’s license typically covers use on that app, often not commercial use, and not other platforms. Muted audio, takedowns, or claims from the song’s rights holders are possible.',
        },
        naturalist: {
          text: 'You use the illustration in the monetized video.',
          cartNote:
            'Used a free-tier AI image on a monetized channel. The tool’s terms limit free-tier output to non-commercial use, and those terms decide what you can do with it. A separate question: an AI image of a real species may not be accurate, which matters on an educational channel.',
        },
        artificer: {
          text: 'You build the photograph into the collage and put the print on your market table.',
          cartNote:
            'Used a living artist’s photograph with no license, though the artist was reachable. Default copyright applies. Transformation in the collage might support fair use, but permission was one email away.',
        },
        bard: {
          text: 'You release the track with the AI backing.',
          cartNote:
            'Released a track with an AI backing made on a plan that grants no commercial rights. The generator’s terms decide this, not copyright. Separately, purely AI-generated material generally isn’t protected by U.S. copyright, so you may not own that layer the way you own what you wrote and played.',
        },
        conjurer: {
          text: 'You push the whole repository public, assets and font included.',
          cartNote:
            'Open-sourced the game with an asset pack licensed against redistribution and a font licensed for desktop use. Publishing the files lets anyone download them, which is redistribution. Both licenses are likely breached, even though the game itself is yours to share.',
        },
      },
    },
    {
      id: 'dont',
      label: 'Don’t use it.',
      outcome: {
        chronicler: {
          text: 'You cut the clip and shoot the culvert yourself on a rainy afternoon.',
          cartNote: 'Dropped the editorial-only stock clip and replaced it with original footage. Full rights for the festival and for streaming. The cost was a wet afternoon.',
        },
        herald: {
          text: 'You keep the original post where it is and re-cut the promoted version with a track licensed for commercial use on any platform.',
          cartNote:
            'Kept the in-app song on its own platform and out of paid promotion. Re-cut the promotion with a track licensed for commercial, cross-platform use.',
        },
        naturalist: {
          text: 'You commission a scientific illustrator who works from museum specimens. It costs money and two weeks.',
          cartNote:
            'Didn’t use the free-tier AI image. Commissioned an illustration based on specimens: paid, slower, checked for accuracy, with rights set out in the commission.',
        },
        artificer: {
          text: 'You leave the photograph out and shoot a greenhouse of your own at dawn.',
          cartNote: 'Left the living artist’s photograph out and made a source image of your own. Full rights.',
        },
        bard: {
          text: 'You play the backing part yourself.',
          cartNote: 'Didn’t release with the free-plan AI track. Recorded the backing part yourself: full rights, and copyright in your own performance.',
        },
        conjurer: {
          text: 'You open-source the code and leave the asset pack and font out of the repository, with a note on where to get them.',
          cartNote:
            'Open-sourced the code and kept the licensed assets and font out of the repository, with instructions for getting them. Respects both licenses; contributors need their own copies.',
        },
      },
    },
    { id: 'fair-use', label: 'Run a fair use analysis.', mechanic: 'fairUse' },
    { id: 'ask', label: 'Ask for permission.', mechanic: 'ask' },
  ],
  debrief: {
    lesson:
      'A license or a terms-of-service agreement is a contract: an agreement about what you may do. It can restrict you even where copyright wouldn’t, as when “editorial use only” rules out a sponsored screening, or a font’s desktop license doesn’t cover shipping the font file. Platform sound libraries usually cover use on that platform, not everywhere. AI tools work the same way: the terms you agreed to decide what you can do with the output, and free and paid plans can grant different rights. One point is mostly settled: purely AI-generated material generally isn’t protected by U.S. copyright, which requires human authorship. Much else about AI and copyright is unsettled, but neither AI scenario here depends on it. And sometimes the simplest move is to ask. A clear request often gets a yes. Silence isn’t a yes, and a no doesn’t end the fair use question, though fair use answers a copyright claim, not a broken contract.',
    prompts: [
      'Have you ever read the terms for a tool or library you use? What would you look for now?',
      'If you asked, what made your request easier or harder to say yes to?',
      'If an image or a sound was made by AI, what would you want to check besides the rights before putting it in front of an audience?',
    ],
  },
  personaReviewBy: {
    herald: { date: '2027-01-01', note: 'Re-check how major platforms’ in-app music libraries handle commercial use and cross-posting.' },
    naturalist: { date: '2027-01-01', note: 'Re-check typical AI image tool free-tier vs. paid commercial-use terms.' },
    bard: { date: '2027-01-01', note: 'Re-check AI music generator plan terms and U.S. Copyright Office guidance on AI-generated material.' },
    conjurer: { date: '2027-01-01', note: 'Re-check typical asset-store redistribution terms and desktop vs. app/embedding font licenses.' },
  },
};
