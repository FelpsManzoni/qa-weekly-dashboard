import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { AuthUser } from '../../types';
import './Header.css';

type HeaderProps = {
  onRefresh: () => void;
  user?: AuthUser | null;
  onLogout?: () => void;
};

export function Header({ onRefresh, user, onLogout }: HeaderProps) {
  const { t } = usePreferences();

  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-header__eyebrow">WEEKLY REPORT</p>
        <h1>{t(copy.title)}</h1>
        <p>{t(copy.subtitle)}</p>
      </div>
      <div className="dashboard-header__actions">
        {user ? <span className="dashboard-header__user">{user.display_name || user.username}</span> : null}
        <button className="dashboard-header__refresh" onClick={onRefresh} type="button">
          {t(copy.refresh)}
        </button>
        {onLogout ? (
          <button className="dashboard-header__refresh" onClick={onLogout} type="button">
            {t(copy.logout)}
          </button>
        ) : null}
      </div>
    </header>
  );
}
