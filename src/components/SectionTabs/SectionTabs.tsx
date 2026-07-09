import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { AppSection } from '../../types';
import './SectionTabs.css';

type SectionTabsProps = {
  section: AppSection;
  onSelect: (section: AppSection) => void;
};

const ITEMS: { key: AppSection; label: keyof typeof copy }[] = [
  { key: 'dashboard', label: 'title' },
  { key: 'projects', label: 'projects' },
  { key: 'project-data', label: 'projectData' }
];

export function SectionTabs({ section, onSelect }: SectionTabsProps) {
  const { t } = usePreferences();

  return (
    <nav className="section-tabs" aria-label="Main navigation">
      <div className="section-tabs__list" role="tablist" aria-orientation="horizontal">
        {ITEMS.map((item) => {
          const isActive = section === item.key;

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`section-tabs__tab ${isActive ? 'section-tabs__tab--active' : ''}`}
              onClick={() => onSelect(item.key)}
            >
              {t(copy[item.label])}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
