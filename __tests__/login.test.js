import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../pages/login';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Login Page', () => {
  it('redirects to dashboard on successful login', () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({ push: mockPush }));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'admin' },
    });
    fireEvent.click(screen.getByText(/login/i));

    expect(cookie.get('token')).toBe('sample-token');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error on invalid login', () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'credentials' },
    });
    fireEvent.click(screen.getByText(/login/i));

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
