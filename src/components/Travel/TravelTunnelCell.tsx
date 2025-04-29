import { motion } from "framer-motion";
import { TileType, GridPosition } from "./store/state";

// Cell Component
type TravelTunnelCellProps = {
  x: number;
  y: number;
  cell: TileType;
  depth: number;
  isRevealed: boolean;
  isWall: boolean;
  isAdjacent: boolean;
  isPlayerHere: boolean;
  playerPos: GridPosition;
  onMove: () => void;
};

const TravelTunnelCell = (props: TravelTunnelCellProps) => {
  const { depth, isRevealed, isWall, isAdjacent, isPlayerHere, cell, onMove } =
    props;

  const getDepthColor = (depthValue: number) => {
    if (depthValue < 0.3) return "bg-gray-700";
    if (depthValue < 0.6) return "bg-gray-800";
    if (depthValue < 0.8) return "bg-gray-900";
    return "bg-black";
  };

  return (
    <motion.div
      className={`
          w-12 h-12
          flex items-center justify-center
          ${getDepthColor(depth)}
          ${isAdjacent ? "cursor-pointer" : ""}
          ${isWall ? "opacity-0" : isRevealed ? "opacity-100" : "opacity-5"}
        `}
      onClick={isAdjacent ? onMove : undefined}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isPlayerHere ? <div>🐍</div> : <span>{cell}</span>}
    </motion.div>
  );
};

export default TravelTunnelCell;
