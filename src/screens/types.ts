import { Dispatch } from 'react';
import { GameContent } from '../content/types';
import { Action, GameState } from '../state';

export interface ScreenProps {
  state: GameState;
  dispatch: Dispatch<Action>;
  content: GameContent;
}
