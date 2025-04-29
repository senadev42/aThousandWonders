// index.ts
import { useTravelState } from "./state";
import { useTravelActions } from "./actions";

export const useTravelStore = () => {
  const state = useTravelState();
  const actions = useTravelActions();

  return {
    state,
    ...actions,
  };
};
