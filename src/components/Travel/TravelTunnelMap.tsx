import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { TileType } from "./store/state";
import TravelTunnelGrid from "./TravelTunnelGrid";

const TravelTunnelMap = () => {
  const store = useTravelStore();
  const { grid, depth, revealed, playerPos, isInitialized } = useSnapshot(
    store.state
  );
  const { initializeGrid, movePlayer } = store;

  useEffect(() => {
    if (!isInitialized) {
      initializeGrid();
    }
  }, []);

  return (
    <div className="flex">
      <div className="flex flex-col space-y-2">
        {/* Header */}
        <div className="p-2 text-gray-200 bg-gray-900">
          <h2 className="text-xl font-bold">Charting: A → B</h2>
        </div>

        {/* Charting Grid */}
        {grid && grid.length > 0 && (
          <div className="flex flex-col space-y-2">
            <TravelTunnelGrid
              grid={grid as TileType[][]}
              depth={depth}
              revealed={revealed}
              playerPos={playerPos}
              movePlayer={movePlayer}
            />
          </div>
        )}

        {/* Legend and eventually actions */}
        <div className="text-gray-200 p-2 bg-gray-900 ">
          <p>🐍 Le Serpent</p>
        </div>
      </div>

      {/* Debug Menu */}
      <div className="flex flex-col space-y-2 ml-4 bg-gray-900 p-4 rounded w-[20rem]">
        <button
          className="mt-4 p-2 bg-gray-800 text-gray-200 rounded"
          onClick={initializeGrid}
        >
          Reset
        </button>

        <div>
          {/* About the grid */}
          <h3 className="text-lg font-bold">Debug Information</h3>
          <p>
            Grid Size: {grid.length} x {grid[0]?.length}
          </p>
          <p>Player Position: {`(${playerPos.x}, ${playerPos.y})`}</p>
          <p>Revealed Tiles: {Object.keys(revealed).length}</p>
        </div>
      </div>
    </div>
  );
};

// Grid Component

export default TravelTunnelMap;
