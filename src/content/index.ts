import { GameContent } from './types';
import { personas } from './personas';
import { onboarding } from './onboarding';
import { reference } from './reference';
import { resources } from './resources';
import { interstitial } from './interstitial';
import { placeholderAsk, placeholderClerk, placeholderFairUse, placeholderFlip, placeholderStop } from './placeholders';

export const content: GameContent = {
  personas,
  onboarding,
  stops: {
    free: placeholderStop('free'),
    layers: placeholderStop('layers'),
    permission: placeholderStop('permission'),
    flip: placeholderFlip,
  },
  fairUse: placeholderFairUse,
  ask: placeholderAsk,
  clerk: placeholderClerk,
  reference,
  resources,
  interstitial,
};
