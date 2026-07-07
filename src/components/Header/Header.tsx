import { bilingualText, copy } from '../../utils/copy';
import './Header.css';

type HeaderProps = {
  onRefresh: () => void;
};

export function Header({ onRefresh }: HeaderProps) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-header__eyebrow">WEEKLY REPORT</p>
        <h1>{bilingualText(copy.title)}</h1>
        <p>{bilingualText(copy.subtitle)}</p>
      </div>
      <button className="dashboard-header__refresh" onClick={onRefresh} type="button">
        {bilingualText(copy.refresh)}
      </button>
    </header>
  );
}
