import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const PRESENCE_INTERVAL = 5000; // Update presence every 5 seconds

export function usePresence(roomId: Id<"rooms">, playerId: string) {
  const updatePresence = useMutation(api.rooms.updatePresence);

  useEffect(() => {
    if (!playerId || !roomId) return;

    // Update presence immediately
    updatePresence({ roomId, playerId });

    // Set up interval to update presence
    const interval = setInterval(() => {
      updatePresence({ roomId, playerId });
    }, PRESENCE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [roomId, playerId, updatePresence]);
} 