export type ClassType = 'inquisitor' | 'chronicler' | 'bard' | 'conjurer' | 'naturalist';

export interface ClassInfo {
  id: ClassType;
  name: string;
  description: string;
}

export const CLASSES: ClassInfo[] = [
  {
    id: 'inquisitor',
    name: 'THE INQUISITOR',
    description: 'True Crime Podcast. You investigate. You dig. You reconstruct events from fragments of evidence. Your podcast needs tense underscoring, archival news clips, and ambient dread.'
  },
  {
    id: 'chronicler',
    name: 'THE CHRONICLER',
    description: 'History Podcast. You make the past legible. Your episodes weave together period recordings, historical speeches, and oral histories. You take accuracy seriously.'
  },
  {
    id: 'bard',
    name: 'THE BARD',
    description: 'Music Analysis Podcast. You love music deeply enough to take it apart. Your podcast analyzes artists, albums, and songs in detail. You need the actual music to make your point.'
  },
  {
    id: 'conjurer',
    name: 'THE CONJURER',
    description: 'Audio Drama. You build worlds out of sound. Your podcast is scripted fiction — characters, scenes, a score. You need music beds, effects, and atmosphere.'
  },
  {
    id: 'naturalist',
    name: 'THE NATURALIST',
    description: 'Science & Nature Podcast. You translate the natural world for curious ears. Your episodes feature field recordings, documentary-style music, and the sounds of specific ecosystems.'
  }
];

export interface Scenario {
  id: number;
  title: string;
  setup: Record<ClassType, string>;
  complication: string;
  choices: Choice[];
}

export interface Choice {
  id: string;
  label: string;
  outcomeText?: string;
  cartNote?: string;
  isFairUse?: boolean;
  isAlternative?: boolean;
  alternativeResource?: string;
  nextStep?: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'The "Free" Track That Isn\'t',
    setup: {
      inquisitor: 'Deep in the Stacks, you find it: a tense, minimal orchestral piece uploaded to a section labeled "FreeMusicDownloads." No description. No license note. No creator name beyond a username: "darkscores_official." It\'s exactly the mood you need for your episode\'s climax.',
      chronicler: 'In a dim corner of the Archive, you find a recording of a mid-century folk singer performing a traditional song. It\'s on something called the Open SoundCloud Shelf. There\'s no attribution, no license, no information beyond the title. It sounds like the exact texture your episode needs.',
      bard: 'There it is — the actual song you want to analyze. Right here in the Archive\'s Popular Wing, fully accessible, anyone can listen. No gate, no paywall. It\'s just... there.',
      conjurer: 'You stumble onto a lush ambient soundscape — layered textures, slow evolution, exactly the atmosphere your opening scene needs. It\'s on a shelf marked "SoundCloud Shares." The uploader seems to just be sharing their work. No license visible.',
      naturalist: 'You find a stunning dawn chorus field recording — exactly the ecosystem your episode covers. It\'s on a YouTube-adjacent shelf in the Archive. No license note. No creator information beyond a username: "soundscapes_unlimited."'
    },
    complication: 'You reach for the track. Then you pause. There\'s no price tag. There\'s no lock. Anyone can listen. But you\'re not here to listen — you\'re here to use this in your podcast, which you\'re going to publish and share. You look for a license. You don\'t find one. Here\'s the thing about The Archive: the absence of a license doesn\'t mean a track is free to use. In most places, copyright attaches to a work the moment it\'s created. No label required. If there\'s no license, the default assumption is: all rights reserved.',
    choices: [
      {
        id: 'A',
        label: 'Take the track.',
        outcomeText: 'You take the track. It goes in the cart. You\'re not sure who made it, whether they\'d want you to use it, or what would happen if they found out. But you\'re on a deadline.',
        cartNote: 'Track added without license. No creator identified. Default copyright applies — all rights reserved unless proven otherwise. Use carries risk of takedown or infringement claim.'
      },
      {
        id: 'B',
        label: 'Try to find out who owns it.',
        outcomeText: 'You dig into the Archive\'s records. The username leads nowhere. The track was uploaded five years ago. You find a forum post suggesting it might have been ripped from a film score, but you can\'t confirm. An hour has passed. You still don\'t have an answer.',
        nextStep: 'sub_choice_1'
      },
      {
        id: 'C',
        label: 'Claim fair use.',
        isFairUse: true
      },
      {
        id: 'D',
        label: 'Leave it and find something you know is usable.',
        outcomeText: 'You leave the track on the shelf. Good instinct. The Archive\'s Reference Desk points you toward the Clearly Labeled Wing. You find a comparable track with a CC BY license — you can use it for any purpose as long as you credit the creator. It\'s not identical to what you had, but it works.',
        cartNote: 'CC BY licensed track selected as alternative. Free to use with attribution. No restrictions on commercial use or modification.',
        isAlternative: true,
        alternativeResource: 'Free Music Archive / Wikimedia Commons'
      }
    ]
  },
  {
    id: 2,
    title: 'The CC Track With a Catch',
    setup: {
      inquisitor: 'You find exactly what you need: a tense minimal score by an indie composer. And there\'s a label on it — a Creative Commons license. CC BY-NC. You know what that means: you can use it, you have to credit the creator, and you can\'t use it for commercial purposes. Clear enough. Then you remember: you\'re planning to pitch this podcast to a true crime network.',
      chronicler: 'A period-style instrumental, perfect for your episode\'s opening. CC BY-ND. You can use it, you have to credit the creator, and you cannot modify it in any way. Then you remember: you need to clip the track to fit your intro sequence.',
      bard: 'A recording you\'ve been hoping to feature and analyze. CC BY-NC. You can use it for non-commercial purposes. Then you remember: your podcast is already live on Spotify, with ads enabled.',
      conjurer: 'An atmospheric soundscape — exactly the texture your dramatic scene needs. CC BY-ND. You can use it, but you cannot modify it. Then you remember: you need to layer it with other audio and edit it to fit the scene.',
      naturalist: 'A field recording of exactly the right environment. CC BY-SA. You can use it — but if you do, your finished work must carry the same ShareAlike license. Then you remember: you want to own your episode fully, without any licensing obligations attached.'
    },
    complication: 'The license is real. The creator chose to share this work. That matters — they wanted people to use it. But licenses have conditions. And your situation might bump into one of them. The question isn\'t whether this track is licensed. It is. The question is whether this license covers your specific use.',
    choices: [
      {
        id: 'A',
        label: 'We\'ve assessed our situation — the license works for us. We\'re taking it.',
        outcomeText: 'You\'ve decided the license covers your use. Good — knowing your situation and making a conscious decision is exactly the right move.',
        cartNote: 'CC licensed track selected. Pair assessed their use case and determined the license terms are compatible. Attribution required.'
      },
      {
        id: 'B',
        label: 'We\'re not sure if the license covers our use. We\'ll contact the creator.',
        outcomeText: 'You send a message to the creator. The Archive\'s clock ticks. For now, the track is flagged in your cart as "pending permission." You\'ll follow up.',
        cartNote: 'CC licensed track — permission requested from creator. Use on hold pending response. Flagged for follow-up.'
      },
      {
        id: 'C',
        label: 'We\'d rather not negotiate. We\'ll find something with fewer conditions.',
        outcomeText: 'You find a comparable CC0 track — no conditions, no attribution required, completely open. It\'s not identical, but it works. And you can use it without a second thought.',
        cartNote: 'CC0 track selected as alternative. No rights reserved. No conditions. Free for any use.',
        isAlternative: true,
        alternativeResource: 'ccMixter / Freesound / Wikimedia Commons'
      },
      {
        id: 'D',
        label: 'Claim fair use.',
        isFairUse: true
      }
    ]
  },
  {
    id: 3,
    title: 'The AI-Generated Track',
    setup: {
      inquisitor: 'A classmate told you about an AI music tool. You try it. Within thirty seconds, you have a tense procedural score that sounds like it was composed for exactly your episode. It\'s perfect. It cost nothing. It took no time. You look at the platform\'s terms of service.',
      chronicler: 'You\'ve been struggling to find period-appropriate music. Then someone suggests an AI tool. You type in a description. The result sounds convincingly historical — orchestral, textured, old. Except it was made this morning, by a machine. You look at the platform\'s terms of service.',
      bard: 'The original recording you want to use is too expensive to license. A classmate suggests an AI tool can generate a "cover" — a new version in the same style. You try it. It\'s eerily close. You look at the platform\'s terms of service. And then you think about what you\'re actually trying to do in your podcast.',
      conjurer: 'An AI tool offers something remarkable: a complete soundscape — music bed, ambient texture, effects, all layered — generated to match your scene description. One prompt, one track, everything you need. You look at the platform\'s terms of service.',
      naturalist: 'The specific ecosystem you\'re covering is remote. Real field recordings are hard to find. An AI tool offers to simulate the soundscape based on scientific descriptions of the habitat. You look at the platform\'s terms of service.'
    },
    complication: 'The terms of service are long. You skim them. Here\'s what you piece together: The platform claims the generated audio is yours to use. But "yours to use" is defined in their terms, not in copyright law. It\'s unclear who, if anyone, owns the underlying copyright to AI-generated audio. The AI was trained on existing audio. Whether that raises any issues for your use isn\'t addressed in the terms.',
    choices: [
      {
        id: 'A',
        label: 'We checked the platform terms and we\'re comfortable. We\'re using the AI track.',
        outcomeText: 'You take the AI track. It\'s fast and fits the bill.',
        cartNote: 'AI-generated track selected. Platform terms reviewed — pair determined use is permitted under platform terms. Copyright ownership of AI-generated audio remains unsettled in law.'
      },
      {
        id: 'B',
        label: 'The ownership questions bother us. We\'re using the human-made alternative.',
        outcomeText: 'You find a human-made alternative with clear licensing.',
        cartNote: 'Human-made CC-licensed alternative selected. Clear rights status. Attribution required if applicable.',
        isAlternative: true,
        alternativeResource: 'Free Music Archive / Wikimedia Commons / Freesound / Macaulay Library'
      },
      {
        id: 'C',
        label: 'We\'re not sure. We\'ll flag it and move on.',
        outcomeText: 'You flag the AI track for later review.',
        cartNote: 'AI-generated track flagged as uncertain. Ownership questions unresolved. Pair chose to proceed without resolving — flagged for review.'
      },
      {
        id: 'D',
        label: 'Claim fair use.',
        isFairUse: true
      }
    ]
  },
  {
    id: 4,
    title: 'The Public Domain Trap',
    setup: {
      inquisitor: 'A noir jazz standard. Everyone knows it. It was written in the 1930s. Old enough to be public domain, surely. You find a recording — lush, full orchestra, exactly the right mood. You\'re about to take it when you look more carefully at the label. Composed: 1934. Recorded: 1955. Produced by: Blue Note Records.',
      chronicler: 'A famous speech by a historical figure. The words have been quoted everywhere for decades. Public domain, obviously. You find an audio recording of the speech — the actual voice, crackling with age. You look at the label. Recorded: 1947. Archive: CBS Broadcasting.',
      bard: 'A classical composition — centuries old, definitively public domain. You find a recording to use in your analysis. It sounds contemporary, well-produced. You look at the label. Performed by: the Berlin Philharmonic. Recorded: 2019.',
      conjurer: 'A traditional folk melody, origins unknown, clearly ancient. You find a recording with the exact texture you need for a scene. You look at the label. Produced by: Folkways Records. Recorded: 1962.',
      naturalist: 'An early scientific field recording of a now-extinct bird species. The research is from 1923. The recording is, as far as you know, the only audio documentation of this species that exists. You look at the label. Archive: Cornell Lab of Ornithology. Recording date: 1935. Copyright: Cornell University.'
    },
    complication: 'Here\'s what you\'ve just discovered: A piece of audio can contain multiple separate rights. The composition — the melody, the lyrics, the structure — and the recording — this specific performance, captured on this specific date, by these specific people — are legally distinct objects. The composition might be in the public domain. The recording almost certainly isn\'t.',
    choices: [
      {
        id: 'A',
        label: 'Find a different recording of the same composition.',
        outcomeText: 'You search for alternative recordings of the same composition. The Reference Desk points you toward performers who have released recordings under CC licenses, or recordings old enough to be in the public domain themselves.',
        cartNote: 'Public domain composition — alternative recording sourced with clear rights status. The composition is freely usable; the specific recording selected is licensed.',
        isAlternative: true,
        alternativeResource: 'Wikimedia Commons / Internet Archive / Musopen'
      },
      {
        id: 'B',
        label: 'Contact the rights holder for permission.',
        outcomeText: 'You send a message to the rights holder. It might take some time.',
        cartNote: 'Rights holder contacted for permission. Use on hold pending response. Flagged for follow-up.'
      },
      {
        id: 'C',
        label: 'Claim fair use.',
        isFairUse: true
      },
      {
        id: 'D',
        label: 'Find something different entirely.',
        outcomeText: 'You decide to cut your losses and find a different track.',
        cartNote: 'Track passed over due to unclear rights status on recording. Alternative selected. The layer distinction — PD composition, protected recording — sent this one back to the shelf.'
      }
    ]
  }
];

export const FAIR_USE_FACTORS = [
  {
    id: 1,
    title: 'Purpose and Character of the Use',
    prompt: 'Is your use transformative? Are you doing something new with this material — commenting on it, criticizing it, analyzing it, parodying it — or are you reproducing it for essentially the same purpose it was made for?',
    classSpecific: {
      inquisitor: 'You\'re using this tense orchestral piece as background music for a dramatic moment in your true crime episode. Are you transforming it — say, commenting on its emotional manipulation — or just borrowing its mood?',
      chronicler: 'You want to clip this folk recording for historical context. Are you using it to say something about the recording itself, or just to illustrate a period?',
      bard: 'You\'re analyzing this song. Your whole episode is commentary on it. You need to play portions so your audience can hear what you\'re talking about. This is one of the strongest transformative use cases that exists.',
      conjurer: 'You\'re using this soundscape as atmosphere for a dramatic scene in your audio fiction. You\'re not commenting on the soundscape — you\'re just using it to set a mood. This is a weak transformative use argument.',
      naturalist: 'You\'re using this field recording to illustrate a specific ecosystem in an educational episode. You\'re not analyzing the recording itself, but you are using it in service of education. Moderately transformative.'
    }
  },
  {
    id: 2,
    title: 'Nature of the Copyrighted Work',
    prompt: 'Is the original work factual or creative? Courts give more leeway for using factual works than highly creative ones. A news broadcast is more fair-use-friendly than a pop song.',
    classSpecific: {
      inquisitor: 'An orchestral film score is a highly creative work. This factor works against you.',
      chronicler: 'A folk performance has both creative and documentary elements. Mixed picture.',
      bard: 'The song you want to analyze is creative — a pop/rock/whatever track. This factor doesn\'t help you. But it rarely sinks a strong transformative use argument on its own.',
      conjurer: 'A lush ambient soundscape is a creative work. This factor works against you.',
      naturalist: 'A field recording sits in interesting territory — it\'s a capture of real-world sound, which is more factual than creative. This factor is neutral to slightly helpful.'
    }
  },
  {
    id: 3,
    title: 'Amount and Substantiality',
    prompt: 'How much of the original are you using? And is what you\'re using the "heart" of the work — the most memorable, essential part?',
    classSpecific: {
      inquisitor: 'Are you using a brief clip, or the whole track? The more you use, and the more central the excerpt, the harder fair use is to argue.',
      chronicler: 'Are you clipping a few seconds for context, or reproducing a significant portion? Brief, illustrative use is more defensible than extended reproduction.',
      bard: 'You need to play enough of the song that your audience can hear what you\'re analyzing. That\'s legitimate — but using more than necessary to make your point weakens the argument. Use what you need, not more.',
      conjurer: 'If you\'re using the whole soundscape as a background track throughout your episode, that\'s a large portion. Hard to argue you needed all of it.',
      naturalist: 'If you\'re using a brief illustrative clip of the field recording, this factor helps you. If you\'re using the whole thing, it\'s harder.'
    }
  },
  {
    id: 4,
    title: 'Effect on the Market',
    prompt: 'Does your use harm the market for the original — or for licensed versions of it? If your use substitutes for buying or licensing the original, that\'s the strongest strike against fair use.',
    classSpecific: {
      inquisitor: 'Is someone going to listen to your podcast instead of licensing this track? Probably not — you\'re not distributing the music, you\'re using it contextually. This factor probably doesn\'t work against you.',
      chronicler: 'Does your use substitute for the original recording in some way? If your episode becomes a place where people go to hear this folk performance, that might matter.',
      bard: 'This is key. Your analysis podcast is not a substitute for the original song. Your listeners are hearing clips to follow your argument, not to avoid buying the track. This factor works in your favor.',
      conjurer: 'If your audio drama uses a soundscape as a music bed throughout the episode, it arguably substitutes for licensing it. This factor works against you.',
      naturalist: 'An educational podcast using a brief field recording clip is unlikely to substitute for the original. This factor is probably in your favor.'
    }
  }
];

export const FAIR_USE_ASSESSMENTS: Record<ClassType, string> = {
  inquisitor: 'Your argument has some merit in the transformative/market factors, but the creative nature of the work and amount used may weaken it. Defensible, but not airtight.',
  chronicler: 'A mixed picture. Your use is somewhat transformative and educational, but depends heavily on how much you use and how central the recording is to your episode.',
  bard: 'This is one of the stronger fair use contexts. Commentary and analysis of creative works is exactly what fair use was designed to protect. Your argument is worth making.',
  conjurer: 'Your fair use argument is weak. Entertainment use, large amount, creative original, and potential market substitution all work against you. Proceed with awareness that this would be hard to defend.',
  naturalist: 'A reasonably strong argument, especially if your use is brief and illustrative. Educational context and low market impact help you.'
};
