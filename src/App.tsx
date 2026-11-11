/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  ShoppingCart, 
  Info, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  ArrowRight,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { 
  CLASSES, 
  SCENARIOS, 
  FAIR_USE_FACTORS, 
  FAIR_USE_ASSESSMENTS, 
  ClassType, 
  Scenario, 
  Choice 
} from './content';

type GameState = 
  | 'intro' 
  | 'class_selection' 
  | 'scenario' 
  | 'fair_use_analysis' 
  | 'fair_use_summary' 
  | 'outcome' 
  | 'pause' 
  | 'cart_review' 
  | 'resource_guide';

interface CartItem {
  scenarioId: number;
  note: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [fairUseStep, setFairUseStep] = useState(0);
  const [fairUseResponses, setFairUseResponses] = useState<string[]>([]);
  const [currentOutcome, setCurrentOutcome] = useState<{ text: string; note: string } | null>(null);

  const currentScenario = SCENARIOS[currentScenarioIndex];

  const handleStart = () => setGameState('class_selection');

  const handleSelectClass = (cls: ClassType) => {
    setSelectedClass(cls);
    setGameState('scenario');
  };

  const handleChoice = (choice: Choice) => {
    if (choice.isFairUse) {
      setFairUseStep(0);
      setFairUseResponses([]);
      setGameState('fair_use_analysis');
    } else if (choice.nextStep === 'sub_choice_1') {
      // Handle sub-choice logic for B in Scenario 1
      setCurrentOutcome({
        text: choice.outcomeText || '',
        note: ''
      });
      setGameState('outcome');
    } else {
      const note = choice.cartNote || '';
      setCurrentOutcome({
        text: choice.outcomeText || '',
        note: note
      });
      if (note) {
        setCart([...cart, { scenarioId: currentScenario.id, note }]);
      }
      setGameState('outcome');
    }
  };

  const handleFairUseResponse = (response: string) => {
    const newResponses = [...fairUseResponses, response];
    setFairUseResponses(newResponses);
    if (fairUseStep < FAIR_USE_FACTORS.length - 1) {
      setFairUseStep(fairUseStep + 1);
    } else {
      setGameState('fair_use_summary');
    }
  };

  const handleAddFairUseToCart = () => {
    if (!selectedClass) return;
    const assessment = FAIR_USE_ASSESSMENTS[selectedClass];
    const note = `Fair use claimed. ${assessment} Argument rests on: ${fairUseResponses.join(', ')}.`;
    setCart([...cart, { scenarioId: currentScenario.id, note }]);
    setCurrentOutcome({
      text: 'You have added this track to your cart based on your fair use analysis.',
      note: note
    });
    setGameState('outcome');
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setGameState('pause');
    } else {
      setGameState('cart_review');
    }
  };

  const handleContinueFromPause = () => {
    setCurrentScenarioIndex(currentScenarioIndex + 1);
    setGameState('scenario');
  };

  const resetGame = () => {
    setGameState('intro');
    setSelectedClass(null);
    setCurrentScenarioIndex(0);
    setCart([]);
    setFairUseResponses([]);
    setCurrentOutcome(null);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e4e3e0] font-sans selection:bg-[#f27d26] selection:text-white overflow-x-hidden">
      {/* Reference Sidebar */}
      <AnimatePresence>
        {isReferenceOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReferenceOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#2a2a2a] border-l border-[#3a3a3a] z-50 p-8 overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif italic text-[#f27d26]">Reference Panel</h2>
                <button onClick={() => setIsReferenceOpen(false)} className="p-2 hover:bg-[#3a3a3a] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-8 text-sm leading-relaxed">
                <section>
                  <h3 className="text-lg font-bold mb-2 text-white">Copyright</h3>
                  <p>When someone creates an original work, copyright attaches automatically. The creator controls how it can be used, copied, shared, or modified. You need permission — a license — to use it, unless an exception like fair use applies.</p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold mb-2 text-white">Public Domain</h3>
                  <p>Works in the public domain are no longer protected by copyright (or never were). They can be used freely by anyone for any purpose. Works enter the public domain when copyright expires, when the creator dedicates them, or when they were created by the US federal government.</p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold mb-2 text-white">Creative Commons</h3>
                  <p>A set of standardized licenses that let creators share their work with specific permissions built in. A CC license doesn't mean "do whatever you want" — it means "here's what I'm allowing, and here are the conditions." Always read the specific license terms.</p>
                  <ul className="mt-4 space-y-2 list-disc pl-4 opacity-80">
                    <li><strong>BY</strong> — Attribution (Required)</li>
                    <li><strong>NC</strong> — NonCommercial</li>
                    <li><strong>ND</strong> — NoDerivatives</li>
                    <li><strong>SA</strong> — ShareAlike</li>
                    <li><strong>CC0</strong> — No rights reserved</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold mb-2 text-white">Fair Use</h3>
                  <p>A legal doctrine that allows use of copyrighted material without permission in certain circumstances — commentary, criticism, education, parody, journalism. Fair use is not a free pass; it's a case-by-case analysis weighing four factors.</p>
                </section>

                <section>
                  <h3 className="text-lg font-bold mb-2 text-white">The Layer Distinction</h3>
                  <p>A piece of audio can contain multiple separate rights. A musical composition (melody, lyrics, structure) and a specific recording of it are legally distinct. The composition can be in the public domain while the recording is still under copyright.</p>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-24 relative">
        {/* Persistent Header */}
        {gameState !== 'intro' && (
          <div className="fixed top-0 left-0 right-0 bg-[#1a1a1a]/80 backdrop-blur-md z-30 border-b border-[#3a3a3a]">
            <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <BookOpen className="text-[#f27d26]" size={20} />
                <span className="text-xs uppercase tracking-widest font-bold opacity-60">The Archive</span>
              </div>
              <div className="flex items-center gap-6">
                {selectedClass && (
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-tighter opacity-40">Class:</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#f27d26]">{selectedClass.replace('_', ' ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="opacity-60" />
                  <span className="text-sm font-mono">{cart.length}/4</span>
                </div>
                <button 
                  onClick={() => setIsReferenceOpen(true)}
                  className="flex items-center gap-2 text-sm hover:text-[#f27d26] transition-colors"
                >
                  <Info size={18} />
                  <span className="hidden sm:inline">Reference</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12 text-center md:text-left"
            >
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-serif italic leading-tight text-white">The Archive</h1>
                <p className="text-xl md:text-2xl font-light opacity-80 max-w-2xl leading-relaxed">
                  A cooperative text RPG about copyright, fair use, and the ethics of sound.
                </p>
              </div>

              <div className="prose prose-invert max-w-3xl space-y-6 text-lg opacity-70 leading-relaxed">
                <p>
                  Somewhere between a library and a labyrinth, The Archive holds every piece of recorded audio ever made. 
                  Music, speeches, field recordings, sound effects, oral histories, birdsong, static, silence. 
                  All of it is here. None of it is labeled.
                </p>
                <p>
                  You and your partner are podcast producers on a deadline. You need to fill your Podcast Cart with four usable tracks before your episode goes live. 
                  The Archive has everything you could ever want.
                </p>
                <p>
                  The problem: <span className="text-white font-medium italic">"everything you could ever want" is not the same as "everything you're allowed to use."</span>
                </p>
              </div>

              <button 
                onClick={handleStart}
                className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#f27d26] hover:text-white transition-all duration-300"
              >
                Enter The Archive
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {gameState === 'class_selection' && (
            <motion.div
              key="class_selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-serif italic text-white">Choose Your Class</h2>
                <p className="opacity-60">Each pair selects one. Your class determines your perspective and needs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls.id)}
                    className="group p-8 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl text-left hover:border-[#f27d26] hover:bg-[#2d2d2d] transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[#f27d26] transition-colors">{cls.name}</h3>
                    <p className="text-sm opacity-60 leading-relaxed">{cls.description}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'scenario' && selectedClass && (
            <motion.div
              key={`scenario-${currentScenarioIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#f27d26]">Scenario {currentScenario.id} of 4</span>
                  <h2 className="text-4xl font-serif italic text-white">{currentScenario.title}</h2>
                </div>
                
                <div className="space-y-6 text-lg leading-relaxed opacity-90">
                  <p className="bg-[#2a2a2a] p-8 rounded-2xl border-l-4 border-[#f27d26]">
                    {currentScenario.setup[selectedClass]}
                  </p>
                  <p className="px-4">
                    {currentScenario.complication}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest font-bold opacity-40 px-4">What do you do?</h3>
                <div className="grid grid-cols-1 gap-3">
                  {currentScenario.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => handleChoice(choice)}
                      className="group flex items-center justify-between p-6 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-left hover:border-[#f27d26] hover:bg-[#333] transition-all"
                    >
                      <span className="flex items-center gap-4">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] text-xs font-bold group-hover:bg-[#f27d26] transition-colors">
                          {choice.id}
                        </span>
                        <span className="font-medium">{choice.label}</span>
                      </span>
                      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'fair_use_analysis' && selectedClass && (
            <motion.div
              key="fair_use_analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#f27d26]">
                  <HelpCircle size={20} />
                  <span className="text-xs uppercase tracking-widest font-bold">Fair Use Analysis</span>
                </div>
                <h2 className="text-4xl font-serif italic text-white">
                  Factor {fairUseStep + 1}: {FAIR_USE_FACTORS[fairUseStep].title}
                </h2>
                <p className="text-lg opacity-70 leading-relaxed">
                  {FAIR_USE_FACTORS[fairUseStep].prompt}
                </p>
              </div>

              <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] space-y-4">
                <h3 className="text-sm uppercase tracking-widest font-bold opacity-40">Your Context:</h3>
                <p className="text-lg italic">
                  "{FAIR_USE_FACTORS[fairUseStep].classSpecific[selectedClass]}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['This supports our fair use argument', 'This complicates our fair use argument', 'We\'re not sure'].map((resp) => (
                  <button
                    key={resp}
                    onClick={() => handleFairUseResponse(resp)}
                    className="p-6 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-sm font-bold hover:border-[#f27d26] hover:bg-[#333] transition-all text-center"
                  >
                    {resp}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'fair_use_summary' && selectedClass && (
            <motion.div
              key="fair_use_summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-serif italic text-white">Fair Use Summary</h2>
                <p className="opacity-70">Here is the argument you've built based on the four factors:</p>
              </div>

              <div className="space-y-4 bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a]">
                {FAIR_USE_FACTORS.map((factor, idx) => (
                  <div key={factor.id} className="flex justify-between items-center py-3 border-b border-[#3a3a3a] last:border-0">
                    <span className="text-sm font-bold opacity-60">{factor.title}</span>
                    <span className="text-sm font-medium text-[#f27d26]">{fairUseResponses[idx]}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="p-8 bg-[#1a1a1a] border border-[#f27d26]/30 rounded-2xl">
                  <h3 className="text-sm uppercase tracking-widest font-bold text-[#f27d26] mb-4">Assessment:</h3>
                  <p className="text-xl leading-relaxed italic">
                    {FAIR_USE_ASSESSMENTS[selectedClass]}
                  </p>
                </div>
                
                <p className="text-sm opacity-50 px-4">
                  This is not a legal opinion. Fair use is ultimately determined case by case, often in court. 
                  But this is what you'd need to be able to articulate if challenged.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddFairUseToCart}
                  className="flex-1 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-[#f27d26] hover:text-white transition-all"
                >
                  Add to cart on this basis
                </button>
                <button
                  onClick={() => setGameState('scenario')}
                  className="flex-1 bg-transparent border border-[#3a3a3a] text-white px-8 py-4 rounded-full font-bold hover:bg-[#333] transition-all"
                >
                  Reconsider — find an alternative
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'outcome' && currentOutcome && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-3 text-[#f27d26]">
                  <CheckCircle2 size={24} />
                  <h2 className="text-4xl font-serif italic text-white">Decision Made</h2>
                </div>
                
                <p className="text-2xl font-light leading-relaxed">
                  {currentOutcome.text}
                </p>

                {currentOutcome.note && (
                  <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] font-mono text-sm space-y-4">
                    <div className="flex items-center gap-2 opacity-40">
                      <ShoppingCart size={14} />
                      <span className="uppercase tracking-widest text-[10px] font-bold">Cart Note Generated</span>
                    </div>
                    <p className="text-[#f27d26] leading-relaxed">
                      {currentOutcome.note}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleNextScenario}
                className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#f27d26] hover:text-white transition-all"
              >
                Continue
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {gameState === 'pause' && (
            <motion.div
              key="pause"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-12 py-12"
            >
              <div className="w-24 h-24 rounded-full border-4 border-[#f27d26] flex items-center justify-center animate-pulse">
                <AlertCircle size={48} className="text-[#f27d26]" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-6xl font-serif italic text-white">Facilitator Pause</h2>
                <p className="text-xl opacity-60 max-w-xl mx-auto">
                  Discuss your choices with the room before continuing to the next scenario.
                </p>
              </div>

              <button
                onClick={handleContinueFromPause}
                className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-[#f27d26] hover:text-white transition-all"
              >
                Continue to Scenario {currentScenarioIndex + 2}
              </button>
            </motion.div>
          )}

          {gameState === 'cart_review' && (
            <motion.div
              key="cart_review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-5xl font-serif italic text-white">Cart Review</h2>
                <p className="text-xl opacity-60">Your Podcast Cart is full. Here's what you're bringing to your episode.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Track {idx + 1}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#f27d26]">{SCENARIOS[idx].title}</span>
                    </div>
                    <p className="font-mono text-sm leading-relaxed text-[#f27d26]">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>

              <div className="prose prose-invert max-w-none bg-[#1a1a1a] p-8 rounded-2xl border border-[#3a3a3a] italic opacity-80">
                <p>Take a moment with your partner:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If this were your real podcast, what would you do differently?</li>
                  <li>Which track are you most confident about?</li>
                  <li>Which one keeps you up at night?</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setGameState('resource_guide')}
                  className="flex-1 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-[#f27d26] hover:text-white transition-all"
                >
                  View Resource Guide
                </button>
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border border-[#3a3a3a] hover:bg-[#333] transition-all"
                >
                  <RotateCcw size={18} />
                  Restart Game
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'resource_guide' && (
            <motion.div
              key="resource_guide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              <div className="space-y-4">
                <h2 className="text-5xl font-serif italic text-white">Resource Guide</h2>
                <p className="text-xl opacity-60">You made it through The Archive. Here's the map for doing this in real life.</p>
              </div>

              <section className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-[#3a3a3a] pb-4">How to Read a License</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { t: 'Find the license first', d: 'Look for it before you decide you need the track. If there\'s no license visible, default copyright applies.' },
                    { t: 'Identify the conditions', d: 'Look for the letters: BY (attribution), NC (non-commercial), ND (no derivatives), SA (share-alike). CC0 means no conditions at all.' },
                    { t: 'Ask three questions', d: 'Does this license allow my specific use? Do I need to credit the creator? Do I need to do anything else (share-alike, no modifications)?' },
                    { t: 'When in doubt, contact', d: 'Licenses are the minimum. Creators can always grant more permissions than their license requires.' }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-4xl font-serif italic text-[#f27d26] opacity-40">{i + 1}</span>
                      <div>
                        <h4 className="font-bold mb-1">{step.t}</h4>
                        <p className="text-sm opacity-60 leading-relaxed">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <h3 className="text-2xl font-bold border-b border-[#3a3a3a] pb-4">Resources by Audio Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] space-y-4">
                    <h4 className="text-[#f27d26] font-bold uppercase tracking-widest text-xs">Music</h4>
                    <ul className="space-y-4 text-sm">
                      <li>
                        <a href="https://freemusicarchive.org" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline flex items-center gap-1">
                          Free Music Archive <ExternalLink size={12} />
                        </a>
                        <p className="opacity-60 mt-1">Large library of CC-licensed music across genres.</p>
                      </li>
                      <li>
                        <a href="https://ccmixter.org" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline flex items-center gap-1">
                          ccMixter <ExternalLink size={12} />
                        </a>
                        <p className="opacity-60 mt-1">CC-licensed music, heavy on electronic and remix culture.</p>
                      </li>
                      <li>
                        <a href="https://musopen.org" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline flex items-center gap-1">
                          Musopen <ExternalLink size={12} />
                        </a>
                        <p className="opacity-60 mt-1">Public domain classical music recordings and scores.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] space-y-4">
                    <h4 className="text-[#f27d26] font-bold uppercase tracking-widest text-xs">Sound Effects</h4>
                    <ul className="space-y-4 text-sm">
                      <li>
                        <a href="https://freesound.org" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline flex items-center gap-1">
                          Freesound <ExternalLink size={12} />
                        </a>
                        <p className="opacity-60 mt-1">Massive community library of CC-licensed sound effects and ambience.</p>
                      </li>
                      <li>
                        <a href="https://macaulaylibrary.org" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline flex items-center gap-1">
                          Macaulay Library <ExternalLink size={12} />
                        </a>
                        <p className="opacity-60 mt-1">The world's largest archive of wildlife audio and video.</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-[#3a3a3a] space-y-4">
                    <h4 className="text-[#f27d26] font-bold uppercase tracking-widest text-xs">Archival</h4>
                    <ul className="space-y-4 text-sm">
                      <li>
                        <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline flex items-center gap-1">
                          Wikimedia Commons <ExternalLink size={12} />
                        </a>
                        <p className="opacity-60 mt-1">Public domain and CC media including historical speeches.</p>
                      </li>
                      <li>
                        <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline flex items-center gap-1">
                          Internet Archive <ExternalLink size={12} />
                        </a>
                        <p className="opacity-60 mt-1">Massive repository of historical audio and radio broadcasts.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="flex justify-center pt-8">
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-[#f27d26] hover:text-white transition-all"
                >
                  <RotateCcw size={20} />
                  Restart Game
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-[#3a3a3a] opacity-30 text-[10px] uppercase tracking-[0.3em] font-bold text-center">
        The Archive &copy; 2026 &bull; Designed for Undergraduate Education
      </footer>
    </div>
  );
}
