import PropTypes from 'prop-types';

function ThemeCard({ theme, isSelected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`theme-card p-4 rounded-lg cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-white dark:bg-gray-800 shadow-lg transform -translate-y-1' 
          : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 shadow hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`font-medium text-gray-900 dark:text-white ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}`}>
            {theme.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {theme.description}
          </p>
        </div>
        {isSelected && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Selected
          </span>
        )}
      </div>
      
      <div className="mt-3 p-2 rounded-md overflow-hidden border dark:border-gray-700" style={{ 
        background: theme.bgColor || '#1a1b26',
        color: theme.textColor || '#a9b1d6',
        fontFamily: '"JetBrains Mono", monospace'
      }}>
        <div className="flex items-center text-sm p-1.5" style={{ background: theme.accentColor || '#32344a' }}>
          <span className="mr-2"></span>
           <span>{theme.name}</span>
         </div>
         {/* Removed hardcoded prompt structure */}
         <div className="p-2"> 
           {/* Display only the theme.preview with a leading symbol and handle newlines */}
           <div className="flex items-start"> 
             <span className="mr-2" style={{ color: theme.accentColor || '#7aa2f7' }}>❯</span> 
             <span style={{ color: theme.textColor, whiteSpace: 'pre-wrap' }}>{theme.preview}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

ThemeCard.propTypes = {
  theme: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    preview: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ThemeCard;
