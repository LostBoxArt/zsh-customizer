// src/data/themes.js

// Popular Oh My Zsh themes from the official repository
export const themes = [
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
    // Corrected preview to match terminal simulation
    preview: 'user@host:~/p/zsh-customizer main ❯', 
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
