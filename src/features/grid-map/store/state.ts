// state.ts
import { proxy } from "valtio";
import { TransitionDefinition } from "@/features/grid-map/types";
import { SceneBackground } from "@/features/grid-map/helpers/resolveBackgroundImage";

export const VIEWPORT_WIDTH = 13;
export const VIEWPORT_HEIGHT = 11;

export const CELL_SIZE = 45;

//Base Scene Types
export enum BaseTiles {
  WALL = "wall",
  FLOOR = "floor",
}

export type BaseCell = {
  type: BaseTiles;
  revealed: boolean;
  transitionId?: string;
  feature?: string; // Add this
};

export type BaseScene = BaseCell[][];

export type GridPosition = {
  x: number;
  y: number;
};

//Scene Types
export enum SceneType {
  MAZE = "maze",
  DUNGEON = "dungeon",
  EMPTY = "empty",
  PREMADE = "premade",
}

export type SceneParams = {
  sceneType: SceneType;
  seed?: number;
  sceneId?: string;
  initPosition?: GridPosition;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type Scene = {
  data: BaseScene;
  background?: SceneBackground;
  name?: string;
  transitions?: Record<string, TransitionDefinition>;
} & Dimensions &
  SceneParams;

export interface ProcessedScenes {
  [key: string]: Scene;
}

//debug
export type DebugSettings = {
  showCoords: boolean;
  showScollbar: boolean;
};

export type DebugInfo = {
  playerPosition: string;
  seed: number;
  isUsingBgImage: boolean;
} & DebugSettings;

export interface GridMapState {
  //scene metadata
  isInitialized: boolean;

  //scene content
  currentScene: Scene;
  processedScenes: ProcessedScenes;

  //entity data
  playerPosition: GridPosition;
  debugSettings: DebugSettings;

  //getters
  debugInfo: DebugInfo;
}

export const gridMapState = proxy<GridMapState>({
  //scene metadata
  isInitialized: false,

  //scene content
  currentScene: {
    //default empty scene
    sceneType: SceneType.EMPTY,
    data: [],
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
  },
  processedScenes: {},

  playerPosition: {
    x: Math.round(VIEWPORT_WIDTH / 2),
    y: Math.round(VIEWPORT_HEIGHT / 2),
  },

  debugSettings: {
    showCoords: false,
    showScollbar: true,
  },

  get debugInfo() {
    return {
      playerPosition: `X: ${this.playerPosition.x} Y: ${this.playerPosition.y}`,
      seed: this.currentScene.seed || 0,
      isUsingBgImage: !!this.currentScene.background,
      ...this.debugSettings,
    };
  },
});

export const useGridMapState = () => gridMapState;
