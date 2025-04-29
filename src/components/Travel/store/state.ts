// state.ts
import { proxy } from "valtio";
import { GRID_HEIGHT, GRID_WIDTH } from "../constants";

export interface TravelState {
  isInitialized: boolean;
  grid: GridMap;
  depth: DepthMap;
  playerPos: GridPosition;
  revealed: RevealedMap;
}

const travelState = proxy<TravelState>({
  isInitialized: false,
  grid: [],
  depth: {},
  playerPos: {
    x: 0,
    y: GRID_HEIGHT / 2,
  },
  revealed: {},
});

export const useTravelState = () => travelState;

//types
export type TileType = "⬛" | "🏛️" | "💎" | "💀" | "🟢" | "🔴" | " ";

export type GridMap = TileType[][];

export type GridPosition = {
  x: number;
  y: number;
};

export type DepthMap = {
  [key: string]: number;
};

export type CoordString = `${number},${number}`;

export type RevealedMap = {
  [key in CoordString]: boolean;
};
