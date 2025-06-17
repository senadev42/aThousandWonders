// index.ts
import { useGridMapState } from "@/features/grid-map/store/state";
import { useTravelActions } from "@/features/grid-map/store/actions";

export const useTravelStore = () => {
  const state = useGridMapState();
  const actions = useTravelActions();

  return {
    state,
    ...actions,
  };
};
