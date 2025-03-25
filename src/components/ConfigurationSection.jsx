import PropTypes from 'prop-types';
// import { useTheme } from '../contexts/theme-hook'; // Removed unused import

function ConfigurationSection({ zshConfig, onCopy, plugins, selectedPlugins }) {
  // const { darkMode } = useTheme(); // Removed unused variable

  // Find selected external plugins that require manual installation
  const externalPluginsToInstall = plugins.filter(p => 
    selectedPlugins.includes(p.id) && p.installation
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4" id="config">Generated Configuration</h2>
      <div className="relative">
        <pre className="bg-gray-800 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-60 text-gray-300">
          {zshConfig}
        </pre>
        <div className="absolute top-2 right-2 flex space-x-2">
          <button 
            onClick={onCopy}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-all duration-300"
          >
            Copy
          </button>
          <button 
            onClick={() => {
              const blob = new Blob([zshConfig], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = '.zshrc';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-all duration-300"
          >
            Download
          </button>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Installation Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Download the configuration file using the button above</li>
          <li>Place the downloaded file in your home directory (<code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-800 dark:text-gray-300">~</code>) and rename it to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-800 dark:text-gray-300">.zshrc</code> (backup your existing one if needed).</li>
          <li>If you don't have Oh My Zsh installed, run: <br />
            <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded block mt-1 overflow-x-auto text-gray-800 dark:text-gray-300">
              sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
            </code>
          </li>
          <li>Install JetBrainsMono Nerd Font:
            <div className="ml-4 mt-1 space-y-1">
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded block text-gray-800 dark:text-gray-300">
                brew tap homebrew/cask-fonts && brew install --cask font-jetbrains-mono-nerd-font
              </code>
              <span className="text-sm">or download manually from <a href="https://www.nerdfonts.com/font-downloads" className="text-blue-400 hover:text-blue-300">nerdfonts.com</a></span>
            </div>
          </li>
          <li>Configure your terminal emulator to use "JetBrainsMono Nerd Font"</li>
          {externalPluginsToInstall.length > 0 && (
            <li>
              Install selected external plugins:
              <div className="ml-4 mt-1 space-y-2">
                {externalPluginsToInstall.map(plugin => (
                  <div key={plugin.id}>
                    <span className="font-semibold">{plugin.name}:</span>
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded block mt-1 overflow-x-auto text-gray-800 dark:text-gray-300">
                      {plugin.installation}
                    </code>
                  </div>
                ))}
              </div>
            </li>
          )}
          <li>Restart your terminal or run <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-800 dark:text-gray-300">source ~/.zshrc</code></li>
        </ol>
      </div>
    </div>
  );
}

ConfigurationSection.propTypes = {
  zshConfig: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
  plugins: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedPlugins: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ConfigurationSection;