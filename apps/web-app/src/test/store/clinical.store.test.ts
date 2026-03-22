import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/clinical.service', () => ({
  ClinicalService: {
    getDoctorConsultations: vi.fn(),
    getPatientTimeline: vi.fn(),
    getAdminRecords: vi.fn(),
    createNote: vi.fn(),
  },
}));

import { useClinicalStore } from '@/store/clinical/clinical.store';
import { ClinicalService } from '@/services/clinical.service';
import type { ClinicalResponse } from '@/types/clinical.types';

describe('Clinical Store', () => {
  beforeEach(() => {
    useClinicalStore.setState({
      notes: [],
      total: 0,
      loading: false,
      page: 1,
      limit: 10,
      search: '',
      from: undefined,
      to: undefined,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
  });

  it('should fetch patient timeline (happy case)', async () => {
    const mockResponse: ClinicalResponse = {
      success: true,
      total: 1,
      page: 1,
      limit: 10,
      data: [
        {
          id: 'c1',
          symptoms: 'fever',
          diagnosis: 'viral infection',
          prescriptions: 'paracetamol',
          notes: null,
          followUpDate: null,
          createdAt: '2026-03-22T10:00:00.000Z',

          appointment: {
            id: 'a1',

            doctor: {
              user: {
                id: 'd1',
                full_name: 'Dr John Doe',
                email: 'doctor@test.com',
              },
            },

            patient: {
              id: 'p1',
              user: {
                id: 'u1',
                full_name: 'Patient One',
                email: 'patient@test.com',
              },
            },

            slot: {
              slotDate: '2026-03-22',
              startTime: '10:00:00',
              endTime: '10:30:00',
            },
          },
        },
      ],
    };

    vi.mocked(ClinicalService.getPatientTimeline).mockResolvedValue(
      mockResponse
    );

    const store = useClinicalStore.getState();

    await store.fetchPatientTimeline();

    expect(ClinicalService.getPatientTimeline).toHaveBeenCalled();
    expect(useClinicalStore.getState().notes.length).toBe(1);
    expect(useClinicalStore.getState().total).toBe(1);
  });

  it('should fetch doctor consultations', async () => {
    const mockResponse: ClinicalResponse = {
      success: true,
      total: 1,
      page: 1,
      limit: 10,
      data: [
        {
          id: 'c2',
          symptoms: 'cough',
          diagnosis: 'flu',
          prescriptions: 'syrup',
          notes: null,
          followUpDate: null,
          createdAt: '2026-03-22T10:00:00.000Z',

          appointment: {
            id: 'a2',
            doctor: {
              user: {
                id: 'd2',
                full_name: 'Dr Smith',
                email: 'doc2@test.com',
              },
            },
            patient: {
              id: 'p2',
              user: {
                id: 'u2',
                full_name: 'Patient Two',
                email: 'patient2@test.com',
              },
            },
            slot: {
              slotDate: '2026-03-22',
              startTime: '11:00:00',
              endTime: '11:30:00',
            },
          },
        },
      ],
    };

    vi.mocked(ClinicalService.getDoctorConsultations).mockResolvedValue(
      mockResponse
    );

    const store = useClinicalStore.getState();

    await store.fetchDoctorConsultations();

    expect(useClinicalStore.getState().notes.length).toBe(1);
  });

  it('should handle API failure', async () => {
    vi.mocked(ClinicalService.getPatientTimeline).mockRejectedValue(
      new Error('API failed')
    );

    const store = useClinicalStore.getState();

    await store.fetchPatientTimeline();

    expect(useClinicalStore.getState().loading).toBe(false);
  });

  it('should create note', async () => {
    vi.mocked(ClinicalService.createNote).mockResolvedValue(undefined);

    const store = useClinicalStore.getState();

    await store.createNote({
      appointmentId: 'a1',
      symptoms: 'fever',
      diagnosis: 'viral',
      prescriptions: 'paracetamol',
    });

    expect(ClinicalService.createNote).toHaveBeenCalled();
  });

  it('should toggle sorting', () => {
    const store = useClinicalStore.getState();

    store.setSort('createdAt');
    expect(useClinicalStore.getState().sortOrder).toBe('ASC');

    store.setSort('createdAt');
    expect(useClinicalStore.getState().sortOrder).toBe('DESC');
  });
});
