import { InterstitialCopy } from './types';

export const interstitial: InterstitialCopy = {
  waitTitle: 'Stop here',
  waitLead: 'Wait for your facilitator.',
  waitBody: 'Your facilitator will bring the room together to talk about this stop. When they say it’s time, continue.',
  continueLabel: 'Continue',
  pauseLabel: 'Add to cart and pause',
  pauseLabels: {
    fairUse: 'Add to cart on a fair use basis and pause',
    askUse: 'Use it and pause',
    askUseAnyway: 'Use it anyway and pause',
    askDont: 'Don’t use it and pause',
    askAccept: 'Accept the terms and pause',
  },
  confirmMoveOn: {
    question: 'Has your facilitator said it’s time to move on?',
    confirm: 'Yes, continue',
    cancel: 'Not yet',
  },
};
