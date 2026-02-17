import request from 'supertest';
import { beforeEach, describe, it, expect } from 'vitest';
import app from '../src/app';
import { HTTP_STATUS } from '../src/constants/http-status';
import { User } from '../src/models/user.model';
import { Role, UserRole } from '../src/models';

describe('Auth Service - Role Middleware', () => {
  it('should block access if role is not doctor', async () => {
    await request(app).post('/api/auth/register').send({
      full_name: 'Patient user',
      email: 'patient@gmail.com',
      password: 'Password@123',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'patient@gmail.com',
      password: 'Password@123',
    });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get('/api/auth/doctor-only')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(HTTP_STATUS.FORBIDDEN);
  });

  it('should allow access if role is doctor', async () => {
    await request(app).post('/api/auth/register').send({
      full_name: 'Doctor User',
      email: 'doctor@gmail.com',
      password: 'Password@123',
    });
    const doctorUser = await User.findOne({
      where: { email: 'doctor@gmail.com' },
    });
    const doctorRole = await Role.findOne({
      where: { name: 'doctor' },
    });
    if (!doctorUser) {
      throw new Error('Doctor user missing in db');
    }
    if (!doctorRole) {
      throw new Error('Doctor role missing in db');
    }
    await UserRole.create({
      userId: doctorUser.get('id'),
      roleId: doctorRole.get('id'),
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'doctor@gmail.com',
      password: 'Password@123',
    });

    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get('/api/auth/doctor-only')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(HTTP_STATUS.OK);
  });
});
