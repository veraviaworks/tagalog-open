// This file is the bridge between the website and your Google Sheet data.
// This is your Google Sheet API web app URL from Google Apps Script.
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz4aaKoERbIz63te3065WI0krhQp9xp0epG4gwL_O-zKEweBglCIflUzIur6wJ4uZwjbw/exec';

// This helper fetches one resource from your Google Apps Script web app.
async function fetchResource(resource) {
  const response = await fetch(`${APPS_SCRIPT_URL}?resource=${resource}`);

  if (!response.ok) {
    throw new Error(`Failed to load ${resource}`);
  }

  return response.json();
}

// Each exported function below loads one tab from your Google Sheet.
export const getTournamentSettings = () => fetchResource('settings');
export const getPlayers = () => fetchResource('players');
export const getMatches = () => fetchResource('matches');
export const getBracket = () => fetchResource('bracket');
export const getAnnouncements = () => fetchResource('announcements');
export const getRules = () => fetchResource('rules');
export const getWinnerInformation = () => fetchResource('winners');
