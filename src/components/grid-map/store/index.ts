// index.ts
import { useGridMapState } from "@/components/grid-map/store/state";
import { useTravelActions } from "@/components/grid-map/store/actions";

export const useTravelStore = () => {
  const state = useGridMapState();
  const actions = useTravelActions();

  return {
    state,
    ...actions,
  };
};
