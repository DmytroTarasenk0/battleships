# BattleShips Game

A fully functional Battleship game built with **React**. Features a smart AI opponent, drag-and-drop ship placement, and an intuitive UI.

## Features

- **Smart AI:** The bot uses an algorithm with axis-locking to sink ships efficiently.
- **Drag & Drop:** Intuitive ship placement using native HTML5 drag-and-drop.
- **Fog of War:** Enemy ships are hidden until hit; sunken ships reveal their surrounding "aura"(1-line border).
- **Game Loop:** Complete flow from placement => turn-based combat => game over screen.

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

1.  **Placement Phase:** Drag your ships (Carrier, Battleship, etc.) onto the board.
2.  **Rotation:** Click a ship in the shipyard to toggle its rotation (Vertical/Horizontal) before dragging if needed.
3.  **Battle Phase:** Click on the "Enemy Board" to fire.
    - **Red:** Hit and you get another turn.
    - **Blue:** Miss. Turn passes to the bot.
4.  **Victory:** Sink all 6 enemy ships to win.

## Future Plans

- [ ] Mobile/Touch-screen support
- [ ] Multiplayer
- [ ] Sound Effects
