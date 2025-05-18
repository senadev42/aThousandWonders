//GridMapComponent.tsx
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import {
  BaseCell,
  BaseTiles,
  CELL_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./store/state";
import React, { useRef } from "react";
import { getFeatureIcon } from "./scenes/getTransitionIcon";

const GridMapComponent = () => {
  const { handleCellInteract, state } = useTravelStore();
  const { currentScene, debugSettings } = useSnapshot(state);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const borderStyle = "border-[0.5px] border-slate-800 border-opacity-4";

  const gridCells = currentScene.data.map((row, y) => {
    return row.map((cell, x) => {
      if (cell.type === BaseTiles.WALL && !cell.feature) return null;

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
            coordString={`${x},${y}`}
            cell={cell}
            cellHash={`${cell.type}-${cell.revealed}-${debugSettings.showCoords}-${cell.feature}`}
            onInteract={() => handleCellInteract(x, y, cell.transitionId)}
            debugSettings={debugSettings}
          />
        </div>
      );
    });
  });

  const centerOnXPlane =
    currentScene.width < VIEWPORT_WIDTH ? "justify-center" : "";

  const centerOnYPlane =
    currentScene.height < VIEWPORT_HEIGHT ? "items-center" : "";

  const scrollbarcustomClass = debugSettings.showScollbar
    ? "scrollbar-custom"
    : "scrollbar-none";

  return (
    <div
      ref={scrollRef}
      className={`border-4 border-black rounded bg-gray-900 overflow-auto flex ${centerOnXPlane} ${centerOnYPlane} ${scrollbarcustomClass}`}
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
          <Player />

          {gridCells}
        </div>
      </div>
    </div>
  );
};

export default GridMapComponent;

type MapCellProps = {
  coordString: string;
  cell: BaseCell;
  cellHash: string;
  onInteract: () => void;
  debugSettings: {
    showCoords: boolean;
  };
};

const MapCell: React.FC<MapCellProps> = React.memo(
  (props: MapCellProps) => {
    const { coordString, cell, onInteract, debugSettings } = props;

    const revealedColorClass = "bg-gray-600";
    const hiddenColorClass = "bg-gray-800";

    const bgColorClass = cell.revealed ? revealedColorClass : hiddenColorClass;

    return (
      <div
        className={`w-full h-full flex items-center justify-center hover:brightness-134 ${bgColorClass}`}
        onClick={onInteract}
      >
        {debugSettings.showCoords && (
          <span className="absolute inset-0 flex items-center justify-center z-10 text-[0.6rem] opacity-50">
            {coordString}
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
  const { state } = useTravelStore();

  const { playerPosition } = useSnapshot(state);

  return (
    <div
      className="absolute z-10"
      style={{
        left: playerPosition.x * CELL_SIZE,
        top: playerPosition.y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <div className="w-full h-full flex items-center justify-center z-10">
        <div className="bg-slate-300 w-6 h-6 rounded-full animate-player-move" />
      </div>
    </div>
  );
};
