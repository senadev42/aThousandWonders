import { useSnapshot } from "valtio";
import { useTravelStore } from "@/features/grid-map/store";
import {
  BaseCell,
  BaseScene,
  BaseTiles,
  CELL_SIZE,
  DebugInfo,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "@/features/grid-map/store/state";
import React, { useRef, useState } from "react";
import { getFeatureIcon } from "@/features/grid-map/helpers/getFeatureIcon";
import { resolveBackgroundImage } from "@/features/grid-map/helpers/resolveBackgroundImage";
import { Interactable, InteractableTypeEnum } from "@/features/grid-map/types";

const ChromaticOverlay: React.FC<{ gridData: BaseScene }> = ({ gridData }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {gridData.map((row, y) =>
        row.map((cell, x) => {
          // Only show overlay on revealed floor tiles
          const shouldShow = cell.type === BaseTiles.FLOOR && cell.revealed;

          return shouldShow ? (
            <div
              key={`overlay-${x}-${y}`}
              className="absolute mix-blend-overlay animate-gradient"
              style={{
                left: `${x * CELL_SIZE}px`,
                top: `${y * CELL_SIZE}px`,
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                background: `linear-gradient(
                  30deg,
                  rgba(255, 240, 79, 0.3) 0%, 
                  rgba(224, 213, 0, 0.3) 100%
                )`,
                filter: "blur(4px)",
              }}
            />
          ) : null;
        })
      )}
    </div>
  );
};

const GridMapComponent = () => {
  const { handleCellInteract, handleInteractable, state } = useTravelStore();
  const { currentScene, debugInfo } = useSnapshot(state);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Mouse Position Tooltip
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / CELL_SIZE;
      const y = (e.clientY - rect.top) / CELL_SIZE;
      setMousePos({ x, y });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  //Grid Styling
  const backgroundImage = resolveBackgroundImage(currentScene.background);
  const borderStyle = backgroundImage
    ? ""
    : "border-[0.5px] border-slate-900 border-opacity-1";

  const gridCells = currentScene.data.map((row, y) => {
    return row.map((cell, x) => {
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
            cellHash={`${cell.type}-${cell.revealed}-${debugInfo.showCoords}-${cell.feature}-${debugInfo.isUsingBgImage}`}
            onInteract={(event) =>
              handleCellInteract(x, y, cell.transitionId, event)
            }
            debugInfo={debugInfo}
          />
        </div>
      );
    });
  });

  const centerOnXPlane =
    currentScene.width < VIEWPORT_WIDTH ? "justify-center" : "";

  const centerOnYPlane =
    currentScene.height < VIEWPORT_HEIGHT ? "items-center" : "";

  const scrollbarcustomClass = debugInfo.showScollbar
    ? "scrollbar-custom"
    : "scrollbar-none";

  return (
    <div
      ref={scrollRef}
      className={`border-4 border-black rounded-md bg-gray-900 overflow-auto flex ${centerOnXPlane} ${centerOnYPlane} ${scrollbarcustomClass}`}
      style={{
        width: `${VIEWPORT_WIDTH * CELL_SIZE + 8}px`,
        height: `${VIEWPORT_HEIGHT * CELL_SIZE + 8}px`,
      }}
    >
      <div className="relative inline-block">
        <div
          className="grid relative"
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            gridTemplateColumns: `repeat(${currentScene.width}, ${CELL_SIZE}px)`,
            gridAutoRows: `${CELL_SIZE}px`,
            width: `${currentScene.width * CELL_SIZE}px`,
            height: `${currentScene.height * CELL_SIZE}px`,
            ...backgroundImage,
          }}
        >
          {/* Cells */}
          {gridCells}

          {/* Player */}
          <Player />

          {/* Interactable Layer */}
          {currentScene.interactables && (
            <InteractableLayer
              interactables={currentScene.interactables}
              handleInteractable={handleInteractable}
            />
          )}

          {/* Tooltip */}
          {debugInfo.showMousePosTooltip && showTooltip && (
            <div
              className="absolute z-200 bg-black opacity-45 text-white px-2 py-1 rounded text-sm pointer-events-none"
              style={{
                left: mousePos.x * CELL_SIZE,
                top: mousePos.y * CELL_SIZE,
                transform: "translate(-100%, -100%)",
                marginTop: -8,
              }}
            >
              x: {mousePos.x.toFixed(2)}, y: {mousePos.y.toFixed(2)}
            </div>
          )}
        </div>
        {/* Chromatic Overlay */}
        {debugInfo.toggleOverlay && (
          <ChromaticOverlay gridData={currentScene.data as BaseScene} />
        )}
      </div>
    </div>
  );
};

export default GridMapComponent;

type MapCellProps = {
  coordString: string;
  cell: BaseCell;
  cellHash: string;
  onInteract: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  debugInfo: DebugInfo;
};

const MapCell: React.FC<MapCellProps> = React.memo(
  (props: MapCellProps) => {
    const { coordString, cell, onInteract, debugInfo } = props;

    let bgColor;
    switch (cell.type) {
      case BaseTiles.WALL:
        bgColor = "bg-gray-900";
        break;
      case BaseTiles.FLOOR:
        if (debugInfo.isUsingBgImage) bgColor = "bg-transparent";
        else if (cell.revealed) bgColor = "bg-gray-600";
        break;
      case BaseTiles.INVISIBLE_WALL:
        bgColor = "bg-transparent";
        break;
      default:
        throw new Error(`Unknown cell type: ${cell.type}`);
    }

    return (
      <div
        className={`w-full h-full flex items-center justify-center hover:brightness-134 ${bgColor}`}
        onClick={(event) => onInteract(event)}
      >
        {debugInfo.showCoords && (
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
      className="absolute"
      style={{
        left: playerPosition.x * CELL_SIZE,
        top: playerPosition.y * CELL_SIZE,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <div className="w-full h-full flex items-center justify-center z-10">
        <div className="bg-slate-700 border-2 border-black size-7 rounded-full animate-player-move" />
      </div>
    </div>
  );
};

type InteractableProps = {
  interactables: Record<string, Interactable>;
  handleInteractable: (id: string) => void;
};

const InteractableLayer: React.FC<InteractableProps> = (
  props: InteractableProps
) => {
  const { interactables, handleInteractable } = props;

  const interactableElements = Object.entries(interactables).map(
    ([id, interactable]) => {
      const { x, y } = interactable.position;

      let buttonClass = "";
      switch (interactable.type) {
        case InteractableTypeEnum.BASIC:
          buttonClass = "rounded-md";
          break;
        case InteractableTypeEnum.INVESTIGATE:
          buttonClass = "rounded-full";
          break;
        default:
          throw new Error(`Unknown interactable type: ${interactable.type}`);
      }

      buttonClass +=
        " size-5 bg-slate-800 hover:bg-slate-700 opacity-40 hover:opacity-80";

      return (
        <div
          key={id}
          className="absolute"
          style={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
          }}
        >
          <button
            onClick={() => {
              handleInteractable(id);
            }}
            className={`${buttonClass} transition-colors`}
          >
            {React.createElement(
              getFeatureIcon(interactable.type) as React.FC<
                React.SVGProps<SVGSVGElement>
              >,
              {
                className: "size-5 text-white",
              }
            )}
          </button>
        </div>
      );
    }
  );

  return <div className="absolute">{interactableElements}</div>;
};
