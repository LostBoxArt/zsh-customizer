import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/theme-hook';

// --- Theme Color Definitions ---
const baseColors = (darkMode) => ({
  background: darkMode ? '#1e1e2e' : '#ffffff', // Base
  foreground: darkMode ? '#cad3f5' : '#4c4f69', // Text
  cursor: darkMode ? '#f5e0dc' : '#dc8a78',     // Cursor
  selectionBackground: darkMode ? 'rgba(91, 96, 120, 0.5)' : 'rgba(172, 176, 190, 0.5)', // Selection
  black: darkMode ? '#5b6078' : '#5c5f77',       // Black (Surface1)
  red: darkMode ? '#ed8796' : '#d20f39',         // Red
  green: darkMode ? '#a6da95' : '#40a02b',       // Green
  yellow: darkMode ? '#eed49f' : '#df8e1d',      // Yellow
  blue: darkMode ? '#8aadf4' : '#1e66f5',        // Blue
  magenta: darkMode ? '#f5bde6' : '#ea76cb',     // Magenta
  cyan: darkMode ? '#8bd5ca' : '#179299',        // Cyan
  white: darkMode ? '#a5adce' : '#bcc0cc',       // White (Subtext1 - light gray)
  brightBlack: darkMode ? '#6e738d' : '#6c6f85', // Bright Black (Surface2 - dark gray)
  brightRed: darkMode ? '#ed8796' : '#d20f39',
  brightGreen: darkMode ? '#a6da95' : '#40a02b',
  brightYellow: darkMode ? '#eed49f' : '#df8e1d',
  brightBlue: darkMode ? '#8aadf4' : '#1e66f5',
  brightMagenta: darkMode ? '#f5bde6' : '#ea76cb',
  brightCyan: darkMode ? '#8bd5ca' : '#179299',
  brightWhite: darkMode ? '#cad3f5' : '#4c4f69', // Bright White (Text) - Default text color
});

// Define specific palettes for each theme based on image samples
// Focus on background, foreground, and colors used in renderPrompt
const themePalettes = {
  'default': baseColors, // Use base for the explicit 'default' if ever selected
  'agnoster': (darkMode) => ({
    ...baseColors(darkMode),
    background: darkMode ? '#2d2d2d' : '#f0f0f0',
    foreground: darkMode ? '#e0e0e0' : '#333333',
    blue: darkMode ? '#589df6' : '#005fff',       // User/Host BG (ANSI blue)
    black: darkMode ? '#444444' : '#bbbbbb',       // Path BG (gray) - Mapped to brightBlack ANSI bg
    green: darkMode ? '#9ece6a' : '#40a02b',       // Git BG / Path FG (ANSI green)
    white: darkMode ? '#ffffff' : '#000000',       // Text on user/host BG (ANSI white)
    brightBlack: darkMode ? '#000000' : '#ffffff', // Text on git BG (ANSI black in dark mode)
    // Ensure brightWhite is defined for path text on gray bg
    brightWhite: darkMode ? '#e0e0e0' : '#333333', // Use foreground for brightWhite if needed
  }),
  'robbyrussell': (darkMode) => { // Default OMZ theme
    const base = baseColors(darkMode);
    return {
      ...base,
      // Explicitly define colors used in its prompt
      green: darkMode ? '#a6da95' : '#40a02b', // Arrow color (ANSI Green)
      cyan: darkMode ? '#89b4fa' : '#1e66f5',  // Path color (ANSI Cyan for blueish)
      red: darkMode ? '#f38ba8' : '#d20f39',   // Git color (ANSI Red)
    };
  },
  'avit': (darkMode) => {
    const base = baseColors(darkMode);
    return {
      ...base,
      // Colors used in prompt
      green: darkMode ? '#a6e3a1' : '#40a02b', // User@host (ANSI Green)
      blue: darkMode ? '#89b4fa' : '#1e66f5',  // Path (ANSI Blue)
      cyan: darkMode ? '#94e2d5' : '#179299',  // Git (ANSI Cyan)
    };
  },
  'bira': (darkMode) => {
     const base = baseColors(darkMode);
    return {
      ...base,
      // Colors used in prompt
      yellow: darkMode ? '#f9e2af' : '#df8e1d', // Path (ANSI Yellow)
    };
  },
  'bureau': (darkMode) => {
    const base = baseColors(darkMode);
    return {
      ...base,
       // Colors used in prompt
      cyan: darkMode ? '#94e2d5' : '#179299', // Git (ANSI Cyan)
    };
  },
  'candy': (darkMode) => {
     const base = baseColors(darkMode);
    return {
      ...base,
       // Colors used in prompt
      blue: darkMode ? '#89b4fa' : '#1e66f5', // Path (ANSI Blue)
    };
  },
  'clean': (darkMode) => {
    // Uses default colors entirely for the prompt
    return baseColors(darkMode);
  },
  'dallas': (darkMode) => {
    const base = baseColors(darkMode);
    return {
      ...base,
       // Colors used in prompt
      cyan: darkMode ? '#94e2d5' : '#179299', // Git (ANSI Cyan)
    };
  },
  'fino': (darkMode) => {
     const base = baseColors(darkMode);
    return {
      ...base,
       // Colors used in prompt
      blue: darkMode ? '#89b4fa' : '#1e66f5', // Path (ANSI Blue)
    };
  },
  'gnzh': (darkMode) => {
    const base = baseColors(darkMode);
    return {
      ...base,
       // Colors used in prompt
      cyan: darkMode ? '#94e2d5' : '#179299', // Git (ANSI Cyan)
    };
  },
};

const getThemeOptions = (themeName, darkMode) => {
  // Fallback to robbyrussell's palette if the specific theme isn't defined
  // This ensures the default prompt rendering uses robbyrussell colors
  const getter = themePalettes[themeName] || themePalettes['robbyrussell'];
  return getter(darkMode);
};

// --- Prompt Simulation ---
// Replicates prompts based *exactly* on the second screenshot provided
const renderPrompt = (themeName, darkMode) => {
  const user = 'user';
  const host = 'host';
  const path = '~';
  const gitBranch = 'main';
  const gitSymbol = '\uE0A0'; // nf-dev-git_branch
  const powerlineArrow = '\uE0B0'; // nf-ple-right_arrow
  const simpleArrow = '❯';

  // ANSI codes
  const reset = '\x1b[0m'; const bold = '\x1b[1m';
  // FG Basic
  const fgBlack = '\x1b[30m'; const fgRed = '\x1b[31m'; const fgGreen = '\x1b[32m';
  const fgYellow = '\x1b[33m'; const fgBlue = '\x1b[34m'; const fgMagenta = '\x1b[35m';
  const fgCyan = '\x1b[36m'; const fgWhite = '\x1b[37m';
  // FG Bright
  const fgBrightBlack = '\x1b[90m'; const fgBrightWhite = '\x1b[97m';
  // BG Basic
  const bgBlack = '\x1b[40m'; const bgGreen = '\x1b[42m';
  const bgBlue = '\x1b[44m';
  const bgWhite = '\x1b[47m';
  // BG Bright
  const bgBrightBlack = '\x1b[100m'; // Used for Agnoster gray background

  // Get the theme options primarily for background color determination
  const themeOpts = getThemeOptions(themeName, darkMode);
  const defaultFg = darkMode ? fgBrightWhite : fgBlack;
  // Determine terminal background ANSI code for ending powerline arrows
  const termBgHex = themeOpts.background;
  let termBgCode = bgBlack; // Default dark
  if (termBgHex === '#ffffff' || termBgHex === '#f0f0f0') { termBgCode = bgWhite; }
  else if (termBgHex === '#2d2d2d') { termBgCode = bgBlack; }


  // Render prompts using direct ANSI codes based on images
  switch (themeName) {
    case 'agnoster': {
      // Image: [user@host](blue_bg/white_fg) > [~/p/zsh-customizer](gray_bg/white_fg) > [git:(main)](green_bg/black_fg) >
      const agnosterPath = '~/p/zsh-customizer';
      // Use direct ANSI codes
      const userHostSegment = `${bgBlue}${fgWhite}${bold} ${user}@${host} ${reset}`;
      const pathSegment = `${bgBrightBlack}${fgBrightWhite}${bold} ${agnosterPath} ${reset}`; // bgBrightBlack for gray
      const gitSegment = `${bgGreen}${fgBlack}${bold} git:(main) ${reset}`; // black fg on green bg

      // Corrected Arrows: FG=Prev_BG, BG=Next_BG
      const arrow1 = `${fgBlue}${bgBrightBlack}${powerlineArrow}${reset}`; // FG=Blue (Prev BG), BG=Gray (Next BG)
      const arrow2 = `${fgBrightBlack}${bgGreen}${powerlineArrow}${reset}`; // FG=Gray (Prev BG), BG=Green (Next BG)
      const arrow3 = `${fgGreen}${termBgCode}${powerlineArrow}${reset}`;   // FG=Green (Prev BG), BG=Terminal BG

      return `${userHostSegment}${arrow1}${pathSegment}${arrow2}${gitSegment}${arrow3} `;
    }
    case 'robbyrussell': {
      // Image: ➜ ~ git:(main)  (Green arrow, blue path, red git)
      const startArrow = `${fgGreen}${bold}➜${reset} `;
      const pathSegment = `${fgCyan}${bold}${path}${reset}`; // Use fgCyan for blueish path
      const gitSegment = ` ${fgRed}git:(${gitBranch})${reset}`;
      return `${startArrow}${pathSegment}${gitSegment} `;
    }
    case 'avit': {
      // Image: user@host:~/p/zsh-customizer main ❯ (Green user@host, blue path, cyan git, default arrow)
      const avitPath = '~/p/zsh-customizer';
      const avitGitBranch = 'main';
      const avitUserHost = `${fgGreen}${user}@${host}${reset}`;
      const pathSegment = `${fgBlue}${avitPath}${reset}`;
      const gitSegment = ` ${fgCyan}${avitGitBranch}${reset}`;
      const avitArrow = ` ${defaultFg}${simpleArrow}${reset}`;
      return `${avitUserHost}:${pathSegment}${gitSegment}${avitArrow} `;
    }
    case 'bira': {
       // Image: user@host:~/projects\n➜ (Default user@host, yellow path, default arrow on newline)
       const biraPath = '~/projects';
      const biraUserHost = `${defaultFg}${user}@${host}${reset}`;
      const pathSegment = `${fgYellow}${biraPath}${reset}`;
      const biraArrow = `${defaultFg}➜${reset}`;
      return `${biraUserHost}:${pathSegment}\r\n${biraArrow} `;
    }
     case 'bureau': {
      // Image: user@host ~/p/zsh-customizer [main] ❯ (Default user/host/path/arrow, cyan git)
      const bureauPath = '~/p/zsh-customizer';
      const bureauGitBranch = 'main';
      const userHostPath = `${defaultFg}${user}@${host} ${bureauPath}${reset}`;
      const gitSegment = ` ${fgCyan}[${bureauGitBranch}]${reset}`; // Cyan git
      const arrowSegment = ` ${defaultFg}${simpleArrow}${reset}`;
      return `${userHostPath}${gitSegment}${arrowSegment} `;
    }
    case 'candy': {
       // Image: ~/p/zsh-customizer main ❯ (Blue path, default git/arrow)
       const candyPath = '~/p/zsh-customizer';
       const candyGitBranch = 'main';
       const pathSegment = `${fgBlue}${candyPath}${reset}`; // Blue path
       const gitSegment = ` ${defaultFg}${candyGitBranch}${reset}`;
       const arrowSegment = ` ${defaultFg}${simpleArrow}${reset}`;
       return `${pathSegment}${gitSegment}${arrowSegment} `;
    }
     case 'clean': {
      // Image: user@host:~> (Default user/host/path/arrow)
      const cleanPath = '~';
      const userHostPath = `${defaultFg}${user}@${host}:${cleanPath}${reset}`;
      const arrowSegment = `${defaultFg}>${reset}`;
      return `${userHostPath}${arrowSegment} `;
    }
    case 'dallas': {
      // Image: user@host:~/projects (main) $ (Default user/host/path/symbol, cyan git)
      const dallasPath = '~/projects';
      const dallasGitBranch = 'main';
      const userHostPath = `${defaultFg}${user}@${host}:${dallasPath}${reset}`;
      const gitSegment = ` ${fgCyan}(${dallasGitBranch})${reset}`; // Cyan git
      const symbolSegment = ` ${defaultFg}$${reset}`;
      return `${userHostPath}${gitSegment}${symbolSegment} `;
    }
    case 'fino': {
      // Image: ~/p/zsh-customizer [main] :: (Blue path, default git/symbol)
      const finoPath = '~/p/zsh-customizer';
      const finoGitBranch = 'main';
      const pathSegment = `${fgBlue}${finoPath}${reset}`; // Blue path
      const gitSegment = ` ${defaultFg}[${finoGitBranch}]${reset}`;
      const symbolSegment = ` ${defaultFg}::${reset}`;
      return `${pathSegment}${gitSegment}${symbolSegment} `;
    }
    case 'gnzh': {
      // Image: user@host ~/p/zsh-customizer (main) ❯ (Default user/host/path/arrow, cyan git)
      const gnzhPath = '~/p/zsh-customizer';
      const gnzhGitBranch = 'main';
      const userHostPath = `${defaultFg}${user}@${host} ${gnzhPath}${reset}`;
      const gnzhGitSegment = ` ${fgCyan}(${gnzhGitBranch})${reset}`; // Cyan git
      const gnzhArrowSegment = ` ${defaultFg}${simpleArrow}${reset}`;
      return `${userHostPath}${gnzhGitSegment}${gnzhArrowSegment} `;
    }
    default: { // Fallback for any other theme or 'default' - Use explicit robbyrussell style
      const startArrow = `${fgGreen}${bold}➜${reset} `;
      const pathSegment = `${fgCyan}${bold}${path}${reset}`;
      const gitSegment = ` ${fgRed}git:(${gitBranch})${reset}`;
      return `${startArrow}${pathSegment}${gitSegment} `;
    }
  }
};
// --- End Prompt Simulation ---


function TerminalPreview({ selectedTheme, selectedPlugins }) {
  const terminalRef = useRef(null);
  const terminalInstanceRef = useRef(null);
  const fitAddonRef = useRef(null);
  const isMountedRef = useRef(false); // Ref to track mount status
  const hasWrittenInitialContentRef = useRef(false); // Ref to track initial write
  const { darkMode } = useTheme();
  const [error, setError] = useState(null);

  // Effect for Initialization and Cleanup ONLY
  useEffect(() => {
    isMountedRef.current = true;
    console.log(">>> TerminalPreview: Mount/Init Effect Running <<<");
    let term;
    let fitAddon;
    let handleResize;

    if (terminalRef.current && !terminalInstanceRef.current) {
      console.log(">>> TerminalPreview: Creating instance <<<");
      try {
        fitAddon = new FitAddon();
        fitAddonRef.current = fitAddon;

        term = new Terminal({ /* ... options ... */
          cursorBlink: true,
          rows: 15,
          fontFamily: '"JetBrainsMono Nerd Font", "JetBrains Mono", "Fira Code", "Menlo", monospace',
          fontSize: 14,
          letterSpacing: 0,
          lineHeight: 1.2,
          allowTransparency: true,
          scrollback: 100,
          windowsMode: false,
        });

        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        // Do not fit or write here

        terminalInstanceRef.current = term; // Store instance

        handleResize = () => fitAddonRef.current?.fit();
        window.addEventListener('resize', handleResize);

      } catch (err) {
        setError(`Terminal initialization error: ${err.message}`);
        console.error('Terminal init error:', err);
        terminalInstanceRef.current = null;
        fitAddonRef.current = null;
      }
    }

    // Cleanup function for unmount
    return () => {
      console.log(">>> TerminalPreview: Cleanup on unmount <<<");
      isMountedRef.current = false; // Mark as unmounted
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
      }
      if (terminalInstanceRef.current) {
          terminalInstanceRef.current.dispose();
      }
      terminalInstanceRef.current = null;
      fitAddonRef.current = null;
      hasWrittenInitialContentRef.current = false; // Reset initial write flag on unmount
    };
  }, []); // Empty array: Run only on mount and unmount

  // Effect for Updates (Theme, Plugins, DarkMode, Content Writing)
  useEffect(() => {
    // Only run if the instance exists AND the component is mounted
    if (terminalInstanceRef.current && isMountedRef.current) {
      console.log(`>>> TerminalPreview: Update Effect Running - Theme=${selectedTheme}, InitialWriteDone=${hasWrittenInitialContentRef.current} <<<`);
      try {
        const term = terminalInstanceRef.current; // Get instance from ref

        // 1. Update Theme (Always update theme)
        term.options.theme = getThemeOptions(selectedTheme, darkMode);

        // 2. Write Content (Clear only if it's NOT the initial write)
        if (hasWrittenInitialContentRef.current) {
            console.log(">>> Clearing terminal for update write <<<");
            term.clear(); // Clear for subsequent updates
        } else {
            console.log(">>> Performing initial write <<<");
        }

        term.write('$ Welcome to Zsh Customizer!\r\n');
        term.write(`$ Theme: ${selectedTheme}\r\n`);
        term.write(`$ Plugins: ${selectedPlugins.length > 0 ? selectedPlugins.join(', ') : '(none)'}\r\n`);
        term.write('$ \r\n');

        // 3. Render Prompt
        const promptString = renderPrompt(selectedTheme, darkMode);
        term.write(promptString);

        // 4. Mark initial write as done (if it wasn't already)
        if (!hasWrittenInitialContentRef.current) {
            hasWrittenInitialContentRef.current = true;
        }

        // 5. Fit after update/initial write
        setTimeout(() => {
            if (fitAddonRef.current) {
                 fitAddonRef.current.fit();
            }
        }, 0);

      } catch (err) {
         setError(`Terminal update error: ${err.message}`);
         console.error('Terminal update error:', err);
      }
    } else {
        console.log(`>>> TerminalPreview: Skipping update (instance not ready or unmounted) <<<`);
    }
  }, [selectedTheme, selectedPlugins, darkMode]); // Dependencies for update

  return (
    <div className="terminal-container backdrop-blur-lg bg-gray-900/95 dark:bg-gray-900/95 p-3 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-800/50 transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.25)] ring-1 ring-gray-800/25">
      <div className="terminal-header bg-gray-800/95 dark:bg-gray-800/95 px-4 py-3 flex items-center justify-between rounded-xl border-b border-gray-700/50 mb-2">
        <div className="flex space-x-2.5">
          {/* Traffic lights */}
          <div className="w-3.5 h-3.5 rounded-full bg-red-500/95 hover:bg-red-500 transition-colors duration-200 cursor-pointer shadow-inner ring-1 ring-red-900/20"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/95 hover:bg-yellow-500 transition-colors duration-200 cursor-pointer shadow-inner ring-1 ring-yellow-900/20"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-green-500/95 hover:bg-green-500 transition-colors duration-200 cursor-pointer shadow-inner ring-1 ring-green-900/20"></div>
        </div>
        <div className="text-gray-200 text-sm flex items-center space-x-4">
          {/* Info display */}
          <span className="flex items-center font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5 animate-pulse shadow-emerald-500/50"></span>Theme: {selectedTheme}</span>
          <span className="px-3.5 py-1.5 bg-gray-700/60 rounded-full text-xs font-semibold border border-gray-600/40 hover:bg-gray-700/80 transition-colors duration-200 shadow-sm">{selectedPlugins.length} plugins</span>
        </div>
      </div>
      {error ? (
        <div className="text-red-400 text-sm p-4 bg-red-950/20 rounded-lg border border-red-900/30 mb-2">{error}</div>
      ) : null}
      {/* Terminal container */}
      <div ref={terminalRef} className="w-full h-[300px] p-4 bg-opacity-98 rounded-lg"></div>
    </div>
  );
}

TerminalPreview.propTypes = {
  selectedTheme: PropTypes.string.isRequired,
  selectedPlugins: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default TerminalPreview;
