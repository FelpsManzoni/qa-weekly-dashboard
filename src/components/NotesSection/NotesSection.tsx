import { EmptyState } from '../EmptyState/EmptyState';
import { bilingualText, copy } from '../../utils/copy';
import type { PriorityNote } from '../../types';
import './NotesSection.css';

type NotesSectionProps = {
  notes: PriorityNote[];
};

const LABELS = {
  0: 'Priority 0 / Prioridade 0',
  1: 'Priority 1 / Prioridade 1',
  2: 'Priority 2 / Prioridade 2'
};

export function NotesSection({ notes }: NotesSectionProps) {
  if (!notes.length) {
    return <EmptyState title={bilingualText(copy.notes)} body={bilingualText(copy.emptyGeneric)} />;
  }

  // Defensive client-side sort by priority so ordering never depends solely on the API (#9).
  const sorted = [...notes].sort((a, b) => a.priority - b.priority);

  return (
    <section className="notes-section">
      <div className="section-heading">{bilingualText(copy.notes)}</div>
      <div className="notes-section__list">
        {sorted.map((note) => (
          <article key={note.id} className={`notes-section__item notes-section__item--p${note.priority}`}>
            <strong>NOTES:</strong>
            <p>{note.note_text}</p>
            <small>{LABELS[note.priority]}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
