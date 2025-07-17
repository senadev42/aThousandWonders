import { Puzzle, Pyramid, Search, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { AnalysisResult, InventoryItem, ToolItem } from "./types";

import InventoryPanel from "./components/InventoryPanel";
import AnalysisMatrix from "./components/ModeAnalysisMatrix";
import ResultsPanel from "./components/ResultsPanel";
import { performAnalysisOnMatrix } from "./helpers/performAnalysis";
import { motion } from "framer-motion";

const AlchemyWorkspace: React.FC = () => {
  const [matrixSlots, setMatrixSlots] = useState<{
    item: InventoryItem | null;
    tool: ToolItem | null;
  }>({ item: null, tool: null });

  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  //drag and drop
  //TODO: replace with library because we don't want translucency on drag
  const handleDragStart = (
    e: React.DragEvent,
    item: InventoryItem | ToolItem,
    slotType: "item" | "tool"
  ) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ item, slotType }));

    if (item.type === "item")
      e.dataTransfer.setData("application/x-item-type", item.type);
    else if (item.type === "tool")
      e.dataTransfer.setData("application/x-tool-type", item.type);
  };

  const handleDrop = (e: React.DragEvent, targetSlot: "item" | "tool") => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (targetSlot === "item" && data.item.type === "item") {
      setMatrixSlots((prev) => ({ ...prev, item: data.item }));
    } else if (targetSlot === "tool" && data.item.type === "tool") {
      setMatrixSlots((prev) => ({ ...prev, tool: data.item }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clearSlot = (slot: "item" | "tool") => {
    setMatrixSlots((prev) => ({ ...prev, [slot]: null }));
  };

  const performAnalysis = () => {
    if (!matrixSlots.item || !matrixSlots.tool) return;

    const matrixToBeAnalyzed = {
      item: matrixSlots.item,
      tool: matrixSlots.tool,
    };

    const result = performAnalysisOnMatrix(matrixToBeAnalyzed);

    setAnalysisResults([result, ...analysisResults.slice(0, 4)]);
    setMatrixSlots({ item: null, tool: null });
  };

  const modes = [
    { icon: Search, label: "Analysis", active: true, color: "cyan" },
    { icon: Pyramid, label: "Extraction", active: false, color: "purple" },
    { icon: Sparkles, label: "Refinement", active: false, color: "emerald" },
    { icon: Puzzle, label: "Synthesis", active: false, color: "amber" },
  ];

  return (
    <div className="h-screen w-full overflow-hidde text-white p-4 relative overflow-hidden scrollbar-custom">
      {/* Dusk */}
      <div className="fixed inset-0 bg-gradient-to-b from-black  via-pink-900/40 via-95% to-orange-700/40" />

      {/* Static starfield */}
      <div className="fixed inset-0">
        {/* Small white stars */}
        {[...Array(400)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[0.4px] h-[0.4px] bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Cyan stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`cyan-${i}`}
            className="absolute w-[0.8px] h-[0.8px] bg-cyan-400 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 2px #22d3ee",
            }}
          />
        ))}

        {/* Red stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`red-${i}`}
            className="absolute w-[0.8px] h-[0.8px] bg-red-500 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 2px #ef4444",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Mode Headers */}
        <div className="flex justify-center gap-4 mb-6">
          {modes.map((mode) => (
            <div
              key={mode.label}
              className={`inline-flex items-center gap-3 px-4 py-1 rounded-lg border transition-all ${
                mode.active
                  ? `bg-slate-800/60 backdrop-blur-sm border-${mode.color}-500/30`
                  : "bg-slate-800/20 border-gray-600/20 opacity-50 cursor-not-allowed"
              }`}
            >
              <mode.icon
                size={24}
                className={`${
                  mode.active ? `text-${mode.color}-400` : "text-gray-400"
                }`}
              />
              <h1
                className={`text-lg font-semibold ${
                  mode.active ? `text-${mode.color}-300` : "text-gray-400"
                }`}
              >
                {mode.label}
              </h1>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4 h-96">
          <div className="col-span-3 space-y-4">
            <InventoryPanel
              onItemDragStart={handleDragStart}
              onToolDragStart={handleDragStart}
            />
          </div>

          {/* Analysis Matrix */}
          <div className="col-span-6">
            <AnalysisMatrix
              matrixSlots={matrixSlots}
              handleDrop={handleDrop}
              handleDragOver={handleDragOver}
              clearSlot={clearSlot}
              performAnalysis={performAnalysis}
            />
          </div>

          <div className="col-span-3 space-y-4">
            <ResultsPanel analysisResults={analysisResults} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlchemyWorkspace;
