// state.ts
import { proxy } from "valtio";

export const VIEWPORT_WIDTH = 13;
export const VIEWPORT_HEIGHT = 13;

export const CELL_SIZE = 36;

//Base Scene Types
export enum BaseTiles {
  WALL = "wall",
  FLOOR = "floor",
}

export type BaseCell = {
  type: BaseTiles;
  revealed: boolean;
  feature?: string; // Add this
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

export type Dimensions = {
  width: number;
  height: number;
};

export type Scene = SceneParams &
  Dimensions & {
    data: BaseScene;
    name?: string;
  };

export interface GridMapState {
  //scene metadata
  isInitialized: boolean;

  //scene content
  currentScene: Scene;

  //entity data
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
  //scene metadata
  isInitialized: false,

  //scene content
  currentScene: {
    //default empty scene
    sceneType: SceneType.EMPTY,
    data: Array.from({ length: VIEWPORT_HEIGHT }, () =>
      Array.from({ length: VIEWPORT_WIDTH }, () => ({
        type: BaseTiles.FLOOR,
        revealed: true,
      }))
    ),
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
  },

  playerPosition: {
    x: Math.round(VIEWPORT_WIDTH / 2),
    y: Math.round(VIEWPORT_HEIGHT / 2),
  },

  debugSettings: {
    showCoords: false,
  },

  get debugInfo() {
    return {
      playerPosition: `X: ${this.playerPosition.x} Y: ${this.playerPosition.y}`,
      seed: this.currentScene.seed || 0,
    };
  },
});

export const useGridMapState = () => gridMapState;
