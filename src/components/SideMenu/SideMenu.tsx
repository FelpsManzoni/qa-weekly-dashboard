import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { AppSection } from '../../types';
import './SideMenu.css';

type SideMenuProps = {
  section: AppSection;
  onSelect: (section: AppSection) => void;
  collapsed: boolean;
  onToggle: () => void;
};

const ITEMS: { key: AppSection; label: keyof typeof copy }[] = [
  { key: 'dashboard', label: 'title' },
  { key: 'projects', label: 'projects' },
  { key: 'project-data', label: 'projectData' }
];

export function SideMenu({ section, onSelect, collapsed, onToggle }: SideMenuProps) {
  const { t } = usePreferences();

  return (
    <nav className={`side-menu ${collapsed ? 'side-menu--collapsed' : ''}`} aria-label="Main navigation">
      <button
        type="button"
        className="side-menu__toggle"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Show menu' : 'Hide menu'}
      >
        {collapsed ? '☰' : '✕'}
      </button>
      {!collapsed ? (
        <ul className="side-menu__list">
          {ITEMS.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={`side-menu__item ${section === item.key ? 'side-menu__item--active' : ''}`}
                onClick={() => onSelect(item.key)}
                aria-current={section === item.key ? 'page' : undefined}
              >
                {t(copy[item.label])}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
