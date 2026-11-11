import { Resource } from './types';

const check = { date: '2027-01-01', note: 'Confirm the URL resolves and the description still fits the collection.' };

export const resources: Resource[] = [
  { name: 'Openverse', url: 'openverse.org', description: 'Search engine for openly licensed and public-domain images and audio, with the license shown for each result.', reviewBy: check },
  { name: 'Wikimedia Commons', url: 'commons.wikimedia.org', description: 'Millions of public-domain and CC-licensed images, video, and sound, each with a file page stating its license.', reviewBy: check },
  { name: 'Smithsonian Open Access', url: 'si.edu/openaccess', description: 'Millions of images and records from Smithsonian museums released under CC0.', reviewBy: check },
  { name: 'NASA Images', url: 'images.nasa.gov', description: 'NASA’s image and video library. Most NASA-made media is a U.S. government work; check the credit line for partner material.', reviewBy: check },
  { name: 'Internet Archive', url: 'archive.org', description: 'Huge repository of films, recordings, books, and software. Rights vary item by item, so read each one.', reviewBy: check },
  { name: 'Freesound', url: 'freesound.org', description: 'Community library of sound effects, field recordings, and ambience under CC licenses.', reviewBy: check },
  { name: 'Free Music Archive', url: 'freemusicarchive.org', description: 'Library of music across genres, much of it CC-licensed. Check each track’s license.', reviewBy: check },
  { name: 'Creative Commons License Chooser', url: 'creativecommons.org/choose', description: 'Answers a few questions and tells you which CC license fits what you want to allow for your own work.', reviewBy: check },
];
