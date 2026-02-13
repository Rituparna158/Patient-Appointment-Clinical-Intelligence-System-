import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../src/services/auth.service';

describe('AuthService.register', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('should create a user with hashed password', async () => {
    const user = await service.register({
      email: 'test@example.com',
      password: 'plain123',
    });

    expect(user.email).toBe('test@example.com');
    expect(user.password).not.toBe('plain123');
    expect(user).toHaveProperty('id');
  });

  it('should throw error if email already exists', async () => {
    await service.register({
      email: 'dup@example.com',
      password: 'pass',
    });

    await expect(
      service.register({
        email: 'dup@example.com',
        password: 'pass',
      })
    ).rejects.toThrow('EMAIL_EXISTS');
  });
});
