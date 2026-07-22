import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import LoginScreen from '../screens/LoginScreen';

const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ reset: mockReset }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  test('requires both username and password', () => {
    const screen = render(<LoginScreen />);

    fireEvent.press(screen.getByText('Login'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Missing fields',
      'Please enter both username and password.'
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('stores the session and navigates home after successful login', async () => {
    const screen = render(<LoginScreen />);
    jest.mocked(global.fetch).mockResolvedValue({
      status: 200,
      text: async () => JSON.stringify({
        token: 'new-token',
        userId: 42,
        username: 'test-user',
      }),
    } as Response);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'test-user');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'secure-password');
    fireEvent.press(screen.getByText('Login'));

    await waitFor(() => expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      ['token', 'new-token'],
      ['userId', '42'],
      ['username', 'test-user'],
    ]));
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/user/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test-user',
          password: 'secure-password',
        }),
      }
    );
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  });

  test('shows a specific message for invalid credentials', async () => {
    const screen = render(<LoginScreen />);
    jest.mocked(global.fetch).mockResolvedValue({
      status: 401,
      text: async () => 'Invalid credentials',
    } as Response);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'test-user');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'wrong-password');
    fireEvent.press(screen.getByText('Login'));

    await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith(
      'Login failed',
      'Invalid username or password'
    ));
    expect(AsyncStorage.multiSet).not.toHaveBeenCalled();
    expect(mockReset).not.toHaveBeenCalled();
  });
});
