import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ThemeCard from './components/ThemeCard'
import PluginCard from './components/PluginCard'
import TerminalPreview from './components/TerminalPreview'
import ConfigurationSection from './components/ConfigurationSection'
import PromptDesigner from './components/PromptDesigner'
import ThemeGuide from './components/ThemeGuide'
import { useTheme } from './contexts/theme-hook' // Updated import path

function App() {
  const { showThemeGuide } = useTheme();
  const [activeTab, setActiveTab] = useState('themes');
  const [selectedTheme, setSelectedTheme] = useState('robbyrussell');
  const [selectedPlugins, setSelectedPlugins] = useState(['git', 'docker']);
  const [customPrompt, setCustomPrompt] = useState('');
  const [zshConfig, setZshConfig] = useState('');
  const [showGuide, setShowGuide] = useState(showThemeGuide);

  // Popular Oh My Zsh themes from the official repository
  const themes = [
    { 
      id: 'robbyrussell',
      name: 'Robbyrussell (Default)',
      description: 'The default theme - clean, simple, compatible',
      preview: '➜  ~ git:(main)', // More typical representation
      bgColor: '#1a1b26',
      textColor: '#a9b1d6',
      accentColor: '#7aa2f7'
    },
    { 
      id: 'agnoster',
      name: 'Agnoster',
      description: 'A popular powerline-based theme',
      preview: 'user@host ~/p/zsh-customizer git:(main) ', // More accurate text representation
      bgColor: '#1a1b26',
      textColor: '#c0caf5',
      accentColor: '#bb9af7',
      powerlineSymbol: ''
    },
    { 
      id: 'avit',
      name: 'Avit',
      description: 'Minimalist theme with git info',
      preview: '~/p/zsh-customizer main ❯', // Shorter path, branch
    },
    { 
      id: 'bira',
      name: 'Bira',
      description: 'Two-line prompt with ruby version',
      preview: 'user@host:~/projects\n➜'
    },
    { 
      id: 'bureau',
      name: 'Bureau',
      description: 'Modern and informative theme',
      preview: 'user@host ~/p/zsh-customizer [main] ❯', // Simplified
    },
    { 
      id: 'candy',
      name: 'Candy',
      description: 'Sweet and colorful theme',
      preview: '~/p/zsh-customizer main ❯', // Simplified
    },
    { 
      id: 'clean',
      name: 'Clean',
      description: 'Simple and uncluttered look',
      preview: 'user@host:~>', // Simplified
    },
    { 
      id: 'dallas',
      name: 'Dallas',
      description: 'Minimal with git branch',
      preview: 'user@host:~/projects (main) $'
    },
    { 
      id: 'fino',
      name: 'Fino',
      description: 'Simple yet informative',
      preview: '~/p/zsh-customizer [main] ∴', // Reversed order, shorter path
    },
    { 
      id: 'gnzh',
      name: 'Gnzh',
      description: 'Fancy prompt with git info',
      preview: 'user@host ~/p/zsh-customizer (main) ❯', // Simplified
    }
  ];

  // Popular Oh My Zsh plugins with descriptions from the official repository
  const plugins = [
    { 
      id: 'git',
      name: 'Git',
      description: 'Provides many aliases and functions for Git workflow',
      commands: ['gst', 'ga', 'gcmsg', 'gp']
    },
    { 
      id: 'docker',
      name: 'Docker',
      description: 'Adds auto-completion and aliases for Docker commands',
      commands: ['dk', 'dkc', 'dki', 'dkps']
    },
    { 
      id: 'npm',
      name: 'NPM',
      description: 'Completion and aliases for npm commands',
      commands: ['npmg', 'npmO', 'npmL']
    },
    { 
      id: 'sudo',
      name: 'Sudo',
      description: 'Press ESC twice to add sudo to the current command',
      commands: ['ESC ESC']
    },
    { 
      id: 'z',
      name: 'Z',
      description: 'Jump to frequently visited directories',
      commands: ['z dirname']
    },
    { 
      id: 'history',
      name: 'History',
      description: 'Aliases for history command and searching',
      commands: ['h', 'hs', 'hsi']
    },
    { 
      id: 'extract',
      name: 'Extract',
      description: 'Extract any archive file with a single command',
      commands: ['x filename.tar.gz']
    },
    { 
      id: 'autojump',
      name: 'Autojump',
      description: 'Smart directory jumping using j command',
      commands: ['j dirname']
    },
    { 
      id: 'zsh-autosuggestions',
      name: 'Autosuggestions',
      description: 'Fish-like suggestions based on command history',
      commands: ['→ to accept'],
      installation: `git clone https://github.com/zsh-users/zsh-autosuggestions $\{ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
    },
    { 
      id: 'zsh-syntax-highlighting',
      name: 'Syntax Highlighting',
      description: 'Fish-like syntax highlighting for commands',
      commands: ['real-time highlighting'],
      installation: `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $\{ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`
    }
  ];

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
          <section className="animate-fadeIn">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Choose a Theme</h2>
              <p className="text-gray-600 dark:text-gray-300">Select from popular Oh My Zsh themes. Each theme provides a unique look for your terminal.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {themes.map((theme) => (
                <ThemeCard 
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                />
              ))}
            </div>
          </section>
        );
      case 'plugins':
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
                  onToggle={() => togglePlugin(plugin.id)}
                />
              ))}
            </div>
          </section>
        );
      case 'terminal':
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
                  onChange={setCustomPrompt}
                  onApply={generateConfig}
                />
              </div>
            </div>
          </section>
        );
      case 'config':
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
                onCopy={() => {
                  navigator.clipboard.writeText(zshConfig);
                  alert('Configuration copied to clipboard!');
                }}
              />
            </div>
          </section>
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