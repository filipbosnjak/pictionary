"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DrawingCanvas from "@/components/DrawingCanvas";
import PlayersList from "@/components/PlayersList";
import GuessInput from "@/components/GuessInput";
import GameChat from "@/components/GameChat";
import RoomIdDisplay from "@/components/RoomIdDisplay";
import { useRoomCleanup } from "@/lib/hooks/useRoomCleanup";
import { usePresence } from "@/lib/hooks/usePresence";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as Id<"rooms">;
  const room = useQuery(api.rooms.getRoom, { roomId });
  const drawing = useQuery(api.drawings.getDrawing, { roomId });
  const [playerId, setPlayerId] = useState<string>("");

  // Get the player ID from localStorage or find it in the room data
  useEffect(() => {
    const storedPlayerId = localStorage.getItem(`player_${roomId}`);
    if (storedPlayerId && room?.players.some((p) => p.id === storedPlayerId)) {
      setPlayerId(storedPlayerId);
    } else if (room?.players.length) {
      // If no stored ID or stored ID not found in room, take the last joined player
      const newPlayerId = room.players[room.players.length - 1].id;
      localStorage.setItem(`player_${roomId}`, newPlayerId);
      setPlayerId(newPlayerId);
    }
  }, [room, roomId]);

  // Use the room cleanup hook to handle tab closing
  useRoomCleanup(roomId, playerId);

  // Use the presence hook to update player's online status
  usePresence(roomId, playerId);

  if (!room) {
    return <div>Loading...</div>;
  }

  // Filter out players who haven't been seen in the last 10 seconds
  const onlineThreshold = Date.now() - 10000;
  const players = room.players.map((player) => ({
    ...player,
    isOnline: (player.lastSeen ?? 0) > onlineThreshold,
  }));

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <RoomIdDisplay roomId={room.customId} />
          </div>
          <DrawingCanvas
            roomId={roomId}
            isDrawer={room.currentDrawer === playerId}
          />
          <GuessInput roomId={roomId} />
        </div>
        <div className="space-y-4">
          <PlayersList players={players} />
          <GameChat roomId={roomId} />
        </div>
      </div>
    </main>
  );
}
