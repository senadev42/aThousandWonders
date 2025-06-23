export enum NarrativeEventTypeEnum {
  SCENE_DRESSING = "SCENE_DRESSING",
  INTERACTABLE = "INTERACTABLE",
  DIVIDER = "DIVIDER",
}

export interface NarrativeEvent {
  id: string;
  type: NarrativeEventTypeEnum;
  payload: string;
}

// scene description types
export type FullNarrativePayload = {
  normal: string;
  firstTime?: string;
  investigate?: {
    check: number;
    success: string;
    fail: string;
  };
};

export type SceneOverview = Record<
  string,
  Omit<FullNarrativePayload, "investigate">
>;

export type StaticInteractables = Record<string, FullNarrativePayload>;
