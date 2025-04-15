interface Player {
  id: string;
  name: string;
  score: number;
  lastSeen?: number;
  isOnline?: boolean;
}

interface PlayersListProps {
  players: Player[];
}

export default function PlayersList({ players }: PlayersListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Players</h2>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-2 w-2">
                {player.isOnline && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </>
                )}
                {!player.isOnline && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-300"></span>
                )}
              </div>
              <span>{player.name}</span>
            </div>
            <span className="font-medium">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
