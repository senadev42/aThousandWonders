import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { GridPosition, TacticalGridCell } from "./store/state";
import React from "react";
import { TILE_VISUALS } from "./constants";

const TravelTunnelGrid = () => {
  const { movePlayer, state } = useTravelStore();
  const { tacticalGridMap, playerPosition, seed } = useSnapshot(state);

  return (
    <div
      className="grid bg-slate-900 rounded overflow-auto p-1"
      style={{
        gridTemplateColumns: `repeat(${tacticalGridMap[0].length}, minmax(36px, 1fr))`, // w-9 = 36px
        gridAutoRows: "36px", // Match height
      }}
    >
      {tacticalGridMap.map((row, y) =>
        row.map((cell, x) => {
          const isAdjacent =
            Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y) ===
              1 && cell.type !== "wall";

          return (
            <div key={`${x}-${y}`} className="relative">
              {/* Base map layer */}
              <MapCell
                x={x}
                y={y}
                cell={cell}
                isAdjacent={isAdjacent}
                seed={seed}
                onMove={() => movePlayer(x, y)}
              />

              {/* Player overlay */}
              <PlayerLayer x={x} y={y} playerPosition={playerPosition} />
            </div>
          );
        })
      )}
    </div>
  );
};

type MapCellProps = {
  x: number;
  y: number;
  cell: TacticalGridCell;
  isAdjacent: boolean;
  seed: number;
  onMove: () => void;
};

const MapCell: React.FC<MapCellProps> = React.memo(
  (props: MapCellProps) => {
    const { x, y, cell, isAdjacent, onMove } = props;

    const opacityClass =
      cell.type === "wall"
        ? "opacity-0"
        : cell.revealed
        ? "opacity-100"
        : "opacity-10";

    return (
      <div
        className={`absolute inset-0 w-9 h-9 flex items-center justify-center bg-gray-500
        hover:brightness-105
        ${isAdjacent ? "cursor-pointer hover:brightness-125" : ""}
        ${opacityClass}
      `}
        onClick={isAdjacent ? onMove : undefined}
      >
        <span className="absolute inset-0 flex items-center justify-center z-10 text-xs">
          {x},{y}
        </span>

        {cell.feature ? (
          <span
            className={
              cell.feature === "start" || cell.feature === "end"
                ? "text-3xl font-extrabold text-red-600 opacity-40"
                : "text-lg"
            }
          >
            {TILE_VISUALS[cell.feature]}
          </span>
        ) : (
          <span className="text-lg">{TILE_VISUALS[cell.type]}</span>
        )}
      </div>
    );
  },
  (prev, next) =>
    prev.seed === next.seed &&
    prev.cell.revealed === next.cell.revealed &&
    prev.isAdjacent === next.isAdjacent
);

type PlayerLayerProps = {
  x: number;
  y: number;
  playerPosition: GridPosition;
};

const PlayerLayer: React.FC<PlayerLayerProps> = React.memo(
  ({ x, y, playerPosition }: PlayerLayerProps) => {
    const isPlayerHere = x === playerPosition.x && y === playerPosition.y;

    if (!isPlayerHere) return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-gray-800 opacity-80 w-6 h-6" />
      </div>
    );
  },
  (prev, next) =>
    (prev.x !== prev.playerPosition.x || prev.y !== prev.playerPosition.y) ===
    (next.x !== next.playerPosition.x || next.y !== next.playerPosition.y)
);

export default TravelTunnelGrid;
