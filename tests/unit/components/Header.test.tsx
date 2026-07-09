import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from '../../../src/components/Header/Header';

it('renders the header with preferences controls and a user menu', () => {
  const onRefresh = vi.fn();
  const onLogout = vi.fn();
  render(
    <Header
      onRefresh={onRefresh}
      onLogout={onLogout}
      user={{ id: 'u1', username: 'qa', email: 'qa@example.com', display_name: 'QA Lead' }}
    />
  );

  expect(screen.getByRole('heading', { name: /Weekly report/i })).toBeInTheDocument();
  expect(screen.getByTitle(/Light mode|Dark mode/i)).toBeInTheDocument();
  expect(screen.getByTitle(/English|Portugu/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /QA Lead/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /Refresh data/i }));
  expect(onRefresh).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /QA Lead/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: /Sign out/i }));
  expect(onLogout).toHaveBeenCalled();
});
