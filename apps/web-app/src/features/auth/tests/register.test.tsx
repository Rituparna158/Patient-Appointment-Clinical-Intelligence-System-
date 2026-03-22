import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Register from '../pages/Register';
import { AuthService } from '@/services/auth.service';


vi.mock('@/services/auth.service', () => ({
  AuthService: {
    register: vi.fn(),
  },
}));

describe('Register Feature', () => {
  function renderWithRouter() {
    return render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  }

 
  async function fillValidForm() {
    await userEvent.type(
      screen.getByPlaceholderText(/full name/i),
      'John Doe'
    );

    await userEvent.type(
      screen.getByPlaceholderText(/email/i),
      'test@test.com'
    );

    await userEvent.type(
      screen.getByPlaceholderText(/10 digit mobile number/i),
      '9876543210'
    );

    await userEvent.type(
      screen.getByPlaceholderText(/enter your password/i),
      '123456'
    );

   
    await userEvent.click(screen.getByText(/select gender/i));
    await userEvent.click(screen.getByText(/male/i));

   
    await userEvent.type(
      screen.getByLabelText(/dob/i),
      '2000-01-01'
    );
  }

  it('should register successfully', async () => {
    vi.mocked(AuthService.register).mockResolvedValue(undefined);

    renderWithRouter();

    await fillValidForm();

    await userEvent.click(
      screen.getByRole('button', { name: /register/i })
    );

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalled();
    });
  });

  it('should show validation errors', async () => {
    renderWithRouter();

    await userEvent.click(
      screen.getByRole('button', { name: /register/i })
    );

    expect(await screen.findAllByText(/required/i)).toBeTruthy();
  });

  it('should handle API failure', async () => {
    vi.mocked(AuthService.register).mockRejectedValue(
      new Error('Failed')
    );

    renderWithRouter();

    await fillValidForm();

    await userEvent.click(
      screen.getByRole('button', { name: /register/i })
    );

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalled();
    });

 
    expect(await screen.findByText(/failed/i)).toBeInTheDocument();
  });
});
