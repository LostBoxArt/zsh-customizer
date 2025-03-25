# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

## Installing Oh My Zsh Plugins

The Zsh Customizer helps you generate a `.zshrc` file with your chosen plugins, but it does not automatically install the plugins themselves. You need to manually install the plugins for them to work with Oh My Zsh.

Here are the general steps to install Oh My Zsh plugins:

1.  **Find the plugin repository:**  Search for the Oh My Zsh plugin you want to install (e.g., on GitHub).
2.  **Clone the plugin to Oh My Zsh plugins directory:** Use `git clone` to clone the plugin repository to the Oh My Zsh custom plugins directory: `~/.oh-my-zsh/custom/plugins`. For example:
    ```bash
    git clone [plugin_repository_url] ~/.oh-my-zsh/custom/plugins/[plugin_name]
    ```
3.  **Enable the plugin in .zshrc:** Open your `.zshrc` file and find the `plugins=(...)` line. Add the plugin name to the array. For example:
    ```zsh
    plugins=(
      git
      [plugin_name]
      ...
    )
    ```
4.  **Restart terminal or source .zshrc:** Restart your terminal or run `source ~/.zshrc` to apply the changes.

For more detailed instructions and plugin-specific installation steps, refer to the Oh My Zsh documentation and the plugin's repository README.


If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
