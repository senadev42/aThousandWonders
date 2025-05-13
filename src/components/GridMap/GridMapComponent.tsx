//GridMapComponent.tsx
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { isAdjacent } from "./store/actions";
import { GridPosition, BaseCell } from "./store/state";
import React from "react";
import GridDebugMenu from "./DebugGridMap";

const GridMapComponent = () => {
  const { movePlayer, state } = useTravelStore();
  const { currentScene, playerPosition, seed, debugSettings } =
    useSnapshot(state);

  return (
    <div className="flex flex-col  gap-2">
      <div
        className="grid rounded overflow-auto border-4 border-black"
        style={{
          gridTemplateColumns: `repeat(${currentScene.data[0].length}, minmax(36px, 1fr))`, // w-9 = 36px
          gridAutoRows: "36px", // Match height
        }}
      >
        {currentScene.data.map((row, y) =>
          row.map((cell, x) => {
            const isCellAdjacent = isAdjacent(
              x,
              y,
              playerPosition,
              cell.type === "wall" ? true : false
            );

            return (
              <div key={`${x}-${y}`} className="relative">
                {/* Base map layer */}
                <MapCell
                  x={x}
                  y={y}
                  cell={cell}
                  isAdjacent={isCellAdjacent}
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
  cell: BaseCell;
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
        <div
          className="bg-green-600 w-6 h-6 rounded-full transition-all duration-75 ease-out
            animate-player-move"
        />
      </div>
    );
  },
  (prev, next) =>
    (prev.x !== prev.playerPosition.x || prev.y !== prev.playerPosition.y) ===
    (next.x !== next.playerPosition.x || next.y !== next.playerPosition.y)
);

export default GridMapComponent;
