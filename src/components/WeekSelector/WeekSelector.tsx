import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import { formatWeekRange, weekLabel } from '../../utils/dates';
import type { Week } from '../../types';
import './WeekSelector.css';

type WeekSelectorProps = {
  weeks: Week[];
  selectedWeekId: string | null;
  onSelect: (weekId: string) => void;
};

export function WeekSelector({ weeks, selectedWeekId, onSelect }: WeekSelectorProps) {
  const { t } = usePreferences();

  return (
    <section className="week-selector">
      <div className="section-heading">{t(copy.weeks)}</div>
      <div className="week-selector__list">
        {weeks.map((week) => {
          const isSelected = selectedWeekId === week.id;

          return (
            <button
              key={week.id}
              className={`week-selector__item ${isSelected ? 'week-selector__item--selected' : ''}`}
              onClick={() => onSelect(week.id)}
              type="button"
            >
              <strong>{weekLabel(week)}</strong>
              <span>{formatWeekRange(week)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
