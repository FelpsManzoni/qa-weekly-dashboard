import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from '../../../src/components/Header/Header';

it('renders bilingual header and refresh action', () => {
  const onRefresh = vi.fn();
  render(<Header onRefresh={onRefresh} />);

  expect(screen.getByRole('heading', { name: /Weekly report/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Refresh data/i }));
  expect(onRefresh).toHaveBeenCalled();
});
