import PropTypes from 'prop-types';
import ConfigurationSection from '../ConfigurationSection'; // Original component
import { plugins } from '../../data/plugins'; // Import plugins data

function ConfigSection({ zshConfig, selectedPlugins }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(zshConfig);
    alert('Configuration copied to clipboard!');
  };

  return (
    <section className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Generated Configuration</h2>
        <p className="text-gray-600 dark:text-gray-300">Your customized Zsh configuration is ready. Copy it to your .zshrc file to apply the changes.</p>
      </div>
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <ConfigurationSection 
          zshConfig={zshConfig}
          plugins={plugins} // Pass full plugins array
          selectedPlugins={selectedPlugins} // Pass selected plugin IDs
          onCopy={handleCopy}
        />
      </div>
    </section>
  );
}

ConfigSection.propTypes = {
  zshConfig: PropTypes.string.isRequired,
  selectedPlugins: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ConfigSection;
