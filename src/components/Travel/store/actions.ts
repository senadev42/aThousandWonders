// actions.ts
import { GridPosition, useTravelState } from "./state";
import { generateTunnels } from "../helpers/generateTunnels";
import { GRID_HEIGHT, GRID_WIDTH } from "../constants";
import {
  getRevealedAdjacent,
  canMoveToGridPosition,
} from "../helpers/mapOperations";

export const useTravelActions = () => {
  const state = useTravelState();

  const initializeGrid = () => {
    const startY = Math.floor(GRID_HEIGHT / 2);
    const endY = Math.floor(GRID_HEIGHT / 2);

    const {
      grid: newGrid,
      depth: newDepth,
      revealed: initialRevealed,
    } = generateTunnels(0, startY, GRID_WIDTH - 1, endY);

    state.grid = newGrid;
    state.depth = newDepth;
    state.revealed = initialRevealed;
    state.isInitialized = true;
  };

  const revealAdjacent = (x: number, y: number): void => {
    const newRevealed = getRevealedAdjacent(x, y, state.grid, state.revealed);
    state.revealed = newRevealed;
  };

  const movePlayer = (x: number, y: number): void => {
    if (canMoveToGridPosition(x, y, state.playerPos, state.grid)) {
      // Batch all reveal operations into one update
      const newRevealed = {
        ...state.revealed,
        [`${x},${y}`]: true,
        ...getRevealedAdjacent(x, y, state.grid, state.revealed),
      };

      // Update state once with all changes
      state.playerPos = { x, y };
      state.revealed = newRevealed;
    }
  };

  //Debug State
  const setHoveredCell = (pos: GridPosition | null) => {
    state.hoveredCell = pos;
  };

  return {
    initializeGrid,
    movePlayer,
    revealAdjacent,
    setHoveredCell,
  };
};
