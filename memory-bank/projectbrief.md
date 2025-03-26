# Project Brief: Zsh Customizer

## 1. Project Purpose

Zsh Customizer is a web application designed to simplify the process of creating and customizing Zsh terminal environments, specifically targeting users of Oh My Zsh. It aims to provide a user-friendly graphical interface for tasks typically done by manually editing configuration files.

## 2. Core Requirements & Features (Current)

*   **Theme Selection:** Allow users to browse and select from various Oh My Zsh themes.
*   **Plugin Management:** Enable users to choose Oh My Zsh plugins to include in their configuration, with search functionality. (Note: Does not install plugins, only lists them for the config).
*   **Custom Prompt Designer:** Provide a visual tool for designing the Zsh prompt (`PS1`) with a live preview.
*   **Terminal Preview:** Display an interactive preview of the selected theme and prompt using xterm.js.
*   **Configuration Generation:** Generate a `.zshrc` file based on user selections.
*   **Export Options:** Allow users to copy the generated configuration or download it as a file.
*   **UI Features:** Include dark/light mode switching and a modern interface (navbar, tabs, glassmorphism).
*   **Persistence:** Save user preferences locally using browser storage.

## 3. Project Goals (Future Roadmap)

The long-term goal is to evolve Zsh Customizer into a comprehensive and interactive tool for Zsh environment management. Key future enhancements include:

*   **Themes:** Richer theme gallery (previews, filtering, comparison, custom creation, favorites).
*   **Plugins:** Advanced management (categories, details, dependencies).
*   **Configuration:** Interactive editor, versioning, sharing, templates.
*   **Setup:** Guided installation for Oh My Zsh and plugins, system detection.
*   **UI/UX:** Guided workflow, persistent preview, animations, mobile improvements.
*   **Technical:** Performance optimization, code quality (TypeScript, testing).
*   **Vision:** Community features, package manager integration, multi-shell support (bash, fish), plugin marketplace.

## 4. Target Audience

Users of Zsh, particularly those using or wanting to use Oh My Zsh, who prefer a graphical interface for configuration over manual file editing. This includes both beginners looking for an easier start and experienced users seeking a more visual way to manage their setup.

## 5. Scope Boundaries

*   **Current:** Focuses on generating the `.zshrc` content based on user selections. Does *not* handle the installation of Oh My Zsh itself or the selected plugins.
*   **Future:** May expand to include guided installation and potentially direct interaction with the user's system (if architecturally feasible and secure).
