// state.ts
import { proxy } from "valtio";
import { BASE_TILES, GRID_HEIGHT } from "../constants";

export type TacticalGridCell = {
  type: BaseCellType;
  feature: FeatureType | null;
  revealed: boolean;
};

export type TacticalGridMap = TacticalGridCell[][];

export interface TacticalMapState {
  isInitialized: boolean;
  seed: number;
  tacticalGridMap: TacticalGridMap;
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

export const tacticalMapState = proxy<TacticalMapState>({
  isInitialized: false,
  seed: 0,
  tacticalGridMap: [],
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

export const useTacticalMapState = () => tacticalMapState;

export type BaseCellType = BASE_TILES.WALL | BASE_TILES.FLOOR;

export type FeatureType =
  | "ruin"
  | "crystal"
  | "danger"
  | "start"
  | "end"
  | null;

export type GridPosition = {
  x: number;
  y: number;
};

//types
export type CoordString = `${number},${number}`;

export type BaseTile = "wall" | "tunnel";

export type BaseGridMap = BaseTile[][];
