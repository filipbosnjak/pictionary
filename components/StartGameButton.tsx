import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

// List of sample words for the game
const SAMPLE_WORDS = [
  "cat",
  "dog",
  "house",
  "tree",
  "car",
  "book",
  "phone",
  "computer",
  "pizza",
  "beach",
  "sun",
  "moon",
  "star",
  "flower",
  "bird",
  "fish",
  "airplane",
  "boat",
  "train",
  "bicycle",
  "chair",
  "table",
  "clock",
  "pencil",
  "shoe",
  "hat",
  "glasses",
  "umbrella",
  "butterfly",
  "rainbow",
];

interface StartGameButtonProps {
  roomId: Id<"rooms">;
  players: Array<{ id: string; name: string }>;
  isCreator: boolean;
}

export default function StartGameButton({
  roomId,
  players,
  isCreator,
}: StartGameButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const startGame = useMutation(api.rooms.startGame);

  const handleStartGame = async () => {
    if (players.length < 2) {
      alert("Need at least 2 players to start the game!");
      return;
    }

    setIsLoading(true);
    try {
      // Pick a random player as the drawer
      const randomDrawer = players[Math.floor(Math.random() * players.length)];
      // Pick a random word
      const randomWord =
        SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)];

      await startGame({
        roomId,
        currentDrawer: randomDrawer.id,
        word: randomWord,
      });
    } catch (error) {
      console.error("Failed to start game:", error);
      alert("Failed to start game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCreator) {
    return null;
  }

  return (
    <Button
      onClick={handleStartGame}
      disabled={isLoading || players.length < 2}
      className="w-full"
    >
      {isLoading ? "Starting..." : "Start Game"}
    </Button>
  );
}
