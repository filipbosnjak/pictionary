import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Id } from "@/convex/_generated/dataModel";

interface GuessInputProps {
  roomId: Id<"rooms">;
}

export default function GuessInput({ roomId }: GuessInputProps) {
  const [guess, setGuess] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const submitGuess = useMutation(api.guesses.submitGuess);

  // Get player info from localStorage
  useEffect(() => {
    const storedPlayerId = localStorage.getItem(`player_${roomId}`);
    const storedPlayerName = localStorage.getItem(`playerName_${roomId}`);
    if (storedPlayerId && storedPlayerName) {
      setPlayerId(storedPlayerId);
      setPlayerName(storedPlayerName);
    }
  }, [roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || !playerId || !playerName) return;

    try {
      await submitGuess({
        roomId,
        playerId,
        playerName,
        guess: guess.trim(),
      });
      setGuess("");
    } catch (error) {
      console.error("Failed to submit guess:", error);
    }
  };

  if (!playerId || !playerName) {
    return null; // Don't show input if player info is not available
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type your guess..."
        className="flex-1"
      />
      <Button type="submit" disabled={!guess.trim()}>
        Send
      </Button>
    </form>
  );
}
