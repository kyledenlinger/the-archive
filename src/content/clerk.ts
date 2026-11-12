import { ClerkContent } from './types';

// The Clerk's lines outside the stops, and the shelf where your work ends up (revision spec §7).
// Fate: `pulled` and `asPlanned` are paragraphs; the other four are single sentences that join, in the order
// underCloud, late, smaller, compromised, into one paragraph. Every scene ends with a full stop, because the
// real run appends one `outsideDetail` sentence after a space.

export const clerk: ClerkContent = {
  briefIntro:
    'Here’s what you came for, then. I’ve put it all on one card: what you’re making, who’s waiting on it, when it’s due, and the three things you need from these shelves. At the bottom is where your project stands before you’ve touched anything. That part tends to change. Sorry in advance.',
  coachInvite:
    'Before you decide, would you mind if we thought this one through together? There’s a test for exactly this question, called fair use. It has four parts, and I’ll tell you what each one is really asking. It won’t hand you a yes or a no, I’m afraid, but you’ll have a much better idea of where you stand.',
  shelf: {
    intro: [
      'That’s the last of it. Your cart’s full, and your own work is out there doing whatever it does now. Before you go, there’s one more shelf I’d like to show you, if you don’t mind a short walk.',
      'I probably should have mentioned this earlier. The Archive holds everything, and that includes a few things that haven’t happened yet. Don’t ask me how they’re cataloged. This shelf is where your project ends up, some years from now. I can’t change what’s on it, and honestly, neither can you. But you can look.',
    ],
    fate: {
      chronicler: {
        pulled:
          'The film premiered at the festival, and for a few months it went everywhere a short documentary can go. Then a rights claim arrived over material you’d used, and the festival pulled it from its online program while you sorted it out. The copy on this shelf is the re-edit: shorter, with a black card where one sequence used to be, and a line in the credits about what you could no longer show.',
        asPlanned:
          'The film premiered at the festival on the night it was scheduled, with everything on screen cleared. A few people from town drove in to see it, and one of them stood up afterward to say her house was in the second shot. It’s on this shelf in a festival case with the program tucked inside, though the streaming service you hoped for never called.',
        underCloud:
          'It screened, but a review asked how you’d gotten some of that footage, and the question followed the film to every panel you sat on.',
        late: 'It missed the main deadline and screened as a late addition on the festival’s last morning, to a mostly empty room.',
        smaller: 'With the money gone, it went out as a shorter cut, without the archival sequence you’d planned for the middle.',
        compromised:
          'The film that screened wasn’t quite the one you set out to make, because the shots you couldn’t clear were replaced with ones you could, and the story bent around them.',
      },
      herald: {
        pulled:
          'The campaign launched, and for a few weeks your posts were everywhere on campus. Then a rights complaint reached the sponsor, and the sponsor asked your organization to take down every post with its name on it. What’s on this shelf is the campaign with holes in it: a grid of posts with gaps where the sponsored ones used to be, and an apology you wrote and posted yourself.',
        asPlanned:
          'The spring campaign launched on schedule, with a post every few days, and the events filled up. The sponsor renewed for next year. It’s on this shelf as a printed grid of every post, though most of them were scrolled past in a second and are already hard to find online.',
        underCloud:
          'It ran, but a thread went around asking where some of your images came from, and the comments under the sponsor’s posts never quite recovered.',
        late: 'The campaign launched a week late, after the first two events had already come and gone without a post.',
        smaller: 'With the budget gone, the campaign ran on fewer posts than planned, mostly reshares of what you’d already made.',
        compromised: 'The posts that went up were the ones the sponsor approved, which weren’t always the ones you would have made.',
      },
      naturalist: {
        pulled:
          'The videos went up every Friday, and your audience grew. Then a rights claim hit one of them, the platform took it down, and a strike sat on your channel for three months. On this shelf the month’s work has a gap in it, and a pinned comment explaining why one video is gone.',
        asPlanned:
          'Every Friday something new went up, and every piece got the science right. The salamander video became the one teachers pass around. It’s on this shelf with the comments printed out, the corrections and the thank-yous, though the ad revenue that paid for it all was smaller than you’d hoped.',
        underCloud:
          'It posted on schedule, but a well-known science account questioned your sources in a video of its own, and your comments filled with people asking how you’d made yours.',
        late: 'You missed two Fridays in a row, and your audience noticed, the way you said they would.',
        smaller: 'With the money gone, the month’s videos went out shorter, with fewer images than you’d planned.',
        compromised:
          'The videos that went up were accurate, but they weren’t the ones you’d planned, and the salamander video explains less than you wanted it to.',
      },
      artificer: {
        pulled:
          'The zine and the prints made it to the market, and your table sold out by noon. A week later, a rights holder saw the zine and wrote to the market organizers, who asked you to stop selling it. On this shelf is the reprint, with one page pasted over in plain paper, and the rest of the first edition boxed up underneath.',
        asPlanned:
          'The zine and the prints were on your table at the campus market, on time and laid out exactly as you’d planned. Your regulars bought them, and a few strangers did too. There’s a copy of each on this shelf, though the run was small and most of them are already gone.',
        underCloud:
          'Your table was busy, but someone posted a side-by-side of your collage and its sources, and a few regulars walked past without stopping.',
        late: 'The print shop got your files late, so the prints arrived halfway through the market and you sold them out of the box.',
        smaller: 'With the money gone, the run was smaller than planned, with fewer copies of the zine and only two of the prints.',
        compromised:
          'The pieces on your table were built from what you could use rather than what you’d pictured, and the centerfold isn’t the one you saw in your head.',
      },
      bard: {
        pulled:
          'The EP came out on release day, and the streams started coming in. Then a rights claim hit one of the tracks, your distributor pulled it from every service, and the EP shrank to three songs while you sorted it out. On this shelf is the reissue, with a different track in that slot and the old version nowhere to be found.',
        asPlanned:
          'The EP came out on the day you set, all four tracks, with every sound on it cleared. Some people found it, and a few of them play it a lot. It’s on this shelf with a streaming statement that shows a few thousand plays and a payout that wouldn’t cover lunch.',
        underCloud:
          'It came out, but someone posted a video tracing your samples, and the comments decided you’d taken more than you’d given.',
        late: 'It came out weeks after the date you set, once your distributor had moved it to the next release window.',
        smaller: 'With the money gone, it came out as two tracks instead of four.',
        compromised: 'The tracks that came out were built from what you could clear, and they sound like it, at least to you.',
      },
      conjurer: {
        pulled:
          'The game launched on the day you announced, and the first players left good reviews. Then a rights complaint reached itch.io, the page came down, and it stayed down until you’d swapped out the assets in question. On this shelf is version 1.1, with a changelog that starts with what you had to remove.',
        asPlanned:
          'The game launched on the day you announced, and the players following your devlog showed up. A few hundred people solved the mystery, and a few dozen wrote to tell you how. Its itch.io page is on this shelf, printed out, though most players never reached the last case.',
        underCloud:
          'It launched, but a thread on a game forum picked apart where your assets came from, and the reviews started mentioning it.',
        late: 'It launched weeks after the date on your itch.io page, and some of the people who’d been waiting had moved on.',
        smaller: 'With the money gone, it launched with fewer cases than you’d planned, and the last one is a locked door marked “Coming soon.”',
        compromised:
          'The game that launched was built from what you could use, and the detective at its center isn’t quite the one you’d imagined.',
      },
    },
    scenes: {
      chronicler: {
        arr: 'Next to your film is a contract from a streaming service, which licensed it for a small fee because every right was yours to sell. Behind that is an email from a teacher in your town who wanted to stream it for her class, couldn’t reach you in time, and showed something else. A playwright’s stage adaptation sits in a folder marked ON HOLD: your heirs couldn’t agree on the rights, and under all rights reserved the film stays protected until 70 years after you die. And on the bottom shelf is a copy you never authorized, retitled and running ads on a channel you’d never heard of, earning money for someone who wasn’t there for any of it.',
        'cc-by':
          'Your film has company: clips of it in three other documentaries, on a local history site, and in a school board presentation, each with your name in the credits. One of them is a political ad that uses your flood footage to argue for something you’d never vote for, credited to you in small letters, which your license allowed. Next to it is a copy someone uploaded with your credits cut off entirely, which it didn’t. You got the screenings and a few hundred thank-you emails, and you didn’t get paid for any of it.',
        'cc-by-sa':
          'Beside your film is a small family of works: a longer documentary that reused your interviews, a museum installation, and a student remix, each labeled CC BY-SA like yours, because your license required it. A streaming service looked at your film too and walked away, unwilling to put its own edit under the same license. Somewhere in the middle is a cut-down version with your name gone and an all-rights-reserved notice on it, as if someone else had made it. That one broke your terms twice.',
        'cc-by-nc':
          'Your film turns up in classroom after classroom, and in a library’s flood-anniversary program, all free and all credited. A streaming service wanted it and couldn’t use it under your license; it sent one email asking about a separate deal and then moved on to something easier. Tucked behind the others is a DVD someone sold at a craft fair, burned from your festival screener, with your name on the case and none of the money coming to you. Selling it was never allowed under your terms.',
        cc0: 'Your film traveled further than anything else on this shelf. Pieces of it turn up in news segments, in a flood-preparedness video, and in other people’s documentaries, and the historical society uses it to explain the flood to visitors. Most of those copies don’t mention you. The one that hurts is a documentary about your town that uses your interviews and thanks everyone in its credits except you. Under CC0 that’s allowed, because you gave up the right to require credit. It stings anyway.',
      },
      herald: {
        arr: 'Your raccoon is here, with a fee from a mug company that asked first and paid. A student newspaper wanted it for a finals-week story, couldn’t get an answer from you in time, and drew its own. A few shelves down is the clothing brand’s ad with the near-copy of your raccoon, same joke, slightly different colors, made without your permission. It sold more shirts than your graphic ever got likes.',
        'cc-by':
          'Your raccoon has spread to other campuses with your handle in the corner: on a study-hall flyer, a dorm sticker, and a counseling center’s post about sleep. A brand put it in an ad for energy drinks, credited to you, which your license allowed, and now people tag you in complaints about the drink. A meme account cropped your handle out and posted it to two million followers, which your license didn’t allow, and every repost of that one credits the meme account.',
        'cc-by-sa':
          'A whole set of raccoons sits beside yours: other students’ remixes, each shared under CC BY-SA, because adapting yours meant they had to. A snack brand wanted it for a campaign, read the ShareAlike terms, and went with a cartoon squirrel instead. Near the end of the shelf is a sticker pack someone sells online with your raccoon redrawn, with no credit and no license, outside your terms on both counts.',
        'cc-by-nc':
          'Your raccoon turns up on campus posters, in the library’s finals-week kit, and in a nonprofit’s mental-health campaign, all free and all credited. A greeting-card company wanted it, couldn’t use it under your terms, asked about a deal, and never followed up. Then there’s the T-shirt in a shop window near campus, printed with your raccoon and sold at a markup, without your permission and without your name.',
        cc0: 'Your raccoon is everywhere: in emoji packs, a campus mascot contest, a textbook cover, and a brand’s ad. Hardly anyone knows you drew it. When the raccoon got its own fan account with a hundred thousand followers, the bio said “artist unknown.” Under CC0 that’s allowed, because you gave up the right to require credit. You read that bio more than once anyway.',
      },
      naturalist: {
        arr: 'Your fox photo is here with a check from a calendar publisher, which asked first and paid well. A wildlife rescue wanted it for a fundraiser poster, couldn’t afford a license, and used a blurrier shot instead. Behind it is a stack of copies from sites that took it without asking, cropped and filtered, and one of them is on a stock site, selling licenses to your own photo.',
        'cc-by':
          'Your fox has leapt into textbooks, park signs, and a dozen other channels’ videos, each with your name in the caption. One of those videos uses it to argue that foxes are pests that should be culled, credited to you, which your license allowed. Next to it is a print someone sells online with your watermark cropped off and no credit, which it didn’t.',
        'cc-by-sa':
          'Your fox anchors a small shelf of open work: a field guide, an encyclopedia article, and a student’s illustrated remix, all shared under CC BY-SA like yours. A nature magazine wanted it for a feature but wouldn’t put its pages under ShareAlike terms, so it hired a photographer instead. At the end is a wallpaper app that bundled your fox with no credit, outside your terms.',
        'cc-by-nc':
          'Your fox is in classrooms, nature centers, and a nonprofit’s guide to winter wildlife, free and credited. A calendar company wanted it and needed a separate commercial license from you, and its email sat unanswered until the deadline passed. Further down is a jigsaw puzzle with your fox on the box, sold in a gift shop, and nobody asked you for anything.',
        cc0: 'Your fox traveled further than any photo you’ve taken: onto museum walls, into a children’s book, onto a nature app’s loading screen and a million phone backgrounds. Almost none of them say who took it. The children’s book credits “stock photo.” Under CC0 that’s allowed, because you gave up the right to require credit. You bought a copy of the book anyway, and it still stings to open it.',
      },
      artificer: {
        arr: 'Your print is here, with a note from a gallery that asked to show it and paid a fee. A high-school art teacher wanted it for a lesson handout, couldn’t find a way to ask, and left it out. On the floor beside it is a fast-fashion T-shirt with your collage across the front, sold by the thousand, without your permission and without a cent coming to you. It cost less than one of your prints.',
        'cc-by':
          'Your print has been reused in other people’s zines, on a band’s poster, and in a design blog’s roundup, with your name on each. A political group used it on a flyer for a cause you’d never support, credited to you, which your license allowed. Then there’s the shop that printed it on T-shirts with no credit at all, which your license didn’t.',
        'cc-by-sa':
          'Your print sits at the head of a family of collages, other artists’ remixes of it, each shared under CC BY-SA as your license required. A poster company wanted to sell it but wouldn’t share its versions on those terms, so it passed. Somewhere in the stack is a version with your name scraped off and someone else’s signature in the corner, which is outside your terms however you look at it.',
        'cc-by-nc':
          'Your print turns up in art classes, at a library zine fest, and in a community center’s mural plans, free and credited. A home-goods store wanted it for throw pillows and couldn’t use it without a separate deal with you, which never came together. And then there are the T-shirts on the fast-fashion site, about as commercial as anything gets, with no credit at all.',
        cc0: 'Your print is the most copied thing on this shelf: on tote bags, on wallpaper, in other people’s collages, and on a mood board for a car ad. Most of them don’t mention you. One shop sells a print of it signed by somebody else. Under CC0, selling it without credit is allowed, because you gave up the right to require credit, and claiming to have made it isn’t a copyright question at all. None of that makes the signature easier to look at.',
      },
      bard: {
        arr: 'Your track is here with a sync fee from an independent filmmaker who asked first and paid. A student wanted it for a dance recital video, couldn’t get permission in time, and used something else. Next to it is a brand’s online ad with your track under it, used without asking and without credit, and the ad has more views than your track has plays.',
        'cc-by':
          'Your track has been sampled, remixed, and played under a hundred videos, with your name in the descriptions. A brand used it in an ad and credited you in the fine print, which your license allowed, and you heard it every time you opened an app for a month. There’s also a remix that got bigger than your original, with your name missing from it, which your license didn’t allow.',
        'cc-by-sa':
          'A family of tracks sits beside yours: remixes and covers, all shared under CC BY-SA, because building on yours meant they had to be. A game studio wanted it for a soundtrack but wouldn’t put its own music under the same license, so it walked away. At the end of the row is a remix uploaded with no credit and all rights reserved stamped on it, outside your terms.',
        'cc-by-nc':
          'Your track plays in student films, podcasts, and on a community radio show, free and credited. A filmmaker wanted it for a feature with a distribution deal, which is commercial, so it needed a separate license from you, and the money for that never came through. Further along is a brand’s ad with your track under it, used without asking and without credit, outside your terms on both counts.',
        cc0: 'Your track is all over the place: under travel videos, on a game’s menu screen, and on a study playlist with a million followers. Almost none of them say who made it. The playlist lists it under someone else’s name. Under CC0, using it without credit is allowed, because you gave up the right to require credit. Hearing it in a café under another name stings anyway.',
      },
      conjurer: {
        arr: 'Your game is here, with a small publisher’s offer you could negotiate because every right was still yours. A modder wanted to make a fan sequel, asked, and you never found time to answer. On another storefront, someone is still selling your game under their own name, unchanged and without permission, and it has more reviews than yours.',
        'cc-by':
          'Your game has been forked, translated, and turned into a classroom puzzle, with your name on each credits screen. One fork added paid extras and got popular, credited to you, which your license allowed. Another copy sits on a storefront under a stranger’s name with no credit at all, which it didn’t.',
        'cc-by-sa':
          'Your game sits among its forks: translations, a mod pack, and a fan’s sequel, all shared under CC BY-SA because your license required it. A console publisher wanted to port it but wouldn’t release its port on the same terms, so it walked away. Somewhere on another storefront is a copy with your name stripped out and a price tag on it, outside your terms.',
        'cc-by-nc':
          'Your game is played in game-design classes and passed around by players, free and credited. A console publisher wanted it and couldn’t use it under your terms without a separate deal, which never came together. Meanwhile someone is charging for an unchanged copy on another storefront, under their own name, outside your terms on both counts.',
        cc0: 'Your game has gone further than you ever pushed it: bundled into collections, reskinned, remade with new art, and sold for a few dollars on storefronts you’ve never heard of. Most of them don’t say who made the original. The best-selling version doesn’t mention you anywhere. Under CC0 that’s allowed, because you gave up the right to require credit. Reading its reviews still stings.',
      },
    },
    outsideDetail: {
      takedown:
        'Where the copy you reported used to be, there’s a gap on the shelf, and a little further along, another one has turned up.',
      credit: 'One copy now carries your name in small print, added after you asked.',
      negotiate: 'A short contract is tucked in beside it, signed by the one who went outside your terms and then came to the table.',
      'let-go': 'The copies you let go have multiplied along the shelf, and there seem to be a few more every time you look.',
    },
    lastWord: {
      chronicler: {
        intact: 'I wanted people to remember that week the way the people who lived through it do. I think they will.',
        compromised: 'It’s not the film I pictured. It’s the film I could clear, and most days that’s close enough.',
        lost: 'I made a film about the flood. I’m still not sure it’s the one I meant to make.',
      },
      herald: {
        intact: 'People stopped scrolling for something I made. That was the whole point.',
        compromised: 'Half of it was mine and half was what would get approved. I can still tell which half is which.',
        lost: 'My feed’s full of posts I made, and I’m not sure many of them sound like me.',
      },
      naturalist: {
        intact: 'People understand something about the living world that they didn’t before. That was the job.',
        compromised: 'It’s accurate. It’s just not as good as it could have been, and I know exactly where.',
        lost: 'Everything I posted was true. Not much of it was what I wanted to say.',
      },
      artificer: {
        intact: 'Everything on that table came out of my hands and my head. That’s what I sell.',
        compromised: 'The cuts show if you know where to look, and I know where to look.',
        lost: 'It’s my name on the table. I’m not sure it’s my work.',
      },
      bard: {
        intact: 'Every sound on that EP is one I chose. That still feels like something.',
        compromised: 'It’s my EP, built out of the sounds I was allowed to use.',
        lost: 'When I play it, I hear everything I had to take out.',
      },
      conjurer: {
        intact: 'It’s the game I wanted to make, and a few hundred people solved my mystery.',
        compromised: 'It’s a good game. It isn’t quite the one in my notebook.',
        lost: 'I shipped a game. I’m still working out whose idea it was by the end.',
      },
    },
    othersOffer:
      'Would you like to see how it might have gone? Same project, same choices along the way, just a different license on your own work. I can show you any of the others. It’s only looking, I promise. Nothing on your shelf moves.',
    altFrame: 'What might have been: {license}.',
    backToYours: 'Back to your shelf',
    closingLine:
      'Well, that’s your shelf. Every decision on it was yours, and every one of them cost something, even the ones that paid off. I’m told that’s more or less what deciding is. Your project’s waiting for you at the front.',
    reviewBy: {
      date: '2027-11-01',
      note: 'Shelf scenes: confirm the U.S. term for works by individual creators is still life plus 70 years (chronicler arr), and that the CC license descriptions still match the current 4.0 licenses.',
    },
  },
};
