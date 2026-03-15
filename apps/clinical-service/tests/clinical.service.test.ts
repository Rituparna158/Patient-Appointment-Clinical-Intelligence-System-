import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as clinicalService from '../src/services/clinical.service';
import * as consultationRepo from '../src/repositories/consultation.repository';
import * as doctorRepo from '../src/repositories/doctor.repository';
import * as appointmentRepo from '../src/repositories/appointment.repository';
import * as patientRepo from '../src/repositories/patient.repository';

vi.mock('../src/queues/clinical.producer', () => ({
  clinicalQueue: {
    add: vi.fn().mockResolvedValue({}),
  },
}));

describe('clinical.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create consultation note', async () => {
    vi.spyOn(consultationRepo, 'findByAppointmentId').mockResolvedValue([]);

    vi.spyOn(doctorRepo, 'findDoctorByUserId').mockResolvedValue({
      id: 'doctor1',
    } as never);

    vi.spyOn(appointmentRepo, 'findAppointmentById').mockResolvedValue({
      id: 'appt1',
      patientId: 'patient1',
      doctorId: 'doctor1',
      status: 'confirmed',
    } as never);

    vi.spyOn(patientRepo, 'findById').mockResolvedValue({
      id: 'patient1',
    } as never);

    const mockNote = {
      id: 'note1',
      appointmentId: 'appt1',
    };

    vi.spyOn(consultationRepo, 'createConsultationNote').mockResolvedValue(
      mockNote as never
    );

    const result = await clinicalService.createNote('doctorUser', {
      appointmentId: 'appt1',
      symptoms: 'fever',
      diagnosis: 'viral',
      prescriptions: 'medicine',
    });

    expect(result).toEqual(mockNote);
  });

  it('should fail if appointment not found', async () => {
    vi.spyOn(consultationRepo, 'findByAppointmentId').mockResolvedValue([]);

    vi.spyOn(doctorRepo, 'findDoctorByUserId').mockResolvedValue({
      id: 'doctor1',
    } as never);

    vi.spyOn(appointmentRepo, 'findAppointmentById').mockResolvedValue(null);

    await expect(
      clinicalService.createNote('doctorUser', {
        appointmentId: 'appt1',
        symptoms: 'fever',
        diagnosis: 'viral',
        prescriptions: 'medicine',
      })
    ).rejects.toThrow();
  });
});
