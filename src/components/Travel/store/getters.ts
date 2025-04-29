// getters.ts
import { useTravelState } from "./state";
import { GridPosition } from "./state";
import { canMoveToGridPosition } from "../helpers/mapOperations";

export const useTravelGetters = () => {
  const state = useTravelState();

  const isValidMove = (pos: GridPosition) => {
    const { grid, playerPos } = state;
    return canMoveToGridPosition(pos.x, pos.y, playerPos, grid);
  };

  const getRevealedTileCount = () => {
    return Object.keys(state.revealed).length;
  };

  const getCurrentDepth = () => {
    const { playerPos, depth } = state;
    return depth[`${playerPos.x},${playerPos.y}`] || 0;
  };

  const getAdjacentTiles = () => {
    const { playerPos, grid } = state;
    const adjacent: GridPosition[] = [];

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of directions) {
      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;
      if (canMoveToGridPosition(newX, newY, playerPos, grid)) {
        adjacent.push({ x: newX, y: newY });
      }
    }

    return adjacent;
  };

  const getDepthColor = (depthValue: number) => {
    if (depthValue < 0.3) return "bg-gray-700";
    if (depthValue < 0.6) return "bg-gray-800";
    if (depthValue < 0.8) return "bg-gray-900";
    return "bg-black";
  };

  return {
    isValidMove,
    getRevealedTileCount,
    getCurrentDepth,
    getAdjacentTiles,
    getDepthColor,
  };
};
