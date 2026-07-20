import { usePreferences } from '../../hooks/usePreferences';
import { copy } from '../../utils/copy';
import './PreferencesControls.css';

type PreferencesControlsProps = {
  className?: string;
};

export function PreferencesControls({ className }: PreferencesControlsProps) {
  const { language, setLanguage, theme, toggleTheme, t } = usePreferences();
  const classes = ['preferences-controls', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <button
        type="button"
        className="preferences-controls__button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t(copy.themeDark) : t(copy.themeLight)}
        title={theme === 'dark' ? t(copy.themeDark) : t(copy.themeLight)}
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
