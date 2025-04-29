// index.ts
import { useTravelState } from "./state";
import { useTravelActions } from "./actions";
import { useTravelGetters } from "./getters";

export const useTravelStore = () => {
  const state = useTravelState();
  const actions = useTravelActions();
  const getters = useTravelGetters();

  return {
    state,
    ...actions,
    ...getters,
  };
};
