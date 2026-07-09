import { EmptyState } from '../EmptyState/EmptyState';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { PriorityNote } from '../../types';
import './NotesSection.css';

type NotesSectionProps = {
  notes: PriorityNote[];
};

export function NotesSection({ notes }: NotesSectionProps) {
  const { t } = usePreferences();

  if (!notes.length) {
    return <EmptyState title={t(copy.notes)} body={t(copy.emptyGeneric)} />;
  }

  // Defensive client-side sort by priority so ordering never depends solely on the API (#9).
  const sorted = [...notes].sort((a, b) => a.priority - b.priority);

  return (
    <section className="notes-section">
      <div className="section-heading">{t(copy.notes)}</div>
      <div className="notes-section__list">
        {sorted.map((note) => (
          <article key={note.id} className={`notes-section__item notes-section__item--p${note.priority}`}>
            <strong>NOTES:</strong>
            <p>{note.note_text}</p>
            <small>{t(copy[`priority${note.priority}` as keyof typeof copy])}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
