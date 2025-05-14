// actions.ts
import {
  GridPosition,
  BaseScene,
  GridMapState,
  useGridMapState,
  SceneParams,
  SceneType,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  BaseTiles,
} from "./state";
import { generateTunnels } from "../helpers/generateTunnels";
import { getSceneById, padSceneToViewport } from "../scenes/sceneProcessor";

export const useTravelActions = () => {
  const state = useGridMapState();

  /**
   * Accepts a sceneParams object and initializes the scene based on the type.
   * @param sceneParams
   */
  const initializeScene = (sceneParams: SceneParams) => {
    state.isInitialized = false;

    switch (sceneParams.sceneType) {
      case SceneType.RANDOM:
        if (!sceneParams.seed)
          throw new Error("Seed is required for random scene generation");

        const startY = Math.floor(VIEWPORT_HEIGHT / 2);
        const endY = Math.floor(VIEWPORT_HEIGHT + VIEWPORT_HEIGHT);

        const newRandomScene: BaseScene = generateTunnels(
          0,
          startY,
          VIEWPORT_WIDTH - 1,
          endY,
          sceneParams.seed
        );

        state.currentScene = {
          sceneType: SceneType.RANDOM,
          seed: sceneParams.seed,
          data: newRandomScene,
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
        };

        break;

      case SceneType.EMPTY:
        const newEmptyScene = Array.from({ length: VIEWPORT_HEIGHT }, () =>
          Array.from({ length: VIEWPORT_WIDTH }, () => ({
            type: BaseTiles.FLOOR,
            revealed: true,
          }))
        );

        state.currentScene = {
          sceneType: SceneType.EMPTY,
          data: newEmptyScene,
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
        };

        break;

      case SceneType.PREMADE: {
        if (!sceneParams.sceneId) throw new Error("Scene ID required");

        let newLoadedScene = getSceneById(sceneParams.sceneId);
        if (!newLoadedScene)
          throw new Error(`Scene ${sceneParams.sceneId} not found`);

        newLoadedScene = padSceneToViewport(
          newLoadedScene,
          VIEWPORT_WIDTH,
          VIEWPORT_HEIGHT
        );

        state.currentScene = {
          sceneType: SceneType.PREMADE,
          sceneId: sceneParams.sceneId,
          data: newLoadedScene.data,
          width: newLoadedScene.width,
          height: newLoadedScene.height,
        };
        break;
      }

      default:
        throw new Error(`Unknown scene type`);
    }

    revealAreaAround(
      state.playerPosition.x,
      state.playerPosition.y,
      state.currentScene.data
    );

    state.isInitialized = true;
  };

  /**
   * Moves the player to a new position if the move is valid.
   * @param x
   * @param y
   * @returns
   */
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
    [x - 1, y], // left
    [x + 1, y], // right
    [x, y - 1], // top
    [x, y + 1], // bottom
    [x - 1, y - 1], // top-left
    [x + 1, y - 1], // top-right
    [x - 1, y + 1], // bottom-left
    [x + 1, y + 1], // bottom-right
  ];

  adjacentPositions.forEach(([adjX, adjY]) => {
    if (
      newMap[adjY] &&
      newMap[adjY][adjX] &&
      newMap[adjY][adjX].type === BaseTiles.FLOOR
    ) {
      newMap[adjY][adjX].revealed = true;
    }
  });
  return newMap;
}
