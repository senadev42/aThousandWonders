import { TileType } from "./store/state";

export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 12;

export const TILES: Record<string, TileType> = {
  WALL: "⬛",
  TUNNEL: " ",
  RUIN: "🏛️",
  CRYSTAL: "💎",
  DANGER: "💀",
  START: "A",
  END: "B",
};
