import { Eye } from "lucide-react";
import { AnalysisResult } from "../types";
import React from "react";

const ResultsPanel: React.FC<{ analysisResults: AnalysisResult[] }> = ({
  analysisResults,
}) => {
  return (
    <div className="bg-slate-800/60 rounded-lg p-4 border-2 border-black flex-1">
      <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
        <Eye size={16} />
        Analysis Results
      </h3>
      <div className="space-y-3 h-[32rem] overflow-y-auto">
        {analysisResults.map((result) => (
          <div
            key={result.id}
            className="bg-slate-700/60 p-3 rounded border border-purple-400/30"
          >
            <div className="text-sm font-medium text-purple-200 mb-1">
              {result.itemName}
            </div>
            <div className="text-xs text-purple-300/70 mb-2">
              Tool: {result.toolUsed}
            </div>
            <div className="space-y-1">
              {result.findings.map((finding, idx) => (
                <div key={idx} className="text-xs text-purple-200">
                  • {finding}
                </div>
              ))}
            </div>
          </div>
        ))}
        {analysisResults.length === 0 && (
          <div className="text-xs text-purple-400/50 text-center py-8">
            ✧ Analysis results will appear here ✧
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
