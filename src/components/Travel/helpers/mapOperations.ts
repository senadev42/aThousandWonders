// helpers/mapOperations.ts
import { GRID_HEIGHT, GRID_WIDTH, TILES } from "../constants";
import {
  CoordString,
  GridMap,
  GridPosition,
  RevealedMap,
} from "../store/state";

export const getAdjacentTiles = (x: number, y: number): GridPosition[] => {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
};

export const isValidGridPosition = (x: number, y: number): boolean => {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
};

export const isAdjacent = (pos1: GridPosition, pos2: GridPosition): boolean => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) === 1;
};

export const isWalkable = (grid: GridMap, x: number, y: number): boolean => {
  return grid[y]?.[x] !== TILES.WALL;
};

export const getRevealedAdjacent = (
  x: number,
  y: number,
  grid: GridMap,
  currentRevealed: RevealedMap
): RevealedMap => {
  const adjacent = getAdjacentTiles(x, y);
  const newRevealed = { ...currentRevealed };

  adjacent.forEach((pos) => {
    if (!isValidGridPosition(pos.x, pos.y)) return;
    if (!isWalkable(grid, pos.x, pos.y)) return;

    const coordKey = `${pos.x},${pos.y}` as CoordString;
    newRevealed[coordKey] = true;
  });

  return newRevealed;
};

export const canMoveToGridPosition = (
  targetX: number,
  targetY: number,
  currentPos: GridPosition,
  grid: GridMap
): boolean => {
  if (!currentPos) return false;

  return (
    isValidGridPosition(targetX, targetY) &&
    isAdjacent(currentPos, { x: targetX, y: targetY }) &&
    isWalkable(grid, targetX, targetY)
  );
};
