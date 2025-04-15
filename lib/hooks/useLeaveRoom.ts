import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export function useLeaveRoom(roomId: Id<"rooms">, playerId: string) {
  const removePlayer = useMutation(api.rooms.removePlayerFromRoom);

  useEffect(() => {
    if (!playerId) return; // Don't set up listeners if we don't have a playerId

    let isUnloading = false;

    const cleanup = async () => {
      if (!isUnloading) {
        try {
          await removePlayer({ roomId, playerId });
        } catch (error) {
          console.error('Error removing player:', error);
        }
      }
    };

    const handleBeforeUnload = () => {
      isUnloading = true;
      // Synchronously remove the player
      removePlayer({ roomId, playerId });
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        try {
          await removePlayer({ roomId, playerId });
        } catch (error) {
          console.error('Error removing player:', error);
        }
      }
    };

    // Handle tab/browser closing
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Handle tab switching/minimizing
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function to handle component unmounting
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanup();
    };
  }, [roomId, playerId, removePlayer]);
} 