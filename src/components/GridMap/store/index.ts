// index.ts
import { useGridMapState } from "./state";
import { useTravelActions } from "./actions";

export const useTravelStore = () => {
  const state = useGridMapState();
  const actions = useTravelActions();

  return {
    state,
    ...actions,
  };
};
