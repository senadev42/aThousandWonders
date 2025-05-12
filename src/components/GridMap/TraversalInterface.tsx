import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import TacticalGrid from "./TacticalGrid";

const TraversalInterface = () => {
  const { state, initializeGrid } = useTravelStore();
  const { isInitialized } = useSnapshot(state);

  useEffect(() => {
    if (!isInitialized) {
      initializeGrid();
    }
  }, []);

  return (
    <div className="flex md:flex-row flex-col gap-2">
      <div className="flex flex-col space-y-2 m-10 md:m-auto">
        {/* Charting Grid */}
        {isInitialized && (
          <div className="flex flex-col space-y-2">
            <TacticalGrid />
          </div>
        )}
      </div>
    </div>
  );
};

// Grid Component

export default TraversalInterface;
