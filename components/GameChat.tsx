import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { getUserColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";

interface GameChatProps {
  roomId: Id<"rooms">;
  isGuessing?: boolean;
  isChatDisabled?: boolean;
}

export default function GameChat({
  roomId,
  isGuessing = false,
  isChatDisabled = false,
}: GameChatProps) {
  const guesses = useQuery(api.guesses.getGuesses, { roomId });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [message, setMessage] = useState("");
  const submitGuess = useMutation(api.guesses.submitGuess);

  // Get current player ID from localStorage
  useEffect(() => {
    const playerId = localStorage.getItem(`player_${roomId}`);
    const playerName = localStorage.getItem(`playerName_${roomId}`);
    if (playerId && playerName) {
      setCurrentPlayerId(playerId);
    }
  }, [roomId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [guesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isChatDisabled) return;

    const playerName = localStorage.getItem(`playerName_${roomId}`);
    if (!currentPlayerId || !playerName) return;

    try {
      await submitGuess({
        roomId,
        playerId: currentPlayerId,
        playerName,
        guess: message.trim(),
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to submit message:", error);
    }
  };

  if (!guesses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">
        {isGuessing ? "Make your guess!" : "Chat"}
      </h2>
      <div className="space-y-2 h-[300px] overflow-y-auto mb-4">
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
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isChatDisabled
              ? "Chat disabled while drawing..."
              : isGuessing
              ? "Type your guess..."
              : "Type a message..."
          }
          disabled={isChatDisabled}
          className="flex-1"
        />
        <Button type="submit" disabled={!message.trim() || isChatDisabled}>
          Send
        </Button>
      </form>
    </div>
  );
}
