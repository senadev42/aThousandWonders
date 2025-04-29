import { TILES } from "./constants";
import { TileType, DepthMap, RevealedMap, GridPosition } from "./store/state";
import TravelTunnelCell from "./TravelTunnelCell";

type TravelTunnelGridProps = {
  grid: TileType[][];
  depth: DepthMap;
  revealed: RevealedMap;
  playerPos: GridPosition;
  movePlayer: (x: number, y: number) => void;
};

const TravelTunnelGrid = (props: TravelTunnelGridProps) => {
  const { grid, depth, revealed, playerPos, movePlayer } = props;

  return (
    <div
      className="grid bg-gray-950 rounded overflow-auto p-1"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isRevealed =
            revealed[`${x},${y}`] || cell === TILES.START || cell === TILES.END;

          const isWall = cell === TILES.WALL;

          const isAdjacent =
            playerPos &&
            Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1 &&
            !isWall;

          const isPlayerHere = playerPos?.x === x && playerPos?.y === y;

          return (
            <TravelTunnelCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              cell={cell}
              depth={depth[`${x},${y}`] || 0}
              isRevealed={isRevealed}
              isWall={isWall}
              isAdjacent={isAdjacent}
              isPlayerHere={isPlayerHere}
              playerPos={playerPos}
              onMove={() => movePlayer(x, y)}
            />
          );
        })
      )}
    </div>
  );
};

export default TravelTunnelGrid;
