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

      // neighboring cells
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
