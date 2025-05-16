//GridMapComponent.tsx
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { isAdjacent } from "./store/actions";
import {
  BaseCell,
  CELL_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./store/state";
import React, { useRef } from "react";
import GridDebugMenu from "./GridDebugMenu";
import { useGridScroll } from "./helpers/useGridScroll";
import { getFeatureIcon } from "./scenes/getTransitionIcon";

const GridMapComponent = () => {
  const { handleCellInteract, state } = useTravelStore();
  const { currentScene, playerPosition, debugSettings } = useSnapshot(state);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const visibleRange = useGridScroll(
    scrollRef,
    playerPosition,
    currentScene.width,
    currentScene.height
  )?.visibleRange ?? {
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  };

  const centerOnXPlane =
    currentScene.width < VIEWPORT_WIDTH ? "justify-center" : "";

  const centerOnYPlane =
    currentScene.height < VIEWPORT_HEIGHT ? "items-center" : "";

  return (
    <div className="flex flex-col gap-2 items-center justify-start w-full mt-10">
      <div
        ref={scrollRef}
        className={`border-4 border-black rounded bg-gray-900 overflow-auto flex ${centerOnXPlane} ${centerOnYPlane} scrollbar-custom `}
        style={{
          width: `${VIEWPORT_WIDTH * CELL_SIZE + 8}px`,
          height: `${VIEWPORT_HEIGHT * CELL_SIZE + 8}px`,
        }}
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
                          cellHash={`${cell.type}-${cell.revealed}-${debugSettings.showCoords}-${cell.transitionId}`}
                          onInteract={() =>
                            handleCellInteract(x, y, cell.transitionId)
                          }
                          debugSettings={debugSettings}
                        />

                        {playerPosition.x == x && playerPosition.y == y && (
                          <Player />
                        )}
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
  onInteract: () => void;
  debugSettings: {
    showCoords: boolean;
  };
};

const MapCell: React.FC<MapCellProps> = React.memo(
  (props: MapCellProps) => {
    const { x, y, cell, onInteract, debugSettings } = props;

    const isWall = cell.type === "wall";

    const wallColorClass = "bg-gray-900";
    const revealedColorClass = "bg-gray-600";
    const hiddenColorClass = "bg-gray-800";

    const bgColorClass = isWall
      ? wallColorClass
      : cell.revealed
      ? revealedColorClass
      : hiddenColorClass;

    return (
      <div
        className={`w-full h-full flex items-center justify-center hover:brightness-134 ${bgColorClass}`}
        onClick={onInteract}
      >
        {!isWall && debugSettings.showCoords && (
          <span className="absolute inset-0 flex items-center justify-center z-10 text-[0.6rem] opacity-50">
            {x},{y}
          </span>
        )}

        {cell.transitionId && (
          <span className="absolute inset-0 flex items-center justify-center z-10 text-[0.6rem] opacity-50 bg-gray-700">
            {cell.feature &&
              React.createElement(getFeatureIcon(cell.feature) as React.FC)}
          </span>
        )}
      </div>
    );
  },
  (prev, next) => {
    return prev.cellHash === next.cellHash;
  }
);

const Player: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div
        className="bg-slate-300 w-6 h-6 rounded-full transition-all duration-75 ease-out
            animate-player-move"
      />
    </div>
  );
};
