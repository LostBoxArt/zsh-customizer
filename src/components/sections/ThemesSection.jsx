import PropTypes from 'prop-types';
import ThemeCard from '../ThemeCard';
import { themes } from '../../data/themes'; // Import themes data

function ThemesSection({ selectedTheme, onThemeSelect }) {
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
            onClick={() => onThemeSelect(theme.id)}
          />
        ))}
      </div>
    </section>
  );
}

ThemesSection.propTypes = {
  selectedTheme: PropTypes.string.isRequired,
  onThemeSelect: PropTypes.func.isRequired,
};

export default ThemesSection;
