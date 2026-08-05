import {
  tournamentSettings,
  players,
  matches,
  bracket,
  announcements,
  rules,
  winners,
} from '../data/mock-data.js';

// This file bridges the website and your Google Sheet database.
// Update this URL only if you create a new Apps Script web app deployment.
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz4aaKoERbIz63te3065WI0krhQp9xp0epG4gwL_O-zKEweBglCIflUzIur6wJ4uZwjbw/exec';

const localData = {
  settings: tournamentSettings,
  players,
  matches,
  bracket,
  announcements,
  rules,
  winners,
};

// Helper to fetch one resource from the Apps Script web app.
async function fetchResource(resource) {
  try {
    // Cache-bust each request so the browser asks for fresh sheet data.
    const url = `${APPS_SCRIPT_URL}?resource=${resource}&_=${Date.now()}`;
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to load ${resource}`);
    }

    return response.json();
  } catch (error) {
    console.warn(`Using local fallback for ${resource}`, error);
    return JSON.parse(JSON.stringify(localData[resource]));
  }
}

// Each exported function loads one tab from Google Sheets.
export const getTournamentSettings = () => fetchResource('settings');
export const getPlayers = () => fetchResource('players');
export const getMatches = () => fetchResource('matches');
export const getBracket = () => fetchResource('bracket');
export const getAnnouncements = () => fetchResource('announcements');
export const getRules = () => fetchResource('rules');
export const getWinnerInformation = () => fetchResource('winners');
