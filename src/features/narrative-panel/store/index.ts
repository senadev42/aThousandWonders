import { useNarrativeActions } from "@/features/narrative-panel/store/actions";
import { useNarrativeState } from "@/features/narrative-panel/store/state";

export const useNarrativeStore = () => {
  const state = useNarrativeState();
  const actions = useNarrativeActions();

  return {
    state,
    ...actions,
  };
};
