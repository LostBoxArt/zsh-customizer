# System Patterns: Zsh Customizer

## 1. Architecture Overview

*   **Client-Side Application:** A single-page application (SPA) built with React and Vite, running entirely in the browser.
*   **Component-Based:** The UI is structured using React components, organized by feature (`src/components/`) and shared UI elements (`src/components/ui/`).
*   **State Management:** Primarily uses React Context API for global state like theme (`src/contexts/ThemeContext.jsx`). Component-local state is likely managed using `useState` and `useReducer`.
*   **Styling:** Leverages Tailwind CSS for utility-first styling, supplemented by standard CSS where needed.

## 2. Key Component Interactions (Inferred)

*   **`App.jsx`:** Likely the main application component, orchestrating layout, routing (if any), and integrating major sections.
*   **`Navbar.jsx`:** Provides top-level navigation and potentially controls like theme switching.
*   **Feature Components (`ConfigurationSection.jsx`, `PromptDesigner.jsx`, `ThemeGuide.jsx`, etc.):** Encapsulate specific customization areas. They likely manage their own state and interact with global contexts (e.g., `ThemeContext`).
*   **UI Components (`src/components/ui/`):** Reusable, presentational components (Button, Card, Tabs, Sidebar) used across different features.
*   **`TerminalPreview.jsx`:** Integrates `xterm.js` to display a simulated terminal based on user selections (theme, prompt).
*   **`ThemeContext.jsx`:** Provides and manages the application's visual theme (dark/light mode).

## 3. Data Flow

*   User interactions within feature components update local or context state.
*   State changes trigger re-renders of relevant components.
*   Selections (theme, plugins, prompt elements) are likely aggregated in a central state (possibly within `App.jsx` or a dedicated context) before being used to generate the `.zshrc` content in `ConfigurationSection.jsx`.
*   The `TerminalPreview.jsx` component reads relevant state (selected theme, prompt string) to update the xterm.js display.
*   Preferences are persisted to and loaded from Local Storage.

## 4. Potential Patterns / Areas for Review

*   **Props Drilling vs. Context:** How is state passed between components? Is Context API used appropriately, or is there excessive props drilling?
*   **Component Granularity:** Are components well-defined and reusable? Are there large, monolithic components that could be broken down?
*   **State Management Complexity:** As features grow, will the current Context API approach scale, or might a more robust solution (like Zustand or Redux Toolkit) be needed?
*   **Consistency:** Is there consistency in how components are built, styled, and how state is managed?
*   **JS/TS Mix:** How is the boundary between JavaScript and TypeScript managed? Are types used effectively in the `.tsx` files?
