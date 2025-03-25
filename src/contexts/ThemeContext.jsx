import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from './theme-hook'; // Import context from hook file

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showThemeGuide, setShowThemeGuide] = useState(() => {
    const guided = localStorage.getItem('themeGuided');
    return !guided;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const completeThemeGuide = () => {
    setShowThemeGuide(false);
    localStorage.setItem('themeGuided', 'true');
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleDarkMode,
      showThemeGuide,
      completeThemeGuide
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};