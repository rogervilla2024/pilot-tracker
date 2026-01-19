/**
 * Pilot Game Configuration
 * Provider: Gamzix
 * RTP: 97%
 * Max Multiplier: 10,000x
 */

export const GAME_CONFIG = {
  // Stats Page Config
  gameId: 'pilot',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8016',

  name: 'Pilot',
  provider: 'Gamzix',
  providerWebsite: 'https://gamzix.com',
  domain: 'pilotgametracker.com',
  rtp: 97.0,
  houseEdge: 3.0,
  maxMultiplier: 10000,
  minMultiplier: 1.0,
  minBet: 0.10,
  maxBet: 100,
  trademark: 'Pilot is a trademark of Gamzix.',
  description: 'Vintage aviation-themed crash game with smooth graphics.',

  theme: {
    primary: '#92400e',
    secondary: '#ca8a04',
    accent: '#0ea5e9',
    cream: '#fef3c7',
  },

  seo: {
    title: 'Pilot Game Tracker - Live Pilot Game Statistics & Flight Analytics',
    description: 'Real-time Pilot crash game statistics by Gamzix. Track flight multipliers up to 10,000x with 97% RTP.',
    keywords: ['pilot game', 'gamzix pilot', 'pilot crash game', 'pilot tracker', 'pilot statistics'],
  },
};

export const API_CONFIG = {
  baseUrl: '/api',
  wsUrl: typeof window !== 'undefined'
    ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`
    : 'ws://localhost:8016/ws',
  endpoints: {
    stats: '/stats',
    history: '/history',
    live: '/live',
  },
};

/**
 * Flight Type Categories
 * Based on multiplier ranges with aviation terminology
 */
export const FLIGHT_TYPES = {
  EMERGENCY: {
    id: 'emergency',
    name: 'Emergency Landing',
    shortName: 'Emergency',
    icon: '🚨',
    minMultiplier: 1.0,
    maxMultiplier: 1.5,
    color: 'red',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    borderClass: 'border-red-300',
    badgeClass: 'badge-emergency',
    multiplierClass: 'multiplier-emergency',
    description: 'Flight ended almost immediately - emergency landing!',
  },
  SHORT: {
    id: 'short',
    name: 'Short Flight',
    shortName: 'Short',
    icon: '🛫',
    minMultiplier: 1.5,
    maxMultiplier: 2.0,
    color: 'orange',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-800',
    borderClass: 'border-orange-300',
    badgeClass: 'badge-short',
    multiplierClass: 'multiplier-short',
    description: 'Quick hop - barely got off the ground',
  },
  DOMESTIC: {
    id: 'domestic',
    name: 'Domestic Flight',
    shortName: 'Domestic',
    icon: '🛩️',
    minMultiplier: 2.0,
    maxMultiplier: 5.0,
    color: 'yellow',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
    borderClass: 'border-yellow-300',
    badgeClass: 'badge-domestic',
    multiplierClass: 'multiplier-domestic',
    description: 'Solid domestic route - steady altitude',
  },
  INTERNATIONAL: {
    id: 'international',
    name: 'International Flight',
    shortName: 'International',
    icon: '✈️',
    minMultiplier: 5.0,
    maxMultiplier: 10.0,
    color: 'green',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
    borderClass: 'border-green-300',
    badgeClass: 'badge-international',
    multiplierClass: 'multiplier-international',
    description: 'Crossing borders - international voyage',
  },
  TRANSATLANTIC: {
    id: 'transatlantic',
    name: 'Transatlantic Flight',
    shortName: 'Transatlantic',
    icon: '🌊',
    minMultiplier: 10.0,
    maxMultiplier: 50.0,
    color: 'blue',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-300',
    badgeClass: 'badge-transatlantic',
    multiplierClass: 'multiplier-transatlantic',
    description: 'Ocean crossing - legendary pilot skills',
  },
  AROUND_WORLD: {
    id: 'around_world',
    name: 'Around the World',
    shortName: 'World Tour',
    icon: '🌍',
    minMultiplier: 50.0,
    maxMultiplier: 100.0,
    color: 'purple',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
    borderClass: 'border-purple-300',
    badgeClass: 'badge-around-world',
    multiplierClass: 'multiplier-around-world',
    description: 'Circumnavigating the globe - aviation legend!',
  },
  MOON: {
    id: 'moon',
    name: 'To the Moon!',
    shortName: 'Moon',
    icon: '🌙',
    minMultiplier: 100.0,
    maxMultiplier: Infinity,
    color: 'gold',
    bgClass: 'bg-gradient-to-r from-yellow-200 to-amber-300',
    textClass: 'text-amber-900',
    borderClass: 'border-amber-400',
    badgeClass: 'badge-moon',
    multiplierClass: 'multiplier-moon',
    description: 'Breaking atmosphere - TO THE MOON!',
  },
};

/**
 * Get flight type based on multiplier value
 * @param {number} multiplier - The game multiplier
 * @returns {Object} Flight type configuration
 */
export function getFlightType(multiplier) {
  if (multiplier < 1.5) return FLIGHT_TYPES.EMERGENCY;
  if (multiplier < 2.0) return FLIGHT_TYPES.SHORT;
  if (multiplier < 5.0) return FLIGHT_TYPES.DOMESTIC;
  if (multiplier < 10.0) return FLIGHT_TYPES.INTERNATIONAL;
  if (multiplier < 50.0) return FLIGHT_TYPES.TRANSATLANTIC;
  if (multiplier < 100.0) return FLIGHT_TYPES.AROUND_WORLD;
  return FLIGHT_TYPES.MOON;
}

/**
 * Get all flight types as an array
 * @returns {Array} Array of flight type configurations
 */
export function getAllFlightTypes() {
  return Object.values(FLIGHT_TYPES);
}

/**
 * Chart Colors for vintage theme
 */
export const CHART_COLORS = [
  '#92400e', '#a16207', '#ca8a04', '#d97706',
  '#0ea5e9', '#38bdf8', '#78350f', '#b45309'
];

/**
 * Responsible Gambling Resources
 */
export const RESPONSIBLE_GAMBLING = {
  warning: 'Gambling can be addictive. Please play responsibly.',
  ageRestriction: 'You must be 18+ (or legal gambling age in your jurisdiction) to gamble.',
  resources: [
    {
      name: 'GamCare',
      url: 'https://www.gamcare.org.uk',
      phone: '0808 8020 133',
    },
    {
      name: 'Gamblers Anonymous',
      url: 'https://www.gamblersanonymous.org',
    },
    {
      name: 'BeGambleAware',
      url: 'https://www.begambleaware.org',
      phone: '0808 8020 133',
    },
    {
      name: 'National Council on Problem Gambling',
      url: 'https://www.ncpgambling.org',
      phone: '1-800-522-4700',
    },
  ],
  tips: [
    'Set a budget before you play and stick to it',
    'Never chase your losses',
    'Take regular breaks from gambling',
    'Never gamble when upset or stressed',
    'Gambling should be entertainment, not income',
    "Past results don't predict future outcomes",
  ],
};

/**
 * Disclaimer Text
 */
export const DISCLAIMER = {
  affiliation: 'Pilot Game Tracker is an independent statistics tracking website. We are NOT affiliated with, endorsed by, or connected to Gamzix or any casino operator.',
  educational: 'This website is for educational and entertainment purposes only. We do not encourage gambling.',
  noGuarantee: 'Past statistics do not guarantee future results. The game uses a Random Number Generator (RNG) and each round is independent.',
  gamblersFallacy: "Remember: Past results do not predict future outcomes. Each flight is independent. This is known as the Gambler's Fallacy.",
  copyright: 'Pilot is a trademark of Gamzix. All rights reserved.',
};

/**
 * Contact Information
 */
export const CONTACT = {
  general: 'contact@pilotgametracker.com',
  business: 'business@pilotgametracker.com',
  legal: 'legal@pilotgametracker.com',
  privacy: 'privacy@pilotgametracker.com',
};

export default GAME_CONFIG;
