import {
  StrategicConnection,
  StrategicNode,
} from "../StrategicMap/StrategicGrid";

export const nodes: StrategicNode[] = [
  {
    id: "sunspire",
    x: 50,
    y: 20,
    name: "Sunspire Citadel",
    type: "settlement",
    description:
      "A fortified city-state, its towers gleaming with solar-forged steel",
    danger: 10,
  },
  {
    id: "veiled",
    x: 20,
    y: 40,
    name: "Veiled Market",
    type: "market",
    description:
      "A secretive bazaar where rare artifacts change hands in shadows",
    danger: 25,
  },
  {
    id: "necropolis",
    x: 65,
    y: 35,
    name: "Brass Necropolis",
    type: "ruins",
    description:
      "Ancient burial grounds of machine-priests, still humming with power",
    danger: 80,
  },
  {
    id: "observatory",
    x: 85,
    y: 65,
    name: "Blind Observatory",
    type: "ruins",
    description:
      "Pre-calamity research facility, its instruments still tracking unknown stars",
    danger: 65,
  },
  {
    id: "oasis",
    x: 40,
    y: 60,
    name: "Twilight Oasis",
    type: "oasis",
    description: "Natural springs where the veil between day and night is thin",
    danger: 30,
  },
  {
    id: "mines",
    x: 15,
    y: 70,
    name: "Stellshade Mines",
    type: "ruins",
    description: "Sprawling crystal mines, rich in raw Stellshade deposits",
    danger: 55,
  },
  {
    id: "monastery",
    x: 60,
    y: 80,
    name: "Silent Monastery",
    type: "settlement",
    description: "Ancient order of sun-shields maintaining forbidden libraries",
    danger: 40,
  },
];

export const connections: StrategicConnection[] = [
  // Sunspire Hub
  {
    from: "sunspire",
    to: "oasis",
    segments: 5,
    distance: 45,
    danger: 35,
    timeEstimate: 6,
  },

  // Necropolis Collegamenti
  {
    from: "necropolis",
    to: "observatory",
    segments: 3,
    distance: 30,
    danger: 70,
    timeEstimate: 4,
  },
  {
    from: "necropolis",
    to: "monastery",
    segments: 6,
    distance: 65,
    danger: 55,
    timeEstimate: 8,
  },

  // Lower Circuit
  {
    from: "mines",
    to: "oasis",
    segments: 4,
    distance: 40,
    danger: 45,
    timeEstimate: 5,
  },
  {
    from: "oasis",
    to: "monastery",
    segments: 3,
    distance: 35,
    danger: 40,
    timeEstimate: 4,
  },
  {
    from: "monastery",
    to: "observatory",
    segments: 4,
    distance: 45,
    danger: 50,
    timeEstimate: 6,
  },

  // Cross Routes
  {
    from: "veiled",
    to: "mines",
    segments: 4,
    distance: 40,
    danger: 35,
    timeEstimate: 5,
  },
  {
    from: "veiled",
    to: "oasis",
    segments: 3,
    distance: 30,
    danger: 30,
    timeEstimate: 4,
  },
];
