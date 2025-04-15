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

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as Id<"rooms">;
  const room = useQuery(api.rooms.getRoom, { roomId });
  const drawing = useQuery(api.drawings.getDrawing, { roomId });

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <RoomIdDisplay roomId={roomId} />
          </div>
          <DrawingCanvas
            roomId={roomId}
            isDrawer={room.currentDrawer === roomId}
          />
          <GuessInput roomId={roomId} />
        </div>
        <div className="space-y-4">
          <PlayersList players={room.players} />
          <GameChat roomId={roomId} />
        </div>
      </div>
    </main>
  );
}
