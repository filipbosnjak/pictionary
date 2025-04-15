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

export default function CreateRoom() {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.createRoom);
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("4");

  const handleCreateRoom = async () => {
    if (!roomName || !playerName || !maxPlayers) return;

    try {
      const roomId = await createRoom({
        name: roomName,
        maxPlayers: parseInt(maxPlayers),
        creatorName: playerName,
      });

      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Room</CardTitle>
        <CardDescription>
          Create a new room and invite your friends to play
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roomName">Room Name</Label>
          <Input
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
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
        <div className="space-y-2">
          <Label htmlFor="maxPlayers">Max Players</Label>
          <Input
            id="maxPlayers"
            type="number"
            min="2"
            max="10"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          onClick={handleCreateRoom}
          disabled={!roomName || !playerName || !maxPlayers}
        >
          Create Room
        </Button>
      </CardContent>
    </Card>
  );
}
