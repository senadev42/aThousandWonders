import { Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { InventoryItem, ToolItem } from "../types";

const AnalysisMatrix: React.FC<{
  matrixSlots: { item: InventoryItem | null; tool: ToolItem | null };
  handleDrop: (e: React.DragEvent, targetSlot: "item" | "tool") => void;
  handleDragOver: (e: React.DragEvent) => void;
  clearSlot: (slot: "item" | "tool") => void;
  performAnalysis: () => void;
}> = ({
  matrixSlots,
  handleDrop,
  handleDragOver,
  clearSlot,
  performAnalysis,
}) => {
  const [dragOverSlot, setDragOverSlot] = useState<"item" | "tool" | null>(
    null
  );

  const handleVisualDragOver = (
    e: React.DragEvent,
    targetSlot: "item" | "tool"
  ) => {
    e.preventDefault();

    const types = Array.from(e.dataTransfer.types);
    const isItem = types.includes("application/x-item-type");
    const isTool = types.includes("application/x-tool-type");

    if (isItem && targetSlot === "item") {
      setDragOverSlot("item");
    } else if (isTool && targetSlot === "tool") {
      setDragOverSlot("tool");
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border-2 border-dashed border-cyan-400/50 rounded-lg p-6 h-full relative">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-cyan-300 flex items-center justify-center gap-2">
          <Search size={20} />
          Analysis Matrix
        </h3>
        <p className="text-sm text-cyan-400/70">
          Place item and tool to begin analysis
        </p>
      </div>

      <div className="space-y-4 flex flex-col items-center justify-center">
        {/* Item Slot */}
        <div
          onDrop={(e) => {
            handleDrop(e, "item");
            setDragOverSlot(null);
          }}
          onDragOver={(e) => {
            handleDragOver(e);
            handleVisualDragOver(e, "item");
          }}
          onDragLeave={() => setDragOverSlot(null)}
          className={`w-2/3 h-[5rem] flex items-center justify-center bg-slate-700/40 border-2 border-dashed rounded-lg p-1 relative transition-all duration-300
            ${
              dragOverSlot === "item"
                ? " border-blue-400/80"
                : "border-blue-400/50"
            }`}
        >
          {matrixSlots.item ? (
            <div className="bg-slate-700/80 p-2 rounded relative w-full">
              <button
                onClick={() => clearSlot("item")}
                className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-xs p-1 m-1 bg-red-100/10 rounded-full"
              >
                <Trash2 size={16} />
              </button>
              <div className="text-sm text-cyan-200 pr-4 font-semibold">
                {matrixSlots.item.name}
              </div>

              {matrixSlots.item.grade && (
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    Grade: {matrixSlots.item.grade}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`text-xs text-blue-400/50 text-center py-2 ${
                dragOverSlot === "item" ? "text-blue-300" : ""
              }`}
            >
              Drop item here
            </div>
          )}
        </div>

        {/* Tool Slot */}
        <div
          onDrop={(e) => {
            handleDrop(e, "tool");
            setDragOverSlot(null);
          }}
          onDragOver={(e) => {
            handleDragOver(e);
            handleVisualDragOver(e, "tool");
          }}
          onDragLeave={() => setDragOverSlot(null)}
          className={`w-2/3 h-[5rem] flex items-center justify-center bg-slate-700/40 border-2 border-dashed border-emerald-400/50 rounded-lg p-1 relative transition-all duration-300
            ${
              dragOverSlot === "tool"
                ? "bg-slate-600/60 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                : ""
            }`}
        >
          {matrixSlots.tool ? (
            <div className="bg-slate-700/80 p-2 rounded relative w-full">
              <button
                onClick={() => clearSlot("tool")}
                className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-xs p-1 m-1 bg-red-100/10 rounded-full"
              >
                <Trash2 size={16} />
              </button>
              <div className="text-sm text-cyan-200 pr-4 font-semibold">
                {matrixSlots.tool.name}
              </div>

              {matrixSlots.tool.condition && (
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    Grade: {matrixSlots.tool.condition}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`text-xs text-emerald-400/50 text-center py-2 ${
                dragOverSlot === "tool" ? "text-emerald-300" : ""
              }`}
            >
              Drop tool here
            </div>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      {matrixSlots.item && matrixSlots.tool && (
        <div className="absolute bottom-6 right-6">
          <button
            onClick={performAnalysis}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-4 py-2 rounded-lg transition-all shadow-lg font-semibold text-sm"
          >
            🔍 Analyze
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisMatrix;
