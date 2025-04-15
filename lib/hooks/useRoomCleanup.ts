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

    // Handle navigation using the History API
    const handlePopState = () => {
      cleanup();
    };
    window.addEventListener('popstate', handlePopState);

    // Handle clicks on links and navigation
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href && !link.href.startsWith('#')) {
        cleanup();
      }
    };
    document.addEventListener('click', handleClick);

    // Cleanup function for component unmounting
    return () => {
      cleanup(); // Clean up when component unmounts
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, [roomId, playerId, removePlayer]);
} 