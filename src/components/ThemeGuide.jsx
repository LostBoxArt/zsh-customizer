import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/theme-hook'; // Updated import path

function ThemeGuide({ onClose }) {
  const { darkMode, toggleDarkMode, completeThemeGuide } = useTheme();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Theme Settings',
      content: 'Let\'s set up your preferred theme mode for the best experience. This will affect how the application looks and how your terminal preview appears.',
      action: null
    },
    {
      title: 'Choose Your Preferred Mode',
      content: 'Select between light and dark mode. You can always change this later using the toggle in the top navigation bar.',
      action: (
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => {
              if (darkMode) toggleDarkMode();
              setStep(step + 1);
            }}
            className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg shadow hover:bg-gray-100 transition-colors"
          >
            Light Mode
          </button>
          <button
            onClick={() => {
              if (!darkMode) toggleDarkMode();
              setStep(step + 1);
            }}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
          >
            Dark Mode
          </button>
        </div>
      )
    },
    {
      title: 'Understanding Theme Preview',
      content: 'The terminal preview will update based on your selected mode. This helps you see how your Zsh theme will look in your actual terminal.',
      action: null
    }
  ];

  const handleComplete = () => {
    completeThemeGuide();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {steps[step].title}
            </h2>
            <button
              onClick={handleComplete}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">
            {steps[step].content}
          </p>

          {steps[step].action && (
            <div className="mt-6">
              {steps[step].action}
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === step
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ThemeGuide.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default ThemeGuide;