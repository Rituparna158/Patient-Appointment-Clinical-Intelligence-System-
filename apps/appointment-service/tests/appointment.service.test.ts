import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as appointmentService from '../src/services/appointment.service';
import * as patientRepo from '../src/repositories/patient.repository';
import * as doctorRepo from '../src/repositories/doctor.repository';
import * as branchRepo from '../src/repositories/branch.repository';
import * as slotRepo from '../src/repositories/doctorSlot.repository';
import * as appointmentRepo from '../src/repositories/appointment.repository';

import { Patient } from '../src/models/external/patient.model';
import { Doctor } from '../src/models/external/doctor.model';
import { Branch } from '../src/models/branch.model';
import { DoctorSlot } from '../src/models/doctorSlot.model';
import { Appointment } from '../src/models/appointment.model';

/* ---------------- MOCK REDIS QUEUE ---------------- */

vi.mock('../src/queues/appointment.producer', () => ({
  appointmentQueue: {
    add: vi.fn().mockResolvedValue(true),
  },
}));

/* ---------------- MOCK PAYMENT ---------------- */

vi.mock('../src/utils/payment.util', () => ({
  processFakePayment: vi.fn().mockResolvedValue(true),
}));

describe('Appointment Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  /* ------------------------------------------------ */
  /* BOOK APPOINTMENT */
  /* ------------------------------------------------ */

  describe('bookAppointment', () => {
    it('should book appointment successfully', async () => {
      const patient = {
        id: 'patient1',
        userId: 'user1',
        address: 'test address',
        emergencyContact: '9999999999',
        isActive: true,
      } as Patient;

      const doctor = {
        id: 'doctor1',
        userId: 'user2',
        specialization: 'cardiology',
        licence_no: 'LIC123',
        consultation_fee: 500,
        is_active: true,
      } as Doctor;

      const branch = {
        id: 'branch1',
        name: 'Main Branch',
        address: 'Test Address',
        phone: '9999999999',
        is_active: true,
      } as Branch;

      /* -------- FIXED DOCTORSLOT MOCK -------- */

      const slot: Partial<DoctorSlot> = {
        id: 'slot1',
        doctorId: 'doctor1',
        branchId: 'branch1',
        slotDate: '2030-01-01',
        startTime: '10:00:00',
        endTime: '10:30:00',
        isBooked: false,
        isActive: true,
        update: vi.fn().mockResolvedValue(true),
      };

      const appointment = {
        id: 'appointment1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        branchId: 'branch1',
        slotId: 'slot1',
        status: 'requested',
        paymentStatus: 'pending',
      } as Appointment;

      vi.spyOn(patientRepo, 'findPatientByUserId').mockResolvedValue(patient);

      vi.spyOn(doctorRepo, 'findDoctorById').mockResolvedValue(doctor);

      vi.spyOn(branchRepo, 'findBranchById').mockResolvedValue(branch);

      vi.spyOn(slotRepo, 'findSlotById').mockResolvedValue(slot as DoctorSlot);

      vi.spyOn(appointmentRepo, 'createAppointment').mockResolvedValue(
        appointment
      );

      const result = await appointmentService.bookAppointment({
        userId: 'user1',
        doctorId: 'doctor1',
        branchId: 'branch1',
        slotId: 'slot1',
        appointmentReason: 'Fever',
      });

      expect(result?.id).toBe('appointment1');
    });

    it('should fail when patient not found', async () => {
      vi.spyOn(patientRepo, 'findPatientByUserId').mockResolvedValue(null);

      await expect(
        appointmentService.bookAppointment({
          userId: 'user1',
          doctorId: 'doctor1',
          branchId: 'branch1',
          slotId: 'slot1',
        })
      ).rejects.toThrow('Patient profile not found');
    });

    it('should fail when slot already booked', async () => {
      const patient = {
        id: 'patient1',
        userId: 'user1',
        address: 'test',
        emergencyContact: '9999999999',
        isActive: true,
      } as Patient;

      const doctor = {
        id: 'doctor1',
        userId: 'user2',
        specialization: 'cardiology',
        licence_no: 'LIC123',
        consultation_fee: 500,
        is_active: true,
      } as Doctor;

      const branch = {
        id: 'branch1',
        name: 'Main Branch',
        address: 'Test Address',
        phone: '9999999999',
        is_active: true,
      } as Branch;

      const slot: Partial<DoctorSlot> = {
        id: 'slot1',
        doctorId: 'doctor1',
        branchId: 'branch1',
        slotDate: '2030-01-01',
        startTime: '10:00:00',
        endTime: '10:30:00',
        isBooked: true,
        isActive: true,
        update: vi.fn().mockResolvedValue(true),
      };

      vi.spyOn(patientRepo, 'findPatientByUserId').mockResolvedValue(patient);

      vi.spyOn(doctorRepo, 'findDoctorById').mockResolvedValue(doctor);

      vi.spyOn(branchRepo, 'findBranchById').mockResolvedValue(branch);

      vi.spyOn(slotRepo, 'findSlotById').mockResolvedValue(slot as DoctorSlot);

      await expect(
        appointmentService.bookAppointment({
          userId: 'user1',
          doctorId: 'doctor1',
          branchId: 'branch1',
          slotId: 'slot1',
        })
      ).rejects.toThrow('Slot already booked');
    });
  });

  /* ------------------------------------------------ */
  /* CONFIRM PAYMENT */
  /* ------------------------------------------------ */

  describe('confirmPayment', () => {
    it('should confirm payment successfully', async () => {
      const appointment = {
        id: 'appointment1',
        patientId: 'patient1',
        doctorId: 'doctor1',
        branchId: 'branch1',
        slotId: 'slot1',
        status: 'requested',
        paymentStatus: 'pending',
      } as Appointment;

      vi.spyOn(appointmentRepo, 'findAppointmentById').mockResolvedValue(
        appointment
      );

      vi.spyOn(appointmentRepo, 'updatePaymentStatus').mockResolvedValue(
        appointment
      );

      vi.spyOn(appointmentRepo, 'updateAppointmentStatus').mockResolvedValue(
        appointment
      );

      const result = await appointmentService.confirmPayment({
        appointmentId: 'appointment1',
      });

      expect(result?.id).toBe('appointment1');
    });

    it('should fail when appointment not found', async () => {
      vi.spyOn(appointmentRepo, 'findAppointmentById').mockResolvedValue(null);

      await expect(
        appointmentService.confirmPayment({
          appointmentId: 'appointment1',
        })
      ).rejects.toThrow('Appointment not found');
    });
  });
});
