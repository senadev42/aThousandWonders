import { BASE_TILES, FEATURES, GRID_HEIGHT, GRID_WIDTH } from "../constants";
import { CoordString, TacticalGridCell } from "../store/state";
import { generateFeatures } from "./generateFeatures";

const getNeighbors = (x: number, y: number): number[][] => {
  const neighbors = [];
  const directions = [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ];

  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;
    if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
      neighbors.push([newX, newY]);
    }
  }
  return neighbors;
};

function createSeededRandom(seed: number) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/**
 * Generates a tunnel system between start and end points with branching paths and special tiles
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @returns A 2D array representing the tactical grid map with tunnels and features
 */
export const generateTunnels = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  seed: number
): TacticalGridCell[][] => {
  const seedRandom = createSeededRandom(seed);

  // Initialize grid with walls
  let newTacticalGridMap: TacticalGridCell[][] = Array.from(
    { length: GRID_HEIGHT },
    () =>
      Array.from({ length: GRID_WIDTH }, () => ({
        type: BASE_TILES.WALL,
        depth: 0,
        feature: null,
        revealed: false,
      }))
  );

  console.log(
    `Generating tunnels from (${startX}, ${startY}) to (${endX}, ${endY})`
  );

  const stack = [
    [startX, startY],
    [endX, endY],
  ];
  const visited = new Set();

  // carve a tunnel between them
  for (let x = startX; x <= endX; x++) {
    newTacticalGridMap[startY][x] = {
      type: BASE_TILES.TUNNEL,
      feature: null,
      revealed: false,
    };
  }

  // Main tunnel generation
  while (stack.length > 0) {
    const [currentX, currentY] = stack[stack.length - 1];

    const coordKey = `${currentX},${currentY}`;
    visited.add(coordKey);

    // Get unvisited neighbors in random order
    const neighbors = getNeighbors(currentX, currentY)
      .filter(([nx, ny]) => !visited.has(`${nx},${ny}`))
      .sort(() => seedRandom() - 0.5);

    if (neighbors.length > 0) {
      const [nextX, nextY] = neighbors[0];
      const midX = (currentX + nextX) / 2;
      const midY = (currentY + nextY) / 2;

      // Create tunnel segments
      newTacticalGridMap[currentY][currentX].type = BASE_TILES.TUNNEL;
      newTacticalGridMap[Math.floor(midY)][Math.floor(midX)].type =
        BASE_TILES.TUNNEL;

      stack.push([nextX, nextY]);
    } else {
      stack.pop();
    }
  }

  newTacticalGridMap = generateFeatures(newTacticalGridMap);

  // Mark start and end positions
  newTacticalGridMap[startY][startX].feature = FEATURES.START;
  newTacticalGridMap[endY][endX].feature = FEATURES.END;

  //Illuminate the known path forward,
  let currentX = startX - 1;
  while (currentX < endX) {
    currentX++;
    newTacticalGridMap[startY][currentX].revealed = true;
  }

  return newTacticalGridMap;
};
