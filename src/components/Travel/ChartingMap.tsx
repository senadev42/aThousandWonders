import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GRID_HEIGHT, GRID_WIDTH, TILES } from "./constants";
import { generateTunnels } from "./helpers/generateTunnels";
import { DepthMap, GridMap, Position, RevealedMap, TileType } from "./types";
import {
  getRevealedAdjacent,
  canMoveToPosition,
} from "./helpers/mapOperations";

const ChartingMap = () => {
  //State
  const [grid, setGrid] = useState<GridMap>([]);
  const [depth, setDepth] = useState<DepthMap>({});
  const [playerPos, setPlayerPos] = useState<Position>({
    x: 0,
    y: GRID_HEIGHT / 2,
  });
  const [revealed, setRevealed] = useState<RevealedMap>({});

  //Actions
  const revealAdjacent = (x: number, y: number): void => {
    const newRevealed = getRevealedAdjacent(x, y, grid, revealed);
    setRevealed(newRevealed);
  };

  const movePlayer = (x: number, y: number): void => {
    if (canMoveToPosition(x, y, playerPos, grid)) {
      setPlayerPos({ x, y });
      setRevealed((prev) => ({ ...prev, [`${x},${y}`]: true }));
      revealAdjacent(x, y);
      //trigger events
    }
  };

  //Component Init
  const initializeGrid = () => {
    const startY = Math.floor(GRID_HEIGHT / 2);
    const endY = Math.floor(GRID_HEIGHT / 2);

    const {
      grid: newGrid,
      depth: newDepth,
      revealed: initialRevealed,
    } = generateTunnels(0, startY, GRID_WIDTH - 1, endY);

    setGrid(newGrid);
    setDepth(newDepth);
    setRevealed(initialRevealed);
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  return (
    <div className="flex">
      {/* Left Side, Map */}
      <div className="flex flex-col space-y-2">
        {/* Header */}
        <div className="p-2 text-gray-200 bg-gray-900">
          <h2 className="text-xl font-bold">Charting: A → B</h2>
        </div>

        {/* Charting Grid */}
        {grid && grid.length > 0 && (
          <div className="flex flex-col space-y-2">
            <ChartingGrid
              grid={grid}
              depth={depth}
              revealed={revealed}
              playerPos={playerPos}
              movePlayer={movePlayer}
            />
          </div>
        )}

        {/* Legend and eventually actions */}
        <div className="text-gray-200 p-2 bg-gray-900 ">
          <p>🐍 Le Serpent</p>
        </div>
      </div>

      {/* Debug Menu */}
      {/* 1. Has a reset button */}
      <div className="flex flex-col space-y-2 ml-4 bg-gray-900 p-4 rounded w-[20rem]">
        <button
          className="mt-4 p-2 bg-gray-800 text-gray-200 rounded"
          onClick={initializeGrid}
        >
          Reset
        </button>

        {/* Render debug information here */}
        <div>
          {/* About the grid */}
          <h3 className="text-lg font-bold">Debug Information</h3>
          <p>
            Grid Size: {grid.length} x {grid[0]?.length}
          </p>
          <p>Player Position: {`(${playerPos.x}, ${playerPos.y})`}</p>
          <p>Revealed Tiles: {Object.keys(revealed).length}</p>
        </div>
      </div>
    </div>
  );
};

// Cell Component
type MapCellProps = {
  x: number;
  y: number;
  cell: TileType;
  depth: number;
  isRevealed: boolean;
  isWall: boolean;
  isAdjacent: boolean;
  isPlayerHere: boolean;
  onMove: () => void;
};

const MapCell = (props: MapCellProps) => {
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

// Grid Component

type ChartingGridProps = {
  grid: TileType[][];
  depth: DepthMap;
  revealed: RevealedMap;
  playerPos: Position;
  movePlayer: (x: number, y: number) => void;
};

const ChartingGrid = (props: ChartingGridProps) => {
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
            <MapCell
              key={`${x}-${y}`}
              x={x}
              y={y}
              cell={cell}
              depth={depth[`${x},${y}`] || 0}
              isRevealed={isRevealed}
              isWall={isWall}
              isAdjacent={isAdjacent}
              isPlayerHere={isPlayerHere}
              onMove={() => movePlayer(x, y)}
            />
          );
        })
      )}
    </div>
  );
};

export default ChartingMap;
