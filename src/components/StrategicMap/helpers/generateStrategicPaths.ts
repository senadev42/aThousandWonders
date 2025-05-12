interface Point {
  x: number;
  y: number;
}

export const getPathCoordinates = (
  fromNode: Point,
  toNode: Point,
  minSegmentLength = 50
) => {
  // Calculate distance between nodes
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Calculate number of segments based on distance
  // Round up to ensure segments aren't too long
  const segments = Math.ceil(distance / minSegmentLength);

  // Generate points
  const points: Point[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    points.push({
      x: fromNode.x + dx * t,
      y: fromNode.y + dy * t,
    });
  }

  return { points, distance };
};

// Or for more interesting paths, add some controlled randomness:
export const getWavyPathCoordinates = (
  fromNode: Point,
  toNode: Point,
  minSegmentLength = 50,
  waviness = 0.2, // 0 = straight line, higher = more wavy
  waves = 3
) => {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const segments = Math.ceil(distance / minSegmentLength);

  // Calculate perpendicular vector for waves
  const perpX = -dy / distance;
  const perpY = dx / distance;

  const points: Point[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Sine wave deviation
    const wave = Math.sin(t * Math.PI * waves) * waviness * distance;

    points.push({
      x: fromNode.x + dx * t + perpX * wave,
      y: fromNode.y + dy * t + perpY * wave,
    });
  }

  return points;
};

// Or for underground tunnels, maybe more organic curves:
export const getBezierPathCoordinates = (
  fromNode: Point,
  toNode: Point,
  minSegmentLength = 50,
  controlPointOffset = 0.5 // Higher = more curved
) => {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const segments = Math.ceil(distance / minSegmentLength);

  // Generate control points for bezier curve
  const midX = (fromNode.x + toNode.x) / 2;
  const midY = (fromNode.y + toNode.y) / 2;

  // Control points perpendicular to direct path
  const control1 = {
    x: midX - dy * controlPointOffset,
    y: midY + dx * controlPointOffset,
  };
  const control2 = {
    x: midX + dy * controlPointOffset,
    y: midY - dx * controlPointOffset,
  };

  const points: Point[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Cubic bezier formula
    points.push({
      x:
        Math.pow(1 - t, 3) * fromNode.x +
        3 * Math.pow(1 - t, 2) * t * control1.x +
        3 * (1 - t) * Math.pow(t, 2) * control2.x +
        Math.pow(t, 3) * toNode.x,
      y:
        Math.pow(1 - t, 3) * fromNode.y +
        3 * Math.pow(1 - t, 2) * t * control1.y +
        3 * (1 - t) * Math.pow(t, 2) * control2.y +
        Math.pow(t, 3) * toNode.y,
    });
  }

  return points;
};
