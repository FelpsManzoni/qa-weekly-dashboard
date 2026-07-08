import { bilingualText, copy } from '../../utils/copy';
import type { AuthUser } from '../../types';
import './Header.css';

type HeaderProps = {
  onRefresh: () => void;
  user?: AuthUser | null;
  onLogout?: () => void;
};

export function Header({ onRefresh, user, onLogout }: HeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-header__eyebrow">WEEKLY REPORT</p>
        <h1>{bilingualText(copy.title)}</h1>
        <p>{bilingualText(copy.subtitle)}</p>
      </div>
      <div className="dashboard-header__actions">
        {user ? <span className="dashboard-header__user">{user.display_name || user.username}</span> : null}
        <button className="dashboard-header__refresh" onClick={onRefresh} type="button">
          {bilingualText(copy.refresh)}
        </button>
        {onLogout ? (
          <button className="dashboard-header__refresh" onClick={onLogout} type="button">
            {bilingualText(copy.logout)}
          </button>
        ) : null}
      </div>
    </header>
  );
}
