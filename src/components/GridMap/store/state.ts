// state.ts
import { proxy } from "valtio";

export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 13;

//Base Scene Types
export enum BASE_TILES {
  WALL = "wall",
  FLOOR = "floor",
}
export type BaseCellType = BASE_TILES.WALL | BASE_TILES.FLOOR;

export type BaseCell = {
  type: BaseCellType;
  revealed: boolean;
};

export type BaseScene = BaseCell[][];

export type GridPosition = {
  x: number;
  y: number;
};

//Scene Data -

export interface GridMapState {
  isInitialized: boolean;
  seed: number;
  currentScene: BaseScene;
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
  currentScene: [],
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
