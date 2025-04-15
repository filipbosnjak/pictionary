import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { getUserColor } from "@/lib/utils";

interface GameChatProps {
  roomId: Id<"rooms">;
}

export default function GameChat({ roomId }: GameChatProps) {
  const guesses = useQuery(api.guesses.getGuesses, { roomId });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");

  // Get current player ID from localStorage
  useEffect(() => {
    const playerId = localStorage.getItem(`player_${roomId}`);
    if (playerId) {
      setCurrentPlayerId(playerId);
    }
  }, [roomId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [guesses]);

  if (!guesses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="space-y-2 h-[300px] overflow-y-auto">
        {guesses.map((guess) => {
          const isCurrentUser = guess.playerId === currentPlayerId;
          const userColor = getUserColor(guess.playerId);

          return (
            <div
              key={guess._id}
              className={`p-2 rounded ${
                guess.isCorrect
                  ? "bg-green-100 text-green-800"
                  : isCurrentUser
                  ? "bg-blue-50 ml-8"
                  : "bg-gray-50 mr-8"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium" style={{ color: userColor }}>
                  {isCurrentUser ? "You" : guess.playerName}:
                </span>
                <span>{guess.guess}</span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
