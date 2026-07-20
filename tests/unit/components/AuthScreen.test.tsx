import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthScreen } from '../../../src/components/Auth/AuthScreen';

const login = vi.fn();
const register = vi.fn();

vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: () => ({ login, register, logout: vi.fn(), user: null, isLoading: false })
}));

beforeEach(() => {
  vi.clearAllMocks();
  login.mockResolvedValue(null);
  register.mockResolvedValue(null);
});

it('submits the login form', async () => {
  render(<AuthScreen />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'qa' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password1' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  await waitFor(() => expect(login).toHaveBeenCalledWith('qa', 'password1'));
});

it('toggles to register and submits', async () => {
  render(<AuthScreen />);
  fireEvent.click(screen.getByRole('button', { name: /Create one/i }));
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'new' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'n@e.com' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password1' } });
  fireEvent.click(screen.getByRole('button', { name: /Create account/i }));
  await waitFor(() => expect(register).toHaveBeenCalled());
});

it('shows an error message on failure', async () => {
  login.mockResolvedValue({ message: 'Invalid username or password', code: 'INVALID_CREDENTIALS' });
  render(<AuthScreen />);
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'qa' } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'bad' } });
  fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
  await waitFor(() => expect(screen.getByText(/Invalid username or password/i)).toBeInTheDocument());
});
