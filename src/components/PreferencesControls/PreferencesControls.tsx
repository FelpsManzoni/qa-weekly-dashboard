import { usePreferences } from '../../hooks/usePreferences';
import './PreferencesControls.css';

export function PreferencesControls() {
  const { language, setLanguage, theme, toggleTheme } = usePreferences();

  return (
    <div className="preferences-controls">
      <button
        type="button"
        className="preferences-controls__button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? '☀' : '🌙'}
      </button>
      <button
        type="button"
        className="preferences-controls__button"
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        aria-label={language === 'pt' ? 'Switch to English' : 'Mudar para Portugues'}
        title={language === 'pt' ? 'Switch to English' : 'Mudar para Portugues'}
      >
        {language === 'pt' ? 'EN' : 'PT'}
      </button>
    </div>
  );
}
