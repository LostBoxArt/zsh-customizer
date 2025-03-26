# Tech Context: Zsh Customizer

## 1. Core Technologies

*   **Frontend Framework:** React (primarily using `.jsx` files).
*   **Build Tool:** Vite (`vite.config.js`).
*   **Styling:**
    *   Tailwind CSS (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
    *   Standard CSS (`.css` files).
*   **Language:** JavaScript (`.js`, `.jsx`). Some TypeScript (`.tsx`) is present in UI components, suggesting potential partial adoption or use of third-party components written in TS.
*   **Package Manager:** npm (`package.json`, `package-lock.json`).
*   **Linting:** ESLint (`eslint.config.js`).

## 2. Key Libraries/Dependencies (Inferred)

*   **React:** Core UI library.
*   **xterm.js:** Used for the interactive terminal preview (inferred from `README.md`).
*   **UI Components:** Custom components built within the project (`src/components/ui/`). Specific libraries like Shadcn/ui might be used or inspired the structure (based on common patterns like `Button.jsx`, `Card.jsx`, `Tabs.jsx`).
*   **State Management:** React Context API (`src/contexts/ThemeContext.jsx`).

## 3. Development Environment

*   **Setup:** Requires Node.js and npm.
*   **Commands:**
    *   `npm install`: Install dependencies.
    *   `npm run dev`: Start the Vite development server.

## 4. Technical Constraints & Considerations

*   **Browser Environment:** Runs entirely in the user's web browser.
*   **Local Storage:** Used for persisting user preferences.
*   **No Backend:** Currently a client-side only application. Configuration generation happens in the browser.
*   **Plugin Installation:** The application *does not* install Zsh plugins; users must do this manually. This is a key limitation communicated to the user.
*   **Mixed JS/TS:** The presence of both `.jsx` and `.tsx` suggests a potential need for consistent language strategy or careful management of the boundary.
