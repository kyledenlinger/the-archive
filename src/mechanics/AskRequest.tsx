import { GameContent, PersonaId } from '../content/types';

// Implemented in Task 8.
export function AskRequest(_: { content: GameContent; persona: PersonaId; seed: number; onDone: (cartNote: string) => void; onBack: () => void }) {
  return null;
}
