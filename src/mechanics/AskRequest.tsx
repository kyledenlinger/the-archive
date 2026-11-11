import { useState } from 'react';
import { motion } from 'motion/react';
import { AskField, AskResponse, GameContent, PersonaId } from '../content/types';
import { askFollowUps } from '../content/ask';
import { dealAskResponse, isWellFormed } from '../lib/ask';
import { ScreenHeading } from '../components/ScreenHeading';
import { ChoiceButton } from '../components/ChoiceButton';
import { btnLink, btnPrimary, eyebrow } from '../components/styles';
import { FairUseAnalysis } from './FairUseAnalysis';

const FIELDS: AskField[] = ['what', 'how', 'where', 'howLong'];

interface Props {
  content: GameContent;
  persona: PersonaId;
  seed: number;
  onDone: (cartNote: string) => void;
  onBack: () => void;
}

export function AskRequest({ content, persona, seed, onDone, onBack }: Props) {
  const ask = content.ask;
  const [request, setRequest] = useState<Partial<Record<AskField, string>>>({});
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [fairUse, setFairUse] = useState(false);

  if (!response) {
    return (
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          setResponse(dealAskResponse(seed, persona, isWellFormed(request)));
        }}
      >
        <ScreenHeading level={2} focusKey="ask-form" className={eyebrow}>
          Ask for permission
        </ScreenHeading>
        <p className="font-serif text-amber-50/90 text-lg leading-relaxed">{ask.intro}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {FIELDS.map((f) => {
            const { label, options } = ask.fieldOptions[f];
            return (
              <label key={f} className="flex flex-col gap-2 text-sm text-amber-200 font-bold uppercase tracking-widest">
                {label}
                <select
                  value={request[f] ?? ''}
                  onChange={(e) => setRequest((r) => ({ ...r, [f]: e.target.value }))}
                  className="normal-case tracking-normal font-normal font-serif text-base text-amber-50 bg-stone-900 border border-amber-900/40 rounded-lg p-3"
                >
                  <option value="">(leave blank)</option>
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <button type="button" className={btnLink} onClick={onBack}>
            Back to the choices
          </button>
          <button type="submit" className={btnPrimary}>
            Send the request
          </button>
        </div>
      </form>
    );
  }

  const answer = ask.responses[persona][response];
  if (fairUse) {
    return (
      <FairUseAnalysis
        stopId="permission"
        persona={persona}
        content={content}
        onDone={(note) => onDone(`${answer.cartNote} ${askFollowUps.fairUse} ${note}`)}
        onBack={() => setFairUse(false)}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <ScreenHeading level={2} focusKey="ask-response" className={eyebrow}>
        The reply
      </ScreenHeading>
      <p className="font-serif text-amber-50/90 text-lg leading-relaxed bg-stone-900/50 border border-amber-900/20 p-6 rounded-2xl">{answer.text}</p>
      <div role="group" aria-labelledby="after-ask" className="flex flex-col gap-4">
        <h3 id="after-ask" className="text-amber-200 text-sm uppercase tracking-widest font-bold">
          {ask.afterPrompt}
        </h3>
        <ChoiceButton onSelect={() => onDone(`${answer.cartNote} ${askFollowUps.use}`)}>Use it</ChoiceButton>
        <ChoiceButton onSelect={() => onDone(`${answer.cartNote} ${askFollowUps.dont}`)}>Don’t use it</ChoiceButton>
        <ChoiceButton onSelect={() => setFairUse(true)}>Run a fair use analysis</ChoiceButton>
      </div>
      <button type="button" className={btnLink} onClick={onBack}>
        Back to the choices
      </button>
    </motion.div>
  );
}
