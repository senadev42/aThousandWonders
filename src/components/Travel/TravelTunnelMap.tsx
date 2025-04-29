import { useEffect } from "react";
import { proxy, useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import TravelTunnelGrid from "./TravelTunnelGrid";

const TravelTunnelMap = () => {
  const { state: travelState, initializeGrid } = useTravelStore();
  const { isInitialized, debugInfo } = useSnapshot(travelState);

  useEffect(() => {
    if (!isInitialized) {
      initializeGrid();
    }
  }, []);

  return (
    <div className="flex lg:flex-row flex-col gap-2">
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

        {/* Legend and eventually actions */}
        <div className="text-gray-200 p-2 bg-gray-900 ">
          <p>🐍 Le Serpent</p>
        </div>
      </div>

      {/* Debug Menu */}
      <div className="flex flex-col space-y-2  bg-gray-900 p-4 rounded lg:w-[20rem] text-black">
        <button
          className="mt-4 p-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
          onClick={initializeGrid}
        >
          Reset Grid
        </button>

        {/* Debug Information */}
        <div className="text-gray-200">
          {/* Cell being hovered over */}
          <p>Hovering on: {debugInfo.hoveredCell}</p>
          <p>Player position: {debugInfo.playerPosition}</p>
        </div>
      </div>
    </div>
  );
};

// Grid Component

export default TravelTunnelMap;
