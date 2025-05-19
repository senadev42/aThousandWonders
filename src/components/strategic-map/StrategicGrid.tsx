import { Circle, Crosshair, Timer } from "lucide-react";
import React, { useState, useMemo } from "react";
import { getPathCoordinates } from "@/components/strategic-map/helpers/generateStrategicPaths";
import {
  connections,
  nodes,
} from "@/components/strategic-map/mockStrategicData";

type NodeType = "settlement" | "ruins" | "oasis" | "market";

export interface StrategicNode {
  id: string;
  x: number;
  y: number;
  name: string;
  type: NodeType;
  description: string;
  danger: number;
}

export interface StrategicConnection {
  from: string;
  to: string;
  segments: number;
  distance: number;
  danger: number;
  timeEstimate: number;
}

const StrategicMap = () => {
  const [pathNodes, setPathNodes] = useState<string[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] =
    useState<StrategicConnection | null>(null);

  // Get all valid connections for a node
  const getValidConnections = (nodeId: string) => {
    return connections
      .filter((c) => c.from === nodeId || c.to === nodeId)
      .map((c) => (c.from === nodeId ? c.to : c.from));
  };

  const handleNodeClick = (nodeId: string) => {
    setPathNodes((prev) => {
      // If empty, start new path
      if (prev.length === 0) return [nodeId];

      const lastNode = prev[prev.length - 1];
      // Check if clicked node is connected to last node in path
      const validNextNodes = getValidConnections(lastNode);

      if (validNextNodes.includes(nodeId)) {
        // Add to path if valid connection exists
        return [...prev, nodeId];
      }

      // Start new path if invalid
      return [nodeId];
    });
  };

  // Get connection between two nodes
  const getConnection = (fromId: string, toId: string) => {
    return connections.find(
      (c) =>
        (c.from === fromId && c.to === toId) ||
        (c.from === toId && c.to === fromId)
    );
  };

  // Calculate total path statistics
  const pathStats = useMemo(() => {
    if (pathNodes.length < 2) return null;

    let totalDistance = 0;
    let totalTime = 0;
    let maxDanger = 0;

    // Calculate stats for each segment
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const connection = getConnection(pathNodes[i], pathNodes[i + 1]);
      if (connection) {
        totalDistance += connection.distance;
        totalTime += connection.timeEstimate;
        maxDanger = Math.max(maxDanger, connection.danger);
      }
    }

    return { totalDistance, totalTime, maxDanger };
  }, [pathNodes]);

  // Generate visual paths
  const connectionPaths = useMemo(() => {
    return connections.map((connection) => {
      const fromNode = nodes.find((n) => n.id === connection.from);
      const toNode = nodes.find((n) => n.id === connection.to);
      if (!fromNode || !toNode) return null;

      const { points, distance } = getPathCoordinates(fromNode, toNode, 7);

      //find the connection with the fromNode.name and toNode.name and edit the distance
      const connectionToEdit = connections.find(
        (c) =>
          (c.from === fromNode.id && c.to === toNode.id) ||
          (c.from === toNode.id && c.to === fromNode.id)
      );

      if (connectionToEdit) {
        connectionToEdit.distance = Math.round(distance);
        connectionToEdit.timeEstimate = Math.round(distance / 10);
      }

      return {
        connection,
        points,
      };
    });
  }, []);

  const isConnectionInPath = (connection: StrategicConnection) => {
    for (let i = 0; i < pathNodes.length - 1; i++) {
      if (
        (connection.from === pathNodes[i] &&
          connection.to === pathNodes[i + 1]) ||
        (connection.to === pathNodes[i] && connection.from === pathNodes[i + 1])
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-4 w-[40rem]">
      {/* Map Area */}
      <div className="relative w-full h-96 bg-gray-900 rounded-lg p-4">
        {/* Connections */}
        {connectionPaths.map((pathData) => {
          if (!pathData) return null;
          const { connection, points } = pathData;

          const isSelected = isConnectionInPath(connection);
          const isHovered = hoveredConnection === connection;

          return (
            <React.Fragment key={`${connection.from}-${connection.to}`}>
              {points.map((point, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded transition-colors ${
                    isSelected
                      ? "bg-amber-500"
                      : isHovered
                      ? "bg-blue-500"
                      : "bg-gray-600"
                  }`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredConnection(connection)}
                  onMouseLeave={() => setHoveredConnection(null)}
                />
              ))}
            </React.Fragment>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute cursor-pointer transition-all
              ${pathNodes.includes(node.id) ? "scale-110" : "hover:scale-105"}
            `}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => handleNodeClick(node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${
                pathNodes.includes(node.id)
                  ? "bg-amber-500"
                  : hoveredNode === node.id
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }
            `}
            >
              <Circle className="w-5 h-5 text-gray-300" />
            </div>
            <div className="absolute top-full mt-2 text-center w-32 -ml-12">
              <div className="text-sm font-medium text-gray-300">
                {node.name}
              </div>
              {hoveredNode === node.id && (
                <div className="text-xs text-gray-400 mt-1 bg-slate-950 rounded-md p-1">
                  {node.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Path Summary */}
      <div className="bg-gray-900 rounded-lg p-4 min-h-[6rem] flex flex-col items-center justify-center gap-2">
        {pathNodes.length === 0 && (
          <div className="text-gray-500 text-center text-2xl font-medium">
            Select starting point
          </div>
        )}
        {pathNodes.length === 1 && (
          <div className="text-gray-500 text-center text-2xl font-medium">
            Select next destination
          </div>
        )}
        {pathNodes.length >= 2 && pathStats && (
          <div className="flex flex-col gap-2 self-start">
            <div className="text-gray-300 text-lg font-medium">
              {pathNodes
                .map((id) => nodes.find((n) => n.id === id)?.name)
                .join(" → ")}
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                <span>{pathStats.totalDistance} leagues</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span>{pathStats.totalTime} hours</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        className="px-4 py-2 rounded transition-colors 
          disabled:bg-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed
          enabled:bg-blue-600 enabled:text-white enabled:hover:bg-blue-700"
        onClick={() => setPathNodes([])}
        disabled={pathNodes.length === 0}
      >
        Clear Path
      </button>
    </div>
  );
};

export default StrategicMap;
