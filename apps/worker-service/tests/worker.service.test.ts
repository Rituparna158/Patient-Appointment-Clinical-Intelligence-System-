import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/utils/email.util', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@repo/shared-database', () => ({
  Appointment: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
  },
  ConsultaionNote: {
    count: vi.fn(),
    findByPk: vi.fn(),
  },
  User: {
    count: vi.fn(),
  },
  Role: {},
  Patient: {
    findBy: vi.fn(),
  },
  AnalyticsDaily: {
    upsert: vi.fn(),
  },
  DoctorSlot: {
    findByPk: vi.fn(),
  },
  Notification: {
    findAll: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../utils/email.util', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('@repo/shared-utils', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('node-cron', () => ({
  default: { schedule: vi.fn() },
}));

import {
  Appointment,
  ConsultaionNote,
  User,
  AnalyticsDaily,
  DoctorSlot,
  Notification,
  Patient,
} from '@repo/shared-database';

import { sendEmail } from '../src/utils/email.util';

import { generateDailyAnalytics } from '../src/jobs/cron-jobs/analytics.job';
import { cancelUnpaidAppointments } from '../src/jobs/cron-jobs/appointment-expiry.job';
import { markMissedAppointments } from '../src/jobs/cron-jobs/appointment-missed.job';
import { processNotification } from '../src/jobs/cron-jobs/notification.job';
import { sendAppointmentConfirmation } from '../src/jobs/queue-jobs/appointment.jobs';
import { startScheduler } from '../src/schedulers/master.scheduler';

const mockedAppointment = vi.mocked(Appointment, true);
const mockedConsultation = vi.mocked(ConsultaionNote, true);
const mockedUser = vi.mocked(User, true);
const mockedAnalytics = vi.mocked(AnalyticsDaily, true);
const mockedDoctorSlot = vi.mocked(DoctorSlot, true);
const mockedNotification = vi.mocked(Notification, true);
const mockedSendEmail = vi.mocked(sendEmail);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Worker Service (All-in-One)', () => {
  it(' generateDailyAnalytics - happy', async () => {
    mockedAppointment.findAll.mockResolvedValue([
      { status: 'confirmed', patientId: '1' } as never,
      { status: 'completed', patientId: '2' } as never,
    ]);

    mockedConsultation.count.mockResolvedValue(2);
    mockedUser.count.mockResolvedValue(1);

    await generateDailyAnalytics();

    expect(mockedAnalytics.upsert).toHaveBeenCalled();
  });

  it('generateDailyAnalytics - fail', async () => {
    mockedAppointment.findAll.mockRejectedValue(new Error('DB fail'));

    await generateDailyAnalytics();

    expect(mockedAnalytics.upsert).not.toHaveBeenCalled();
  });

  it('cancelUnpaidAppointments - happy', async () => {
    const save = vi.fn();

    mockedAppointment.findAll.mockResolvedValue([
      { status: 'requested', paymentStatus: 'pending', save } as never,
    ]);

    await cancelUnpaidAppointments();

    expect(save).toHaveBeenCalled();
  });

  it(' cancelUnpaidAppointments - fail', async () => {
    mockedAppointment.findAll.mockRejectedValue(new Error('fail'));

    await expect(cancelUnpaidAppointments()).rejects.toThrow();
  });

  it(' markMissedAppointments - happy', async () => {
    const save = vi.fn();

    mockedAppointment.findAll.mockResolvedValue([
      { slotId: '1', save } as never,
    ]);

    mockedDoctorSlot.findByPk.mockResolvedValue({
      slotDate: '2020-01-01',
      endTime: '10:00:00',
    } as never);

    await markMissedAppointments();

    expect(save).toHaveBeenCalled();
  });

  it(' markMissedAppointments - no slot', async () => {
    mockedAppointment.findAll.mockResolvedValue([{ slotId: '1' } as never]);

    mockedDoctorSlot.findByPk.mockResolvedValue(null);

    await markMissedAppointments();

    expect(mockedDoctorSlot.findByPk).toHaveBeenCalled();
  });

  it(' processNotification - happy', async () => {
    const save = vi.fn();

    mockedNotification.findAll.mockResolvedValue([
      { status: 'pending', save, type: 'email', userId: '1' } as never,
    ]);

    await processNotification();

    expect(save).toHaveBeenCalled();
  });

  it(' processNotification - fail', async () => {
    mockedNotification.findAll.mockRejectedValue(new Error('fail'));

    await expect(processNotification()).rejects.toThrow();
  });

  it('sendAppointmentConfirmation - happy', async () => {
    mockedAppointment.findByPk.mockResolvedValue({
      patient: { user: { email: 'test@mail.com', full_name: 'Test' } },
      slot: { slotDate: '2024', startTime: '10:00' },
    } as never);

    await sendAppointmentConfirmation('1');

    expect(sendEmail).toHaveBeenCalled();
  });

  it(' sendAppointmentConfirmation - missing data', async () => {
    mockedAppointment.findByPk.mockResolvedValue({
      patient: { user: {} },
      slot: null,
    } as never);

    await sendAppointmentConfirmation('1');

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it(' scheduler registers jobs', async () => {
    const cron = await import('node-cron');

    startScheduler();

    expect(cron.default.schedule).toHaveBeenCalledTimes(2);
  });
});
