import { BaseCell, BaseTiles } from "@/features/grid-map/store/state";

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

function createSeededRandom(seed: number) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const generateRoomDungeon = (
  width: number,
  height: number,
  seed: number,
  {
    minRoomSize = 2,
    maxRoomSize = 6,
    desiredRoomCount = 20, // Target number of rooms
    maxAttempts = 1000, // Maximum attempts to place rooms
    spacing = 1, // Minimum space between rooms (0 for adjacent rooms)
  } = {}
): BaseCell[][] => {
  const seedRandom = createSeededRandom(seed);

  let dungeon: BaseCell[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      type: BaseTiles.WALL,
      revealed: true,
    }))
  );

  const rooms: Room[] = [];
  let attempts = 0;

  // Keep trying to place rooms until we hit our target or max attempts
  while (rooms.length < desiredRoomCount && attempts < maxAttempts) {
    attempts++;

    // Adjust room size based on remaining space
    const roomWidth =
      Math.floor(seedRandom() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
    const roomHeight =
      Math.floor(seedRandom() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;

    // Try to place room in a random position
    const roomX = Math.floor(seedRandom() * (width - roomWidth - 2)) + 1;
    const roomY = Math.floor(seedRandom() * (height - roomHeight - 2)) + 1;

    const newRoom = {
      x: roomX,
      y: roomY,
      width: roomWidth,
      height: roomHeight,
    };

    // Check if room overlaps with existing rooms (including spacing)
    let overlaps = false;
    for (const room of rooms) {
      if (
        newRoom.x <= room.x + room.width + spacing &&
        newRoom.x + newRoom.width + spacing >= room.x &&
        newRoom.y <= room.y + room.height + spacing &&
        newRoom.y + newRoom.height + spacing >= room.y
      ) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      rooms.push(newRoom);
      // Carve out the room
      for (let y = roomY; y < roomY + roomHeight; y++) {
        for (let x = roomX; x < roomX + roomWidth; x++) {
          dungeon[y][x].type = BaseTiles.FLOOR;
        }
      }
    }
  }

  // Sort rooms by distance from center for better corridor connections
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  rooms.sort((a, b) => {
    const distA =
      Math.pow(a.x + a.width / 2 - centerX, 2) +
      Math.pow(a.y + a.height / 2 - centerY, 2);
    const distB =
      Math.pow(b.x + b.width / 2 - centerX, 2) +
      Math.pow(b.y + b.height / 2 - centerY, 2);
    return distA - distB;
  });

  // Connect rooms using a more organic corridor pattern
  for (let i = 0; i < rooms.length - 1; i++) {
    const roomA = rooms[i];
    const roomB = rooms[i + 1];

    // Get random points within the rooms instead of always using centers
    const pointAX = Math.floor(roomA.x + seedRandom() * roomA.width);
    const pointAY = Math.floor(roomA.y + seedRandom() * roomA.height);
    const pointBX = Math.floor(roomB.x + seedRandom() * roomB.width);
    const pointBY = Math.floor(roomB.y + seedRandom() * roomB.height);

    // Add some randomness to corridor creation
    if (seedRandom() < 0.5) {
      createHCorridor(dungeon, pointAX, pointBX, pointAY);
      createVCorridor(dungeon, pointAY, pointBY, pointBX);
    } else {
      createVCorridor(dungeon, pointAY, pointBY, pointAX);
      createHCorridor(dungeon, pointAX, pointBX, pointBY);
    }

    // Occasionally add an alternative path for more interesting layouts
    if (seedRandom() < 0.05) {
      const altPointAX = Math.floor(roomA.x + seedRandom() * roomA.width);
      const altPointAY = Math.floor(roomA.y + seedRandom() * roomA.height);
      const altPointBX = Math.floor(roomB.x + seedRandom() * roomB.width);
      const altPointBY = Math.floor(roomB.y + seedRandom() * roomB.height);

      if (seedRandom() < 0.5) {
        createHCorridor(dungeon, altPointAX, altPointBX, altPointAY);
        createVCorridor(dungeon, altPointAY, altPointBY, altPointBX);
      } else {
        createVCorridor(dungeon, altPointAY, altPointBY, altPointAX);
        createHCorridor(dungeon, altPointAX, altPointBX, altPointBY);
      }
    }
  }

  return dungeon;
};

const createHCorridor = (
  dungeon: BaseCell[][],
  x1: number,
  x2: number,
  y: number
) => {
  const start = Math.min(x1, x2);
  const end = Math.max(x1, x2);

  for (let x = start; x <= end; x++) {
    dungeon[y][x].type = BaseTiles.FLOOR;
  }
};

const createVCorridor = (
  dungeon: BaseCell[][],
  y1: number,
  y2: number,
  x: number
) => {
  const start = Math.min(y1, y2);
  const end = Math.max(y1, y2);

  for (let y = start; y <= end; y++) {
    dungeon[y][x].type = BaseTiles.FLOOR;
  }
};

export { generateRoomDungeon };
