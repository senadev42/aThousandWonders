import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import TravelTunnelCell from "./TravelTunnelCell";
import { TILES } from "./constants";

const TravelTunnelGrid = () => {
  const { movePlayer, state } = useTravelStore();
  const { grid, depth, revealed, playerPos } = useSnapshot(state);

  return (
    <div
      className="grid bg-slate-900 rounded overflow-auto p-1"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isRevealed =
            revealed[`${x},${y}`] || cell === TILES.START || cell === TILES.END;

          return (
            <TravelTunnelCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              cell={cell}
              depth={depth[`${x},${y}`] || 0}
              playerPos={playerPos}
              isRevealed={isRevealed}
              onMove={() => movePlayer(x, y)}
            />
          );
        })
      )}
    </div>
  );
};

export default TravelTunnelGrid;
