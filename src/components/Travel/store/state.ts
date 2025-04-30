// state.ts
import { proxy } from "valtio";
import { GRID_HEIGHT } from "../constants";

export type TacticalGridCell = {
  type: BaseCellType;
  depth: number;
  feature: FeatureType | null;
  revealed: boolean;
};

export type TacticalGridMap = TacticalGridCell[][];

interface TacticalMapState {
  isInitialized: boolean;
  seed: number;
  tacticalGridMap: TacticalGridMap;
  playerPosition: GridPosition;

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

  get debugInfo() {
    return {
      playerPosition: `X: ${this.playerPosition.x} Y: ${this.playerPosition.y}`,
      seed: this.seed,
    };
  },
});

export const useTacticalMapState = () => tacticalMapState;

export type BaseCellType = "wall" | "tunnel";

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
