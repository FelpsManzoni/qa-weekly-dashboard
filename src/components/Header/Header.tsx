import { useEffect, useRef, useState } from 'react';
import { PreferencesControls } from '../PreferencesControls/PreferencesControls';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const userLabel = user?.display_name || user?.username;

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__content">
        <p className="dashboard-header__eyebrow">WEEKLY REPORT</p>
        <h1>{t(copy.title)}</h1>
        <p>{t(copy.subtitle)}</p>
      </div>
      <div className="dashboard-header__actions">
        <PreferencesControls className="dashboard-header__preferences" />
        {userLabel ? (
          <div className="dashboard-header__menu" ref={menuRef}>
            <button
              className="dashboard-header__menu-trigger"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <span className="dashboard-header__user">{userLabel}</span>
              <span aria-hidden="true" className="dashboard-header__caret">{menuOpen ? '▴' : '▾'}</span>
            </button>
            {menuOpen ? (
              <div className="dashboard-header__dropdown" role="menu" aria-label="User actions">
                <button
                  className="dashboard-header__dropdown-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onRefresh();
                  }}
                  type="button"
                  role="menuitem"
                >
                  {t(copy.refresh)}
                </button>
                {onLogout ? (
                  <button
                    className="dashboard-header__dropdown-item"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    type="button"
                    role="menuitem"
                  >
                    {t(copy.logout)}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <button className="dashboard-header__menu-trigger" onClick={onRefresh} type="button">
            {t(copy.refresh)}
          </button>
        )}
      </div>
    </header>
  );
}
