import { StrategicConnection } from "@/features/strategic-map/StrategicGrid";

export const getValidConnections = (
  nodeId: string,
  connections: StrategicConnection[]
) => {
  return connections
    .filter((c) => c.from === nodeId || c.to === nodeId)
    .map((c) => (c.from === nodeId ? c.to : c.from));
};

// Get connection between two nodes
export const getConnection = (
  fromId: string,
  toId: string,
  connections: StrategicConnection[]
) => {
  return connections.find(
    (c) =>
      (c.from === fromId && c.to === toId) ||
      (c.from === toId && c.to === fromId)
  );
};
