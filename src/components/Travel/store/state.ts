// state.ts
import { proxy } from "valtio";
import { GRID_HEIGHT, GRID_WIDTH } from "../constants";

export interface TravelState {
  isInitialized: boolean;
  grid: GridMap;
  depth: DepthMap;
  playerPos: Position;
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

export type Position = {
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
