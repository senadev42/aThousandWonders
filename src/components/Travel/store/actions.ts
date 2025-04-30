// actions.ts
import { GridPosition, TacticalGridMap, useTacticalMapState } from "./state";
import { generateTunnels } from "../helpers/generateTunnels";
import { GRID_HEIGHT, GRID_WIDTH } from "../constants";

export const useTravelActions = () => {
  const state = useTacticalMapState();

  const initializeGrid = () => {
    state.isInitialized = false;
    const startY = Math.floor(GRID_HEIGHT / 2);
    const endY = Math.floor(GRID_HEIGHT / 2);

    state.seed = Math.floor(Math.random() * 10000);

    state.tacticalGridMap = generateTunnels(
      0,
      startY,
      GRID_WIDTH - 1,
      endY,
      state.seed
    );

    state.isInitialized = true;
  };

  const movePlayer = (x: number, y: number): void => {
    if (!isValidMove(x, y, state.playerPosition, state.tacticalGridMap)) return;
    state.tacticalGridMap = revealAreaAround(x, y, state.tacticalGridMap);
    state.playerPosition = { x, y };
  };

  return {
    initializeGrid,
    movePlayer,
  };
};

function isInBounds(x: number, y: number): boolean {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

function isAdjacent(x: number, y: number, playerPos: GridPosition): boolean {
  return Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1;
}

function isValidMove(
  targetX: number,
  targetY: number,
  playerPos: GridPosition,
  map: TacticalGridMap
): boolean {
  return (
    isInBounds(targetX, targetY) &&
    isAdjacent(targetX, targetY, playerPos) &&
    map[targetY][targetX].type === "tunnel"
  );
}

function revealAreaAround(
  x: number,
  y: number,
  tacticalGridMap: TacticalGridMap
): TacticalGridMap {
  // Create new map copy
  const newMap = tacticalGridMap.map((row) =>
    [...row].map((cell) => ({ ...cell }))
  );

  // Reveal center and adjacent cells
  newMap[y][x].revealed = true;

  const adjacentPositions = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ].filter(([x, y]) => isInBounds(x, y));

  adjacentPositions.forEach(([adjX, adjY]) => {
    if (newMap[adjY][adjX].type === "tunnel") {
      newMap[adjY][adjX].revealed = true;
    }
  });

  return newMap;
}
