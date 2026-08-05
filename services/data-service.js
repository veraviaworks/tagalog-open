// DB 
// This file is the "bridge" between the website and the raw data.
//
// Right now it returns mock data from ../data/mock-data.js.
// Later, this is the only place you would need to change if you want
// to load live information from Google Sheets or another API.

import {
  tournamentSettings,
  players,
  matches,
  bracket,
  announcements,
  rules,
  winners,
} from '../data/mock-data.js';

// We return a deep copy so the UI can safely read the data
// without accidentally changing the original source objects.
const copy = (value) => JSON.parse(JSON.stringify(value));

// This helper keeps every exported function asynchronous.
// That makes it easier to replace mock data with fetch() later.
const respond = async (value) => copy(value);

// Each function below gives one part of the site access to one data set.
export const getTournamentSettings = () => respond(tournamentSettings);
export const getPlayers = () => respond(players);
export const getMatches = () => respond(matches);
export const getBracket = () => respond(bracket);
export const getAnnouncements = () => respond(announcements);
export const getRules = () => respond(rules);
export const getWinnerInformation = () => respond(winners);

// Future Google Sheets / Apps Script example:
//
// const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
//
// export async function getPlayers() {
//   const response = await fetch(`${APPS_SCRIPT_URL}?resource=players`);
//
//   if (!response.ok) {
//     throw new Error('Unable to load players');
//   }
//
//   return response.json();
// }
