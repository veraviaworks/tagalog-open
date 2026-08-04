// Phase 2: replace these mock imports with fetch() calls to your deployed
// Google Apps Script Web App URL. Keep the exported function names unchanged.
import { tournamentSettings, players, matches, bracket, announcements, rules, winners } from '../data/mock-data.js';

const copy = (value) => JSON.parse(JSON.stringify(value));
const respond = async (value) => copy(value);

export const getTournamentSettings = () => respond(tournamentSettings);
export const getPlayers = () => respond(players);
export const getMatches = () => respond(matches);
export const getBracket = () => respond(bracket);
export const getAnnouncements = () => respond(announcements);
export const getRules = () => respond(rules);
export const getWinnerInformation = () => respond(winners);

// Future example:
// const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
// export async function getPlayers() {
//   const response = await fetch(`${APPS_SCRIPT_URL}?resource=players`);
//   if (!response.ok) throw new Error('Unable to load players');
//   return response.json();
// }
