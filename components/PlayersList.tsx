interface Player {
  id: string;
  name: string;
  score: number;
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
            <span>{player.name}</span>
            <span className="font-medium">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
