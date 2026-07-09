import { usePreferences } from '../../hooks/usePreferences';
import { copy } from '../../utils/copy';
import './PreferencesControls.css';

export function PreferencesControls() {
  const { language, setLanguage, theme, toggleTheme, t } = usePreferences();

  return (
    <div className="preferences-controls">
      <button
        type="button"
        className="preferences-controls__button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Dark mode' : 'Light mode'}
        title={theme === 'dark' ? 'Dark mode' : 'Light mode'}
      >
        {theme === 'dark' ? '🌙' : '☀'}
      </button>
      <button
        type="button"
        className="preferences-controls__button"
        onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
        aria-label={t(copy.languageLabel)}
        title={language === 'pt' ? 'Português' : 'English'}
      >
        {language === 'pt' ? '🇧🇷' : '🇺🇸'}
      </button>
    </div>
  );
}
