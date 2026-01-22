"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface SeatData {
  showtimeId: string;
  bookedSeats: string[];
  lockedSeats: string[];
  totalSeats: number;
  availableSeats: number;
  rows?: number;
  seatsPerRow?: number;
  lastUpdate?: string;
}

export function useSeatRealtime(showtimeId: string | null) {
  const [seatData, setSeatData] = useState<SeatData | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const pendingSeatsRef = useRef<string[]>([]);
  const selectDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!showtimeId) return;

    // Get user from localStorage
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?._id || user?.id || 'guest-' + Date.now();

    // Connect to WebSocket FIRST for faster updates
    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    const socket = io(`${socketUrl}/showtimes`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      reconnectionAttempts: 10,
      timeout: 10000,
      forceNew: false,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      
      // Join showtime room with userId
      socket.emit('joinShowtime', { showtimeId, userId });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('seatUpdate', (data: SeatData) => {
      setSeatData(data);
    });

    socket.on('connect_error', () => {
      setConnected(false);
    });

    // Fetch initial seat data (parallel, no blocking)
    const fetchInitialSeats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
        const response = await fetch(`${apiUrl}/showtimes/${showtimeId}/seats`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          setSeatData(data);
        }
      } catch {
        // Socket will provide updates anyway
      }
    };

    fetchInitialSeats();

    // Cleanup on unmount
    return () => {
      if (selectDebounceRef.current) {
        clearTimeout(selectDebounceRef.current);
      }
      if (socketRef.current) {
        socketRef.current.emit('leaveShowtime', { showtimeId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [showtimeId]);

  const selectSeats = useCallback((seats: string[], userId: string) => {
    if (!socketRef.current || !showtimeId) return;

    // Optimistic update
    setSeatData(prev => prev ? {
      ...prev,
      lockedSeats: [...new Set([...prev.lockedSeats, ...seats])],
    } : null);

    // Debounce socket emit
    pendingSeatsRef.current = seats;
    
    if (selectDebounceRef.current) {
      clearTimeout(selectDebounceRef.current);
    }

    selectDebounceRef.current = setTimeout(() => {
      socketRef.current?.emit('selectSeats', {
        showtimeId,
        seats: pendingSeatsRef.current,
        userId,
      });
    }, 100);
  }, [showtimeId]);

  const notifyBookingCreated = useCallback(() => {
    if (socketRef.current && showtimeId) {
      socketRef.current.emit('bookingCreated', { showtimeId });
    }
  }, [showtimeId]);

  return {
    seatData,
    connected,
    selectSeats,
    notifyBookingCreated,
  };
}
