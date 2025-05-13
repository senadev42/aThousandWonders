// state.ts
import { proxy } from "valtio";

export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 13;

//Base Scene Types
export enum BaseTiles {
  WALL = "wall",
  FLOOR = "floor",
}

export type BaseCell = {
  type: BaseTiles;
  revealed: boolean;
};

export type BaseScene = BaseCell[][];

export type GridPosition = {
  x: number;
  y: number;
};

//Scene Types
export enum SceneType {
  RANDOM = "random",
  EMPTY = "empty",
  PREMADE = "premade",
}

export type SceneParams = {
  sceneType: SceneType;
  seed?: number;
  sceneId?: string;
};

export type Scene = SceneParams & {
  data: BaseScene;
};

export interface GridMapState {
  isInitialized: boolean;
  seed: number;

  currentScene: Scene;

  playerPosition: GridPosition;
  debugSettings: {
    showCoords: boolean;
  };

  //getters
  debugInfo: {
    playerPosition: string;
    seed: number;
  };
}

export const gridMapState = proxy<GridMapState>({
  isInitialized: false,
  seed: 0,
  currentScene: {
    sceneType: SceneType.EMPTY,
    data: Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => ({
        type: BaseTiles.FLOOR,
        revealed: true,
      }))
    ),
  },
  playerPosition: {
    x: 0,
    y: Math.round(GRID_HEIGHT / 2),
  },
  debugSettings: {
    showCoords: false,
  },

  get debugInfo() {
    return {
      playerPosition: `X: ${this.playerPosition.x} Y: ${this.playerPosition.y}`,
      seed: this.seed,
    };
  },
});

export const useGridMapState = () => gridMapState;
