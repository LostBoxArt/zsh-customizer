import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/theme-hook'; // Updated import path

function PromptDesigner({ onPromptChange }) {
  const { darkMode } = useTheme();
  const [promptStyle, setPromptStyle] = useState('default');
  const [promptColor, setPromptColor] = useState('#00FF00');
  const [showUsername, setShowUsername] = useState(true);
  const [showHostname, setShowHostname] = useState(true);
  const [showPath, setShowPath] = useState(true);
  const [showGitInfo, setShowGitInfo] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');
  const [previewPrompt, setPreviewPrompt] = useState('user@host:~/projects $');

  // Predefined prompt styles
  const promptStyles = [
    { id: 'default', name: 'Default', example: 'username@hostname:~/path$ ' },
    { id: 'arrow', name: 'Arrow', example: '➜ ~/path ' },
    { id: 'minimal', name: 'Minimal', example: '$ ' },
    { id: 'informative', name: 'Informative', example: '[user@host ~/path]$ ' },
    { id: 'custom', name: 'Custom', example: 'Custom prompt...' }
  ];

  // Update preview prompt when settings change
  useEffect(() => {
    let newPrompt = '';
    
    if (promptStyle === 'custom') {
      newPrompt = customPrompt;
    } else {
      // Build prompt based on selected components
      if (promptStyle === 'default') {
        if (showUsername) newPrompt += 'user';
        if (showUsername && showHostname) newPrompt += '@';
        if (showHostname) newPrompt += 'host';
        if ((showUsername || showHostname) && showPath) newPrompt += ':';
        if (showPath) newPrompt += '~/projects';
        if (showGitInfo) newPrompt += ' (main)';
        newPrompt += ' $ ';
      } else if (promptStyle === 'arrow') {
        if (showUsername) newPrompt += 'user ';
        if (showHostname) newPrompt += 'at host ';
        if (showPath) newPrompt += 'in ~/projects ';
        if (showGitInfo) newPrompt += '(main) ';
        newPrompt += '➜ ';
      } else if (promptStyle === 'minimal') {
        if (showPath) newPrompt += '~/projects ';
        newPrompt += '$ ';
      } else if (promptStyle === 'informative') {
        newPrompt += '[';
        if (showUsername) newPrompt += 'user';
        if (showUsername && showHostname) newPrompt += '@';
        if (showHostname) newPrompt += 'host';
        if (showPath) newPrompt += ' ~/projects';
        newPrompt += ']';
        if (showGitInfo) newPrompt += ' (main)';
        newPrompt += '$ ';
      }
    }
    
    setPreviewPrompt(newPrompt);
    if (onPromptChange) {
      onPromptChange(newPrompt);
    }
  }, [promptStyle, promptColor, showUsername, showHostname, showPath, showGitInfo, customPrompt, onPromptChange]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="text-xl font-semibold mb-4">Custom Prompt Designer</h2>
      
      {/* Prompt Style Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Prompt Style</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {promptStyles.map(style => (
            <button
              key={style.id}
              onClick={() => setPromptStyle(style.id)}
              className={`p-2 rounded text-sm ${promptStyle === style.id 
                ? 'bg-primary-light dark:bg-primary-dark text-white' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input (only shown when custom style is selected) */}
      {promptStyle === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Custom Prompt Format</label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom prompt format..."
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            Use %u for username, %h for hostname, %d for directory, %g for git branch
          </p>
        </div>
      )}

      {/* Prompt Color */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Prompt Color</label>
        <div className="flex items-center">
          <input
            type="color"
            value={promptColor}
            onChange={(e) => setPromptColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <span className="ml-2 text-sm">{promptColor}</span>
        </div>
      </div>

      {/* Prompt Components */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Prompt Components</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showUsername}
              onChange={() => setShowUsername(!showUsername)}
              className="mr-2"
            />
            <span>Show Username</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHostname}
              onChange={() => setShowHostname(!showHostname)}
              className="mr-2"
            />
            <span>Show Hostname</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showPath}
              onChange={() => setShowPath(!showPath)}
              className="mr-2"
            />
            <span>Show Current Path</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showGitInfo}
              onChange={() => setShowGitInfo(!showGitInfo)}
              className="mr-2"
            />
            <span>Show Git Branch</span>
          </label>
        </div>
      </div>

      {/* Prompt Preview */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Preview</label>
        <div className="bg-gray-900 text-white p-3 rounded font-mono text-sm overflow-x-auto">
          <span style={{ color: promptColor }}>{previewPrompt}</span>
          <span className="animate-pulse">|</span>
        </div>
      </div>
    </div>
  );
}

PromptDesigner.propTypes = {
  onPromptChange: PropTypes.func
};

export default PromptDesigner;