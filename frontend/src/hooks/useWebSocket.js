import { useState, useEffect, useCallback, useRef } from 'react';
import { API_CONFIG } from '../config/gameConfig';

/**
 * Custom hook for WebSocket connection to Pilot game data
 * Handles connection, reconnection, and message parsing
 */
export function useWebSocket(options = {}) {
  const {
    maxHistory = 100,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isUnmountedRef = useRef(false);

  // Add new result to history
  const addToHistory = useCallback((result) => {
    setHistory((prev) => {
      const newHistory = [result, ...prev];
      // Keep only maxHistory items
      return newHistory.slice(0, maxHistory);
    });
    setLastResult(result);
  }, [maxHistory]);

  // Parse incoming WebSocket message
  const parseMessage = useCallback((data) => {
    try {
      const message = typeof data === 'string' ? JSON.parse(data) : data;

      // Handle different message types
      if (message.type === 'result' || message.type === 'crash' || message.type === 'flight_ended') {
        const result = {
          id: message.id || message.gameId || Date.now().toString(),
          multiplier: parseFloat(message.multiplier || message.crashPoint || message.value),
          timestamp: message.timestamp || Date.now(),
          gameId: message.gameId || message.game_id || message.round_id,
        };

        if (!isNaN(result.multiplier) && result.multiplier > 0) {
          addToHistory(result);
        }
      } else if (message.type === 'history' && Array.isArray(message.data)) {
        // Handle bulk history data
        const historyData = message.data.map((item, index) => ({
          id: item.id || item.gameId || `history-${index}`,
          multiplier: parseFloat(item.multiplier || item.crashPoint || item.value),
          timestamp: item.timestamp || Date.now() - index * 15000,
          gameId: item.gameId || item.game_id || item.round_id,
        })).filter((item) => !isNaN(item.multiplier) && item.multiplier > 0);

        setHistory(historyData.slice(0, maxHistory));
        if (historyData.length > 0) {
          setLastResult(historyData[0]);
        }
      } else if (message.type === 'ping') {
        // Respond to ping with pong
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'pong' }));
        }
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  }, [addToHistory, maxHistory]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (isUnmountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = API_CONFIG.wsUrl;
      console.log('Connecting to WebSocket:', wsUrl);

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        if (isUnmountedRef.current) return;
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        setReconnectCount(0);

        // Request initial history
        wsRef.current?.send(JSON.stringify({ type: 'get_history', limit: maxHistory }));
      };

      wsRef.current.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        parseMessage(event.data);
      };

      wsRef.current.onerror = (event) => {
        if (isUnmountedRef.current) return;
        console.error('WebSocket error:', event);
        setError('Connection error');
      };

      wsRef.current.onclose = (event) => {
        if (isUnmountedRef.current) return;
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);

        // Attempt reconnection
        if (reconnectCount < maxReconnectAttempts) {
          const delay = reconnectInterval * Math.pow(1.5, reconnectCount);
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectCount + 1}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              setReconnectCount((prev) => prev + 1);
              connect();
            }
          }, delay);
        } else {
          setError('Max reconnection attempts reached');
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError(err.message);
    }
  }, [maxHistory, maxReconnectAttempts, parseMessage, reconnectCount, reconnectInterval]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof message === 'string' ? message : JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      disconnect();
    };
  }, [connect, disconnect]);

  // Generate demo data if not connected after timeout
  useEffect(() => {
    const demoTimeout = setTimeout(() => {
      if (!isConnected && history.length === 0) {
        console.log('Generating demo flight data');
        const demoData = generateDemoData(50);
        setHistory(demoData);
        setLastResult(demoData[0]);
      }
    }, 5000);

    return () => clearTimeout(demoTimeout);
  }, [isConnected, history.length]);

  return {
    isConnected,
    lastResult,
    history,
    error,
    reconnectCount,
    connect,
    disconnect,
    sendMessage,
  };
}

/**
 * Generate demo flight data for testing
 */
function generateDemoData(count = 50) {
  const now = Date.now();
  const data = [];

  for (let i = 0; i < count; i++) {
    // Generate realistic multiplier distribution based on RTP
    const rand = Math.random();
    let multiplier;

    if (rand < 0.25) {
      // Emergency landing (< 1.5x) - 25%
      multiplier = 1 + Math.random() * 0.5;
    } else if (rand < 0.45) {
      // Short flight (1.5-2x) - 20%
      multiplier = 1.5 + Math.random() * 0.5;
    } else if (rand < 0.70) {
      // Domestic (2-5x) - 25%
      multiplier = 2 + Math.random() * 3;
    } else if (rand < 0.85) {
      // International (5-10x) - 15%
      multiplier = 5 + Math.random() * 5;
    } else if (rand < 0.94) {
      // Transatlantic (10-50x) - 9%
      multiplier = 10 + Math.random() * 40;
    } else if (rand < 0.98) {
      // Around the world (50-100x) - 4%
      multiplier = 50 + Math.random() * 50;
    } else {
      // Moon (100x+) - 2%
      multiplier = 100 + Math.random() * 400;
    }

    data.push({
      id: `demo-${i}`,
      multiplier: Math.round(multiplier * 100) / 100,
      timestamp: now - i * 15000 - Math.random() * 5000,
      gameId: `FLIGHT-${(10000 - i).toString().padStart(5, '0')}`,
    });
  }

  return data;
}

export default useWebSocket;
