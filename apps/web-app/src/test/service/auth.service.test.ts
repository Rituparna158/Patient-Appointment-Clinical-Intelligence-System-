import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/api', () => ({
  api: vi.fn(),
}));

import { api } from '@/services/api';
import { AuthService } from '@/services/auth.service';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login (happy)', async () => {
    vi.mocked(api).mockResolvedValue({
      data: {
        user: { id: '1', roles: ['patient'] },
        token: 'token123',
      },
    });

    const res = await AuthService.login('test@test.com', '123456');

    expect(res.token).toBe('token123');
  });

  it('should fail login', async () => {
    vi.mocked(api).mockRejectedValue(new Error('Invalid credentials'));

    await expect(AuthService.login('x', 'x')).rejects.toThrow(
      'Invalid credentials'
    );
  });

  it('should register', async () => {
    vi.mocked(api).mockResolvedValue({
      data: {
        user: { id: '1', roles: ['patient'] },
        token: 'token123',
      },
    });

    const res = await AuthService.register({
      full_name: 'Test',
      email: 'test@test.com',
      password: '123456',
      phone: '9999999999',
      gender: 'male',
      date_of_birth: '2000-01-01',
    });

    expect(res.user.roles[0]).toBe('patient');
  });
});
