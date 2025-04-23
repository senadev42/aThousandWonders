import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GRID_HEIGHT, GRID_WIDTH, TILES } from "./constants";
import { generateTunnels } from "./helpers/generateTunnels";
import { CoordString, DepthMap, GridMap, Position, RevealedMap } from "./types";

const ChartingMap = () => {
  //Map
  const [grid, setGrid] = useState<GridMap>([]);
  const [depth, setDepth] = useState<DepthMap>({});

  //player position
  const [playerPos, setPlayerPos] = useState<Position | null>(null);

  const [revealed, setRevealed] = useState<RevealedMap>({});
  const [knownPath, setKnownPath] = useState(new Set());

  const initializeGrid = () => {
    const startY = Math.floor(GRID_HEIGHT / 2);
    const endY = Math.floor(GRID_HEIGHT / 2);

    const {
      grid: newGrid,
      depth: newDepth,
      knownPath: newKnownPath,
      revealed: initialRevealed,
    } = generateTunnels(0, startY, GRID_WIDTH - 1, endY);

    setGrid(newGrid);
    setDepth(newDepth);
    setPlayerPos({ x: 0, y: startY });
    setKnownPath(newKnownPath);
    setRevealed(initialRevealed);
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const getDepthColor = (depthValue: number) => {
    if (depthValue < 0.3) return "bg-gray-700";
    if (depthValue < 0.6) return "bg-gray-800";
    if (depthValue < 0.8) return "bg-gray-900";
    return "bg-black";
  };

  const revealAdjacent = (x: number, y: number): void => {
    const adjacent: Position[] = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];

    const newRevealed: RevealedMap = { ...revealed };

    adjacent.forEach((pos) => {
      if (pos.x < 0 || pos.x >= GRID_WIDTH) return;
      if (pos.y < 0 || pos.y >= GRID_HEIGHT) return;
      if (grid[pos.y][pos.x] === TILES.WALL) return;

      const coordKey = `${pos.x},${pos.y}` as CoordString;
      newRevealed[coordKey] = true;
    });

    setRevealed(newRevealed);
  };

  const movePlayer = (x: number, y: number): void => {
    if (!playerPos) return;

    const isValidPosition =
      x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;

    const isAdjacent =
      Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1;

    const isWalkable = grid[y]?.[x] !== TILES.WALL;

    if (isValidPosition && isAdjacent && isWalkable) {
      setPlayerPos({ x, y });
      setRevealed((prev) => ({ ...prev, [`${x},${y}`]: true }));
      revealAdjacent(x, y);
      //trigger events
    }
  };

  return (
    <div className="flex">
      {/* Left Side, Map */}
      <div className="flex flex-col space-y-2">
        {/* Header */}
        <div className="p-2 text-gray-200 bg-gray-900">
          <h2 className="text-xl font-bold">Charting: A → B</h2>
        </div>

        {/* Charting Grid */}
        <div
          className="grid bg-gray-950 rounded"
          style={{
            gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x: number) => {
              const isRevealed =
                revealed[`${x},${y}`] ||
                cell === TILES.START ||
                cell === TILES.END;

              const isWall = cell === TILES.WALL;

              const isAdjacent =
                playerPos &&
                Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1 &&
                !isWall;

              return (
                <motion.div
                  key={`${x}-${y}`}
                  className={`
                                        aspect-square
                                        flex items-center justify-center
                                        text-2xl
                                        ${getDepthColor(
                                          depth[`${x},${y}`] || 0
                                        )}
                                        ${
                                          isAdjacent
                                            ? "cursor-pointer hover:opacity-80"
                                            : ""
                                        }
                                        ${
                                          isWall
                                            ? "opacity-0"
                                            : isRevealed
                                            ? "opacity-100"
                                            : "opacity-5"
                                        }
                                           
                                    `}
                  onClick={() => (isAdjacent ? movePlayer(x, y) : null)}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {playerPos?.x === x && playerPos?.y === y ? "🐍" : cell}
                </motion.div>
              );
            })
          )}
        </div>

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
      </div>
    </div>
  );
};

export default ChartingMap;
