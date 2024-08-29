import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import { login, getSession, logout } from '../lib/auth';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../lib/auth', () => ({
  login: jest.fn(),
  getSession: jest.fn(),
  logout: jest.fn(),
}));

describe('Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  test('Login redirects to dashboard on success', async () => {
    const push = jest.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));

    login.mockResolvedValue(true); // Mock successful login

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'user1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password1' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard'); // Check redirection
    });
  });

  test('Login shows alert on failed login attempt', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    login.mockResolvedValue(false); // Mock failed login

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'user1' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongPassword' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Invalid credentials'); // Check alert
    });

    alertMock.mockRestore(); // Restore original alert implementation
  });

  test('Dashboard redirects to login if not authenticated', async () => {
    const push = jest.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));

    getSession.mockResolvedValue(null);

    render(<Dashboard />);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });

  test('Dashboard displays user info if authenticated', async () => {
    const push = jest.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));

    const sessionData = { userId: 1, username: 'user1' };
    getSession.mockResolvedValue(sessionData);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome to the Dashboard, user1!/)).toBeInTheDocument();
    });
  });

  test('Logout redirects to login', async () => {
    const push = jest.fn();
    useRouter.mockImplementation(() => ({
      push,
    }));

    const sessionData = { userId: 1, username: 'user1' };
    getSession.mockResolvedValue(sessionData);

    render(<Dashboard />);

    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });
});
