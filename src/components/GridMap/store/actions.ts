// actions.ts
import {
  GridPosition,
  BaseScene,
  GridMapState,
  useGridMapState,
  SceneParams,
  SceneType,
} from "./state";
import { generateTunnels } from "../helpers/generateTunnels";
import { BaseTiles, GRID_HEIGHT, GRID_WIDTH } from "./state";

export const useTravelActions = () => {
  const state = useGridMapState();

  const initializeScene = (sceneParams: SceneParams) => {
    state.isInitialized = false;

    const startY = Math.floor(GRID_HEIGHT / 2);
    const endY = Math.floor(GRID_HEIGHT / 2);

    let newScene: BaseScene;

    switch (sceneParams.sceneType) {
      case SceneType.RANDOM:
        console.log("generating random map with seed", sceneParams.seed);

        if (!sceneParams.seed)
          throw new Error("Seed is required for random scene generation");

        newScene = generateTunnels(
          0,
          startY,
          GRID_WIDTH - 1,
          endY,
          sceneParams.seed
        );

        state.currentScene = {
          sceneType: SceneType.RANDOM,
          seed: sceneParams.seed,
          data: newScene,
        };

        break;

      case SceneType.EMPTY:
        newScene = Array.from({ length: GRID_HEIGHT }, () =>
          Array.from({ length: GRID_WIDTH }, () => ({
            type: BaseTiles.FLOOR,
            revealed: true,
          }))
        );

        state.currentScene = {
          sceneType: SceneType.EMPTY,
          data: newScene,
        };

        break;

      case SceneType.PREMADE:
        console.log("Loading premade scene:", sceneParams.sceneId);
        throw new Error("Not implemented yet");

        break;

      default:
        throw new Error(`Unknown scene type`);
    }

    state.isInitialized = true;
  };

  const movePlayer = (x: number, y: number): void => {
    if (!isValidMove(x, y, state.playerPosition, state.currentScene.data))
      return;
    state.currentScene.data = revealAreaAround(x, y, state.currentScene.data);
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
    initializeScene,
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
    map[targetY][targetX].type === BaseTiles.FLOOR
  );
}

function revealAreaAround(x: number, y: number, data: BaseScene): BaseScene {
  // Create new map copy
  const newMap = data.map((row) => [...row].map((cell) => ({ ...cell })));

  // Reveal center and adjacent cells
  newMap[y][x].revealed = true;

  const adjacentPositions = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ].filter(([x, y]) => isInBounds(x, y));

  adjacentPositions.forEach(([adjX, adjY]) => {
    if (newMap[adjY][adjX].type === BaseTiles.FLOOR) {
      newMap[adjY][adjX].revealed = true;
    }
  });

  return newMap;
}
