import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface GameChatProps {
  roomId: Id<"rooms">;
}

export default function GameChat({ roomId }: GameChatProps) {
  const guesses = useQuery(api.guesses.getGuesses, { roomId });

  if (!guesses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="space-y-2 h-[300px] overflow-y-auto">
        {guesses.map((guess) => (
          <div
            key={guess._id}
            className={`p-2 rounded ${
              guess.isCorrect ? "bg-green-100 text-green-800" : "bg-gray-50"
            }`}
          >
            <span className="font-medium">{guess.playerName}: </span>
            <span>{guess.guess}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
