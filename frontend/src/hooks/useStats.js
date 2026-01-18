import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../config/gameConfig';

/**
 * Custom hook for fetching and managing Pilot game statistics
 */
export function useStats(options = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch stats from API
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.stats}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API response to expected format
      const transformedStats = {
        totalRounds: data.totalRounds || data.total_rounds || data.totalFlights || 0,
        averageMultiplier: parseFloat(data.averageMultiplier || data.average_multiplier || data.avgMultiplier || 0),
        highestMultiplier: parseFloat(data.highestMultiplier || data.highest_multiplier || data.maxMultiplier || 0),
        lowestMultiplier: parseFloat(data.lowestMultiplier || data.lowest_multiplier || data.minMultiplier || 1),
        lastHourRounds: data.lastHourRounds || data.last_hour_rounds || 0,
        last24HoursRounds: data.last24HoursRounds || data.last_24_hours_rounds || 0,

        // Flight type distribution
        distribution: data.distribution || {
          emergency: data.emergencyCount || 0,
          short: data.shortCount || 0,
          domestic: data.domesticCount || 0,
          international: data.internationalCount || 0,
          transatlantic: data.transatlanticCount || 0,
          aroundWorld: data.aroundWorldCount || 0,
          moon: data.moonCount || 0,
        },

        // Streaks and patterns
        currentStreak: data.currentStreak || null,
        longestStreak: data.longestStreak || null,

        // Time-based stats
        hourlyStats: data.hourlyStats || [],
        dailyStats: data.dailyStats || [],
      };

      setStats(transformedStats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);

      // Set demo stats if API fails
      if (!stats) {
        setStats(generateDemoStats());
      }
    } finally {
      setLoading(false);
    }
  }, [stats]);

  // Manual refetch function
  const refetch = useCallback(() => {
    return fetchStats();
  }, [fetchStats]);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchStats();

    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchStats, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchStats, autoRefresh, refreshInterval]);

  return {
    stats,
    loading,
    error,
    lastUpdated,
    refetch,
  };
}

/**
 * Generate demo statistics for testing
 */
function generateDemoStats() {
  const totalRounds = Math.floor(Math.random() * 50000) + 100000;

  return {
    totalRounds,
    averageMultiplier: 2.5 + Math.random() * 0.5,
    highestMultiplier: 5000 + Math.random() * 5000,
    lowestMultiplier: 1.0,
    lastHourRounds: Math.floor(Math.random() * 200) + 100,
    last24HoursRounds: Math.floor(Math.random() * 4000) + 2000,

    distribution: {
      emergency: Math.floor(totalRounds * 0.25),
      short: Math.floor(totalRounds * 0.20),
      domestic: Math.floor(totalRounds * 0.25),
      international: Math.floor(totalRounds * 0.15),
      transatlantic: Math.floor(totalRounds * 0.09),
      aroundWorld: Math.floor(totalRounds * 0.04),
      moon: Math.floor(totalRounds * 0.02),
    },

    currentStreak: {
      type: 'domestic',
      count: Math.floor(Math.random() * 5) + 1,
    },
    longestStreak: {
      type: 'emergency',
      count: Math.floor(Math.random() * 10) + 5,
    },

    hourlyStats: generateHourlyStats(),
    dailyStats: generateDailyStats(),
  };
}

/**
 * Generate demo hourly statistics
 */
function generateHourlyStats() {
  const stats = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const hour = new Date(now);
    hour.setHours(hour.getHours() - i);

    stats.push({
      hour: hour.getHours(),
      timestamp: hour.toISOString(),
      rounds: Math.floor(Math.random() * 150) + 50,
      averageMultiplier: 2 + Math.random() * 1.5,
      highestMultiplier: 10 + Math.random() * 100,
    });
  }

  return stats;
}

/**
 * Generate demo daily statistics
 */
function generateDailyStats() {
  const stats = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);

    stats.push({
      date: day.toISOString().split('T')[0],
      timestamp: day.toISOString(),
      rounds: Math.floor(Math.random() * 3000) + 2000,
      averageMultiplier: 2 + Math.random() * 1,
      highestMultiplier: 500 + Math.random() * 2000,
      emergencyRate: 0.2 + Math.random() * 0.1,
      moonRate: 0.01 + Math.random() * 0.02,
    });
  }

  return stats;
}

export default useStats;
