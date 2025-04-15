"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DrawingCanvas from "@/components/DrawingCanvas";
import PlayersList from "@/components/PlayersList";
import GameChat from "@/components/GameChat";
import RoomIdDisplay from "@/components/RoomIdDisplay";
import StartGameButton from "@/components/StartGameButton";
import Celebration from "@/components/Celebration";
import { useRoomCleanup } from "@/lib/hooks/useRoomCleanup";
import { usePresence } from "@/lib/hooks/usePresence";
import { useEffect, useState } from "react";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as Id<"rooms">;
  const room = useQuery(api.rooms.getRoom, { roomId });
  const drawing = useQuery(api.drawings.getDrawing, { roomId });
  const [playerId, setPlayerId] = useState<string>("");
  const [showCelebration, setShowCelebration] = useState(false);
  const guesses = useQuery(api.guesses.getGuesses, { roomId }) || [];
  const latestGuess = guesses[0];
  const removePlayer = useMutation(api.rooms.removePlayerFromRoom);
  const [countdown, setCountdown] = useState(5);

  // Clean up player data when component unmounts
  useEffect(() => {
    return () => {
      if (playerId && roomId) {
        // Remove player from room
        removePlayer({ roomId, playerId });
        // Clear local storage
        localStorage.removeItem(`player_${roomId}`);
        localStorage.removeItem(`playerName_${roomId}`);
      }
    };
  }, [playerId, roomId, removePlayer]);

  // Show celebration when a correct guess is made
  useEffect(() => {
    if (latestGuess?.isCorrect) {
      setShowCelebration(true);
      // Hide celebration after 2 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [latestGuess?.timestamp]); // Only trigger on new guesses

  // Get the player ID from localStorage or find it in the room data
  useEffect(() => {
    if (!room) return;

    const storedPlayerId = localStorage.getItem(`player_${roomId}`);
    const storedPlayerName = localStorage.getItem(`playerName_${roomId}`);

    // Find the player in the room's player list
    const playerInRoom = room.players.find(
      (p) => p.id === storedPlayerId && p.name === storedPlayerName
    );

    if (playerInRoom && storedPlayerId) {
      // If found in room, use stored ID
      setPlayerId(storedPlayerId);
    } else if (room.players.length > 0) {
      // If not found or no stored ID, find by name
      const playerByName = storedPlayerName
        ? room.players.find((p) => p.name === storedPlayerName)
        : null;

      if (playerByName) {
        localStorage.setItem(`player_${roomId}`, playerByName.id);
        setPlayerId(playerByName.id);
      } else {
        // If still not found, use the last joined player (fallback)
        const lastPlayer = room.players[room.players.length - 1];
        localStorage.setItem(`player_${roomId}`, lastPlayer.id);
        localStorage.setItem(`playerName_${roomId}`, lastPlayer.name);
        setPlayerId(lastPlayer.id);
      }
    }
  }, [room, roomId]);

  // Use the room cleanup hook to handle tab closing
  useRoomCleanup(roomId, playerId);

  // Use the presence hook to update player's online status
  usePresence(roomId, playerId);

  // Handle countdown during transition
  useEffect(() => {
    if (!room || room.status !== "transitioning") {
      setCountdown(5);
      return;
    }

    // Set initial countdown
    const startTime = room.transitionStartTime ?? Date.now();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const initial = Math.max(0, 5 - elapsed);
    setCountdown(initial);

    // Update every second
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [room?.status, room?.transitionStartTime]);

  if (!room) {
    return <div>Loading...</div>;
  }

  // Filter out players who haven't been seen in the last 10 seconds
  const onlineThreshold = Date.now() - 10000;
  const players = room.players.map((player) => ({
    ...player,
    isOnline: (player.lastSeen ?? 0) > onlineThreshold,
  }));

  // Check if current player is the room creator (first player)
  const isCreator = playerId === room.players[0]?.id;

  // Check if current player is the drawer
  const isDrawer = room.status === "playing" && room.currentDrawer === playerId;

  // Show word only to the drawer
  const currentWord = isDrawer ? room.currentWord : null;

  // Chat should only be disabled for the active drawer during gameplay
  const isChatDisabled = isDrawer;

  // Debug information
  console.log({
    playerId,
    isCreator,
    currentDrawer: room.currentDrawer,
    isDrawer,
    isChatDisabled,
    roomStatus: room.status,
  });

  const renderGameContent = () => {
    if (room.status === "waiting") {
      return (
        <div className="bg-yellow-100 p-4 rounded-lg text-yellow-800 text-center">
          Waiting for the game to start... Chat with other players while you
          wait!
        </div>
      );
    }

    if (room.status === "transitioning") {
      const isNextDrawer = playerId === room.nextDrawer;
      const nextDrawerName = room.players.find(
        (p) => p.id === room.nextDrawer
      )?.name;

      return (
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded-lg text-green-800 text-center">
            <div className="text-xl animate-bounce mb-2">
              🎉 <strong>{latestGuess?.playerName}</strong> guessed the word
              correctly! 🎉
            </div>
            <div className="text-3xl font-bold mb-2">{countdown} ⏰</div>
            {isNextDrawer ? (
              <div className="space-y-2">
                <div className="text-lg">
                  🎨 Get ready! You're drawing next! 🎨
                </div>
                <div className="bg-blue-100 p-2 rounded text-blue-800">
                  Your word will be: <strong>{room.nextWord}</strong> ✏️
                </div>
              </div>
            ) : (
              <div className="text-lg">
                Next up: <strong>{nextDrawerName}</strong> will be drawing! 🎨
              </div>
            )}
          </div>
          <DrawingCanvas roomId={roomId} isDrawer={false} />
        </div>
      );
    }

    return (
      <>
        {currentWord && (
          <div className="bg-blue-100 p-4 rounded-lg text-blue-800 text-center">
            Your word to draw: <strong>{currentWord}</strong>
          </div>
        )}
        {latestGuess?.isCorrect && (
          <div className="bg-green-100 p-4 rounded-lg text-green-800 text-center animate-bounce">
            🎉 <strong>{latestGuess.playerName}</strong> guessed the word
            correctly! 🎉
          </div>
        )}
        <DrawingCanvas roomId={roomId} isDrawer={isDrawer} />
      </>
    );
  };

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <Celebration
        isVisible={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <RoomIdDisplay roomId={room.customId} />
          </div>
          {renderGameContent()}
        </div>
        <div className="space-y-4">
          <PlayersList players={players} />
          {room.status === "waiting" && (
            <StartGameButton
              roomId={roomId}
              players={players}
              isCreator={isCreator}
            />
          )}
          <GameChat
            roomId={roomId}
            isGuessing={room.status === "playing" && !isDrawer}
            isChatDisabled={isChatDisabled}
          />
        </div>
      </div>
    </main>
  );
}
