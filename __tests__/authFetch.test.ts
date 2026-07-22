import AsyncStorage from '@react-native-async-storage/async-storage';

import { authFetch } from '../utils/authFetch';

describe('authFetch', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('adds the stored token and preserves request headers', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('stored-token');
    const response = new Response(null, { status: 204 });
    jest.mocked(global.fetch).mockResolvedValue(response);

    await expect(authFetch('/api/user/me', {
      headers: { 'X-Request-Id': 'request-1' },
    })).resolves.toBe(response);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/user/me',
      expect.objectContaining({
        headers: {
          'X-Request-Id': 'request-1',
          'Content-Type': 'application/json',
          Authorization: 'Bearer stored-token',
        },
      })
    );
  });

  test('does not add authorization when no token is stored', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);
    jest.mocked(global.fetch).mockResolvedValue(new Response(null, { status: 204 }));

    await authFetch('/api/species');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/species',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  test('propagates network failures', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('stored-token');
    jest.mocked(global.fetch).mockRejectedValue(new Error('network unavailable'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(authFetch('/api/user/me')).rejects.toThrow('network unavailable');
  });
});
