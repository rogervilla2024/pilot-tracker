import { useState, useMemo } from 'react';
import {
  Plane,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Clock,
  Target,
  AlertCircle,
  RefreshCw,
  Compass,
  Gauge,
  Wind,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import LiveFeed from '../components/LiveFeed';
import { useStats } from '../hooks/useStats';
import { useWebSocket } from '../hooks/useWebSocket';
import {
  GAME_CONFIG,
  FLIGHT_TYPES,
  getAllFlightTypes,
  getFlightType,
  CHART_COLORS,
  DISCLAIMER,
} from '../config/gameConfig';
import { formatMultiplier, formatNumber, formatPercentage, formatTime } from '../utils/formatters';

function HomePage() {
  const { stats, loading, error, refetch } = useStats();
  const { lastResult, isConnected, history } = useWebSocket();
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  // Calculate flight type distribution from history
  const flightTypeDistribution = useMemo(() => {
    if (!history || history.length === 0) {
      // Return demo data if no history
      return getAllFlightTypes().map((type) => ({
        name: type.shortName,
        value: Math.floor(Math.random() * 100) + 10,
        color: type.color,
        fullName: type.name,
        icon: type.icon,
      }));
    }

    const distribution = {};
    getAllFlightTypes().forEach((type) => {
      distribution[type.id] = {
        name: type.shortName,
        fullName: type.name,
        value: 0,
        color: type.color,
        icon: type.icon,
      };
    });

    history.forEach((result) => {
      const flightType = getFlightType(result.multiplier);
      distribution[flightType.id].value++;
    });

    return Object.values(distribution);
  }, [history]);

  // Calculate stats from history
  const calculatedStats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        totalFlights: 0,
        averageMultiplier: 0,
        highestMultiplier: 0,
        lowestMultiplier: 0,
        emergencyRate: 0,
        moonRate: 0,
      };
    }

    const multipliers = history.map((h) => h.multiplier);
    const total = multipliers.length;
    const sum = multipliers.reduce((a, b) => a + b, 0);
    const emergencies = multipliers.filter((m) => m < 1.5).length;
    const moons = multipliers.filter((m) => m >= 100).length;

    return {
      totalFlights: total,
      averageMultiplier: sum / total,
      highestMultiplier: Math.max(...multipliers),
      lowestMultiplier: Math.min(...multipliers),
      emergencyRate: (emergencies / total) * 100,
      moonRate: (moons / total) * 100,
    };
  }, [history]);

  // Pie chart colors
  const PIE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#f59e0b'];

  const timeframes = [
    { id: '1h', label: '1 Hour' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-pilot-dark mb-2 text-shadow-vintage">
          Flight Control Tower
        </h1>
        <p className="text-pilot-brown text-lg">
          Real-time {GAME_CONFIG.name} statistics by {GAME_CONFIG.provider}
        </p>
      </div>

      {/* Connection Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 card-vintage px-4 py-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-semibold text-pilot-dark">
              {isConnected ? 'Radar Active' : 'Radar Offline'}
            </span>
          </div>

          {/* Last Flight */}
          {lastResult && (
            <div className="card-vintage px-4 py-2">
              <span className="text-sm text-pilot-brown">Last Flight: </span>
              <span className={`font-bold ${getFlightType(lastResult.multiplier).multiplierClass}`}>
                {formatMultiplier(lastResult.multiplier)}
              </span>
            </div>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setSelectedTimeframe(tf.id)}
              className={`px-4 py-2 rounded-vintage text-sm font-semibold transition-all ${
                selectedTimeframe === tf.id
                  ? 'btn-brass'
                  : 'bg-pilot-cream-dark/50 text-pilot-brown hover:bg-pilot-cream-dark border border-pilot-tan/30'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Total Flights */}
        <div className="card-vintage p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 bg-pilot-dark/10 rounded-full flex items-center justify-center">
            <Plane className="w-5 h-5 text-pilot-dark" />
          </div>
          <div className="stat-value">{formatNumber(calculatedStats.totalFlights || stats?.totalRounds || 0)}</div>
          <div className="stat-label">Total Flights</div>
        </div>

        {/* Average Altitude */}
        <div className="card-vintage p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 bg-pilot-sky/10 rounded-full flex items-center justify-center">
            <Gauge className="w-5 h-5 text-pilot-sky" />
          </div>
          <div className="stat-value text-pilot-sky">
            {formatMultiplier(calculatedStats.averageMultiplier || stats?.averageMultiplier || 0)}
          </div>
          <div className="stat-label">Avg Altitude</div>
        </div>

        {/* Highest Flight */}
        <div className="card-vintage p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="stat-value text-green-600">
            {formatMultiplier(calculatedStats.highestMultiplier || stats?.highestMultiplier || 0)}
          </div>
          <div className="stat-label">Record Flight</div>
        </div>

        {/* Lowest Flight */}
        <div className="card-vintage p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div className="stat-value text-red-600">
            {formatMultiplier(calculatedStats.lowestMultiplier || stats?.lowestMultiplier || 1.0)}
          </div>
          <div className="stat-label">Emergency</div>
        </div>

        {/* Emergency Rate */}
        <div className="card-vintage p-4 text-center">
          <div className="w-10 h-10 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="stat-value text-orange-600">
            {formatPercentage(calculatedStats.emergencyRate || 0)}
          </div>
          <div className="stat-label">Emergency Rate</div>
        </div>

        {/* Moon Flight Rate */}
        <div className="card-vintage p-4 text-center bg-gradient-to-br from-amber-50 to-yellow-100">
          <div className="w-10 h-10 mx-auto mb-2 bg-amber-200 rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-700" />
          </div>
          <div className="stat-value text-amber-700">
            {formatPercentage(calculatedStats.moonRate || 0)}
          </div>
          <div className="stat-label">Moon Flights</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flight Type Distribution - Pie Chart */}
        <div className="card-vintage p-6">
          <h2 className="text-xl font-display font-semibold text-pilot-dark mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-pilot-gold" />
            Flight Type Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={flightTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {flightTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: '#fef3c7',
                    border: '2px solid #ca8a04',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flight Type Bar Chart */}
        <div className="card-vintage p-6">
          <h2 className="text-xl font-display font-semibold text-pilot-dark mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pilot-gold" />
            Flight Statistics
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flightTypeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ca8a04" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#92400e', fontSize: 12 }}
                  axisLine={{ stroke: '#ca8a04' }}
                />
                <YAxis
                  tick={{ fill: '#92400e', fontSize: 12 }}
                  axisLine={{ stroke: '#ca8a04' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fef3c7',
                    border: '2px solid #ca8a04',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" name="Flights" radius={[4, 4, 0, 0]}>
                  {flightTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Flight Types Legend */}
      <div className="card-vintage p-6">
        <h2 className="text-xl font-display font-semibold text-pilot-dark mb-4 flex items-center gap-2">
          <Wind className="w-5 h-5 text-pilot-gold" />
          Flight Type Guide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {getAllFlightTypes().map((type) => (
            <div
              key={type.id}
              className={`p-3 rounded-vintage border-2 ${type.bgClass} ${type.borderClass}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{type.icon}</span>
                <span className={`font-semibold ${type.textClass}`}>{type.shortName}</span>
              </div>
              <div className={`text-sm ${type.textClass} opacity-80`}>
                {type.minMultiplier}x - {type.maxMultiplier === Infinity ? '∞' : `${type.maxMultiplier}x`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Feed Section */}
      <div className="card-vintage p-6">
        <h2 className="text-xl font-display font-semibold text-pilot-dark mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-pilot-gold animate-pulse" />
          Live Flight Log
        </h2>
        <LiveFeed />
      </div>

      {/* RTP Information */}
      <div className="card-vintage p-6">
        <h2 className="text-xl font-display font-semibold text-pilot-dark mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-pilot-gold" />
          Game Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-pilot-cream-dark/30 rounded-vintage">
            <div className="text-3xl font-bold text-pilot-dark mb-1">{GAME_CONFIG.rtp}%</div>
            <div className="text-sm text-pilot-brown">Return to Player (RTP)</div>
            <p className="text-xs text-pilot-brown/70 mt-2">
              Theoretical return over millions of rounds
            </p>
          </div>
          <div className="text-center p-4 bg-pilot-cream-dark/30 rounded-vintage">
            <div className="text-3xl font-bold text-pilot-dark mb-1">{GAME_CONFIG.houseEdge}%</div>
            <div className="text-sm text-pilot-brown">House Edge</div>
            <p className="text-xs text-pilot-brown/70 mt-2">
              Casino advantage per round
            </p>
          </div>
          <div className="text-center p-4 bg-pilot-cream-dark/30 rounded-vintage">
            <div className="text-3xl font-bold text-pilot-gold mb-1">{GAME_CONFIG.maxMultiplier.toLocaleString()}x</div>
            <div className="text-sm text-pilot-brown">Maximum Multiplier</div>
            <p className="text-xs text-pilot-brown/70 mt-2">
              Highest possible payout
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer-box">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-pilot-brown flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p><strong>Educational Purpose Only:</strong> {DISCLAIMER.educational}</p>
            <p><strong>No Guarantee:</strong> {DISCLAIMER.noGuarantee}</p>
            <p><strong>Independence:</strong> {DISCLAIMER.affiliation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
