# Arrow Escape – React Native + Expo Puzzle Game

**Arrow Escape** is a mobile puzzle game built with React Native and Expo. Players strategically tap arrows pointing in different directions (Up, Down, Left, Right) to guide them off the board in the correct order without colliding into blocking arrows.

---

## Features

- **Dynamic Grid Puzzle Engine**:
  - Progressive difficulty across 50 handcrafted and algorithmically validated levels:
    - **Levels 1–10**: Beginner (4x4 board)
    - **Levels 11–20**: Easy (5x5 board)
    - **Levels 21–30**: Medium (6x6 board)
    - **Levels 31–40**: Hard (7x7 board)
    - **Levels 41–50**: Expert (8x8 board)
  - **Guaranteed Solvability**: Every level is mathematically verified to ensure a complete, deadlock-free solution exists.
  - **Daily Challenge Mode**: Generates a deterministic daily puzzle seeded by the current date, tracking daily completion streaks.

- **Polished Game Mechanics & Animations**:
  - Smooth arrow exit flight animations out of the board.
  - Blocked arrow shake feedback with red alert glow.
  - Smart Hint system identifying optimal moves that unlock downstream paths with a glowing gold pulse.
  - Undo functionality allowing players to step backwards.
  - Move counter, active timer, and 3-star rating metric.

- **Screens**:
  1. **Home Screen**: Game emblem, quick stats (Completed levels, Total stars, Streak), Play/Continue, Level Selection, Daily Challenge, Settings, and an interactive "How to Play" tutorial modal.
  2. **Gameplay Screen**: Centered dynamic board, live stats bar, Undo, Hint, Restart, and Pause modal.
  3. **Level Selection Screen**: Grid view of all 50 levels with locked/unlocked state, star badges, and difficulty category filters.
  4. **Settings Screen**: Sound effects toggle, Haptic feedback toggle, Dark/Light theme toggle, and progress reset confirmation dialog.
  5. **Level Complete Screen**: Celebration overlay with particle confetti, sequential star bounce animations, moves/time recap, and next level navigation.

- **Storage & State Persistence**:
  - Uses `@react-native-async-storage/async-storage` for local saving of unlocked levels, level stars, best moves/time, settings, and daily streaks.

- **100% Expo Go Compatible**:
  - Zero incompatible native modules.
  - Runs out of the box with `npx expo start`.

---

## Project Structure

```
arrow-escape/
├── src/
│   ├── components/
│   │   ├── Arrow.js               # Animated interactive arrow tile
│   │   ├── GameBoard.js           # Responsive grid container
│   │   ├── GameButton.js          # Reusable styled button with haptics
│   │   ├── GameHeader.js          # Top header and live stats bar
│   │   ├── LevelCard.js           # Level selection card component
│   │   ├── PauseModal.js          # Pause menu with quick toggles
│   │   ├── LevelCompleteModal.js  # Victory celebration modal
│   │   └── Confetti.js            # Particle confetti animation
│   ├── engine/
│   │   ├── collisionDetection.js  # Raycasting and path clearance checks
│   │   ├── puzzleEngine.js        # Solver, star calculation, validation
│   │   ├── levelGenerator.js      # Reverse-unwinding puzzle generator
│   │   └── levelData.js           # 50 levels metadata and daily challenge
│   ├── hooks/
│   │   └── useGame.js             # Comprehensive game state machine hook
│   ├── utils/
│   │   ├── constants.js           # Directions, themes, tiers, storage keys
│   │   ├── sound.js               # Audio and haptic feedback manager
│   │   └── storage.js             # AsyncStorage persistence service
│   └── screens/
│       ├── HomeScreen.js          # Main menu and stats
│       ├── GameScreen.js          # Active gameplay interface
│       ├── LevelSelectScreen.js   # 50-level category grid
│       └── SettingsScreen.js      # Sound, haptics, theme, and data reset
├── App.js                         # Root navigation and safe area provider
├── app.json                       # Expo configuration
└── package.json                   # Dependencies
```

---

## How to Run the Game

### 1. Start the Dev Server
```bash
npx expo start
```

### 2. Run on Your Device with Expo Go
1. Install the **Expo Go** app from Google Play Store (Android) or App Store (iOS).
2. Scan the QR code displayed in the terminal using your phone camera (iOS) or the Expo Go app (Android).

### 3. Run on Web
```bash
npx expo start --web
```
