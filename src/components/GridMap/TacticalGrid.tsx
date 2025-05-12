import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { GridPosition, TacticalGridCell } from "./store/state";
import React, { useEffect } from "react";
import { TILE_VISUALS } from "./constants";
import GridDebugMenu from "./DebugGridMap";

const TravelTunnelGrid = () => {
  const { movePlayer, state } = useTravelStore();
  const { tacticalGridMap, playerPosition, seed, debugSettings } =
    useSnapshot(state);

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div
        className="grid rounded overflow-auto border-4 border-black"
        style={{
          gridTemplateColumns: `repeat(${tacticalGridMap[0].length}, minmax(36px, 1fr))`, // w-9 = 36px
          gridAutoRows: "36px", // Match height
        }}
      >
        {tacticalGridMap.map((row, y) =>
          row.map((cell, x) => {
            const isAdjacent =
              cell.type !== "wall" &&
              cell.revealed &&
              Math.abs(x - playerPosition.x) +
                Math.abs(y - playerPosition.y) ===
                1;

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
                  debugSettings={debugSettings}
                />

                {/* Player overlay */}
                <PlayerLayer x={x} y={y} playerPosition={playerPosition} />
              </div>
            );
          })
        )}
      </div>

      <GridDebugMenu />
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
  debugSettings: {
    showCoords: boolean;
  };
};

const MapCell: React.FC<MapCellProps> = React.memo(
  (props: MapCellProps) => {
    const { x, y, cell, isAdjacent, onMove, debugSettings } = props;

    const isWall = cell.type === "wall";
    const wallColorClass = "bg-gray-900";
    const revealedColorClass = "bg-gray-600";
    const hiddenColorClass = "bg-gray-800";

    const opacityClass = isWall
      ? wallColorClass
      : cell.revealed
      ? revealedColorClass
      : hiddenColorClass;

    return (
      <div
        className={`absolute inset-0 w-9 h-9 flex items-center justify-center 
        hover:brightness-105
        ${isAdjacent ? "cursor-pointer hover:brightness-125" : ""}
        ${opacityClass}
      `}
        onClick={isAdjacent ? onMove : undefined}
      >
        {!isWall && debugSettings.showCoords && (
          <span className="absolute inset-0 flex items-center justify-center z-10 text-[0.6rem] opacity-50">
            {x},{y}
          </span>
        )}

        {cell.feature && cell.revealed ? (
          <span
            className={
              cell.feature === "start" || cell.feature === "end"
                ? "text-3xl font-bold text-amber-600 opacity-70"
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
    prev.isAdjacent === next.isAdjacent &&
    prev.debugSettings.showCoords === next.debugSettings.showCoords
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
        <div className="bg-green-600 w-6 h-6 rounded-full" />
      </div>
    );
  },
  (prev, next) =>
    (prev.x !== prev.playerPosition.x || prev.y !== prev.playerPosition.y) ===
    (next.x !== next.playerPosition.x || next.y !== next.playerPosition.y)
);

export default TravelTunnelGrid;
