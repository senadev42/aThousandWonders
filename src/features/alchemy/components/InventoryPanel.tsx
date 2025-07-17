import React, { useState } from "react";
import {
  Info,
  Package,
  Gem,
  Zap,
  Droplets,
  Coins,
  X,
  Beaker,
  Anchor,
  Shuffle,
  Grid,
} from "lucide-react";
import { mockInventory } from "../mockInventory";
import { mockTools } from "../mockTools";
import { AlchemicalCategory, InventoryItem, ToolItem } from "../types";

const InventoryPanel: React.FC<{
  onItemDragStart: (
    e: React.DragEvent,
    item: InventoryItem,
    slotType: "item"
  ) => void;
  onToolDragStart: (
    e: React.DragEvent,
    tool: ToolItem,
    slotType: "tool"
  ) => void;
}> = ({ onItemDragStart, onToolDragStart }) => {
  const [selectedFilter, setSelectedFilter] = useState<
    AlchemicalCategory | "all"
  >("all");
  const [selectedInfo, setSelectedInfo] = useState<
    InventoryItem | ToolItem | null
  >(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "tools">(
    "inventory"
  );

  const filters = [
    { id: "all", name: "All", icon: Grid },
    { id: "crystalline", name: "Crystalline", icon: Gem },
    { id: "volatile", name: "Volatile", icon: Zap },
    { id: "binding", name: "Binding", icon: Anchor },
    { id: "catalytic", name: "Catalytic", icon: Shuffle },
  ];

  const getFilteredInventory = () => {
    if (selectedFilter === "all") return mockInventory;
    return mockInventory.filter(
      (item) =>
        item.alchemicalProperties.primaryCategory === selectedFilter ||
        item.alchemicalProperties.secondaryCategory === selectedFilter
    );
  };

  const InfoPanel: React.FC<{ item: InventoryItem | ToolItem }> = ({
    item,
  }) => (
    <div className="bg-slate-800/40 rounded-sm p-3 borderborder-cyan-500/30 max-w-md">
      {/* Top Header part */}
      <div className="flex justify-between items-center mb-2 gap-2">
        <h3 className="text-base font-bold text-cyan-300 flex-1">
          {item.name}
        </h3>
        <div className="flex items-center gap-1.5 text-amber-300">
          <Coins size={12} className="opacity-90" />
          <span className="font-medium text-sm">{item.marketPrice}g</span>
        </div>
        <button
          onClick={() => setSelectedInfo(null)}
          className="text-cyan-400 hover:text-cyan-300 transition-colors p-1 rounded-sm bg-cyan-900/50 hover:bg-cyan-800 backdrop-blur-sm"
        >
          <X size={12} />
        </button>
      </div>

      <hr className="border-cyan-500/30 my-2" />

      <p className="text-cyan-200/90 leading-relaxed mb-4 text-xs">
        {item.description}
      </p>

      <div className="bg-slate-900/50 rounded-md p-2 space-y-2">
        {"alchemicalProperties" in item ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-cyan-400/70 text-xs mb-1">
                Primary Category
              </span>
              <span className="text-cyan-100">
                {item.alchemicalProperties.primaryCategory}
              </span>
            </div>
            {item.alchemicalProperties.resonance && (
              <div className="flex flex-col">
                <span className="text-cyan-400/70 text-xs mb-1">
                  Resonance Type
                </span>
                <span className="text-cyan-100">
                  {item.alchemicalProperties.resonance.type}
                </span>
              </div>
            )}
            {item.grade && (
              <div className="flex flex-col">
                <span className="text-cyan-400/70 text-xs mb-1">Grade</span>
                <span className="text-cyan-100">{item.grade}</span>
              </div>
            )}
            {item.riskLevel && (
              <div className="flex flex-col">
                <span className="text-cyan-400/70 text-xs mb-1">
                  Risk Level
                </span>
                <span className="text-cyan-100">{item.riskLevel}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-cyan-400/70 text-xs mb-1">Function</span>
              <span className="text-cyan-100">{item.function}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-cyan-400/70 text-xs mb-1">Precision</span>
              <span className="text-cyan-100">{item.precision}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const InventoryCard: React.FC<{ item: InventoryItem }> = ({ item }) => (
    <div
      draggable
      onDragStart={(e) => onItemDragStart(e, item, "item")}
      className="bg-slate-800 p-2 rounded-md cursor-grab hover:bg-slate-700 transition-all border border-cyan-500
        hover:border-cyan-400/50 shadow-lg active:cursor-grabbing active:scale-95 active:border-cyan-400
        active:bg-slate-700 select-none"
    >
      <div className="flex justify-between items-center mb-2 gap-2">
        <h4 className="text-sm font-medium text-cyan-100 flex-1 pr-2">
          {item.name}
        </h4>

        <div className="flex items-center gap-1 text-xs text-amber-300">
          <Coins size={12} />
          {item.marketPrice}g
        </div>

        <button
          onClick={() => setSelectedInfo(item)}
          className="text-cyan-500 hover:text-cyan-200 transition-colors p-1 bg-cyan-100/10 rounded-full"
        >
          <Info size={14} />
        </button>
      </div>

      <div className="flex gap-2">
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
          {item.alchemicalProperties.primaryCategory}
        </span>
        {item.alchemicalProperties.resonance && (
          <div className="flex gap-1">
            <span className="text-xs bg-blue-500/20 text-blue-300 px-1 py-1 rounded flex items-center gap-1">
              <Zap size={10} /> {item.alchemicalProperties.resonance.strength}
            </span>
            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-1 py-1 rounded flex items-center gap-1">
              <Droplets size={10} />{" "}
              {item.alchemicalProperties.resonance.purity}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const ToolCard: React.FC<{ tool: ToolItem }> = ({ tool }) => (
    <div
      draggable
      onDragStart={(e) => onToolDragStart(e, tool, "tool")}
      className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg cursor-grab hover:bg-slate-700/80 transition-all border border-emerald-500/30 hover:border-emerald-400/50 shadow-lg relative"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-emerald-100 flex-1 pr-2">
          {tool.name}
        </h4>
        <button
          onClick={() => setSelectedInfo(tool)}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Info size={14} />
        </button>
      </div>

      <p className="text-xs text-emerald-300/70 mb-2">{tool.function}</p>
      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">
        {tool.precision}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Rest of the component remains the same */}
      <div className="bg-slate-800/40 rounded-sm p-3 border border-cyan-500/30 flex-1">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-2 rounded text-sm ${
              activeTab === "inventory"
                ? "bg-cyan-500/30 text-cyan-200"
                : "text-cyan-400 hover:bg-slate-700"
            }`}
          >
            <Package size={16} />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`flex items-center gap-2 p-2 rounded ${
              activeTab === "tools"
                ? "bg-emerald-500/30 text-emerald-200"
                : "text-emerald-400 hover:bg-slate-700"
            }`}
          >
            <Beaker size={16} />
            Tools
          </button>
        </div>

        <div className="h-62 overflow-y-auto">
          {activeTab === "inventory" && (
            <>
              <div className="flex gap-1 mb-4 flex-wrap">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() =>
                        setSelectedFilter(
                          filter.id as AlchemicalCategory | "all"
                        )
                      }
                      className={`flex items-center gap-1 px-1 py-1 rounded text-[10px] transition-all ${
                        selectedFilter === filter.id
                          ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/50"
                          : "bg-slate-700/60 text-cyan-400 hover:bg-slate-600/60"
                      }`}
                    >
                      <Icon size={12} />
                      {filter.name}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 pr-2">
                {getFilteredInventory().map((item, idx) => (
                  <InventoryCard key={idx} item={item} />
                ))}
              </div>
            </>
          )}

          {activeTab === "tools" && (
            <div className="space-y-3">
              {mockTools.map((tool, idx) => (
                <ToolCard key={idx} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedInfo ? (
        <InfoPanel item={selectedInfo} />
      ) : (
        <div className="h-60 flex items-center justify-center bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30 text-cyan-300 text-center">
          Select something to know more about it
        </div>
      )}
    </div>
  );
};

export default InventoryPanel;
