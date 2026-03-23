import { describe, it, expect } from 'vitest';
import { useAuthStore } from '@/store/auth/auth.store';
import type { User } from '@/types/auth.types';

describe('Auth Store', () => {
  it('should set user', () => {
    const store = useAuthStore.getState();

    const user: User = {
      id: '1',
      email: 'test@test.com',
      roles: ['patient'],
    };

    store.setUser(user, 'token123');

    expect(useAuthStore.getState().user?.email).toBe('test@test.com');
  });

  it('should logout', () => {
    const store = useAuthStore.getState();

    store.logout();

    expect(useAuthStore.getState().user).toBeNull();
  });
});
