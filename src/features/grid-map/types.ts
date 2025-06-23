import { GridPosition } from "./store/state";

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
  blockedMoves?: string[];
  interactables?: {
    id: string;
    type: string;
    position: GridPosition;
  }[];
}

export type SceneMetadata = {
  id: string;
  name: string;
};

//Interactables
export enum InteractableTypeEnum {
  BASIC = "basic",
  INVESTIGATE = "investigate",
}

export type Interactable = {
  id: string;
  type: InteractableTypeEnum;
  position: GridPosition;
};
