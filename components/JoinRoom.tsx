import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRoomId } from "@/lib/utils";

export default function JoinRoom() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const joinRoom = useMutation(api.rooms.joinRoom);

  const handleRoomIdChange = (value: string) => {
    const formatted = value.toUpperCase();
    console.log("Raw input:", value);
    console.log("Formatted input:", formatted);
    setRoomId(formatted);
    setError(null);
  };

  const handleJoinRoom = async () => {
    if (!roomId || !playerName) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting to join with roomId:", roomId);
      const result = await joinRoom({
        customId: roomId,
        playerName,
      });
      console.log("Join result:", result);

      // Store player name in localStorage
      localStorage.setItem(`playerName_${result.internalId}`, playerName);

      router.push(`/room/${result.internalId}`);
    } catch (err) {
      console.error("Join error:", err);
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Room</CardTitle>
        <CardDescription>
          Join an existing room with your friends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roomId">Room ID</Label>
          <Input
            id="roomId"
            value={roomId}
            onChange={(e) => handleRoomIdChange(e.target.value)}
            placeholder="Enter room ID (e.g., 1A4B-4HN1)"
            maxLength={9} // 8 chars + 1 hyphen
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="playerName">Your Name</Label>
          <Input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <Button
          className="w-full"
          onClick={handleJoinRoom}
          disabled={!roomId || !playerName || isLoading}
        >
          {isLoading ? "Joining..." : "Join Room"}
        </Button>
      </CardContent>
    </Card>
  );
}
