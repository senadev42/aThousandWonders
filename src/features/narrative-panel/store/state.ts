import { proxy } from "valtio";
import { NarrativeEvent } from "@/features/narrative-panel/types";
export interface NarrativeState {
  npEvents: NarrativeEvent[];
}

const narrativeState = proxy<NarrativeState>({
  npEvents: [],
});

export const useNarrativeState = () => narrativeState;
