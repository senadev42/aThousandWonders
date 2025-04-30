import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import TravelTunnelGrid from "./TravelTunnelGrid";

const TravelTunnelMap = () => {
  const { state, initializeGrid } = useTravelStore();
  const { isInitialized, debugInfo } = useSnapshot(state);

  useEffect(() => {
    if (!isInitialized) {
      initializeGrid();
    }
  }, []);

  return (
    <div className="flex md:flex-row flex-col gap-2">
      <div className="flex flex-col space-y-2 m-10 md:m-auto">
        {/* Header */}
        <div className="p-2 text-gray-200 bg-gray-900">
          <h2 className="text-xl font-bold">Charting: A → B</h2>
        </div>

        {/* Charting Grid */}
        {isInitialized && (
          <div className="flex flex-col space-y-2">
            <TravelTunnelGrid />
          </div>
        )}
      </div>

      {/* Debug Menu */}
      <div className="flex flex-col space-y-2  bg-gray-900 p-4 rounded min-w-[20rem] text-black">
        <button
          className="mt-4 p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
          onClick={initializeGrid}
        >
          Reset Grid
        </button>

        {/* Debug Information */}
        <div className="text-gray-200 w-full">
          {/* Cell being hovered over */}
          <p>Player position: {debugInfo.playerPosition}</p>
          <p>Seed: {debugInfo.seed}</p>
        </div>
      </div>
    </div>
  );
};

// Grid Component

export default TravelTunnelMap;
