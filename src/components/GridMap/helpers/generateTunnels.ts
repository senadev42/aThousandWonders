import { BaseTiles, VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../store/state";
import { BaseCell } from "../store/state";

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
    if (
      newX >= 0 &&
      newX < VIEWPORT_WIDTH &&
      newY >= 0 &&
      newY < VIEWPORT_HEIGHT
    ) {
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
): BaseCell[][] => {
  const seedRandom = createSeededRandom(seed);

  // Initialize grid with walls
  let newBaseScene: BaseCell[][] = Array.from({ length: VIEWPORT_HEIGHT }, () =>
    Array.from({ length: VIEWPORT_WIDTH }, () => ({
      type: BaseTiles.WALL,
      revealed: false,
    }))
  );

  const stack = [
    [startX, startY],
    [endX, endY],
  ];
  const visited = new Set();

  // carve a tunnel between them
  for (let x = startX; x <= endX; x++) {
    newBaseScene[startY][x] = {
      type: BaseTiles.FLOOR,
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
      newBaseScene[currentY][currentX].type = BaseTiles.FLOOR;
      newBaseScene[Math.floor(midY)][Math.floor(midX)].type = BaseTiles.FLOOR;

      stack.push([nextX, nextY]);
    } else {
      stack.pop();
    }
  }

  //Illuminate the known path forward,
  let currentX = startX - 1;
  while (currentX < endX) {
    currentX++;
    newBaseScene[startY][currentX].revealed = true;
  }

  return newBaseScene;
};
