import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/api', () => ({
  api: vi.fn(),
}));

import { api } from '@/services/api';
import { AppointmentService } from '@/services/appointment.service';

describe('Appointment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get doctors', async () => {
    vi.mocked(api).mockResolvedValue({
      data: [
        {
          id: 'd1',
          specialization: 'Cardiologist',
          user: {
            id: 'u1',
            full_name: 'Dr John',
            email: 'doc@test.com',
          },
        },
      ],
    });

    const res = await AppointmentService.getDoctors();

    expect(res.length).toBe(1);
  });

  it('should get branches', async () => {
    vi.mocked(api).mockResolvedValue({
      data: [
        {
          id: 'b1',
          name: 'Main',
          address: 'BBSR',
          phone: '999',
        },
      ],
    });

    const res = await AppointmentService.getBranches();

    expect(res[0].name).toBe('Main');
  });

  it('should get slots', async () => {
    vi.mocked(api).mockResolvedValue({
      data: [
        {
          id: 's1',
          doctorId: 'd1',
          branchId: 'b1',
          slotDate: '2026-03-22',
          startTime: '10:00:00',
          endTime: '10:30:00',
        },
      ],
    });

    const res = await AppointmentService.getAvailableSlots(
      'd1',
      'b1',
      '2026-03-22'
    );

    expect(res.length).toBe(1);
  });

  it('should book appointment', async () => {
    vi.mocked(api).mockResolvedValue({
      data: {
        id: 'a1',
      },
    });

    const res = await AppointmentService.book({
      doctorId: 'd1',
      branchId: 'b1',
      slotId: 's1',
    });

    expect(res.id).toBe('a1');
  });

  it('should fail booking', async () => {
    vi.mocked(api).mockRejectedValue(new Error('Booking failed'));

    await expect(
      AppointmentService.book({
        doctorId: 'd1',
        branchId: 'b1',
        slotId: 's1',
      })
    ).rejects.toThrow('Booking failed');
  });

  it('should process payment', async () => {
    vi.mocked(api).mockResolvedValue({ success: true });

    await AppointmentService.pay('a1');

    expect(api).toHaveBeenCalled();
  });
});
