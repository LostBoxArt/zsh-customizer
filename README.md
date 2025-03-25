# Zsh Customizer

Zsh Customizer is a web application designed to simplify the process of creating and customizing your Zsh terminal environment, particularly when using [Oh My Zsh](https://ohmyz.sh/). It provides a user-friendly interface for selecting themes, managing plugins, designing prompts, and generating the necessary `.zshrc` configuration.


## Current Features

*   **Theme Selection:** Browse and select from various Oh My Zsh themes.
*   **Plugin Management:** Choose plugins to include in your configuration. Includes search functionality.
*   **Custom Prompt Designer:** Visually design your Zsh prompt (`PS1`) with a live preview.
*   **Terminal Preview:** See an interactive preview of your selected theme and prompt using xterm.js.
*   **Configuration Generation:** Generate a `.zshrc` file based on your selections.
*   **Export Options:** Copy the generated configuration to the clipboard or download it as a file.
*   **Dark/Light Mode:** Switch between visual themes for the customizer interface.
*   **Local Storage:** Saves your preferences locally for persistence between sessions.
*   **Modern UI:** Features a redesigned interface with a navigation bar, responsive tabs, and glassmorphism effects.

## Future Goals / Roadmap

The project aims to become a comprehensive tool for Zsh customization. Key areas for future development include:

*   **Enhanced Theme Experience:**
    *   Actual preview images/GIFs for themes.
    *   Theme gallery with filtering, sorting, and comparison.
    *   Custom theme creation capabilities.
    *   Theme favoriting and rating.
*   **Advanced Plugin Management:**
    *   Plugin categories, tags, and recommendations.
    *   Detailed plugin information, usage examples, and dependency management.
*   **Interactive Configuration:**
    *   An editor for the generated configuration with syntax highlighting.
    *   Configuration versioning, history, sharing via URL, and templates.
*   **Guided Installation &amp; Setup:**
    *   Interactive installation guide for Oh My Zsh and plugins.
    *   System detection for tailored instructions and verification.
    *   Troubleshooting assistance and video tutorials.
*   **UI/UX Polish:**
    *   Wizard-like guided customization flow.
    *   Persistent real-time preview across all sections.
    *   Subtle animations, micro-interactions, and improved mobile experience.
*   **Technical Improvements:**
    *   Performance optimization (code splitting, lazy loading, asset optimization).
    *   Code quality enhancements (TypeScript adoption, component library, testing).
*   **Long-Term Vision:**
    *   Community features (user profiles, shared configurations).
    *   Integration with package managers.
    *   Support for additional shells (bash, fish).
    *   A dedicated plugin marketplace.

## Getting Started (Development)

1.  Clone the repository:
    ```bash
    git clone https://github.com/LostBoxArt/zsh-customizer.git
    cd zsh-customizer
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open the application in your browser (usually `http://localhost:5173`).

## Important Note on Plugins

Zsh Customizer helps you *select* plugins for your `.zshrc` file, but it does **not** automatically install them. You need to install the chosen plugins manually for Oh My Zsh to use them.

Here are the general steps:

1.  **Find the plugin repository:** Search for the Oh My Zsh plugin you want (e.g., on GitHub).
2.  **Clone the plugin:** Use `git clone` to download the plugin into the Oh My Zsh custom plugins directory (`~/.oh-my-zsh/custom/plugins`).
    ```bash
    git clone [plugin_repository_url] ~/.oh-my-zsh/custom/plugins/[plugin_name]
    ```
    *(Replace `[plugin_repository_url]` and `[plugin_name]` accordingly)*
3.  **Enable the plugin:** Open your `~/.zshrc` file and add the `[plugin_name]` to the `plugins=(...)` list.
    ```zsh
    plugins=(
      git
      [plugin_name]
      # other plugins...
    )
    ```
4.  **Apply changes:** Restart your terminal or run `source ~/.zshrc`.

Refer to the official Oh My Zsh documentation and the specific plugin's README for detailed instructions.
