/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ShoppingCart, 
  ChevronRight, 
  Info, 
  X, 
  User, 
  Search, 
  Scale, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { 
  CHARACTERS, 
  SCENARIOS, 
  FAIR_USE_QUESTIONS, 
  FAIR_USE_ASSESSMENTS,
  RESOURCES,
  CharacterType, 
  GameState 
} from './constants';

const INITIAL_STATE: GameState = {
  screen: 'framing',
  character: null,
  cart: [],
  clerkScore: 0,
  scenarioIndex: 0,
  fuScenario: null,
  fuResponses: [],
  fuStep: 0,
};

export default function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isRefOpen, setIsRefOpen] = useState(false);

  // Helper to update state
  const updateState = (updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Persistent UI: Reference Panel
  const ReferencePanel = () => (
    <>
      <button 
        onClick={() => setIsRefOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-amber-900/80 text-amber-100 p-3 rounded-l-xl border-l border-y border-amber-700/50 shadow-xl z-40 hover:bg-amber-800 transition-colors flex flex-col items-center gap-2"
        id="ref-panel-trigger"
      >
        <BookOpen size={20} />
        <span className="[writing-mode:vertical-rl] text-xs font-medium tracking-widest uppercase">Reference</span>
      </button>

      <AnimatePresence>
        {isRefOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRefOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-stone-900 border-l border-amber-900/30 shadow-2xl z-50 overflow-y-auto p-8 text-amber-50/90"
            >
              <div className="flex justify-between items-center mb-8 border-b border-amber-900/20 pb-4">
                <h2 className="text-2xl font-serif italic text-amber-200">The Reference Desk</h2>
                <button onClick={() => setIsRefOpen(false)} className="text-amber-400 hover:text-amber-200 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8 font-serif">
                <section>
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Copyright</h3>
                  <p className="text-sm leading-relaxed">
                    When someone creates an original work, copyright attaches automatically. The creator controls how it can be used, copied, shared, or modified. You need permission — a license — to use it, unless an exception like fair use applies.
                  </p>
                </section>

                <section>
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Public Domain</h3>
                  <p className="text-sm leading-relaxed">
                    Works where copyright has expired or been waived. Anyone can use them for any purpose. Works enter the public domain when copyright expires, when the creator dedicates them, or when created by the US federal government.
                  </p>
                </section>

                <section>
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Creative Commons</h3>
                  <p className="text-sm leading-relaxed mb-4">
                    Standardized licenses that let creators share work with specific permissions built in. A CC license doesn't mean "do whatever you want" — it means "here's what I'm allowing, with these conditions." Always read the specific terms.
                  </p>
                  <div className="bg-stone-800/50 p-4 rounded-lg border border-amber-900/20 space-y-2">
                    <p className="text-xs"><strong>BY</strong> — Credit the creator (required in all CC licenses)</p>
                    <p className="text-xs"><strong>NC</strong> — NonCommercial use only</p>
                    <p className="text-xs"><strong>ND</strong> — NoDerivatives — don't modify it</p>
                    <p className="text-xs"><strong>SA</strong> — ShareAlike — your work must use the same license</p>
                    <p className="text-xs"><strong>CC0</strong> — No rights reserved. Completely open.</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Fair Use</h3>
                  <p className="text-sm leading-relaxed">
                    A legal doctrine allowing use of copyrighted material without permission in certain circumstances — commentary, criticism, education, parody, journalism. Not a free pass. A case-by-case analysis weighing four factors.
                  </p>
                </section>

                <section>
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">The Layer Distinction</h3>
                  <p className="text-sm leading-relaxed">
                    A piece of audio can contain multiple separate rights. A musical composition (melody, lyrics, structure) and a specific recording of it are legally distinct. The composition can be in the public domain while the recording is still under copyright.
                  </p>
                </section>

                <section>
                  <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">Resource Guide</h3>
                  <div className="space-y-4">
                    {RESOURCES.map((res, i) => (
                      <div key={i} className="bg-stone-800/50 p-4 rounded-lg border border-amber-900/20">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-amber-200 font-bold text-sm">{res.name}</h4>
                          <span className="text-[10px] text-amber-500 font-mono">{res.url}</span>
                        </div>
                        <p className="text-xs text-amber-50/70 leading-relaxed">{res.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );

  // Persistent UI: Cart Indicator
  const CartIndicator = () => {
    if (state.screen === 'framing' || state.screen === 'character-selection') return null;
    return (
      <div className="fixed top-0 left-0 w-full bg-stone-950/80 backdrop-blur-md border-b border-amber-900/20 py-3 px-6 z-30 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-amber-200/60 uppercase tracking-[0.2em] text-[10px] font-bold">
            <User size={12} />
            <span>{state.character ? CHARACTERS[state.character].name : 'Initializing...'}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full border ${i < state.cart.length ? 'bg-amber-400 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'border-amber-900/40'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
            <ShoppingCart size={14} />
            <span>{state.cart.length}/4 TRACKS</span>
          </div>
        </div>
      </div>
    );
  };

  // Screens
  const FramingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-serif italic text-amber-100 mb-8 tracking-tight">The Archive</h1>
        <div className="space-y-6 text-lg text-amber-50/80 font-serif leading-relaxed italic">
          <p>A cooperative text RPG about copyright, fair use, and the ethics of sound.</p>
          <p>Somewhere between a library and a labyrinth, The Archive holds every piece of recorded audio ever made. Music, speeches, field recordings, sound effects, oral histories, birdsong, static, silence. All of it is here. None of it is labeled.</p>
          <p>You and your partner are podcast producers on a deadline. You need to fill your Podcast Cart with four usable tracks before your episode goes live. The Archive has everything you could ever want.</p>
          <p>The problem: "everything you could ever want" is not the same as "everything you're allowed to use."</p>
        </div>
        <button 
          onClick={() => updateState({ screen: 'character-selection' })}
          className="mt-12 px-10 py-4 bg-amber-900 text-amber-100 rounded-full font-serif text-xl hover:bg-amber-800 transition-all hover:scale-105 shadow-2xl border border-amber-700/50 flex items-center gap-3 mx-auto"
          id="enter-archive-btn"
        >
          Enter The Archive <ChevronRight />
        </button>
      </motion.div>
    </div>
  );

  const CharacterSelection = () => (
    <div className="min-h-screen py-24 px-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-serif italic text-amber-100 mb-4">Choose Your Focus</h2>
        <p className="text-amber-50/60 font-serif">Select the character that defines your podcast's mission.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.entries(CHARACTERS) as [CharacterType, typeof CHARACTERS.inquisitor][]).map(([key, info]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateState({ character: key, screen: 'onboarding' })}
            className="bg-stone-900/50 border border-amber-900/20 p-8 rounded-2xl text-left hover:border-amber-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <User size={80} />
            </div>
            <h3 className="text-amber-400 font-bold tracking-widest text-sm mb-2">{info.name}</h3>
            <div className="text-amber-100 text-xl font-serif italic mb-4">— {info.genre}</div>
            <p className="text-amber-50/70 text-sm leading-relaxed font-serif">{info.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const Onboarding = () => {
    const [step, setStep] = useState(0);

    const clerkDialogue = [
      {
        text: "Ah. New arrivals.",
        clerk: true,
      },
      {
        text: "He has a clipboard. He consults it, nods at nothing, and tucks it under his arm. 'Don't worry — everyone gets a little turned around in here. The labeling system is... well. There isn't one, really. But that's why you have me. I know where everything is.'",
      },
      {
        text: "He pauses. 'Whether you're allowed to take it — that's a slightly different question, and honestly not one I'm always in a position to answer definitively.' He extends a hand. His fingers are ink-stained. 'They call me the Clerk. I'll show you around.'",
      }
    ];

    if (step < 3) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {step === 0 && (
                <div className="space-y-6 font-serif text-amber-50/80 italic text-lg leading-relaxed">
                  <p>The Archive is quiet. Not peacefully quiet — the kind of quiet that comes from very large spaces with no one in them.</p>
                  <p>The shelves go up further than you can see. The tracks are not labeled. There is no map.</p>
                  <p>You are looking for a way in when something moves.</p>
                  <p>Small. Fast. Wearing a suit that has seen better decades.</p>
                  <p>He stops. Looks at you. Looks at your Podcast Cart. Looks back at you.</p>
                </div>
              )}
              
              {clerkDialogue[step].clerk ? (
                <div className="clerk-box bg-stone-800/40 border-l-4 border-amber-600 p-6 italic font-serif text-amber-100 text-xl">
                  <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-2">The Clerk</div>
                  "{clerkDialogue[step].text}"
                </div>
              ) : (
                <div className="font-serif text-amber-50/80 italic text-lg leading-relaxed">
                  {clerkDialogue[step].text}
                </div>
              )}

              <button 
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 text-amber-400 font-serif text-lg hover:text-amber-200 transition-colors ml-auto"
              >
                Continue <ArrowRight size={20} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-3xl mx-auto space-y-12">
          <div className="space-y-6">
            <button 
              onClick={() => setStep(4)}
              className="w-full text-left p-6 rounded-xl border border-amber-900/30 hover:bg-amber-900/10 hover:border-amber-500/50 transition-all font-serif text-amber-100"
            >
              A) "Who authorized you to be in here?"
            </button>
            <button 
              onClick={() => setStep(5)}
              className="w-full text-left p-6 rounded-xl border border-amber-900/30 hover:bg-amber-900/10 hover:border-amber-500/50 transition-all font-serif text-amber-100"
            >
              B) "We'll take all the help we can get."
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-3xl mx-auto space-y-8">
        <div className="clerk-box bg-stone-800/40 border-l-4 border-amber-600 p-6 italic font-serif text-amber-100 text-xl">
          <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-2">The Clerk</div>
          {step === 4 ? (
            "Authorized. Interesting word. I've been here longer than most of the collection. I know where the 1930s radio broadcasts are — both the documented ones and the ones that got digitized informally. I know which sections are monitored and which aren't. The authorization question is, in my view, a bit of a red herring. But I understand the instinct. Are you coming?"
          ) : (
            "Excellent attitude. Very practical. Most people who come in here spend the first twenty minutes trying to figure out the system before realizing there isn't one. You're already ahead. Let's go."
          )}
        </div>
        <div className="font-serif text-amber-50/80 italic text-lg leading-relaxed space-y-4">
          <p>You follow The Clerk deeper into the Archive. He talks as he walks.</p>
          <div className="clerk-box bg-stone-800/40 border-l-4 border-amber-600 p-6 italic font-serif text-amber-100 text-lg">
            "Here's what you need to understand. Everything in here exists. Everything can be heard. Accessibility, however, is not the same as permission. Some of these tracks are copyrighted — the creator controls who uses them and how. Some have entered the public domain. Some have Creative Commons licenses. And some are simply... unclear. Which is where it gets interesting."
          </div>
          <p>He smiles. It is the smile of someone who finds legal ambiguity genuinely exciting.</p>
          <div className="clerk-box bg-stone-800/40 border-l-4 border-amber-600 p-6 italic font-serif text-amber-100 text-lg">
            "Fair use is the doctrine that allows you to use copyrighted material without permission — in certain circumstances. It's not a free pass. It's a case-by-case analysis. But it's real, and it's powerful, and most people don't use it nearly as often as they could. Let's see if you can do better."
          </div>
        </div>
        <button 
          onClick={() => updateState({ screen: 'scenario' })}
          className="px-10 py-4 bg-amber-900 text-amber-100 rounded-full font-serif text-xl hover:bg-amber-800 transition-all shadow-2xl border border-amber-700/50 flex items-center gap-3 mx-auto mt-8"
        >
          Into the Archive <ChevronRight />
        </button>
      </div>
    );
  };

  const ScenarioScreen = () => {
    const scenario = SCENARIOS[state.scenarioIndex];
    const [subScreen, setSubScreen] = useState<'intro' | 'setup' | 'choices' | 'investigation' | 'outcome'>('intro');
    const [investigationResult, setInvestigationResult] = useState<any>(null);
    const [outcome, setOutcome] = useState<any>(null);

    const handleChoice = (choice: string) => {
      if (choice === 'A') {
        if (state.scenarioIndex === 0) {
          const note = "Track added without license. No creator identified. Default copyright applies — all rights reserved unless proven otherwise. Use carries risk of takedown or infringement claim.";
          setOutcome({ note, score: 0 });
          setSubScreen('outcome');
        } else if (state.scenarioIndex === 1) {
          setSubScreen('outcome'); // Needs confirmation subscene logic
        } else if (state.scenarioIndex === 2) {
          const note = `AI-generated ${state.character} track selected. Platform terms reviewed — pair determined use is permitted under platform terms. Copyright ownership of AI-generated audio is unsettled in law. No human creator to credit. Platform terms govern use rather than standard copyright.`;
          setOutcome({ note, score: 1 });
          setSubScreen('outcome');
        } else if (state.scenarioIndex === 3) {
          // Scenario 4 Choice A logic
          const resources = { inquisitor: 'Wikimedia Commons', chronicler: 'Wikimedia Commons', bard: 'Musopen', conjurer: 'Freesound', artificer: 'University Archive' };
          const resource = resources[state.character as keyof typeof resources] || 'Open Source';
          const notes = {
            inquisitor: `PD composition (1934 jazz standard) — alternative CC-licensed recording sourced from Wikimedia Commons. Composition freely usable; this recording is CC BY. Attribution required.`,
            chronicler: `PD speech text — alternative PD recording of same speech sourced from Wikimedia Commons. Both the words and this recording are freely usable. Documented provenance.`,
            bard: `PD classical composition — alternative CC-licensed performance sourced from Musopen, which commissions CC recordings of PD classical works specifically to solve this problem. Attribution required.`,
            conjurer: `PD folk melody — alternative CC0 recording of same melody sourced from Freesound (contemporary folk musician, CC0 release). Composition and this recording both freely usable.`,
            naturalist: `Archival recording of extinct species — educational use permission requested from Cornell Macaulay Library. Pending approval. Attribution required. Note: this is the only known recording of this species; the petition is both a legal step and an act of preservation.`,
            artificer: `PD composition (1952 lecture) — alternative CC-licensed recording of same lecture sourced from university archive. Composition freely usable; this recording is CC BY. Attribution required.`
          };
          setOutcome({ note: notes[state.character as keyof typeof notes], score: 2 });
          setSubScreen('outcome');
        }
      } else if (choice === 'B') {
        if (state.scenarioIndex === 0) {
          const isDeadEnd = Math.random() > 0.45;
          setInvestigationResult(isDeadEnd ? 'dead-end' : 'found-creator');
          setSubScreen('investigation');
        } else if (state.scenarioIndex === 1) {
          const note = "CC licensed track — permission requested from creator. Use on hold pending response. Flagged for follow-up. Note: most CC-licensed creators want their work used — asking directly often works.";
          setOutcome({ note, score: 2 });
          setSubScreen('outcome');
        } else if (state.scenarioIndex === 2) {
          const notes = {
            inquisitor: "CC BY licensed documentary score from Free Music Archive. Clear rights, human composer, attribution required. No other conditions.",
            chronicler: "Period recording sourced from Internet Archive. CC-licensed, documented provenance, verifiable historical context. Attribution required.",
            bard: "CC-licensed recording from Free Music Archive selected as alternative. Note: for music analysis, a strong fair use argument for the original may be available — see Scenario 3 Bard option E.",
            conjurer: "Custom soundscape assembled from CC0 sources on Freesound. Full rights over assembled work. No attribution required. No restrictions.",
            naturalist: "Field recording sourced from Macaulay Library at Cornell, non-commercial educational use terms. Real habitat, documented, scientifically verifiable. Attribution required.",
            artificer: "Blue Dot Sessions (sessions.blue) track selected. CC BY-NC license applies. Note: for sponsored podcasts, a commercial license is required; Blue Dot offers affordable options for this specific use case."
          };
          setOutcome({ note: notes[state.character as keyof typeof notes], score: 2 });
          setSubScreen('outcome');
        } else if (state.scenarioIndex === 3) {
          const notes = {
            inquisitor: "Rights holder (Blue Note/Capitol Music Group) contacted for permission to use 1955 recording. Archival jazz labels sometimes grant educational use. On hold pending response.",
            chronicler: "Rights holder (CBS/Paramount Global) contacted for permission to use 1947 recording for educational podcast. Broadcasting archives sometimes grant non-commercial use. On hold.",
            bard: "Rights holder (Deutsche Grammophon/Universal) contacted for permission to use 2019 recording for analytical podcast. Labels sometimes grant press or educational use. On hold.",
            conjurer: "Rights holder (Folkways/Smithsonian) contacted for permission. Smithsonian Folkways has educational use processes. On hold.",
            naturalist: "Cornell Lab of Ornithology contacted for permission. Approached both as rights inquiry and educational access request. On hold.",
            artificer: "University archive contacted for permission to use 1998 recording. Archives sometimes grant educational or research use. On hold pending response."
          };
          setOutcome({ note: notes[state.character as keyof typeof notes], score: 2 });
          setSubScreen('outcome');
        }
      } else if (choice === 'C') {
        if (state.scenarioIndex === 1) {
          const note = "CC0 track selected as alternative. No rights reserved. No conditions. Free for any use including commercial, modification, or redistribution.";
          setOutcome({ note, score: 2 });
          setSubScreen('outcome');
        } else if (state.scenarioIndex === 2) {
          const note = "AI-generated track flagged as uncertain. Ownership questions unresolved. Pair chose to proceed without fully resolving. Flagged for review.";
          setOutcome({ note, score: 1 });
          setSubScreen('outcome');
        } else {
          updateState({ screen: 'fair-use-analysis', fuScenario: state.scenarioIndex, fuStep: 0, fuResponses: [] });
        }
      } else if (choice === 'D') {
        if (state.scenarioIndex === 0) {
          const notes = {
            inquisitor: "CC BY licensed alternative track selected from Free Music Archive. Free to use for any purpose with attribution. No restrictions on commercial use or modification.",
            chronicler: "CC BY-SA historical folk recording sourced from Wikimedia Commons. Documented provenance. Attribution required; ShareAlike applies if used in derivative works.",
            bard: "CC BY licensed alternative track selected from Free Music Archive. Free to use for any purpose with attribution. No restrictions on commercial use or modification.",
            conjurer: "CC BY licensed alternative track selected from Free Music Archive. Free to use for any purpose with attribution. No restrictions on commercial use or modification.",
            naturalist: "CC BY licensed field recording from Freesound. Comparable ecosystem, documented location, human recordist, attribution required.",
            artificer: "CC BY licensed electronic track selected from Free Music Archive. Free to use for any purpose with attribution. No restrictions on commercial use or modification."
          };
          setOutcome({ note: notes[state.character as keyof typeof notes], score: 2 });
          setSubScreen('outcome');
        } else if (state.scenarioIndex === 1) {
          updateState({ screen: 'fair-use-analysis', fuScenario: state.scenarioIndex, fuStep: 0, fuResponses: [] });
        } else if (state.scenarioIndex === 2) {
          updateState({ screen: 'fair-use-analysis', fuScenario: state.scenarioIndex, fuStep: 0, fuResponses: [] });
        } else if (state.scenarioIndex === 3) {
          const note = "Track passed over due to layer distinction — PD composition, protected recording. A cleaner rights situation was available and taken.";
          setOutcome({ note, score: 2 });
          setSubScreen('outcome');
        }
      } else if (choice === 'E') {
        updateState({ screen: 'fair-use-analysis', fuScenario: state.scenarioIndex, fuStep: 0, fuResponses: [] });
      }
    };

    const finalizeScenario = () => {
      const newCart = [...state.cart, { scenario: scenario.title, note: outcome.note, score: outcome.score }];
      updateState({ 
        cart: newCart, 
        clerkScore: state.clerkScore + outcome.score,
        screen: 'pause'
      });
    };

    return (
      <div className="min-h-screen py-24 px-8 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {subScreen === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <h2 className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold">Scenario {scenario.id}: {scenario.title}</h2>
              <div className="clerk-box bg-stone-800/40 border-l-4 border-amber-600 p-8 italic font-serif text-amber-100 text-xl leading-relaxed">
                <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-4">The Clerk</div>
                "{scenario.clerkIntro}"
              </div>
              <button onClick={() => setSubScreen('setup')} className="flex items-center gap-2 text-amber-400 font-serif text-xl hover:text-amber-200 transition-colors ml-auto">
                Investigate the Track <ChevronRight />
              </button>
            </motion.div>
          )}

          {subScreen === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 font-serif text-amber-50/90 text-lg leading-relaxed">
              <div className="space-y-6">
                <p>{scenario.setup[state.character as keyof typeof scenario.setup]}</p>
                <div className="h-px bg-amber-900/20 w-full" />
                <p>{scenario.complication}</p>
                {scenario.id === 2 && (
                  <div className="bg-amber-900/10 border border-amber-900/30 p-6 rounded-xl italic">
                    <strong>{scenario.conditions![state.character as keyof typeof scenario.conditions]}:</strong> {scenario.conditionExplanation![state.character as keyof typeof scenario.conditionExplanation]}
                  </div>
                )}
                {scenario.id === 3 && (
                   <div className="bg-stone-800/40 border border-amber-900/20 p-8 rounded-xl space-y-4">
                      <h4 className="text-amber-400 uppercase tracking-widest text-xs font-bold">Human-Made Alternative</h4>
                      <p className="text-sm italic">{scenario.alternative![state.character as keyof typeof scenario.alternative]}</p>
                   </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-amber-200 text-sm uppercase tracking-widest font-bold mb-2">What do you do?</h3>
                {scenario.id === 1 && (
                  <>
                    <button onClick={() => handleChoice('A')} className="choice-btn">A) Take the track.</button>
                    <button onClick={() => handleChoice('B')} className="choice-btn">B) Try to find out who owns it.</button>
                    <button onClick={() => handleChoice('C')} className="choice-btn">C) Claim fair use.</button>
                    <button onClick={() => handleChoice('D')} className="choice-btn">D) Leave it and find something clearly labeled.</button>
                  </>
                )}
                {scenario.id === 2 && (
                  <>
                    <button onClick={() => handleChoice('A')} className="choice-btn">A) We've assessed our situation — the license works for us.</button>
                    <button onClick={() => handleChoice('B')} className="choice-btn">B) We're not sure. We'll contact the creator.</button>
                    <button onClick={() => handleChoice('C')} className="choice-btn">C) We'll find something with fewer conditions (CC0).</button>
                    <button onClick={() => handleChoice('D')} className="choice-btn">D) Claim fair use.</button>
                  </>
                )}
                {scenario.id === 3 && (
                  <>
                    <button onClick={() => handleChoice('A')} className="choice-btn">A) We're comfortable. We're using the AI track.</button>
                    <button onClick={() => handleChoice('B')} className="choice-btn">B) We're going with the human-made alternative.</button>
                    <button onClick={() => handleChoice('C')} className="choice-btn">C) We'll flag it as uncertain and move on.</button>
                    <button onClick={() => handleChoice('D')} className="choice-btn">D) Claim fair use for the underlying work.</button>
                    {state.character === 'bard' && <button onClick={() => handleChoice('E')} className="choice-btn border-amber-500/50 text-amber-200">E) Actually — we have a fair use argument for the original.</button>}
                  </>
                )}
                {scenario.id === 4 && (
                  <>
                    <button onClick={() => handleChoice('A')} className="choice-btn">
                      {state.character === 'naturalist' ? 'A) Petition the archive for educational use.' : 'A) Find a different recording of the same composition.'}
                    </button>
                    <button onClick={() => handleChoice('B')} className="choice-btn">B) Contact the rights holder for permission.</button>
                    <button onClick={() => handleChoice('C')} className="choice-btn">C) Claim fair use.</button>
                    <button onClick={() => handleChoice('D')} className="choice-btn">D) Find something different entirely.</button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {subScreen === 'investigation' && (
            <motion.div key="investigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
              <div className="font-serif text-amber-50/90 text-lg leading-relaxed">
                {investigationResult === 'dead-end' ? (
                  <div className="space-y-6">
                    <p>You dig into the Archive's records. The username leads nowhere. The track was uploaded five years ago. You find a forum post suggesting it might have been ripped from a film score, but you can't confirm. An hour has passed. You still don't have an answer.</p>
                    <div className="flex flex-col gap-4 mt-8">
                      <button onClick={() => { setOutcome({ note: "Track added despite investigation yielding no result. No creator found, no license confirmed. Due diligence attempted; use still carries risk.", score: 1 }); setSubScreen('outcome'); }} className="choice-btn">Take it anyway</button>
                      <button onClick={() => handleChoice('D')} className="choice-btn">Leave it</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p>You trace the username back to a real person — a musician with a website. No license is stated anywhere on it. They exist and they're reachable. But contacting them and waiting for a response will take more time than you have right now.</p>
                    <div className="flex flex-col gap-4 mt-8">
                      <button onClick={() => { setOutcome({ note: "Creator identified, no license stated. Permission request sent. Use on hold pending response. Flagged for follow-up.", score: 2 }); setSubScreen('outcome'); }} className="choice-btn">Contact them and flag as pending</button>
                      <button onClick={() => handleChoice('D')} className="choice-btn">Leave it</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {subScreen === 'outcome' && (
            <motion.div key="outcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
              <div className="bg-stone-900 border border-amber-900/30 p-10 rounded-2xl shadow-2xl">
                <h3 className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  <FileText size={14} /> Case Note Generated
                </h3>
                <div className="font-mono text-amber-100/90 text-sm leading-relaxed border-l-2 border-amber-900/50 pl-6 py-2">
                  {outcome.note}
                </div>
              </div>
              <button onClick={finalizeScenario} className="px-10 py-4 bg-amber-900 text-amber-100 rounded-full font-serif text-xl hover:bg-amber-800 transition-all shadow-2xl border border-amber-700/50 flex items-center gap-3 mx-auto">
                Continue <ChevronRight />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const FairUseAnalysis = () => {
    const scenario = SCENARIOS[state.fuScenario!];
    const question = FAIR_USE_QUESTIONS[state.fuStep];

    const handleResponse = (res: string) => {
      const newResponses = [...state.fuResponses, res];
      if (state.fuStep < 3) {
        updateState({ fuResponses: newResponses, fuStep: state.fuStep + 1 });
      } else {
        updateState({ fuResponses: newResponses, screen: 'fair-use-summary' });
      }
    };

    const getQuestionText = () => {
      const text = question.text[state.character as keyof typeof question.text];
      if (Array.isArray(text)) {
        return text[state.fuScenario!] || text[0];
      }
      return text;
    };

    return (
      <div className="min-h-screen py-24 px-8 max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold">Fair Use Analysis: Factor {state.fuStep + 1}</h2>
            <span className="text-amber-900 font-mono text-xs">{state.fuStep + 1}/4</span>
          </div>
          <div className="h-1 bg-stone-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(state.fuStep + 1) * 25}%` }}
              className="h-full bg-amber-500"
            />
          </div>
        </div>

        <motion.div 
          key={state.fuStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-amber-100">{question.title}</h3>
            <p className="text-amber-50/60 font-serif italic">{question.description}</p>
          </div>

          <div className="bg-stone-900/50 border border-amber-900/20 p-8 rounded-2xl font-serif text-amber-50/90 text-lg leading-relaxed">
            {getQuestionText()}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => handleResponse('supports')} className="choice-btn text-center justify-center">This supports our fair use argument</button>
            <button onClick={() => handleResponse('complicates')} className="choice-btn text-center justify-center">This complicates our fair use argument</button>
            <button onClick={() => handleResponse('unsure')} className="choice-btn text-center justify-center">We're not sure</button>
          </div>
        </motion.div>
      </div>
    );
  };

  const FairUseSummary = () => {
    const scenario = SCENARIOS[state.fuScenario!];
    
    const getDefensibility = () => {
      const assessment = FAIR_USE_ASSESSMENTS[state.character as keyof typeof FAIR_USE_ASSESSMENTS];
      if (typeof assessment === 'string') return assessment;
      
      const a = assessment as any;
      if (state.character === 'chronicler') {
        return state.fuScenario === 3 ? a.s4 : a.s123;
      }
      if (state.character === 'bard') {
        // Option E check would be here if I tracked it, but let's approximate
        return a.standard;
      }
      if (state.character === 'naturalist') {
        return state.fuScenario === 2 ? a.s3 : a.s124;
      }
      if (state.character === 'artificer') {
        return a;
      }
      return "Moderate defensibility.";
    };

    const defensibilityText = getDefensibility();
    const score = defensibilityText.includes('Strong') || defensibilityText.includes('strong') ? 3 : 2;

    const finalize = (proceed: boolean) => {
      if (proceed) {
        const note = `Fair use claimed. ${defensibilityText} Four-factor argument: Purpose — ${state.fuResponses[0]}; Nature of work — ${state.fuResponses[1]}; Amount — ${state.fuResponses[2]}; Market effect — ${state.fuResponses[3]}.`;
        const newCart = [...state.cart, { scenario: scenario.title, note, score }];
        updateState({ 
          cart: newCart, 
          clerkScore: state.clerkScore + score,
          screen: 'pause'
        });
      } else {
        updateState({ screen: 'scenario' });
      }
    };

    return (
      <div className="min-h-screen py-24 px-8 max-w-4xl mx-auto space-y-12">
        <h2 className="text-3xl font-serif italic text-amber-100 text-center">Fair Use Summary</h2>
        
        <div className="overflow-hidden rounded-2xl border border-amber-900/30 bg-stone-900/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-950/50 text-amber-500 uppercase tracking-widest text-[10px] font-bold">
                <th className="p-4 border-b border-amber-900/20">Factor</th>
                <th className="p-4 border-b border-amber-900/20">Your Assessment</th>
              </tr>
            </thead>
            <tbody className="text-amber-50/80 font-serif text-sm">
              {FAIR_USE_QUESTIONS.map((q, i) => (
                <tr key={i} className="border-b border-amber-900/10">
                  <td className="p-4 font-bold text-amber-200">{q.title}</td>
                  <td className="p-4 capitalize">{state.fuResponses[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-amber-900/10 border border-amber-900/30 p-8 rounded-2xl space-y-4">
          <h4 className="text-amber-400 uppercase tracking-widest text-xs font-bold">Assessment</h4>
          <p className="text-amber-50/90 font-serif italic leading-relaxed">{defensibilityText}</p>
        </div>

        <div className="flex flex-col gap-4">
          <button onClick={() => finalize(true)} className="choice-btn bg-amber-900/20 border-amber-500/50 text-amber-100 text-center justify-center">Add to cart — fair use basis</button>
          <button onClick={() => finalize(false)} className="choice-btn text-center justify-center">Reconsider — find an alternative</button>
        </div>
      </div>
    );
  };

  const PauseScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-emerald-950/20">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl space-y-12">
        <div className="inline-block px-6 py-2 bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 rounded-full font-bold tracking-[0.4em] uppercase text-xs">
          Facilitator Pause
        </div>
        <h2 className="text-5xl font-serif italic text-amber-100">Track {state.cart.length} Secured</h2>
        <div className="space-y-6 text-amber-50/70 font-serif text-lg italic">
          <p>Please sit tight until all pairs have made their choice. Once everyone is ready, we'll discuss the decisions as a class.</p>
          <ul className="space-y-4">
            <li>• What did your pair decide? What did other pairs do?</li>
            <li>• What were the main tensions in this scenario?</li>
            <li>• How did your character's specific needs influence your choice?</li>
            {state.character === 'artificer' && <li>• How does the "made" nature of your subject (architecture, design) change how you think about the "made" nature of the music you use?</li>}
          </ul>
        </div>
        <button 
          onClick={() => {
            if (state.scenarioIndex < 3) {
              updateState({ screen: 'scenario', scenarioIndex: state.scenarioIndex + 1 });
            } else {
              updateState({ screen: 'cart-review' });
            }
          }}
          className="px-10 py-4 bg-amber-900 text-amber-100 rounded-full font-serif text-xl hover:bg-amber-800 transition-all shadow-2xl border border-amber-700/50 flex items-center gap-3 mx-auto"
        >
          Ready to Continue <ChevronRight />
        </button>
      </motion.div>
    </div>
  );

  const CartReview = () => (
    <div className="min-h-screen py-24 px-8 max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif italic text-amber-100">Your Cart Is Full.</h2>
        <p className="text-amber-50/60 font-serif uppercase tracking-widest text-sm">
          Playing as: {state.character ? CHARACTERS[state.character].name : ''} — {state.character ? CHARACTERS[state.character].genre : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {state.cart.map((item, i) => (
          <div key={i} className="bg-stone-900/50 border border-amber-900/30 p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-amber-400 font-mono text-xs uppercase tracking-[0.3em]">Track {i + 1} — {item.scenario}</h3>
            <div className="font-mono text-amber-100/80 text-xs leading-relaxed border-l border-amber-900/30 pl-4 py-1">
              {item.note}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-8 font-serif italic text-amber-50/80 text-lg">
        <p>Take a moment with your partner:</p>
        <ul className="space-y-2">
          <li>If this were your real podcast, what would you do differently?</li>
          <li>Which track are you most confident about?</li>
          <li>Which one keeps you up at night?</li>
        </ul>
        <div className="text-amber-500/60 text-sm uppercase tracking-widest mt-12">
          [Facilitator: use these cart notes as case documents for full-room debrief before continuing.]
        </div>
      </div>

      <button 
        onClick={() => updateState({ screen: 'reveal' })}
        className="px-12 py-5 bg-amber-900 text-amber-100 rounded-full font-serif text-2xl hover:bg-amber-800 transition-all shadow-2xl border border-amber-700/50 flex items-center gap-3 mx-auto"
      >
        The Reveal <ChevronRight />
      </button>
    </div>
  );

  const RevealScreen = () => {
    const [revealed, setRevealed] = useState(false);
    
    const getEnding = () => {
      if (state.clerkScore <= 4) return 'corporate';
      if (state.clerkScore <= 8) return 'neutral';
      return 'commons';
    };

    const ending = getEnding();

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 max-w-3xl mx-auto space-y-12">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 text-center">
              <div className="font-serif text-amber-50/80 italic text-xl leading-relaxed space-y-6">
                <p>Your cart is full. Four tracks. Four decisions. You've been through more of The Archive than most visitors ever see.</p>
                <p>The Clerk is waiting at the exit.</p>
                <p>He looks different here, in the light. You're not sure exactly how — smaller, or perhaps more precisely shaped than you'd noticed. He is looking at your cart the way someone looks at a thing they already know.</p>
                <p>"Before you go," he says.</p>
                <p>He reaches up and unpins his badge.</p>
                <p>"I should probably tell you who I am."</p>
              </div>
              <button onClick={() => setRevealed(true)} className="choice-btn mx-auto">Look at the badge</button>
            </motion.div>
          ) : (
            <motion.div key="ending" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
              {ending === 'corporate' && (
                <div className="space-y-8">
                  <div className="clerk-box bg-red-950/20 border-l-4 border-red-600 p-8 italic font-serif text-amber-100 text-xl leading-relaxed">
                    <div className="text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase mb-4">The Badge: Meridian Rights Enforcement, LLC.</div>
                    "You've been very helpful. The tracks you selected — the unlicensed ones, the ones with unclear provenance — we've been looking for uses like yours. It helps establish infringement. Establishes the market harm. You'll receive a takedown notice within seventy-two hours. Possibly a licensing demand. It's nothing personal. You had every opportunity to ask questions."
                  </div>
                  <div className="font-serif text-amber-50/80 italic text-lg leading-relaxed space-y-4">
                    <p>The thing about The Archive is that it holds everything. Including consequences.</p>
                    <p>"Freely accessible" was never the same as "free to use." You had the information. The question was whether you slowed down enough to apply it.</p>
                    <p>Your episode won't go live. But you know something now that you didn't before. That's worth something.</p>
                  </div>
                </div>
              )}
              {ending === 'neutral' && (
                <div className="space-y-8">
                  <div className="clerk-box bg-stone-800/40 border-l-4 border-amber-600 p-8 italic font-serif text-amber-100 text-xl leading-relaxed">
                    <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase mb-4">The Badge: The Archive Itself.</div>
                    "I'm not anyone, really. I'm the space between the tracks. The gap where the label should be. You were careful. Your episode will go live. You won't get a takedown notice. I wonder sometimes about the tracks you left on the shelf, though. There may have been moments where you had a stronger argument than you made. Fair use is a muscle. You have to exercise it, or it atrophies."
                  </div>
                  <div className="font-serif text-amber-50/80 italic text-lg leading-relaxed space-y-4">
                    <p>The safe path and the right path aren't always the same path.</p>
                    <p>You navigated The Archive carefully, and that served you well. The next time you're in here — and there will be a next time — try asking what you're actually entitled to, not just what's safest to take.</p>
                  </div>
                </div>
              )}
              {ending === 'commons' && (
                <div className="space-y-8">
                  <div className="clerk-box bg-emerald-950/20 border-l-4 border-emerald-600 p-8 italic font-serif text-amber-100 text-xl leading-relaxed">
                    <div className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase mb-4">The Badge: Creative Culture, Ongoing.</div>
                    "Thank you. The arguments you made — the fair use analyses, the cases where you took the track you had a right to take and articulated why — those matter. Culture moves forward because creators exercise their rights, not just observe them from a safe distance. You also found the open alternatives when they were the better answer. You treated the collection with care."
                  </div>
                  <div className="font-serif text-amber-50/80 italic text-lg leading-relaxed space-y-4">
                    <p>Copyright is not the enemy of creativity. It's the frame within which creativity makes its arguments.</p>
                    <p>You made good arguments. Your episode will go live. And somewhere in the deeper stacks, the Clerk is back at his camp, making notes in his indecipherable handwriting. Something about the ones who got it right.</p>
                  </div>
                </div>
              )}
              <button onClick={() => updateState({ screen: 'resources' })} className="px-10 py-4 bg-amber-900 text-amber-100 rounded-full font-serif text-xl hover:bg-amber-800 transition-all shadow-2xl border border-amber-700/50 flex items-center gap-3 mx-auto">
                Continue to Resources <ChevronRight />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ResourceGuide = () => (
    <div className="min-h-screen py-24 px-8 max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif italic text-amber-100">Resource Guide</h2>
        <p className="text-amber-50/60 font-serif uppercase tracking-widest text-sm">How to navigate the open ecosystem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section className="bg-stone-900/50 p-8 rounded-2xl border border-amber-900/20">
            <h3 className="text-2xl font-serif italic text-amber-200 mb-6">How to Read a License</h3>
            <div className="space-y-6 text-amber-50/80 font-serif leading-relaxed">
              <p><strong>1. Find the license first.</strong> Look before you decide you need the track. No license visible? Default copyright applies.</p>
              <p><strong>2. Identify the conditions.</strong> Look for BY, NC, ND, SA. CC0 means no conditions at all.</p>
              <p><strong>3. Ask three questions:</strong> Does this license allow my specific use? Do I need to credit the creator? Do I need to do anything else?</p>
              <p><strong>4. When in doubt, contact the creator.</strong> Most people who CC-license their work want it to be used.</p>
            </div>
          </section>

          <section className="bg-amber-900/10 border border-amber-900/30 p-8 rounded-2xl">
            <h3 className="text-xl font-serif italic text-amber-200 mb-4">For Your Character — Start Here</h3>
            <div className="text-amber-50/90 font-serif leading-relaxed italic">
              {state.character === 'inquisitor' && "Start at Free Music Archive (film/documentary section) for tense scores. Freesound for ambience, tension, and sound design. Wikimedia Commons for any archival news clips or historical audio."}
              {state.character === 'chronicler' && "Internet Archive and Library of Congress first. Wikimedia Commons for speeches and historical recordings. Musopen for period instrumental music."}
              {state.character === 'bard' && "Musopen for classical analysis. For contemporary music: build your fair use argument. Commentary and analysis is one of the strongest fair use contexts."}
              {state.character === 'conjurer' && "Freesound is your home base — effects, ambience, texture. ccMixter for music beds. Build your own layered mix from CC0 sources."}
              {state.character === 'naturalist' && "Macaulay Library at Cornell first, always — the world's largest wildlife audio archive. Freesound for supplementary ambience and effects."}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <h3 className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-4">All Resources</h3>
          {[
            { name: "Free Music Archive", url: "freemusicarchive.org", desc: "Large library of CC-licensed music across genres. Essential starting point." },
            { name: "ccMixter", url: "ccmixter.org", desc: "CC-licensed music, heavy on electronic and remix culture. Good for music beds." },
            { name: "Musopen", url: "musopen.org", desc: "Public domain classical music recordings and scores. Solves the layer problem." },
            { name: "Freesound", url: "freesound.org", desc: "Community library of sound effects, field recordings, and ambience." },
            { name: "Macaulay Library", url: "macaulaylibrary.org", desc: "World's largest archive of wildlife audio and video. Educational use focus." },
            { name: "Wikimedia Commons", url: "commons.wikimedia.org", desc: "Public domain and CC-licensed media including historical speeches." },
            { name: "Internet Archive", url: "archive.org", desc: "Massive repository of historical audio and radio broadcasts." },
          ].map((res, i) => (
            <div key={i} className="flex flex-col p-4 border-b border-amber-900/10 hover:bg-amber-900/5 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-amber-200 font-bold font-serif">{res.name}</span>
                <span className="text-amber-500 text-[10px] font-mono">{res.url}</span>
              </div>
              <p className="text-xs text-amber-50/60 font-serif">{res.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setState(INITIAL_STATE)}
        className="mt-12 px-10 py-4 border border-amber-900/30 text-amber-400 rounded-full font-serif text-lg hover:bg-amber-900/10 transition-all mx-auto block"
      >
        Restart Experience
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-amber-50 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <CartIndicator />
      <ReferencePanel />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {state.screen === 'framing' && <FramingScreen key="framing" />}
          {state.screen === 'character-selection' && <CharacterSelection key="chars" />}
          {state.screen === 'onboarding' && <Onboarding key="onboarding" />}
          {state.screen === 'scenario' && <ScenarioScreen key="scenario" />}
          {state.screen === 'fair-use-analysis' && <FairUseAnalysis key="fu" />}
          {state.screen === 'fair-use-summary' && <FairUseSummary key="fu-sum" />}
          {state.screen === 'pause' && <PauseScreen key="pause" />}
          {state.screen === 'cart-review' && <CartReview key="review" />}
          {state.screen === 'reveal' && <RevealScreen key="reveal" />}
          {state.screen === 'resources' && <ResourceGuide key="resources" />}
        </AnimatePresence>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#292524_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
      </div>
    </div>
  );
}
