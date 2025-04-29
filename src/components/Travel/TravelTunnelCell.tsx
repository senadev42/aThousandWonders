import { motion } from "framer-motion";
import { TileType, GridPosition, RevealedMap } from "./store/state";
import { TILES } from "./constants";
import { useTravelStore } from "./store";
import { useMemo } from "react";

// Cell Component
type TravelTunnelCellProps = {
  x: number;
  y: number;
  cell: TileType;
  depth: number;
  isRevealed: boolean;
  playerPos: GridPosition;
  onMove: () => void;
};

const TravelTunnelCell = (props: TravelTunnelCellProps) => {
  const { x, y, cell, onMove, playerPos, isRevealed } = props;

  const isWall = cell === TILES.WALL;

  const isAdjacent =
    playerPos &&
    Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1 &&
    !isWall;

  const isPlayerHere = playerPos?.x === x && playerPos?.y === y;

  const { setHoveredCell } = useTravelStore();

  return (
    <div
      className={`w-10 h-10 relative flex items-center justify-center bg-gray-500
      hover:brightness-105
      ${isAdjacent ? "cursor-pointer hover:brightness-125" : ""}
      ${isWall ? "opacity-0" : isRevealed ? "opacity-100" : "opacity-10"}
    `}
      onClick={isAdjacent ? onMove : undefined}
      onMouseEnter={() => {
        setHoveredCell({ x, y });
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center z-0 text-xs">
        {x},{y}
      </span>
      <div className="relative z-10 flex items-center justify-center text-2xl">
        {isPlayerHere ? (
          <div className="bg-green-500 w-6 h-6 border-4 border-black"></div>
        ) : (
          <span>{cell}</span>
        )}
      </div>
    </div>
  );
};

export default TravelTunnelCell;
