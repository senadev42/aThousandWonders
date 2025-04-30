// index.ts
import { useTacticalMapState } from "./state";
import { useTravelActions } from "./actions";

export const useTravelStore = () => {
  const state = useTacticalMapState();
  const actions = useTravelActions();

  return {
    state,
    ...actions,
  };
};
