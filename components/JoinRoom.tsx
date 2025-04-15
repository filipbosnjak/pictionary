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

export default function JoinRoom() {
  const router = useRouter();
  const joinRoom = useMutation(api.rooms.joinRoom);
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const handleJoinRoom = async () => {
    if (!roomId || !playerName) return;
    setError("");

    try {
      const result = await joinRoom({
        roomId,
        playerName,
      });

      if (result) {
        router.push(`/room/${roomId}`);
      }
    } catch (error) {
      console.error("Failed to join room:", error);
      setError("Invalid room ID or room is full");
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
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
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
          disabled={!roomId || !playerName}
        >
          Join Room
        </Button>
      </CardContent>
    </Card>
  );
}
