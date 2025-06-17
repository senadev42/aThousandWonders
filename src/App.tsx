import { useSnapshot } from "valtio";
import StrategicMap from "@/features/strategic-map/StrategicGrid";
import TraversalInterface from "@/features/scene-ui/SceneInterface";
import RegionMap from "@/features/region-map/RegionMap";
import { gameState, Views } from "@/store.ts";

function HeaderButton({
  view,
  currentView,
  onClick,
}: {
  view: string;
  currentView: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`p-1 px-2 rounded-md ${
        currentView === view ? "bg-slate-600" : "hover:bg-slate-700"
      }`}
      onClick={onClick}
    >
      {view.charAt(0).toUpperCase() + view.slice(1).toLowerCase()} View
    </button>
  );
}

function Header() {
  const snap = useSnapshot(gameState);

  const viewOptions = Object.values(Views);

  return (
    <header className="fixed top-0 left-0 right-0 text-white p-4 py-1 flex items-center justify-between">
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-mono bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-start">
          a thousand wonders <span className="text-xs">pre-pre-pre alpha </span>
        </h1>
      </div>

      {/* View Options */}
      <div className="flex gap-1 text-sm items-center">
        {viewOptions.map((view) => (
          <HeaderButton
            key={view}
            view={view}
            currentView={snap.currentView}
            onClick={() => gameState.setView(view)}
          />
        ))}
      </div>
    </header>
  );
}

function App() {
  const { currentView } = useSnapshot(gameState);

  return (
    <div className="min-h-screen bg-slate-700 flex flex-col justify-center">
      <Header />
      <main className="flex items-center justify-center">
        {currentView === Views.STRATEGIC && <StrategicMap />}
        {currentView === Views.LOCAL && <TraversalInterface />}
        {currentView === Views.REGION && <RegionMap />}
      </main>
    </div>
  );
}

export default App;
