import PropTypes from 'prop-types';
import PluginCard from '../PluginCard';
import { plugins } from '../../data/plugins'; // Import plugins data

function PluginsSection({ selectedPlugins, onPluginToggle }) {
  return (
    <section className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Select Plugins</h2>
        <p className="text-gray-600 dark:text-gray-300">Choose plugins to enhance your terminal experience. Each plugin adds useful features and shortcuts. <strong className="text-yellow-600 dark:text-yellow-400">Note:</strong> Some plugins (like Autosuggestions and Syntax Highlighting) require manual installation steps, which will be shown in the 'Generated Configuration' tab if selected.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {plugins.map((plugin) => (
          <PluginCard 
            key={plugin.id}
            plugin={plugin}
            isSelected={selectedPlugins.includes(plugin.id)}
            onToggle={() => onPluginToggle(plugin.id)}
          />
        ))}
      </div>
    </section>
  );
}

PluginsSection.propTypes = {
  selectedPlugins: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPluginToggle: PropTypes.func.isRequired,
};

export default PluginsSection;
