import { EmptyState } from '../EmptyState/EmptyState';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { PriorityNote } from '../../types';
import './NotesSection.css';

type NotesSectionProps = {
  notes: PriorityNote[];
};

const PRIORITY_BLOCK = ['notes-section__block--p0', 'notes-section__block--p1', 'notes-section__block--p2', 'notes-section__block--p3'] as const;

export function NotesSection({ notes }: NotesSectionProps) {
  const { t } = usePreferences();

  if (!notes.length) {
    return <EmptyState title={t(copy.notes)} body={t(copy.emptyGeneric)} />;
  }

  // Defensive client-side sort by priority so ordering never depends solely on the API.
  const sorted = [...notes].sort((a, b) => a.priority - b.priority);

  // Group sequential notes per priority block.
  const groups = new Map<number, PriorityNote[]>();
  for (const note of sorted) {
    const list = groups.get(note.priority) ?? [];
    list.push(note);
    groups.set(note.priority, list);
  }

  return (
    <section className="notes-section">
      <div className="section-heading">{t(copy.notes)}</div>
      <div className="notes-section__groups">
        {[...groups.entries()].map(([priority, items]) => (
          <div key={priority} className={`notes-section__block ${PRIORITY_BLOCK[priority]}`}>
            <div className="notes-section__block-title">{t(copy[`priority${priority}` as keyof typeof copy])}</div>
            <ol className="notes-section__list">
              {items.map((note) => (
                <li key={note.id} className="notes-section__item">{note.note_text}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
