import { GRID_WIDTH, GRID_HEIGHT, TILES } from "../constants";
import { CoordString, GridMap, RevealedMap } from "../types";

const SPECIAL_TILE_CHANCE = 0.15; // Base chance for special tiles
const MAX_BRANCHES = 5; // Number of branching tunnels to attempt
const BRANCH_LENGTH = 3; // Length of each branch
const SPECIAL_TILES = [TILES.CRYSTAL, TILES.DANGER, TILES.RUIN]; // Possible special tiles

const getNeighbors = (x: number, y: number, grid: GridMap): number[][] => {
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

const illuminateKnownPath = (
  startX: number,
  startY: number,
  endX: number
): Set<CoordString> => {
  const path: Set<CoordString> = new Set();
  let currentX = startX;
  let currentY = startY;

  while (currentX < endX) {
    currentX++;
    path.add(`${currentX},${currentY}`);
  }

  return path;
};

/**
 * Generates a tunnel system between start and end points with branching paths and special tiles
 * @param startX - Starting X coordinate
 * @param startY - Starting Y coordinate
 * @param endX - Ending X coordinate
 * @param endY - Ending Y coordinate
 * @returns Object containing generated grid, depth map, known path, and revealed tiles
 */
export const generateTunnels = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  // Initialize grid with walls
  const newGrid: GridMap = Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(TILES.WALL));

  const newDepth: Record<string, number> = {};
  const stack = [[startX, startY]];
  const visited = new Set();

  // Main tunnel generation
  while (stack.length > 0) {
    const [currentX, currentY] = stack[stack.length - 1];
    const coordKey: CoordString = `${currentX},${currentY}`;

    visited.add(coordKey);

    // Calculate depth value (0 at center, 1 at top/bottom edges, for now)
    const depthValue = Math.abs(currentY - GRID_HEIGHT / 2) / (GRID_HEIGHT / 2);
    newDepth[coordKey] = depthValue;

    // Get unvisited neighbors in random order
    const neighbors = getNeighbors(currentX, currentY, newGrid)
      .filter(([nx, ny]) => !visited.has(`${nx},${ny}`))
      .sort(() => Math.random() - 0.5);

    if (neighbors.length > 0) {
      const [nextX, nextY] = neighbors[0];
      const midX = (currentX + nextX) / 2;
      const midY = (currentY + nextY) / 2;

      // Create tunnel segments
      newGrid[currentY][currentX] = TILES.TUNNEL;
      newGrid[Math.floor(midY)][Math.floor(midX)] = TILES.TUNNEL;

      // Occasionally place special tiles (more likely deeper in the cave)
      if (Math.random() < SPECIAL_TILE_CHANCE * (1 + depthValue)) {
        newGrid[currentY][currentX] =
          SPECIAL_TILES[Math.floor(Math.random() * SPECIAL_TILES.length)];
      }

      stack.push([nextX, nextY]);
    } else {
      stack.pop();
    }
  }

  //Carve the main tunnel
  let currentX = endX;
  let currentY = endY;
  while (currentX > startX) {
    newGrid[currentY][currentX] = TILES.TUNNEL;
    currentX -= 1;
  }

  // Mark start and end positions
  newGrid[startY][startX] = TILES.START;
  newGrid[endY][endX] = TILES.END;

  // Generate branching tunnels
  generateBranches(newGrid);

  //Generate the known path forward, wonky
  const newKnownPath = illuminateKnownPath(startX, startY, endX);
  const initialRevealed = {} as RevealedMap;

  newKnownPath.forEach((coord: CoordString) => {
    initialRevealed[coord] = true;
  });

  return {
    grid: newGrid,
    depth: newDepth,
    knownPath: newKnownPath,
    revealed: initialRevealed,
  };
};

/**
 * Generates branching tunnels from existing tunnels
 */
const generateBranches = (grid: GridMap) => {
  // Collect all existing tunnel tiles
  const tunnelTiles: [number, number][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x] === TILES.TUNNEL) {
        tunnelTiles.push([x, y]);
      }
    }
  }

  // Create several branches from random tunnel points
  for (let i = 0; i < MAX_BRANCHES && tunnelTiles.length > 0; i++) {
    const [startX, startY] =
      tunnelTiles[Math.floor(Math.random() * tunnelTiles.length)];
    let branchX = startX;
    let branchY = startY;

    // Grow branch in random directions
    for (let j = 0; j < BRANCH_LENGTH; j++) {
      const direction = Math.floor(Math.random() * 4);
      const [dx, dy] = [
        [-1, 0], // Left
        [1, 0], // Right
        [0, -1], // Up
        [0, 1], // Down
      ][direction];

      branchX += dx;
      branchY += dy;

      // Only carve if within bounds and hitting a wall
      if (
        branchX >= 0 &&
        branchX < GRID_WIDTH &&
        branchY >= 0 &&
        branchY < GRID_HEIGHT &&
        grid[branchY][branchX] === TILES.WALL
      ) {
        grid[branchY][branchX] = TILES.TUNNEL;
      }
    }
  }
};
