import { useSnapshot } from "valtio";
import StrategicMap from "@/components/strategic-map/StrategicGrid";
import TraversalInterface from "@/components/grid-map/TraversalInterface";
import { gameState, Views } from "@/store.ts";
import RegionMap from "./components/region-map/RegionMap";

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
      className={`p-2 rounded-md ${
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
    <header className="fixed top-0 left-0 right-0 bg-slate-800 text-white p-4 py-2 flex items-center justify-between">
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-mono bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-start">
          a thousand wonders <span className="text-xs">pre-pre-pre alpha </span>
        </h1>
      </div>

      {/* View Options */}
      <div className="flex gap-2">
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
    <div className="min-h-screen w-full bg-slate-700">
      <Header />
      <main className="pt-15 flex items-center justify-center min-h-screen">
        {currentView === Views.STRATEGIC && <StrategicMap />}
        {currentView === Views.LOCAL && <TraversalInterface />}
        {currentView === Views.REGION && <RegionMap />}
      </main>
    </div>
  );
}

export default App;
