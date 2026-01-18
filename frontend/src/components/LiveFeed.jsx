import { useState, useEffect, useRef } from 'react';
import {
  Plane,
  Clock,
  TrendingUp,
  AlertTriangle,
  Gauge,
  Wind,
  Navigation,
} from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { getFlightType, getAllFlightTypes } from '../config/gameConfig';
import { formatMultiplier, formatTime, getTimeAgo } from '../utils/formatters';

function LiveFeed() {
  const { history, lastResult, isConnected } = useWebSocket();
  const feedRef = useRef(null);
  const [filter, setFilter] = useState('all');

  // Auto-scroll to top when new results come in
  useEffect(() => {
    if (feedRef.current && lastResult) {
      feedRef.current.scrollTop = 0;
    }
  }, [lastResult]);

  // Filter history based on selected flight type
  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    const flightType = getFlightType(item.multiplier);
    return flightType.id === filter;
  });

  // Get flight-themed message based on multiplier
  const getFlightMessage = (multiplier) => {
    const type = getFlightType(multiplier);
    const messages = {
      emergency: [
        'Mayday! Emergency landing!',
        'Engine failure detected!',
        'Aborted takeoff!',
        'Emergency protocols engaged!',
      ],
      short: [
        'Quick hop completed',
        'Short runway approach',
        'Brief flight concluded',
        'Local pattern flight',
      ],
      domestic: [
        'Domestic route completed',
        'Regional flight landed',
        'Steady cruise achieved',
        'Cross-country success',
      ],
      international: [
        'International flight arrived',
        'Border crossing complete',
        'Long-haul success!',
        'Overseas journey done',
      ],
      transatlantic: [
        'Transatlantic crossing!',
        'Ocean voyage complete!',
        'Legendary flight path!',
        'Across the pond!',
      ],
      around_world: [
        'Around the world flight!',
        'Global circumnavigation!',
        'World tour complete!',
        'Epic journey finished!',
      ],
      moon: [
        'TO THE MOON!',
        'Leaving atmosphere!',
        'Lunar trajectory achieved!',
        'ASTRONOMICAL FLIGHT!',
      ],
    };
    const typeMessages = messages[type.id] || messages.domestic;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  // Generate demo data if no history
  const displayHistory = filteredHistory.length > 0 ? filteredHistory : generateDemoHistory();

  function generateDemoHistory() {
    const demoData = [];
    const now = Date.now();
    for (let i = 0; i < 50; i++) {
      // Generate realistic multiplier distribution
      const rand = Math.random();
      let multiplier;
      if (rand < 0.25) multiplier = 1 + Math.random() * 0.5; // Emergency
      else if (rand < 0.45) multiplier = 1.5 + Math.random() * 0.5; // Short
      else if (rand < 0.70) multiplier = 2 + Math.random() * 3; // Domestic
      else if (rand < 0.85) multiplier = 5 + Math.random() * 5; // International
      else if (rand < 0.94) multiplier = 10 + Math.random() * 40; // Transatlantic
      else if (rand < 0.98) multiplier = 50 + Math.random() * 50; // Around World
      else multiplier = 100 + Math.random() * 900; // Moon

      demoData.push({
        id: `demo-${i}`,
        multiplier: Math.round(multiplier * 100) / 100,
        timestamp: now - i * 15000 - Math.random() * 5000,
        gameId: `FLIGHT-${1000 + i}`,
      });
    }
    return demoData;
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-pilot-dark flex items-center gap-1">
          <Navigation className="w-4 h-4" />
          Filter:
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-pilot-dark text-pilot-cream'
              : 'bg-pilot-cream-dark/50 text-pilot-brown hover:bg-pilot-cream-dark'
          }`}
        >
          All Flights
        </button>
        {getAllFlightTypes().map((type) => (
          <button
            key={type.id}
            onClick={() => setFilter(type.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filter === type.id
                ? `${type.bgClass} ${type.textClass} border ${type.borderClass}`
                : 'bg-pilot-cream-dark/50 text-pilot-brown hover:bg-pilot-cream-dark'
            }`}
          >
            {type.icon} {type.shortName}
          </button>
        ))}
      </div>

      {/* Live Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-pilot-brown">
            {isConnected ? 'Live radar feed' : 'Connecting to tower...'}
          </span>
        </div>
        <span className="text-sm text-pilot-brown">
          Showing {displayHistory.length} flights
        </span>
      </div>

      {/* Flight Log */}
      <div
        ref={feedRef}
        className="max-h-96 overflow-y-auto border-2 border-pilot-tan/30 rounded-vintage bg-pilot-cream-light/50"
      >
        {displayHistory.length === 0 ? (
          <div className="p-8 text-center text-pilot-brown">
            <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No flights matching this filter</p>
          </div>
        ) : (
          <div className="divide-y divide-pilot-tan/20">
            {displayHistory.map((flight, index) => {
              const flightType = getFlightType(flight.multiplier);
              const isLatest = index === 0;

              return (
                <div
                  key={flight.id || `flight-${index}`}
                  className={`flight-log-entry ${
                    isLatest ? 'bg-pilot-cream-dark/30 animate-fade-in' : ''
                  }`}
                >
                  {/* Flight Icon */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${flightType.bgClass} border ${flightType.borderClass}`}
                    >
                      <span className="text-lg">{flightType.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${flightType.multiplierClass}`}>
                          {formatMultiplier(flight.multiplier)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${flightType.bgClass} ${flightType.textClass}`}>
                          {flightType.shortName}
                        </span>
                        {isLatest && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-pilot-brown/70 mt-0.5">
                        {flight.gameId || `Flight #${flight.id}`}
                      </div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <div className="text-xs text-pilot-brown/70">Status</div>
                      <div className={`text-sm font-medium ${flightType.textClass}`}>
                        {flight.multiplier >= 100 ? 'LEGENDARY' : flight.multiplier >= 10 ? 'Excellent' : flight.multiplier >= 2 ? 'Completed' : 'Crashed'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-pilot-brown/70 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        Time
                      </div>
                      <div className="text-sm text-pilot-dark">
                        {getTimeAgo(flight.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {displayHistory.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-pilot-cream-dark/30 rounded-vintage p-3 text-center">
            <div className="text-xs text-pilot-brown uppercase">Highest</div>
            <div className="font-bold text-green-600">
              {formatMultiplier(Math.max(...displayHistory.map((f) => f.multiplier)))}
            </div>
          </div>
          <div className="bg-pilot-cream-dark/30 rounded-vintage p-3 text-center">
            <div className="text-xs text-pilot-brown uppercase">Lowest</div>
            <div className="font-bold text-red-600">
              {formatMultiplier(Math.min(...displayHistory.map((f) => f.multiplier)))}
            </div>
          </div>
          <div className="bg-pilot-cream-dark/30 rounded-vintage p-3 text-center">
            <div className="text-xs text-pilot-brown uppercase">Average</div>
            <div className="font-bold text-pilot-sky">
              {formatMultiplier(
                displayHistory.reduce((a, b) => a + b.multiplier, 0) / displayHistory.length
              )}
            </div>
          </div>
          <div className="bg-pilot-cream-dark/30 rounded-vintage p-3 text-center">
            <div className="text-xs text-pilot-brown uppercase">Emergencies</div>
            <div className="font-bold text-orange-600">
              {displayHistory.filter((f) => f.multiplier < 1.5).length}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-vintage border border-amber-200 text-xs text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Remember:</strong> Each flight is independent. Past results do not predict future outcomes.
          The game uses RNG - patterns are coincidental, not predictive.
        </p>
      </div>
    </div>
  );
}

export default LiveFeed;
