import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export function useRoomCleanup(roomId: Id<"rooms">, playerId: string) {
  const removePlayer = useMutation(api.rooms.removePlayerFromRoom);

  useEffect(() => {
    if (!playerId || !roomId) return;

    const cleanup = async () => {
      try {
        await removePlayer({ roomId, playerId });
      } catch (error) {
        console.error('Error removing player:', error);
      }
    };

    const handleUnload = () => {
      // Create a cleanup promise
      const cleanupPromise = cleanup();
      
      // Block the unload event until cleanup is done
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Busy wait to ensure the mutation is sent
      }
    };

    // Handle tab/browser closing
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);

    // Cleanup function for component unmounting
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [roomId, playerId, removePlayer]);
} 