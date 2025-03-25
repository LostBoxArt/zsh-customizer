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
  brightWhite: darkMode ? '#cad3f5' : '#4c4f69', // Bright White (Text)
});

const themePalettes = {
  'default': baseColors,
  'agnoster': (darkMode) => ({
    ...baseColors(darkMode),
    background: darkMode ? '#2d2d2d' : '#f0f0f0',
    foreground: darkMode ? '#e0e0e0' : '#333333',
    blue: darkMode ? '#589df6' : '#005fff',       // User/Host BG
    black: darkMode ? '#444444' : '#bbbbbb',       // Path BG (gray)
    green: darkMode ? '#9ece6a' : '#40a02b',       // Git BG / Path FG
    white: darkMode ? '#ffffff' : '#000000',       // Text on user/host BG
    brightBlack: darkMode ? '#000000' : '#ffffff', // Text on git BG
  }),
  'robbyrussell': (darkMode) => ({
    ...baseColors(darkMode),
    cyan: darkMode ? '#89b4fa' : '#1e66f5', // Path color (blueish)
    red: darkMode ? '#f38ba8' : '#d20f39',  // Arrow/Git color (reddish)
  }),
  'avit': (darkMode) => ({
    ...baseColors(darkMode),
    green: darkMode ? '#a6e3a1' : '#40a02b', // User@host
    blue: darkMode ? '#89b4fa' : '#1e66f5',  // Path
    cyan: darkMode ? '#94e2d5' : '#179299',  // Git
  }),
  'bira': (darkMode) => ({
    ...baseColors(darkMode),
    yellow: darkMode ? '#f9e2af' : '#df8e1d', // Path
  }),
};

const getThemeOptions = (themeName, darkMode) => {
  const paletteGetter = themePalettes[themeName] || themePalettes['default'];
  return paletteGetter(darkMode);
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
  const bgBlack = '\x1b[40m'; const bgRed = '\x1b[41m'; const bgGreen = '\x1b[42m';
  const bgYellow = '\x1b[43m'; const bgBlue = '\x1b[44m'; const bgMagenta = '\x1b[45m';
  const bgCyan = '\x1b[46m'; const bgWhite = '\x1b[47m';
  // BG Bright
  const bgBrightBlack = '\x1b[100m'; const bgBrightWhite = '\x1b[107m';

  const themeOpts = getThemeOptions(themeName, darkMode);
  const defaultFg = darkMode ? fgBrightWhite : fgBlack;
  // Determine terminal background ANSI code for ending powerline arrows
  const termBgHex = themeOpts.background;
  let termBgCode = bgBlack; // Default dark
  if (termBgHex === '#ffffff' || termBgHex === '#f0f0f0') { termBgCode = bgWhite; }
  else if (termBgHex === '#2d2d2d') { termBgCode = bgBlack; }

  // Helper to get ANSI code - simplified for known palette colors
  const getFgCode = (hex) => {
      if (!hex) return defaultFg;
      if (hex === themeOpts.foreground) return defaultFg;
      if (hex === themeOpts.red) return fgRed; if (hex === themeOpts.green) return fgGreen;
      if (hex === themeOpts.yellow) return fgYellow; if (hex === themeOpts.blue) return fgBlue;
      if (hex === themeOpts.magenta) return fgMagenta; if (hex === themeOpts.cyan) return fgCyan;
      if (hex === themeOpts.white) return fgWhite; if (hex === themeOpts.black) return fgBlack;
      if (hex === themeOpts.brightBlack) return fgBrightBlack; if (hex === themeOpts.brightWhite) return fgBrightWhite;
      const base = baseColors(darkMode);
      if (hex === base.red) return fgRed; if (hex === base.green) return fgGreen;
      if (hex === base.yellow) return fgYellow; if (hex === base.blue) return fgBlue;
      if (hex === base.magenta) return fgMagenta; if (hex === base.cyan) return fgCyan;
      return defaultFg;
  };
   const getBgCode = (hex) => {
      if (!hex) return termBgCode;
      if (hex === themeOpts.background) return termBgCode;
      if (hex === themeOpts.blue) return bgBlue;
      if (hex === themeOpts.black) return darkMode ? bgBrightBlack : bgWhite; // Gray BG for agnoster path
      if (hex === themeOpts.green) return bgGreen;
      return termBgCode;
  };

  switch (themeName) {
    case 'agnoster':
      // Screenshot: [ user@host ](blue_bg/white_fg) > [ ~ ](gray_bg/white_fg) > [ git:(main) ](green_bg/black_fg) >
      const userBg = getBgCode(themeOpts.blue);
      const pathBg = getBgCode(themeOpts.black); // Gray BG
      const gitBg = getBgCode(themeOpts.green);
      const userFg = getFgCode(themeOpts.white); // White text on blue
      const pathFg = getFgCode(themeOpts.brightWhite); // White text on gray
      const gitFg = getFgCode(themeOpts.brightBlack); // Black text on green

      const userHostSegment = `${userBg}${userFg}${bold} ${user}@${host} ${reset}`;
      const pathSegment = `${pathBg}${pathFg}${bold} ${path} ${reset}`;
      const gitSegment = `${gitBg}${gitFg}${bold} ${gitSymbol} ${gitBranch} ${reset}`;

      const arrow1 = `${userBg}${pathBg === bgBrightBlack ? fgBrightBlack : fgWhite}${powerlineArrow}${reset}`;
      const arrow2 = `${pathBg}${gitBg === bgGreen ? fgGreen : fgBlack}${powerlineArrow}${reset}`;
      // Arrow into default background: fg is the last segment's bg color
      const arrow3Fg = getFgCode(termBgHex === themeOpts.background ? themeOpts.foreground : (darkMode ? themeOpts.black : themeOpts.white));
      const arrow3 = `${gitBg}${arrow3Fg}${powerlineArrow}${reset}`;

      return `${userHostSegment}${arrow1}${pathSegment}${arrow2}${gitSegment}${arrow3} `;

    case 'robbyrussell':
      // Screenshot: [~](blueish,bold) [git:(main)](reddish) ❯(reddish,bold)
      const robbyPathFg = getFgCode(themeOpts.cyan); // Use the specific cyan/blue
      const robbyGitFg = getFgCode(themeOpts.red);   // Use the specific red/pink
      const robbyPath = `${robbyPathFg}${bold}${path}${reset}`;
      // Simulating the git part structure from screenshot
      const robbyGit = ` ${robbyGitFg}${gitSymbol} git:(${gitBranch})${reset}`; // Added space before git
      const robbyArrow = ` ${robbyGitFg}${bold}${simpleArrow}${reset}`; // Added space before arrow
      return `${robbyPath}${robbyGit}${robbyArrow} `;

    case 'avit':
      // Screenshot: [user@host](green):[~](blue) [git:(main)](cyan) >(default)
      const avitUserHostFg = getFgCode(themeOpts.green);
      const avitPathFg = getFgCode(themeOpts.blue);
      const avitGitFg = getFgCode(themeOpts.cyan);
      const avitUserHost = `${avitUserHostFg}${user}@${host}${reset}`;
      const avitPath = `${avitPathFg}${path}${reset}`;
      const avitGit = ` ${avitGitFg}${gitSymbol} git:(${gitBranch})${reset}`; // Added space
      const avitArrow = ` ${defaultFg}>${reset}`; // Added space
      return `${avitUserHost}:${avitPath}${avitGit}${avitArrow} `;

    case 'bira':
       // Screenshot: user@host:[~](yellow)$(default)
      const biraUserHostFg = defaultFg;
      const biraPathFg = getFgCode(themeOpts.yellow);
      const biraUserHost = `${biraUserHostFg}${user}@${host}${reset}`;
      const biraPath = `${biraPathFg}${path}${reset}`;
      return `${biraUserHost}:${biraPath}$ ${reset}`;

    default:
      return `${defaultFg}${user}@${host}:${path}$ ${reset}`;
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