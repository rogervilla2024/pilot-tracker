import React, { useState, useMemo, useEffect } from 'react';

/**
 * Cockpit Dashboard - Pilot Game
 * Aviation-themed dashboard with pilot controls
 */
export function CockpitDashboard({ rtp = 97 }) {
  const [altitude, setAltitude] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [flightLog, setFlightLog] = useState([]);
  const [stats, setStats] = useState({ flights: 0, wins: 0, profit: 0, maxAltitude: 0 });
  const [instruments, setInstruments] = useState({
    speed: 0,
    fuel: 100,
    heading: 0
  });

  // Generate crash point
  const generateCrash = () => {
    const random = Math.random();
    const crash = Math.max(1.0, (rtp / 100) / (1 - random));
    return Math.min(crash, 10000);
  };

  // Simulate flight
  const startFlight = () => {
    if (isFlying) return;
    setIsFlying(true);
    setAltitude(1.0);

    const crashPoint = generateCrash();
    const won = crashPoint >= autoCashout;
    const profit = won ? betAmount * (autoCashout - 1) : -betAmount;

    // Animate
    let currentAlt = 1.0;
    const maxAlt = Math.min(crashPoint, autoCashout + 0.5);

    const interval = setInterval(() => {
      currentAlt += 0.02 + Math.random() * 0.05;
      setAltitude(currentAlt);

      // Update instruments
      setInstruments({
        speed: Math.min(currentAlt * 100, 999),
        fuel: Math.max(0, 100 - currentAlt * 5),
        heading: (Date.now() / 100) % 360
      });

      if (currentAlt >= maxAlt || currentAlt >= crashPoint) {
        clearInterval(interval);
        setIsFlying(false);
        setAltitude(crashPoint);

        setFlightLog(prev => [{
          crash: crashPoint,
          target: autoCashout,
          won,
          profit,
          timestamp: Date.now()
        }, ...prev].slice(0, 50));

        setStats(prev => ({
          flights: prev.flights + 1,
          wins: prev.wins + (won ? 1 : 0),
          profit: prev.profit + profit,
          maxAltitude: Math.max(prev.maxAltitude, crashPoint)
        }));
      }
    }, 50);
  };

  // Quick simulate
  const quickSimulate = (count) => {
    for (let i = 0; i < count; i++) {
      const crashPoint = generateCrash();
      const won = crashPoint >= autoCashout;
      const profit = won ? betAmount * (autoCashout - 1) : -betAmount;

      setFlightLog(prev => [{
        crash: crashPoint,
        target: autoCashout,
        won,
        profit,
        timestamp: Date.now()
      }, ...prev].slice(0, 50));

      setStats(prev => ({
        flights: prev.flights + 1,
        wins: prev.wins + (won ? 1 : 0),
        profit: prev.profit + profit,
        maxAltitude: Math.max(prev.maxAltitude, crashPoint)
      }));
    }
  };

  const calculations = useMemo(() => {
    const winProbability = ((rtp / 100) / autoCashout) * 100;
    const potentialWin = betAmount * (autoCashout - 1);

    return { winProbability, potentialWin };
  }, [autoCashout, betAmount, rtp]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">👨‍✈️</span>
        Cockpit Dashboard
        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded ml-2">PILOT</span>
      </h3>

      {/* Cockpit Instrument Panel */}
      <div className="bg-gray-950 rounded-lg p-4 mb-6 border-2 border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          {/* Altimeter */}
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-600">
            <div className="text-xs text-gray-400 mb-1">ALTIMETER</div>
            <div className={`text-3xl font-bold font-mono ${isFlying ? 'text-green-400 animate-pulse' : 'text-yellow-400'}`}>
              {altitude.toFixed(2)}x
            </div>
            <div className="text-xs text-gray-500">Multiplier</div>
          </div>

          {/* Speedometer */}
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-600">
            <div className="text-xs text-gray-400 mb-1">AIRSPEED</div>
            <div className="text-3xl font-bold font-mono text-blue-400">
              {instruments.speed.toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">knots</div>
          </div>

          {/* Fuel */}
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-600">
            <div className="text-xs text-gray-400 mb-1">FUEL</div>
            <div className={`text-3xl font-bold font-mono ${
              instruments.fuel > 50 ? 'text-green-400' :
              instruments.fuel > 20 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {instruments.fuel.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">remaining</div>
          </div>
        </div>

        {/* Horizon Indicator */}
        <div className="mt-4 bg-gradient-to-b from-blue-900 to-brown-700 h-24 rounded-lg relative overflow-hidden border border-gray-600">
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform"
            style={{ transform: `rotate(${Math.sin(instruments.heading / 50) * 10}deg)` }}
          >
            <div className="w-full h-0.5 bg-yellow-400"></div>
            <div className="absolute w-8 h-8 border-2 border-yellow-400 rounded-full flex items-center justify-center">
              <div className="text-yellow-400 text-xl">✈️</div>
            </div>
          </div>
          <div className="absolute top-2 left-2 text-xs text-white/50">ARTIFICIAL HORIZON</div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-gray-400 text-xs mb-1">Bet Amount ($)</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 1)}
            disabled={isFlying}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1">Auto Eject At</label>
          <input
            type="number"
            step="0.1"
            value={autoCashout}
            onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 1.1)}
            disabled={isFlying}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1">Success Rate</label>
          <div className={`bg-gray-800 border border-gray-600 rounded px-3 py-2 font-mono ${
            calculations.winProbability > 50 ? 'text-green-400' : 'text-red-400'
          }`}>
            {calculations.winProbability.toFixed(1)}%
          </div>
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1">Potential Win</label>
          <div className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-green-400 font-mono">
            +${calculations.potentialWin.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={startFlight}
          disabled={isFlying}
          className="flex-1 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-bold text-lg"
        >
          {isFlying ? '✈️ IN FLIGHT...' : '🛫 TAKE OFF'}
        </button>
        <button
          onClick={() => quickSimulate(10)}
          disabled={isFlying}
          className="px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium"
        >
          10x
        </button>
        <button
          onClick={() => quickSimulate(100)}
          disabled={isFlying}
          className="px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium"
        >
          100x
        </button>
      </div>

      {/* Flight Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-xs text-gray-400">Total Flights</div>
          <div className="text-2xl font-bold text-white font-mono">{stats.flights}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-xs text-gray-400">Success Rate</div>
          <div className={`text-2xl font-bold font-mono ${
            stats.flights > 0 && (stats.wins / stats.flights) >= 0.5 ? 'text-green-400' : 'text-red-400'
          }`}>
            {stats.flights > 0 ? ((stats.wins / stats.flights) * 100).toFixed(1) : 0}%
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-xs text-gray-400">Highest Altitude</div>
          <div className="text-2xl font-bold text-blue-400 font-mono">{stats.maxAltitude.toFixed(2)}x</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-xs text-gray-400">Total Profit</div>
          <div className={`text-2xl font-bold font-mono ${stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Flight Log */}
      {flightLog.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-2 font-mono">FLIGHT LOG</h4>
          <div className="flex flex-wrap gap-2">
            {flightLog.slice(0, 20).map((flight, idx) => (
              <div
                key={idx}
                className={`px-3 py-1 rounded font-mono text-sm ${
                  flight.won ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {flight.crash.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CockpitDashboard;
