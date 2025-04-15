import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { formatRoomId } from "@/lib/utils";

interface RoomIdDisplayProps {
  roomId?: string;
}

export default function RoomIdDisplay({ roomId }: RoomIdDisplayProps) {
  const [copied, setCopied] = useState(false);

  // If no roomId is provided, don't render anything
  if (!roomId) return null;

  // Format the room ID with the hyphen if it's not already formatted
  const formattedId = roomId.includes("-") ? roomId : formatRoomId(roomId);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Room ID</span>
        <code className="font-mono text-sm">{formattedId}</code>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyToClipboard}
        className="h-8 w-8 p-0"
        title={copied ? "Copied!" : "Copy room ID"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
