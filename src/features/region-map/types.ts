export type PolyPoint = [number, number];
export type Polygon = PolyPoint[];

export interface RegionInfo {
  type: string;
  resources: string;
  settlements: string;
  description: string;
}

export interface Region {
  name: string;
  points: Polygon;
  info: RegionInfo;
}

export interface CanvasState {
  mousePosition: PolyPoint;
  showTooltip: boolean;
  clickedPoints: PolyPoint[];
  selectedRegion: Region | null;
}
