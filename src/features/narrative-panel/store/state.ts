import { proxy } from "valtio";

export enum NarrativeEventTypeEnum {
  SCENE_DRESSING = "SCENE_DRESSING",
  DIVIDER = "DIVIDER",
}

export interface NarrativeEvent {
  id: string;
  type: NarrativeEventTypeEnum;
  payload: string;
}

export interface NarrativeState {
  npEvents: NarrativeEvent[];
}

const narrativeState = proxy<NarrativeState>({
  npEvents: [],
});

export const useNarrativeState = () => narrativeState;
