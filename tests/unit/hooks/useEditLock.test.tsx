import { act, renderHook, waitFor } from '@testing-library/react';
import { useEditLock } from '../../../src/hooks/useEditLock';

const acquireLock = vi.fn();
const extendLock = vi.fn();
const releaseLock = vi.fn();

vi.mock('../../../src/api/locks', () => ({
  acquireLock: (...a: unknown[]) => acquireLock(...a),
  extendLock: (...a: unknown[]) => extendLock(...a),
  releaseLock: (...a: unknown[]) => releaseLock(...a)
}));

beforeEach(() => {
  vi.clearAllMocks();
  acquireLock.mockResolvedValue({ data: { id: 'l1' }, error: null });
  extendLock.mockResolvedValue({ data: { id: 'l1' }, error: null });
  releaseLock.mockResolvedValue({ data: null, error: null });
});

it('does not acquire when disabled', async () => {
  renderHook(() => useEditLock('notes', null, false));
  await waitFor(() => expect(acquireLock).not.toHaveBeenCalled());
});

it('surfaces an error when the resource is locked by another editor', async () => {
  acquireLock.mockResolvedValue({ data: null, error: { message: 'locked', code: 'LOCKED' } });
  const { result } = renderHook(() => useEditLock('notes', 'n1'));
  await waitFor(() => expect(result.current.error).toMatch(/locked/i));
  expect(result.current.lock).toBeNull();
});

it('releases the lock on unmount', async () => {
  const { result, unmount } = renderHook(() => useEditLock('notes', 'n1'));
  await waitFor(() => expect(result.current.lock?.id).toBe('l1'));
  unmount();
  await waitFor(() => expect(releaseLock).toHaveBeenCalledWith('l1'));
});

it('sends a heartbeat on user activity', async () => {
  const { result } = renderHook(() => useEditLock('notes', 'n1'));
  await waitFor(() => expect(result.current.lock?.id).toBe('l1'));

  await act(async () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
  });
  await waitFor(() => expect(extendLock).toHaveBeenCalledWith('l1'));
});
