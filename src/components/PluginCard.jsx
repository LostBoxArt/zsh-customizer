import PropTypes from 'prop-types';

function PluginCard({ plugin, isSelected, onToggle }) {
  return (
    <div 
      onClick={onToggle}
      className={`plugin-card p-4 rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-white dark:bg-gray-800 shadow-lg transform -translate-y-1' 
          : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium text-gray-900 dark:text-white ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}`}>
            {plugin.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {plugin.description}
          </p>
          {plugin.installation && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 italic">
              Requires manual installation (see Config tab)
            </p>
          )}
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          {isSelected && '✓'}
        </div>
      </div>
      
      <div className="mt-3">
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Example Commands:</h4>
        <div className="font-mono text-xs p-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-md overflow-x-auto whitespace-nowrap">
          {plugin.commands.join(', ')}
        </div>
      </div>
    </div>
  );
}

PluginCard.propTypes = {
  plugin: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    commands: PropTypes.arrayOf(PropTypes.string).isRequired,
    installation: PropTypes.string // Add optional installation prop
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default PluginCard;