// src/data/plugins.js

// Popular Oh My Zsh plugins with descriptions from the official repository
export const plugins = [
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
