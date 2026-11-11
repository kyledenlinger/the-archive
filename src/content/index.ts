import { GameContent } from './types';
import { personas } from './personas';
import { onboarding } from './onboarding';
import { reference } from './reference';
import { resources } from './resources';
import { interstitial } from './interstitial';
import { stop1Free } from './stops/stop1-free';
import { fairUse } from './fairUse';
import { placeholderAsk, placeholderClerk, placeholderFlip, placeholderStop } from './placeholders';

export const content: GameContent = {
  personas,
  onboarding,
  stops: {
    free: stop1Free,
    layers: placeholderStop('layers'),
    permission: placeholderStop('permission'),
    flip: placeholderFlip,
  },
  fairUse,
  ask: placeholderAsk,
  clerk: placeholderClerk,
  reference,
  resources,
  interstitial,
};
