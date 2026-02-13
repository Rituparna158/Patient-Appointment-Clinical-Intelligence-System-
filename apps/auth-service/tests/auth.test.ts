import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/app';

describe('Auth serice API', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.text).toBe('Auth service is running');
  });
});
