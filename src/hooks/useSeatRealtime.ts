"use client";

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SeatData {
  showtimeId: string;
  bookedSeats: string[];
  lockedSeats: string[];
  totalSeats: number;
  availableSeats: number;
  lastUpdate?: string;
}

export function useSeatRealtime(showtimeId: string | null) {
  const [seatData, setSeatData] = useState<SeatData | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!showtimeId) return;

    // Connect to WebSocket
    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    const socket = io(`${socketUrl}/seats`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      
      // Join showtime room
      socket.emit('joinShowtime', { showtimeId });
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

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leaveShowtime', { showtimeId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [showtimeId]);

  const selectSeats = (seats: string[], userId: string) => {
    if (socketRef.current && showtimeId) {
      socketRef.current.emit('selectSeats', {
        showtimeId,
        seats,
        userId,
      });
    }
  };

  const notifyBookingCreated = () => {
    if (socketRef.current && showtimeId) {
      socketRef.current.emit('bookingCreated', { showtimeId });
    }
  };

  return {
    seatData,
    connected,
    selectSeats,
    notifyBookingCreated,
  };
}
