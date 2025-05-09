import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ThemeCard from './components/ThemeCard'
import PluginCard from './components/PluginCard'
import TerminalPreview from './components/TerminalPreview'
// Keep original ConfigurationSection import for now, as ConfigSection uses it
import ConfigurationSection from './components/ConfigurationSection'; 
import PromptDesigner from './components/PromptDesigner';
import ThemeGuide from './components/ThemeGuide';
import { useTheme } from './contexts/theme-hook'; // Updated import path
// Removed data imports as they are now used in section components
// import { themes } from './data/themes'; 
// import { plugins } from './data/plugins'; 

// Import new section components
import ThemesSection from './components/sections/ThemesSection';
import PluginsSection from './components/sections/PluginsSection';
import TerminalSection from './components/sections/TerminalSection';
import ConfigSection from './components/sections/ConfigSection';

function App() {
  const { showThemeGuide } = useTheme();
  const [activeTab, setActiveTab] = useState('themes');
  const [selectedTheme, setSelectedTheme] = useState('robbyrussell');
  const [selectedPlugins, setSelectedPlugins] = useState(['git', 'docker']);
  const [customPrompt, setCustomPrompt] = useState('');
  const [zshConfig, setZshConfig] = useState('');
  const [showGuide, setShowGuide] = useState(showThemeGuide);

  // Generate .zshrc configuration
  const generateConfig = useCallback(() => {
    const config = `# Generated by Zsh Customizer

# Path to your oh-my-zsh installation
export ZSH="$HOME/.oh-my-zsh"

# Set theme
ZSH_THEME="${selectedTheme}"

# Plugins
plugins=(${selectedPlugins.join(' ')})

# Source oh-my-zsh
source $ZSH/oh-my-zsh.sh

# User configuration
${customPrompt ? `
# Custom prompt
PROMPT="${customPrompt}"
` : '# Add your custom configurations below'}
`;
    
    setZshConfig(config);
  }, [selectedTheme, selectedPlugins, customPrompt]);

  // Load preferences and generate initial config on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('zsh-theme');
    const savedPlugins = localStorage.getItem('zsh-plugins');
    
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
    
    if (savedPlugins) {
      try {
        const parsedPlugins = JSON.parse(savedPlugins);
        if (Array.isArray(parsedPlugins)) {
          setSelectedPlugins(parsedPlugins);
        }
      } catch (error) {
        console.error("Failed to parse saved plugins:", error);
        // Optionally reset to default or clear the invalid item
        localStorage.removeItem('zsh-plugins');
      }
    }
    // generateConfig will be called by the effects below once state is set
  }, []); // Run only once on mount

  // Update config and save preferences when theme changes
  useEffect(() => {
    localStorage.setItem('zsh-theme', selectedTheme);
    generateConfig();
  }, [selectedTheme, generateConfig]);

  // Update config and save preferences when plugins change
  useEffect(() => {
    localStorage.setItem('zsh-plugins', JSON.stringify(selectedPlugins));
    generateConfig();
  }, [selectedPlugins, generateConfig]);

  // Update config when custom prompt changes
  useEffect(() => {
    generateConfig();
  }, [customPrompt, generateConfig]);

  // Toggle plugin selection
  const togglePlugin = (pluginId) => {
    if (selectedPlugins.includes(pluginId)) {
      setSelectedPlugins(selectedPlugins.filter(id => id !== pluginId));
    } else {
      setSelectedPlugins([...selectedPlugins, pluginId]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'themes':
        return (
          <ThemesSection 
            selectedTheme={selectedTheme}
            onThemeSelect={setSelectedTheme}
          />
        );
      case 'plugins':
        return (
          <PluginsSection 
            selectedPlugins={selectedPlugins}
            onPluginToggle={togglePlugin}
          />
        );
      case 'terminal':
        return (
          <TerminalSection 
            selectedTheme={selectedTheme}
            selectedPlugins={selectedPlugins}
            customPrompt={customPrompt}
            onPromptChange={setCustomPrompt}
            onPromptApply={generateConfig}
          />
        );
      case 'config':
        return (
          <ConfigSection 
            zshConfig={zshConfig}
            selectedPlugins={selectedPlugins}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Customize Your Zsh Experience</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Create your perfect terminal environment with themes and plugins from Oh My Zsh.</p>
          {renderContent()}
        </div>
      </div>
      {showGuide && <ThemeGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}

export default App
