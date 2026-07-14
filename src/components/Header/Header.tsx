import { useEffect, useRef, useState } from 'react';
import { PreferencesControls } from '../PreferencesControls/PreferencesControls';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { AppSection, AuthUser } from '../../types';
import './Header.css';

type HeaderProps = {
  onRefresh: () => void;
  user?: AuthUser | null;
  onLogout?: () => void;
  section: AppSection;
  onSelect: (section: AppSection) => void;
};

const NAV_ITEMS: { key: AppSection; label: keyof typeof copy }[] = [
  { key: 'dashboard', label: 'title' },
  { key: 'projects', label: 'projects' },
  { key: 'project-data', label: 'projectData' }
];

export function Header({ onRefresh, user, onLogout, section, onSelect }: HeaderProps) {
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
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__brand-mark" aria-hidden="true">QA</span>
        <span className="topbar__brand-label">{t(copy.brandName)}</span>
      </div>

      <nav className="topbar__nav" aria-label="Main navigation">
        <div className="topbar__nav-list" role="tablist" aria-orientation="horizontal">
          {NAV_ITEMS.map((item) => {
            const isActive = section === item.key;

            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`topbar__nav-link ${isActive ? 'topbar__nav-link--active' : ''}`}
                onClick={() => onSelect(item.key)}
              >
                {t(copy[item.label])}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="topbar__actions">
        <PreferencesControls className="topbar__preferences" />
        {userLabel ? (
          <div className="topbar__menu" ref={menuRef}>
            <button
              className="topbar__menu-trigger"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <span className="topbar__user">{userLabel}</span>
              <span aria-hidden="true" className="topbar__caret">{menuOpen ? '▴' : '▾'}</span>
            </button>
            {menuOpen ? (
              <div className="topbar__dropdown" role="menu" aria-label="User actions">
                <button
                  className="topbar__dropdown-item"
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
                    className="topbar__dropdown-item"
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
          <button className="topbar__menu-trigger" onClick={onRefresh} type="button">
            {t(copy.refresh)}
          </button>
        )}
      </div>
    </header>
  );
}
