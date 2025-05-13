import { useSnapshot } from "valtio";
import { useTravelStore } from "./store";
import { Scene, SceneParams, SceneType } from "./store/state";
import { useState } from "react";

const GridDebugMenu = () => {
  const { state, initializeScene, updateDebugSettings } = useTravelStore();
  const { debugInfo } = useSnapshot(state);

  const [seed, setSeed] = useState<number>(debugInfo.seed);

  return (
    <div className="flex justify-between items-start bg-gray-900 p-4 rounded text-white text-xs h-[6rem]">
      {/* Debug Information */}
      <div className="text-gray-200  space-x-2 ">
        {/* Cell being hovered over */}
        <p>{debugInfo.playerPosition}</p>

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
      <div className="text-gray-200 w-[13rem] ">
        <div className="border-slate-400 rounded-md">
          {/* Drop down with 3 options, empty map, random map, and a scene */}
          <SceneSelector
            onSceneSelect={initializeScene}
            stateSeed={debugInfo.seed}
          />
        </div>
      </div>
    </div>
  );
};

export default GridDebugMenu;

const SceneSelector = ({
  onSceneSelect,
  stateSeed,
}: {
  onSceneSelect: (params: SceneParams) => void;
  stateSeed: number;
}) => {
  const [selectedType, setSelectedType] = useState<SceneType>(SceneType.EMPTY);
  const [seed, setSeed] = useState<string>("");
  const [sceneId, setSceneId] = useState<string>("");

  const handleSceneSelect = () => {
    switch (selectedType) {
      case SceneType.RANDOM:
        onSceneSelect({
          sceneType: SceneType.RANDOM,
          seed: seed ? parseInt(seed) : Math.floor(Math.random() * 10000),
        });
        break;
      case SceneType.EMPTY:
        onSceneSelect({
          sceneType: SceneType.EMPTY,
        });
        break;
      case SceneType.PREMADE:
        onSceneSelect({
          sceneType: SceneType.PREMADE,
          sceneId: sceneId,
        });
        break;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          className="bg-gray-800 text-gray-200 p-1 rounded w-2/3"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as SceneType)}
        >
          <option value={SceneType.EMPTY}>Empty Map</option>
          <option value={SceneType.RANDOM}>Random Map</option>
          <option value={SceneType.PREMADE}>Premade Map</option>
        </select>
        <button
          className="bg-slate-500 text-white text-xs p-1 rounded disabled:cursor-not-allowed flex-1"
          onClick={handleSceneSelect}
          disabled={selectedType === SceneType.PREMADE && !sceneId}
        >
          Generate
        </button>
      </div>

      {selectedType === SceneType.RANDOM && (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={stateSeed.toString()}
            className="bg-gray-800 text-gray-200 p-1 rounded flex-1"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </div>
      )}

      {selectedType === SceneType.PREMADE && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Scene ID"
            className="bg-gray-800 text-gray-200 p-1 text-xs rounded flex-1"
            value={sceneId}
            onChange={(e) => setSceneId(e.target.value)}
            required
          />
        </div>
      )}
    </div>
  );
};
