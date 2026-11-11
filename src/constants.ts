/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharacterType = "inquisitor" | "chronicler" | "bard" | "conjurer" | "naturalist" | "artificer";

export interface GameState {
  screen: string;
  character: CharacterType | null;
  cart: { scenario: string; note: string; score: number }[];
  clerkScore: number;
  scenarioIndex: number;
  fuScenario: number | null;
  fuResponses: string[];
  fuStep: number;
}

export const CHARACTERS = {
  inquisitor: {
    name: "THE INQUISITOR",
    genre: "True Crime Podcast",
    description: "You investigate. You dig. You reconstruct events from fragments of evidence. Your podcast needs tense underscoring, archival news clips, and ambient dread. You're considering pitching it to a true crime network.",
  },
  chronicler: {
    name: "THE CHRONICLER",
    genre: "History Podcast",
    description: "You make the past legible. Your episodes weave together period recordings, historical speeches, and oral histories. Your professor wants you to publish publicly. You take accuracy seriously.",
  },
  bard: {
    name: "THE BARD",
    genre: "Music Analysis Podcast",
    description: "You love music deeply enough to take it apart. Your podcast analyzes artists, albums, and songs in detail. You're already on Spotify with ads enabled. You need the actual music to make your point.",
  },
  conjurer: {
    name: "THE CONJURER",
    genre: "Audio Drama",
    description: "You build worlds out of sound. Your podcast is scripted fiction — characters, scenes, a score. You're selling episodes as a limited series. You need music beds, effects, and atmosphere.",
  },
  naturalist: {
    name: "THE NATURALIST",
    genre: "Science & Nature Podcast",
    description: "You translate the natural world for curious ears. Your episodes feature field recordings, documentary-style music, and the sounds of specific ecosystems. You care about getting it right.",
  },
  artificer: {
    name: "THE ARTIFICER",
    genre: "Art & Design Podcast",
    description: "You find meaning in made things. Your podcast tells the stories behind designed objects, buildings, and ideas. You need considered mood music, ambient sound from the spaces you cover, and interview clips with the designers who made them.",
  },
};

export const SCENARIOS = [
  {
    id: 1,
    title: "The 'Free' Track That Isn't",
    clerkIntro: "Ah. You found one. No license. Common, actually. Most things in here aren't labeled. And here's the thing people don't always realize — the absence of a label doesn't mean it's free. In most jurisdictions, copyright attaches the moment something is created. No registration required. No label required. The default assumption is: all rights reserved. Of course, the likelihood of anyone noticing, in a collection this size, is... well. Statistically, I couldn't say. That's not advice, obviously.",
    setup: {
      inquisitor: "Deep in the Stacks, you find it: a tense, minimal orchestral piece uploaded to a section labeled 'FreeMusicDownloads.' No description. No license note. No creator name beyond a username: darkscores_official. It's exactly the mood you need for your episode's climax.",
      chronicler: "In a dim corner of the Archive, you find a recording of a mid-century folk singer performing a traditional song. It's on something called the Open SoundCloud Shelf. There's no attribution, no license, no information beyond the title and a faded year: 1958. It sounds like the exact texture your episode needs.",
      bard: "There it is — the actual song you want to analyze. Right here in the Archive's Popular Wing, fully accessible, anyone can listen. No gate, no paywall, no lock. It's just there, streaming freely, like it's waiting for you.",
      conjurer: "You stumble onto a lush ambient soundscape — layered textures, slow evolution, exactly the atmosphere your opening scene needs. It's on a shelf marked 'SoundCloud Shares.' The uploader seems to just be sharing their work. No license visible. No price.",
      naturalist: "You find a stunning dawn chorus field recording — exactly the ecosystem your episode covers. It's on a YouTube-adjacent shelf in the Archive. No license note. No creator information beyond a username: soundscapes_unlimited. The recording is breathtaking.",
      artificer: "In a sleek, minimalist corner of the Archive, you find a hip, textured electronic track. It's labeled 'Free for Creators' on a shelf marked 'DesignResources.' No license, no name, just a username: grid_and_pixel. It's the perfect mood for your episode on brutalist architecture.",
    },
    complication: "You reach for the track. Then you pause. There's no price tag. There's no lock. Anyone can listen. But you're not here to listen — you're here to use this in your podcast, which you're going to publish and share. You look for a license. You don't find one. Here's the thing about The Archive: the absence of a license doesn't mean a track is free to use. Copyright attaches to a work the moment it's created — no label required. If there's no license, the default assumption is: all rights reserved.",
  },
  {
    id: 2,
    title: "The CC Track With a Catch",
    clerkIntro: "Creative Commons. Good news. The creator wanted this used. They made a choice — took the time to put a license on it. That matters. The conditions, though. The conditions are where it gets interesting. CC licenses are not all the same thing. BY means credit the creator. NC means non-commercial. ND means no modifications. SA means whatever you make with it has to carry the same license forward. Your license is specific. Whether it covers your specific situation depends on your specific situation, which I don't know in detail, so I couldn't say for certain. But the creator is a person. They have a contact page. People often say yes when you ask nicely. I've seen it happen.",
    setup: {
      inquisitor: "You find exactly what you need: a tense minimal score by an indie composer. And there's a label — CC BY-NC. You can use it, you have to credit the creator, and you can't use it for commercial purposes. Clear enough. Then you remember: you're planning to pitch this podcast to a true crime network.",
      chronicler: "A period-style instrumental, perfect for your episode's opening. CC BY-ND. You can use it, you have to credit the creator, and you cannot modify it in any way. Then you remember: you need to clip the track to fit your intro sequence. You need the first 45 seconds, not the full two minutes.",
      bard: "A recording you've been hoping to feature and analyze. CC BY-NC. You can use it for non-commercial purposes. Then you remember: your podcast is already live on Spotify. With ads enabled.",
      conjurer: "An atmospheric soundscape — exactly the texture your dramatic scene needs. CC BY-ND. You can use it, but you cannot modify it in any way. Then you remember: you need to layer it with voice acting, fold in additional effects, and trim it to fit the scene's exact runtime.",
      naturalist: "A field recording of exactly the right environment. CC BY-SA. You can use it — but if you do, your finished work must carry the same ShareAlike license. Then you remember: you want to own your episode fully, without licensing obligations attached to it.",
      artificer: "You find a beautiful, ambient track with a textured, industrial feel. CC BY-NC. You can use it, you have to credit the creator, and you can't use it for commercial purposes. Then you remember: your podcast is sponsored by a high-end furniture brand.",
    },
    complication: "The license is real. The creator chose to share this work. That matters — they wanted people to use it. But licenses have conditions. And your situation might bump into one of them. The question isn't whether this track is licensed. It is. The question is whether this license covers your specific use.",
    conditions: {
      inquisitor: "NC",
      chronicler: "ND",
      bard: "NC",
      conjurer: "ND",
      naturalist: "SA",
      artificer: "NC",
    },
    conditionExplanation: {
      inquisitor: "A network deal would almost certainly count as commercial use. Your podcast might be non-commercial now — but pitching it means you're hoping it won't be for long.",
      chronicler: "Clipping is a modification. Even shortening a track counts as creating a derivative work under ND terms.",
      bard: "Ads enabled on Spotify almost certainly constitutes commercial use. Your show is generating — or intended to generate — revenue.",
      conjurer: "Layering, mixing, and trimming all constitute modification. Under ND terms, you can't do any of that.",
      naturalist: "If you use a SA-licensed work in your podcast, your episode would need to be released under the same CC BY-SA license — meaning anyone could reuse your episode under those same terms.",
      artificer: "A sponsorship deal almost certainly counts as commercial use. Even if you're not selling the podcast directly, the brand is paying for the association.",
    }
  },
  {
    id: 3,
    title: "The AI-Generated Track",
    clerkIntro: "The generative wing. Yes. No human creator. Made in seconds. The platform says you can use it. The platform's terms of service are not the same thing as copyright law, you understand. The legal status of AI-generated audio is — I want to choose the right word — unsettled. Courts are still sorting it out. There is also, I should mention, a great deal of human-made audio in this Archive. Recorded by people. Licensed for exactly this kind of use. It takes a little longer to find. I mention it only in the interest of completeness. The easy path and the right path are sometimes the same path. Not always, though.",
    setup: {
      inquisitor: "A fellow creator told you about an AI music tool. You try it. Within thirty seconds, you have a tense procedural score that sounds like it was composed specifically for your episode. It's perfect. It cost nothing. It took no time. You look at the platform's terms of service.",
      chronicler: "You've been struggling to find period-appropriate music. Then someone suggests an AI tool. You type in a description. The result sounds convincingly historical — orchestral, textured, old. Except it was made this morning, by a machine. You look at the platform's terms of service.",
      bard: "The original recording you want to use is expensive to license. A fellow creator suggests an AI tool can generate a 'cover' — a new version in the same style. You try it. It's eerily close to the original. You look at the platform's terms of service. And then you think about what you're actually trying to do in your podcast.",
      conjurer: "An AI tool offers something remarkable: describe your scene, and it generates a complete soundscape — music bed, ambient texture, effects — all layered and matched to your description. One prompt. Everything you need. You look at the platform's terms of service.",
      naturalist: "The specific ecosystem you're covering is remote and rarely recorded. Real field recordings are hard to find. An AI tool offers to simulate the soundscape based on scientific descriptions of the habitat — the right bird species, insect layers, wind patterns. You look at the platform's terms of service.",
      artificer: "You need a specific 'mid-century modern' sound for your next segment. An AI tool generates a track that sounds exactly like a 1950s furniture showroom — optimistic, clean, and slightly synthetic. It took ten seconds. You look at the platform's terms of service.",
    },
    complication: "The terms of service are long. You skim them. Here's what you piece together: The platform claims the generated audio is 'yours to use' — but that phrase is defined in their terms, not in copyright law. Who, if anyone, holds copyright on AI-generated audio is an unsettled legal question. The AI was trained on existing audio. Whether that raises any issues for your use isn't addressed in the terms. Monetization may be subject to different or additional terms. You close the terms of service tab.",
    alternative: {
      inquisitor: "Free Music Archive has a section of CC-licensed film and documentary scores. One of them — a sparse, tense piece by a composer who releases everything under CC BY — would work for your episode.",
      chronicler: "Wikimedia Commons and the Internet Archive both have real period recordings with clear licensing — folk music, classical performances, historical broadcasts. Documented, sourced, verifiable. The real thing exists.",
      bard: "Here's the harder question: you don't actually need a cover. You need the original — to analyze it. Your whole podcast is commentary and criticism. That's one of the strongest fair use contexts that exists. The AI track sidesteps the question rather than answering it.",
      conjurer: "Freesound has thousands of CC-licensed ambient recordings and soundscapes. Building your own layered mix would take effort — but you'd know exactly what you have, and you'd own the assembled result.",
      naturalist: "The Macaulay Library at Cornell has the largest collection of wildlife recordings in the world. Many are available for non-commercial educational use. The real thing — documented, scientifically verifiable — may well be there.",
      artificer: "Blue Dot Sessions (sessions.blue) has a deep library of textured, acoustic, and electronic music with clear licensing for podcasts. Many tracks are CC BY-NC, but they offer simple, affordable licenses for sponsored shows.",
    }
  },
  {
    id: 4,
    title: "The Public Domain Trap",
    clerkIntro: "Tricky one. The composition is old. Public domain, by any measure — the copyright ran out decades ago. That part is genuinely free. Anyone can use it, build on it, remake it. The recording, though. The recording is a separate object, legally speaking. Separate copyright. Separate clock. You can have a forty-year-old song recorded last Tuesday, and that recording is protected for another seventy years. The composition and the performance of it are distinct things. I probably should have mentioned this earlier. Apologies.",
    setup: {
      inquisitor: "A noir jazz standard. Everyone knows it. Written in the 1930s — old enough to be public domain, surely. You find a recording: lush, full orchestra, exactly the right mood. You're about to take it when you look more carefully at the label. Composed: 1934. Recorded: 1955. Produced by: Blue Note Records.",
      chronicler: "A famous speech by a historical figure. The words have been quoted everywhere for decades — clearly in the public domain. You find an audio recording: the actual voice, crackling with age, unmistakably real. Recorded: 1947. Archive: CBS Broadcasting.",
      bard: "A classical composition — centuries old, definitively in the public domain. You find a recording to use in your analysis. It sounds contemporary and polished. Performed by: the Berlin Philharmonic. Recorded: 2019. Label: Deutsche Grammophon.",
      conjurer: "A traditional folk melody — origins unknown, clearly ancient. You find a recording with exactly the eerie, timeless texture you need for a pivotal scene. Traditional melody. Produced by: Folkways Records. Recorded: 1962.",
      naturalist: "An early scientific field recording of a now-extinct bird species. The research is from 1923. This recording may be the only audio documentation of this species that exists anywhere. Recording date: 1935. Archive: Cornell Lab of Ornithology. Copyright: Cornell University.",
      artificer: "A recording of a famous architect's lecture from 1952. The words are public domain, but the recording was produced by a university archive in 1998. The university claims copyright on the digitized version.",
    },
    complication: "Here's what you've just discovered: A piece of audio can contain multiple separate rights. The composition — the melody, the lyrics, the structure — and the recording — this specific performance, captured on this specific date — are legally distinct objects. The composition might be in the public domain. The recording almost certainly isn't. In the United States, sound recordings have their own copyright timeline, separate from the underlying work. A 1955 recording of a 1934 composition is still protected. A 2019 performance of a 400-year-old symphony is still protected.",
  }
];

export const FAIR_USE_QUESTIONS = [
  {
    title: "Purpose and Character of the Use",
    description: "Is your use transformative? Are you doing something new with this material — commenting on it, criticizing it, analyzing it, parodying it — or reproducing it for essentially the same purpose it was originally made for?",
    text: {
      inquisitor: [
        "You're using this tense piece as background music for a dramatic moment in your true crime episode. Are you transforming it — say, commenting on how music manipulates listener emotion — or just borrowing its mood for your own purposes?",
        "You're using this score as background music. Are you commenting on or transforming it in any way, or using it purely for atmosphere?",
        "You're using this piece as dramatic underscoring. You're not analyzing or commenting on it. How transformative is that?",
        "You're using a clip of this jazz recording for atmosphere — not analyzing the recording itself."
      ],
      artificer: [
        "You're using this electronic track as background music for a segment on urban design. Are you transforming it — say, by using it to illustrate the 'texture' of a city — or just using it as a mood-setter?",
        "You're using this ambient track in a sponsored podcast. Are you transforming it, or using it for its intended purpose as mood music?",
        "You're using an AI-generated track for atmosphere. Transformative?",
        "You're using a lecture recording for its informational content. That's a strong educational purpose, but is it transformative?"
      ],
      chronicler: [
        "You're using this folk recording to establish historical texture. You're not analyzing the recording itself — you're using it to evoke a period. Is that transformative, or decorative?",
        "Your whole show is historical. You need this track for period context. Transformative?",
        "You're using an AI-generated piece for period atmosphere. Even setting aside the AI question: how transformative is atmospheric use?",
        "You're using this archival recording to let listeners hear the actual historical voice. That's a strong historical and educational purpose — arguably more transformative than decorative."
      ],
      bard: [
        "You want to analyze this song. Your whole episode is commentary on it — you need to play portions so listeners can hear what you're talking about. Are you transforming the work through critical analysis, or simply reproducing it?",
        "Your whole show is commentary and analysis. You need to feature this track to analyze it. Transformative? Yes — analysis is one of the clearest transformative purposes recognized by courts.",
        "You're using an AI cover instead of the original. Your analysis depends on listeners hearing the actual track. Using a cover undermines your own argument. The fair use case for the original is the stronger argument to make.",
        "Your podcast is commentary and analysis of this specific song. You need to play it so listeners can hear what you're discussing. That is one of the most clearly transformative uses fair use was designed to cover.",
        "You're analyzing a classical work. The specific recording matters — you're discussing this performance, these musicians, this interpretation. That's a meaningful transformative analytical purpose."
      ],
      conjurer: [
        "You're using this soundscape as atmosphere for your audio drama. You're not commenting on it, analyzing it, or transforming it in any meaningful way. You're using it because it sounds right for your scene.",
        "You're using this soundscape as background atmosphere for a fictional scene. No transformation, no commentary. Purely functional use.",
        "You're using AI-generated audio as your complete soundscape. Fair use applies to copyrighted works you're using without permission — it doesn't map cleanly onto AI-generated content.",
        "You're using this folk recording for atmospheric effect in your drama. No analysis, no commentary on the recording. Purely functional."
      ],
      naturalist: [
        "You're using this dawn chorus to illustrate the ecosystem you're discussing. You're not analyzing the recording itself — you're using it to let listeners hear the environment. Is that transformative, or purely illustrative?",
        "You're using this field recording to illustrate an ecosystem in an educational context. Scientifically informative use — how transformative is that?",
        "You're using an AI simulation of an ecosystem. Separately: does a science podcast benefit from a simulation when the real thing exists?",
        "You're using this archival recording of an extinct species for a science podcast. There is no other recording. Your use is educational and preservationist in intent. That's a meaningful purpose."
      ]
    }
  },
  {
    title: "Nature of the Copyrighted Work",
    description: "Is the original work more factual or more creative? Courts give more leeway when using factual works. A news broadcast is more fair-use-friendly than a pop song.",
    text: {
      inquisitor: "An orchestral film score is a highly creative work. This factor works against your argument.",
      chronicler: "A folk performance or historical recording contains both creative and documentary elements. Mixed picture.",
      bard: "The song or recording you're analyzing is a creative work. This factor works against you — but it rarely defeats a strong transformative purpose on its own.",
      conjurer: "A soundscape or musical work is highly creative. This factor works against your argument.",
      naturalist: "A field recording sits in interesting territory — it captures real-world sound, which is more factual than creative. This factor is neutral to slightly in your favor.",
      artificer: "An electronic track or ambient soundscape is a creative work. This factor works against your argument."
    }
  },
  {
    title: "Amount and Substantiality",
    description: "How much of the original are you using? And is what you're using the 'heart' of the work — the most memorable, recognizable part?",
    text: {
      inquisitor: "Are you using a brief clip, or the whole track? The more you use, and the more central the excerpt, the harder fair use is to defend.",
      chronicler: [
        "Are you clipping a few seconds for context, or reproducing a significant portion? Brief, illustrative use is more defensible.",
        "You want to use 45 seconds of a 2-minute track. That's a significant portion.",
        "How much of the recording are you using? Even for historical material, use only what you need."
      ],
      bard: "Use enough for listeners to follow your analysis — not more. Are you using only what's necessary to make your argument?",
      conjurer: "If this track runs under your whole scene, that's significant use. Are you using the whole thing, or a portion?",
      naturalist: [
        "Brief illustrative use is the strongest position. How much do you actually need?",
        "How much of the recording are you using? Even for such a unique document, use only what you need."
      ],
      artificer: "Are you using a brief clip, or the whole track? For background music, the 'amount' is often the entire duration of the segment."
    }
  },
  {
    title: "Effect on the Market",
    description: "Does your use harm the market for the original — or for licensed versions of it? If your use substitutes for buying or licensing the original, that's the strongest strike against fair use.",
    text: {
      inquisitor: "You're using this contextually in a podcast, not as a substitute for the original recording. Listeners aren't coming to your show to hear the track instead of licensing it. This factor is likely in your favor.",
      chronicler: "Does your use substitute for the original in some way? If your episode becomes a place people go to hear this recording, that might matter. For brief contextual use: probably not a significant market impact.",
      bard: "Your analysis podcast is not a substitute for the original. Listeners hear clips to follow your argument, not to avoid buying or streaming the track. This factor is likely in your favor.",
      conjurer: "Your audio drama is entertainment — a commercial product. If you're using a soundscape as a sustained music bed, your use could plausibly substitute for licensing it. This factor works against you.",
      naturalist: "An educational podcast using field recording clips is unlikely to substitute for the original in any commercial sense. This factor is probably in your favor.",
      artificer: "You're using this in a sponsored podcast. Does your use substitute for licensing the original? If the track is part of a library that sells licenses to podcasters, this factor works against you."
    }
  }
];

export const FAIR_USE_ASSESSMENTS = {
  inquisitor: "Your argument has some traction on market effect, but purpose is decorative rather than transformative. Moderate defensibility — worth thinking through carefully before proceeding.",
  chronicler: {
    s123: "Educational and historical context helps, but purpose is more illustrative than transformative. How much you use matters a great deal. Moderate defensibility — brief clip is much stronger than extended use.",
    s4: "Educational purpose and historical context make this a moderate-to-strong argument, especially for a brief excerpt. The speech itself is PD; what you're using is the recording of it. Reasonably defensible with clear educational framing."
  },
  bard: {
    standard: "This is one of the stronger fair use contexts that exists. Commentary and analysis of creative works is exactly what fair use was designed to protect. Strong transformative purpose, low market impact. Worth defending confidently.",
    ai: "Weak argument. It's not the original, so it doesn't serve the analytical purpose. If you want to claim fair use, claim it for the original — not a cover."
  },
  conjurer: "Fair use argument is weak. Entertainment use with no transformative element, creative original, significant amount, and a commercial production. Finding a CC-licensed alternative is strongly recommended.",
  naturalist: {
    s124: "Educational purpose and illustrative intent make this a moderate argument. Brief, illustrative use is more defensible than extended use. Reasonably solid for a non-commercial educational podcast.",
    s3: "Fair use doesn't cleanly apply to AI-generated content. More importantly: using a simulation when the real thing exists raises scientific credibility concerns beyond the legal question."
  },
  artificer: "Your argument has some traction on purpose if you're using the music to illustrate a design concept, but the creative nature of the work and the sponsored context of your show make this a difficult fair use case. Finding a CC-licensed or properly licensed alternative is recommended."
};

export const RESOURCES = [
  {
    name: "Free Music Archive",
    url: "freemusicarchive.org",
    description: "A massive library of CC-licensed music across all genres. Excellent for finding high-quality scores and background tracks."
  },
  {
    name: "Freesound",
    url: "freesound.org",
    description: "The primary source for CC-licensed sound effects, field recordings, and ambient textures."
  },
  {
    name: "Wikimedia Commons",
    url: "commons.wikimedia.org",
    description: "A vast collection of public domain and CC-licensed media, including historical recordings and speeches."
  },
  {
    name: "Blue Dot Sessions",
    url: "sessions.blue",
    description: "High-quality, textured music library for podcasters. Offers both CC BY-NC tracks and simple paid licenses for commercial/sponsored use."
  }
];
