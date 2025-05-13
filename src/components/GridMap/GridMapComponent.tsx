//GridMapComponent.tsx
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { isAdjacent } from "./store/actions";
import { GridPosition, BaseCell } from "./store/state";
import React, { useCallback, useEffect, useRef, useState } from "react";
import GridDebugMenu from "./GridDebugMenu";

const CELL_SIZE = 36;

const GridMapComponent = () => {
  const { movePlayer, state } = useTravelStore();
  const { currentScene, playerPosition, debugSettings } = useSnapshot(state);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track visible area
  const [visibleRange, setVisibleRange] = useState({
    startX: 0,
    endX: 15,
    startY: 0,
    endY: 13,
  });

  // Update visible range on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const element = scrollRef.current;
    const scrollLeft = element.scrollLeft;
    const scrollTop = element.scrollTop;

    const startX = Math.max(0, Math.floor(scrollLeft / CELL_SIZE) - 1);
    const startY = Math.max(0, Math.floor(scrollTop / CELL_SIZE) - 1);
    const endX = Math.min(startX + 18, currentScene.width);
    const endY = Math.min(startY + 16, currentScene.height);

    setVisibleRange({ startX, endX, startY, endY });
  }, [currentScene.width, currentScene.height]);

  // attach event listener
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={scrollRef}
        className="border-4 border-black rounded bg-black w-[548px] h-[478px] overflow-auto flex"
      >
        <div className="relative inline-block">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${currentScene.width}, ${CELL_SIZE}px)`,
              gridAutoRows: `${CELL_SIZE}px`,
              width: `${currentScene.width * CELL_SIZE}px`,
              height: `${currentScene.height * CELL_SIZE}px`,
            }}
          >
            {currentScene.data
              .slice(visibleRange.startY, visibleRange.endY)
              .map((row, relY) => {
                const y = relY + visibleRange.startY;
                return row
                  .slice(visibleRange.startX, visibleRange.endX)
                  .map((cell, relX) => {
                    const x = relX + visibleRange.startX;
                    const isCellAdjacent = isAdjacent(
                      x,
                      y,
                      playerPosition,
                      cell.type === "wall"
                    );

                    const borderStyle =
                      cell.type === "wall"
                        ? ""
                        : "border-[0.5px] border-slate-800 border-opacity-4";

                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`relative ${borderStyle}`}
                        style={{
                          gridColumn: x + 1,
                          gridRow: y + 1,
                        }}
                      >
                        <MapCell
                          x={x}
                          y={y}
                          cell={cell}
                          isAdjacent={isCellAdjacent}
                          cellHash={`${cell.type}-${cell.revealed}-${isCellAdjacent}-${debugSettings.showCoords}`}
                          onMove={() => movePlayer(x, y)}
                          debugSettings={debugSettings}
                        />
                        <PlayerLayer
                          x={x}
                          y={y}
                          playerPosition={playerPosition}
                        />
                      </div>
                    );
                  });
              })}
          </div>
        </div>
      </div>
      <GridDebugMenu />
    </div>
  );
};

export default GridMapComponent;

type MapCellProps = {
  x: number;
  y: number;
  cell: BaseCell;
  isAdjacent: boolean;
  cellHash: string;
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

    function handleClick() {
      console.log("Clicked cell", x, y);
      onMove();
    }

    return (
      <div
        className={`w-full h-full flex items-center justify-center 
          hover:brightness-105
          ${isAdjacent ? "cursor-pointer hover:brightness-125" : ""}
          ${opacityClass}
        `}
        onClick={isAdjacent ? handleClick : undefined}
      >
        {!isWall && debugSettings.showCoords && (
          <span className="absolute inset-0 flex items-center justify-center z-10 text-[0.6rem] opacity-50">
            {x},{y}
          </span>
        )}
      </div>
    );
  },
  (prev, next) => {
    return prev.cellHash === next.cellHash;
  }
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
  (prev, next) => {
    return (
      (prev.x !== prev.playerPosition.x || prev.y !== prev.playerPosition.y) ===
      (next.x !== next.playerPosition.x || next.y !== next.playerPosition.y)
    );
  }
);
