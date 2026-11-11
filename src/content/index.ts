import { GameContent } from './types';
import { personas } from './personas';
import { onboarding } from './onboarding';
import { reference } from './reference';
import { resources } from './resources';
import { interstitial } from './interstitial';
import { stop1Free } from './stops/stop1-free';
import { stop2Layers } from './stops/stop2-layers';
import { stop3Permission } from './stops/stop3-permission';
import { ask } from './ask';
import { stop4Flip } from './stops/stop4-flip';
import { clerk } from './clerk';
import { fairUse } from './fairUse';

export const content: GameContent = {
  personas,
  onboarding,
  stops: {
    free: stop1Free,
    layers: stop2Layers,
    permission: stop3Permission,
    flip: stop4Flip,
  },
  fairUse,
  ask,
  clerk,
  reference,
  resources,
  interstitial,
};
