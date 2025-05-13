// actions.ts
import {
  GridPosition,
  BaseScene,
  GridMapState,
  useGridMapState,
} from "./state";
import { generateTunnels } from "../helpers/generateTunnels";
import { BASE_TILES, GRID_HEIGHT, GRID_WIDTH } from "./state";

export const useTravelActions = () => {
  const state = useGridMapState();

  const initializeGrid = (emptyMap?: boolean) => {
    state.isInitialized = false;
    const startY = Math.floor(GRID_HEIGHT / 2);
    const endY = Math.floor(GRID_HEIGHT / 2);

    state.seed = Math.floor(Math.random() * 10000);

    state.currentScene = generateTunnels(
      0,
      startY,
      GRID_WIDTH - 1,
      endY,
      state.seed,
      emptyMap
    );

    state.isInitialized = true;
  };

  const movePlayer = (x: number, y: number): void => {
    if (!isValidMove(x, y, state.playerPosition, state.currentScene)) return;
    state.currentScene = revealAreaAround(x, y, state.currentScene);
    state.playerPosition = { x, y };
  };

  const updateDebugSettings = (
    settings: Partial<GridMapState["debugSettings"]>
  ) => {
    state.debugSettings = {
      ...state.debugSettings,
      ...settings,
    };
  };

  return {
    initializeGrid,
    movePlayer,
    updateDebugSettings,
  };
};

//Utild
function isInBounds(x: number, y: number): boolean {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

export function isAdjacent(
  x: number,
  y: number,
  playerPos: GridPosition,
  isWall?: boolean
): boolean {
  if (isWall) return false;
  return Math.max(Math.abs(x - playerPos.x), Math.abs(y - playerPos.y)) === 1;
}

function isValidMove(
  targetX: number,
  targetY: number,
  playerPos: GridPosition,
  map: BaseScene
): boolean {
  return (
    isInBounds(targetX, targetY) &&
    isAdjacent(targetX, targetY, playerPos) &&
    map[targetY][targetX].type === BASE_TILES.FLOOR
  );
}

function revealAreaAround(
  x: number,
  y: number,
  currentScene: BaseScene
): BaseScene {
  // Create new map copy
  const newMap = currentScene.map((row) =>
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
    if (newMap[adjY][adjX].type === BASE_TILES.FLOOR) {
      newMap[adjY][adjX].revealed = true;
    }
  });

  return newMap;
}
