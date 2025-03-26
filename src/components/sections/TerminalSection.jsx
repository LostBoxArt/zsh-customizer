import PropTypes from 'prop-types';
import TerminalPreview from '../TerminalPreview';
import PromptDesigner from '../PromptDesigner';

function TerminalSection({ 
  selectedTheme, 
  selectedPlugins, 
  customPrompt, 
  onPromptChange, 
  onPromptApply 
}) {
  return (
    <section className="animate-fadeIn">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Terminal Preview</h2>
        <p className="text-gray-600 dark:text-gray-300">See how your terminal will look with the selected theme and plugins.</p>
      </div>
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <TerminalPreview 
          selectedTheme={selectedTheme}
          selectedPlugins={selectedPlugins}
        />
      </div>
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Customize Prompt</h2>
          <p className="text-gray-600 dark:text-gray-300">Create your own custom prompt or use the theme's default.</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg">
          <PromptDesigner 
            value={customPrompt}
            onChange={onPromptChange}
            onApply={onPromptApply}
          />
        </div>
      </div>
    </section>
  );
}

TerminalSection.propTypes = {
  selectedTheme: PropTypes.string.isRequired,
  selectedPlugins: PropTypes.arrayOf(PropTypes.string).isRequired,
  customPrompt: PropTypes.string.isRequired,
  onPromptChange: PropTypes.func.isRequired,
  onPromptApply: PropTypes.func.isRequired,
};

export default TerminalSection;
