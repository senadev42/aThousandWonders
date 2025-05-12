import { useState } from "react";
import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";

type RegenCondition = {
  emptyMap: boolean;
};

const GridDebugMenu = () => {
  const { state, initializeGrid, updateDebugSettings } = useTravelStore();
  const { debugInfo } = useSnapshot(state);

  const [regenCondition, setRegenCondition] = useState<RegenCondition>({
    emptyMap: false,
  });

  return (
    <div className="flex flex-col  bg-gray-900 p-4 rounded min-w-[15rem] text-white">
      {/* Debug Information */}
      <div className="text-gray-200 w-full">
        {/* Cell being hovered over */}
        <p>Player position: {debugInfo.playerPosition}</p>
        <p>Seed: {debugInfo.seed}</p>
      </div>

      <div className="mt-4 flex items-center ">
        <input
          type="checkbox"
          className="mr-2 size-5 "
          onChange={(e) => {
            updateDebugSettings({
              showCoords: e.target.checked,
            });
          }}
        />
        <span>Show Coords in Cells</span>
      </div>

      {/* Regen section */}
      <div className="mt-10 border-slate-400 rounded-md space-y-2">
        {/* Checkbox to generate empty map */}
        <div className="flex items-center ">
          <input
            type="checkbox"
            className="mr-2 size-5 "
            onChange={(e) => {
              setRegenCondition({
                ...regenCondition,
                emptyMap: e.target.checked,
              });
            }}
          />
          <span>Generate Empty Map</span>
        </div>

        {/* Button to re-generate grid */}
        <button
          className="p-1 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 w-full"
          onClick={() => initializeGrid(regenCondition.emptyMap)}
        >
          Re-generate Grid
        </button>
      </div>
    </div>
  );
};

export default GridDebugMenu;
