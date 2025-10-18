// src/hooks/useStockSocket.ts
import { useEffect, useRef, useCallback, useState } from "react";
import { FINNHUB_WS_URL } from "../constants";

type TradeData = { s: string; p: number; t: number };

interface UseStockSocketParams {
  onTrade: (trades: TradeData[]) => void;
}

/**
 * Custom hook to manage a WebSocket connection for real-time stock data.
 * It handles connection, disconnection, automatic reconnection, and a ping/pong
 * mechanism to keep the connection alive.
 * @param {UseStockSocketParams} params - The parameters for the hook.
 * @param {function} params.onTrade - Callback function to be executed when new trade data is received.
 * @returns An object containing methods to interact with the socket and its status.
 */
export const useStockSocket = ({ onTrade }: UseStockSocketParams) => {
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);
  const pingInterval = useRef<number | null>(null);
  const reconnectTimeout = useRef<number | null>(null);

  /**
   * Sends a 'subscribe' message to the WebSocket for a given stock symbol.
   */
  const subscribe = useCallback((symbol: string) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      console.log("✅ Subscribing to:", symbol);
      socket.current.send(JSON.stringify({ type: "subscribe", symbol }));
    } else {
      console.warn("⚠️ Cannot subscribe, socket not open");
    }
  }, []);

  /**
   * Sends an 'unsubscribe' message to the WebSocket for a given stock symbol.
   */
  const unsubscribe = useCallback((symbol: string) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      console.log("❌ Unsubscribing from:", symbol);
      socket.current.send(JSON.stringify({ type: "unsubscribe", symbol }));
    }
  }, []);

  // Main effect for managing the WebSocket lifecycle.
  // This effect is responsible for creating the connection, setting up event listeners,
  // and cleaning up when the component unmounts or a reconnection is attempted.
  useEffect(() => {
    console.log(`🔌 Connecting to WebSocket (Attempt: ${reconnectAttempt})...`);

    socket.current = new WebSocket(FINNHUB_WS_URL);

    /**
     * Starts a 30-second interval to send a 'ping' message to keep the
     * connection alive.
     */
    const startPing = () => {
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
      }

      pingInterval.current = window.setInterval(() => {
        if (socket.current?.readyState === WebSocket.OPEN) {
          socket.current.send(JSON.stringify({ type: "ping" }));
          console.log("🏓 Ping sent");
        }
      }, 30000);
    };

    /**
     * Clears the ping interval.
     */
    const stopPing = () => {
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
        pingInterval.current = null;
      }
    };

    // WebSocket connection established
    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      startPing();
      setIsConnected(true);
    };

    // Handle incoming WebSocket messages
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "ping") {
        console.log("🏓 Ping response received");
        return;
      }

      if (message.type === "trade") {
        console.log("📈 Trade data received:", message.data.length, "trades");
        onTrade(message.data);
      }
    };

    // Handle WebSocket errors
    socket.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setIsConnected(false);
    };

    // Handle WebSocket closing
    socket.current.onclose = (event) => {
      console.log(
        "🔴 WebSocket disconnected. Code:",
        event.code,
        "Reason:",
        event.reason
      );

      stopPing();

      setIsConnected(false);
      // Reconnect if it wasn't a normal close
      if (event.code !== 1000 && event.code !== 1001) {
        console.log("🔄 Reconnecting in 5 seconds...");
        reconnectTimeout.current = setTimeout(() => {
          // Increment the counter to trigger the useEffect and reconnect
          setReconnectAttempt((prev) => prev + 1);
        }, 5000);
      }
    };

    // Cleanup function to run when the component unmounts or before the effect re-runs.
    return () => {
      console.log("🧹 Cleaning up WebSocket connection");

      stopPing();

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }

      if (socket.current) {
        socket.current.close(1000, "Component unmounting");
        socket.current = null;
      }
    };
  }, [subscribe, onTrade, reconnectAttempt]);

  return { subscribe, unsubscribe, isConnected, socketRef: socket };
};
