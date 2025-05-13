import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { SceneType } from "./store/state";

const GridDebugMenu = () => {
  const { state, initializeScene, updateDebugSettings } = useTravelStore();
  const { debugInfo } = useSnapshot(state);

  return (
    <div className="flex justify-between items-start bg-gray-900 p-4 rounded text-white text-xs">
      {/* Debug Information */}
      <div className="text-gray-200  space-x-2 ">
        {/* Cell being hovered over */}
        <p>{debugInfo.playerPosition}</p>
        <p>Seed: {debugInfo.seed}</p>

        <div className="mt-2 flex items-center  ">
          <input
            type="checkbox"
            className="mr-2 size-3"
            onChange={(e) => {
              updateDebugSettings({
                showCoords: e.target.checked,
              });
            }}
          />
          <span>Show Coords in Cells</span>
        </div>
      </div>

      {/* Regen section */}
      <div className="border-slate-400 rounded-md ">
        {/* Drop down with 3 options, empty map, random map, and a scene */}
        <select
          className="bg-gray-800 text-gray-200 p-1 rounded"
          onChange={(e) => {
            const selectedScene = e.target.value as SceneType;
            initializeScene({
              sceneType: selectedScene,
            });
          }}
        >
          <option value={SceneType.EMPTY}>Empty Map</option>
          <option value={SceneType.RANDOM}>Random Map</option>
          <option value={SceneType.PREMADE}>Premade Map</option>
        </select>
      </div>
    </div>
  );
};

export default GridDebugMenu;
