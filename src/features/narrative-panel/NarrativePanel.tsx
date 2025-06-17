import { CircleX, Search } from "lucide-react";
import { useNarrativeStore } from "./store";
import { useSnapshot } from "valtio";
import { NarrativeEventTypeEnum } from "./store/state";

const NarrativePanel = () => {
  const { state } = useNarrativeStore();

  const { npEvents } = useSnapshot(state);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col justify-end scrollbar-custom relative">
      <div className="absolute top-2 right-2">
        {/* clear events */}
        <button
          onClick={() => {
            const { clearEvents } = useNarrativeStore();
            clearEvents();
          }}
          className="bg-slate-800 hover:bg-slate-700  rounded-full transition-colors"
        >
          <CircleX className="text-slate-400 h-5" />
        </button>
      </div>

      {npEvents.length === 0 && (
        <div className="flex-1 flex flex-col gap-2 items-center justify-center text-gray-500">
          <p className="text-sm">No narrative events to display.</p>
          <p className="text-xs">Go do something!</p>
        </div>
      )}

      <div className="flex flex-col p-3 text-gray-200 space-y-2">
        {npEvents.map((event) => {
          if (event.type === NarrativeEventTypeEnum.SCENE_DRESSING) {
            return (
              <p className="text-sm" key={event.id}>
                {event.payload}
              </p>
            );
          }
          // You can handle other event types here if needed
          return null;
        })}
      </div>
    </div>
  );
};

// Style guide for the narrative panel
const roughExample = () => {
  return (
    <>
      <p className="text-sm">
        You wander through the dimly lit mess hall, weaving between long wooden
        tables and benches. The space is empty and quiet, save for the echo of
        your footsteps on the stone floor.
      </p>

      <p className="text-sm">
        You spot shards of broken glass scattered by the wall. A light red pool
        of liquid spreads slowly from the shattered bottle, looking at first
        glance like spilled wine.
      </p>

      <div className="text-xs text-gray-400 italic flex items-center gap-x-1">
        {/* investigation icon */}
        <Search size={12} />
        <span>Investigation Check: </span>
        <span className="text-green-400">Success</span>
      </div>

      <div className="border-l-2 border-purple-500 pl-2">
        <p className="text-sm italic text-purple-300">
          The bottle's label is partially intact - you can make out "Celesrose
          Wine". Somewhat of a rare vintage, wierd to find it here in pieces in
          the mess hall.
        </p>
      </div>
    </>
  );
};

export default NarrativePanel;
