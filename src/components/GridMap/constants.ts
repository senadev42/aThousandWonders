export const GRID_WIDTH = 19;
export const GRID_HEIGHT = 15;

export const BASE_TILES = {
  WALL: "wall",
  TUNNEL: "tunnel",
} as const;

export const FEATURES = {
  RUIN: "ruin",
  CRYSTAL: "crystal",
  DANGER: "danger",
  START: "start",
  END: "end",
} as const;

export const TILE_VISUALS = {
  [BASE_TILES.WALL]: " ",
  [BASE_TILES.TUNNEL]: " ",
  [FEATURES.RUIN]: "🏛️",
  [FEATURES.CRYSTAL]: "💎",
  [FEATURES.DANGER]: "💀",
  [FEATURES.START]: "A",
  [FEATURES.END]: "B",
} as const;
