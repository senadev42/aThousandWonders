import { GridPosition } from "../store/state";

export interface TransitionDefinition {
  transitionId: string;
  transitionType: string;
  position: GridPosition;
  targetSceneId: string;
  target: GridPosition;
}

export interface RawScene {
  id: string;
  name: string;
  initPosition: GridPosition;
  layout: string[];
  transitions?: TransitionDefinition[];
  features?: Record<string, string>;
}

export type SceneMetadata = {
  id: string;
  name: string;
};
