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
