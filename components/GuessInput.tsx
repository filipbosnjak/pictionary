import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GuessInputProps {
  roomId: Id<"rooms">;
}

export default function GuessInput({ roomId }: GuessInputProps) {
  const [guess, setGuess] = useState("");
  const submitGuess = useMutation(api.guesses.submitGuess);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;

    try {
      await submitGuess({
        roomId,
        playerId: "temp-id", // This should come from auth
        playerName: "Player", // This should come from auth
        guess: guess.trim(),
      });
      setGuess("");
    } catch (error) {
      console.error("Failed to submit guess:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type your guess..."
        className="flex-1"
      />
      <Button type="submit" disabled={!guess.trim()}>
        Guess
      </Button>
    </form>
  );
}
