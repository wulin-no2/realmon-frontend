import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, waitFor } from '@testing-library/react-native';

import AuthGate from '../screens/AuthGate';

const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ replace: mockReplace }),
}));

describe('AuthGate', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  test('redirects to login when no token is stored', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);

    render(<AuthGate />);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Login'));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('redirects to home when the stored token is valid', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('valid-token');
    jest.mocked(global.fetch).mockResolvedValue(new Response(null, { status: 200 }));

    render(<AuthGate />);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Home'));
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/user/me',
      { headers: { Authorization: 'Bearer valid-token' } }
    );
  });

  test('clears session data when the stored token is rejected', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('expired-token');
    jest.mocked(global.fetch).mockResolvedValue(new Response(null, { status: 401 }));
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(<AuthGate />);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Login'));
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['token', 'userId', 'username']);
  });

  test('clears session data when validation fails over the network', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('stored-token');
    jest.mocked(global.fetch).mockRejectedValue(new Error('network unavailable'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<AuthGate />);

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('Login'));
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['token', 'userId', 'username']);
  });
});
