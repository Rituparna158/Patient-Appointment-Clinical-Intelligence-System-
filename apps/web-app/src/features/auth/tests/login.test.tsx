import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { AuthService } from '@/services/auth.service';
import type { AuthResponse } from '@/types/test.types';

vi.mock('@/services/auth.service', () => ({
  AuthService: {
    login: vi.fn(),
  },
}));

const setUserMock = vi.fn();

vi.mock('@/store/auth/auth.store', () => {
  return {
    useAuthStore: (selector: (state: { setUser: typeof setUserMock }) => unknown) =>
      selector({
        setUser: setUserMock,
      }),
  };
});

describe('Login', () => {
  function renderWithRouter() {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  }

  it('success login', async () => {
    const mockResponse: AuthResponse = {
      user: { id: '1', roles: ['patient'] },
      token: 'token123',
    };

    vi.mocked(AuthService.login).mockResolvedValue(mockResponse);

    renderWithRouter();

    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), '123456');

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalled();
    });
  });

  it('validation error', async () => {
    renderWithRouter();

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findAllByText(/required/i)).toBeTruthy();
  });

  it('login failure', async () => {
    vi.mocked(AuthService.login).mockRejectedValue(new Error('Login failed'));

    renderWithRouter();

    await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@test.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), '123456');

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalled();
    });
  });
});
