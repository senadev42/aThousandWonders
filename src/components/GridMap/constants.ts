export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 13;

export enum BASE_TILES {
  WALL = "wall",
  FLOOR = "floor",
}

export const FEATURES = {
  RUIN: "ruin",
  CRYSTAL: "crystal",
  DANGER: "danger",
  START: "start",
  END: "end",
} as const;

export const TILE_VISUALS = {
  [BASE_TILES.WALL]: " ",
  [BASE_TILES.FLOOR]: " ",
  [FEATURES.RUIN]: "🏛️",
  [FEATURES.CRYSTAL]: "💎",
  [FEATURES.DANGER]: "💀",
  [FEATURES.START]: "A",
  [FEATURES.END]: "B",
} as const;
