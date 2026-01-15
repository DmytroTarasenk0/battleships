import { fleet } from "./fleet";

// calculate the coordinates for a ship
export const calculateCoords = (startIndex, length, isRotated) => {
  const coords = [];
  const startX = startIndex % 10;
  const startY = Math.floor(startIndex / 10);

  for (let i = 0; i < length; i++) {
    const x = isRotated ? startX : startX + i;
    const y = isRotated ? startY + i : startY;

    if (x > 9 || y > 9) return null; // out of bounds

    coords.push(y * 10 + x);
  }
  return coords;
};

// collision check for new-placed ships with existing ones (true/false)
export const checkCollision = (placedShips, newCoords) => {
  const forbidden = new Set();

  placedShips.forEach((ship) => {
    ship.coords.forEach((coord) => {
      // add self
      forbidden.add(coord);

      const cx = coord % 10;
      const cy = Math.floor(coord / 10);

      // neighbouring cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = cx + dx;
          const ny = cy + dy;

          // out of bounds or add
          if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
            forbidden.add(ny * 10 + nx);
          }
        }
      }
    });
  });

  return newCoords.some((coord) => forbidden.has(coord));
};

// ship-placement random generator (randomly place ships on the board in 100 attempts max each)
export const generateShips = () => {
  const newShips = [];
  for (const ship of fleet) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      const randIndex = Math.floor(Math.random() * 100);
      const randRotated = Math.random() < 0.5;

      const coords = calculateCoords(randIndex, ship.length, randRotated);

      // if coords exist and no collision => place ship
      if (coords && !checkCollision(newShips, coords)) {
        newShips.push({ id: ship.id, coords });
        placed = true;
      }
      attempts++;
    }
  }

  return newShips;
};

// check if cell is occupied by any ship in the fleet
export const isOccupied = (fleetOwner, cellIndex) =>
  fleetOwner.some((ship) => ship.coords.includes(cellIndex));

// reveal collision-aura(1-cell border) after kill
export const revealAura = (shipCoords) => {
  const aura = new Set();

  shipCoords.forEach((index) => {
    const cx = index % 10;
    const cy = Math.floor(index / 10);

    // neighbouring cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // skip self

        const nx = cx + dx;
        const ny = cy + dy;

        // out of bounds or add
        if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
          aura.add(ny * 10 + nx);
        }
      }
    }
  });

  shipCoords.forEach((coord) => {
    aura.delete(coord); // remove ship coords from aura
  });

  return Array.from(aura);
};

// get neighbouring cells of a given cell
export const getNeighbours = (index) => {
  const neighbours = [];
  const x = index % 10;
  const y = Math.floor(index / 10);

  if (y > 0) neighbours.push(index - 10); // up
  if (y < 9) neighbours.push(index + 10); // down
  if (x > 0) neighbours.push(index - 1); // left
  if (x < 9) neighbours.push(index + 1); // right

  return neighbours;
};
