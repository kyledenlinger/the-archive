import { LicenseId, ReferenceEntry } from './types';

/**
 * Accurate one-line definitions of each license choice. The flip's license picker
 * (stop 4, "What this actually means") uses these exact strings, so the two always match.
 */
export const LICENSE_DEFINITIONS: Record<LicenseId, string> = {
  arr: 'All rights reserved: the default. Nobody may copy, share, or adapt the work without your permission, unless an exception such as fair use applies.',
  'cc-by': 'CC BY: anyone may copy, share, and adapt the work for any purpose, including commercial, as long as they credit you.',
  'cc-by-sa': 'CC BY-SA: like CC BY, but anyone who shares an adapted version must license it under the same terms (ShareAlike).',
  'cc-by-nc': 'CC BY-NC: anyone may copy, share, and adapt the work with credit, but only for noncommercial purposes. Commercial use still needs your permission.',
  cc0: 'CC0: no rights reserved. You waive your copyright as far as the law allows, and anyone may use the work for anything, with or without credit.',
};

export const reference: ReferenceEntry[] = [
  {
    id: 'copyright',
    title: 'Copyright',
    body: 'When someone creates an original work and fixes it in a lasting form, copyright attaches automatically. No registration or © symbol is needed. The creator controls how it can be copied, shared, adapted, and performed. If there’s no license, the default is all rights reserved: you need permission, unless an exception like fair use applies.',
  },
  {
    id: 'public-domain',
    title: 'Public Domain',
    body: 'Works whose copyright has expired, was waived, or never existed. Anyone can use them for any purpose. Works enter the public domain when their term runs out, when the creator dedicates them (for example with CC0), or, in the U.S., when they are created by federal government employees as part of their official duties.',
  },
  {
    id: 'creative-commons',
    title: 'Creative Commons',
    body: [
      'Standardized licenses that let creators share their work with permissions built in. A CC license doesn’t mean “do whatever you want.” It means “here’s what I’m allowing, on these conditions.” Always read the specific terms.',
      LICENSE_DEFINITIONS['cc-by'],
      LICENSE_DEFINITIONS['cc-by-sa'],
      LICENSE_DEFINITIONS['cc-by-nc'],
      'ND (NoDerivatives): appears in some CC licenses. Share the work as is, but don’t modify it.',
      LICENSE_DEFINITIONS.cc0,
    ].join('\n\n'),
  },
  {
    id: 'fair-use',
    title: 'Fair Use',
    body: 'A U.S. legal doctrine that allows use of copyrighted material without permission in certain circumstances, such as commentary, criticism, education, parody, and news reporting. It isn’t a free pass. It’s a case-by-case analysis weighing four factors: the purpose of your use, the nature of the original, how much you take, and the effect on the market for the original.',
  },
  {
    id: 'rights-layers',
    title: 'Rights Layers',
    body: 'One thing can carry several separate rights. A song has a composition and a recording, and each has its own term. Public-domain film footage can sit inside a new restoration with a new soundtrack. A character can be public domain in one version and protected in a later one, and trademark is another layer again. Check every layer, not only the one on top.',
  },
  {
    id: 'contracts',
    title: 'Contracts and Terms of Service',
    body: 'Copyright isn’t the only thing that decides what you can do. When you buy a stock clip, use a platform’s sound library, download an asset pack, or use an AI tool, you agree to terms. Those terms are a contract. They can limit or expand what you may do, whatever copyright law alone would say. A use can be fine under copyright and still break a license you agreed to.',
  },
  {
    id: 'asking',
    title: 'Asking Permission',
    body: 'If you can find the owner, you can ask. A good request says what you want to use, how you’ll use it, where it will appear, and for how long. Silence isn’t a yes. A no answers the permission question; it doesn’t settle whether fair use applies, though it’s worth taking seriously. Keep a record of what you asked and what you were told.',
  },
];
