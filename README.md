# BattleShips Game

A fully functional Battleship game built with **React**. Features a smart AI opponent, drag-and-drop ship placement, and an intuitive UI.

## Features

- **Smart AI:** The bot uses an algorithm with axis-locking to sink ships efficiently.
- **Hybrid Controls:** Supports both traditional **Drag & Drop** (PC) and **Tap-to-Place** (Mobile & PC).
- **Fog of War:** Enemy ships are hidden until hit; sunken ships reveal their surrounding "aura"(1-line border).
- **Game Loop:** Complete flow from placement => turn-based combat => game over screen.
- **Responsive Design:** Optimized layout for desktop and landscape mobile play.
- **Interactive Audio:** Immersive sound effects for hits, misses, and turn switches.

## Live Demo

Play the game here: https://battleships-livid.vercel.app/

## Tech Stack

- **Frontend:** React (Hooks: `useState`, `useEffect`)
- **Build Tool:** Vite
- **Styling:** CSS

### Prerequisites

- Node.js
- npm

### Installation

1.  Clone the repo:
    ```bash
    git clone https://github.com/DmytroTarasenk0/battleships.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the dev server:
    ```bash
    npm run dev
    ```

## How to Play

1.  **Placement Phase:**
    - **Drag & Drop(PC ONLY):** Drag ships from the shipyard onto the board.
    - **Tap-to-Place:** Tap a ship to select it, then tap a cell on the board to place it.
2.  **Rotation:**
    - Tap a ship **once** to select it.
    - Tap **again** to toggle rotation (Vertical/Horizontal).
3.  **Battle Phase:** Click on the "Enemy Board" to fire.
    - **Red:** Hit and you get another turn.
    - **Blue:** Miss. Turn passes to the bot.
4.  **Victory:** Sink all 6 enemy ships to win.

## Future Plans

- [x] Mobile/Touch-screen support
- [x] Sound Effects
- [ ] Multiplayer
