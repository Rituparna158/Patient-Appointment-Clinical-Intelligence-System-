import { describe, test, expect, vi } from 'vitest';
import { AuthService } from '@/services/auth.service';
import * as apiModule from '@/services/api';

interface ApiSuccess<T> {
  data: T;
}

describe('AuthService', () => {
  test('login calls API correctly', async () => {
    const mockResponse: ApiSuccess<{ token: string }> = {
      data: { token: '123' },
    };

    vi.spyOn(apiModule, 'api').mockResolvedValue(mockResponse);

    const result = await AuthService.login('a@mail.com', '123456');

    expect(result.data.token).toBe('123');
  });

  test('login throws error', async () => {
    vi.spyOn(apiModule, 'api').mockRejectedValue(new Error('Login failed'));

    await expect(AuthService.login('a@mail.com', '123456')).rejects.toThrow(
      'Login failed'
    );
  });
});
