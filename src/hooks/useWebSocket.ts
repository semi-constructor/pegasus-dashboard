"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketHook {
  socket: Socket | null;
  isConnected: boolean;
  subscribe: (event: string, callback: (...args: any[]) => void) => void;
  unsubscribe: (event: string, callback?: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

export function useWebSocket(namespace: string = "/"): WebSocketHook {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In production, this should point to your API URL
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:2000";
    
    const socketInstance = io(`${url}${namespace}`, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log(`WebSocket connected to ${namespace}`);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log(`WebSocket disconnected from ${namespace}`);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [namespace]);

  const subscribe = useCallback((event: string, callback: (...args: any[]) => void) => {
    if (!socket) return;
    socket.on(event, callback);
  }, [socket]);

  const unsubscribe = useCallback((event: string, callback?: (...args: any[]) => void) => {
    if (!socket) return;
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }, [socket]);

  const emit = useCallback((event: string, ...args: any[]) => {
    if (!socket) return;
    socket.emit(event, ...args);
  }, [socket]);

  return { socket, isConnected, subscribe, unsubscribe, emit };
}
