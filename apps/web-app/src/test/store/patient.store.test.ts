import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/patient.service', () => ({
  PatientService: {
    searchPatient: vi.fn(),
  },
}));

import { usePatientStore } from '@/store/patient/patient.store';
import { PatientService } from '@/services/patient.service';

const mockResponse = {
  patients: [
    {
      id: 'p1',
      userId: 'u1',
      address: 'Bhubaneswar',
      emergencyContact: '9999999999',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 'u1',
        full_name: 'Test User',
        email: 'test@test.com',
      },
    },
  ],
  total: 1,
};

describe('Patient Store', () => {
  beforeEach(() => {
    usePatientStore.setState({
      patients: [],
      total: 0,
      page: 1,
      limit: 10,
      search: '',
      loading: false,
    });
  });

  it('should fetch patients (happy case)', async () => {
    vi.mocked(PatientService.searchPatient).mockResolvedValue(mockResponse);

    const store = usePatientStore.getState();

    await store.fetchPatients();

    const state = usePatientStore.getState();

    expect(PatientService.searchPatient).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });

    expect(state.patients.length).toBe(1);
    expect(state.total).toBe(1);
    expect(state.patients[0].user.full_name).toBe('Test User');
  });

  it('should fetch patients with search', async () => {
    vi.mocked(PatientService.searchPatient).mockResolvedValue(mockResponse);

    const store = usePatientStore.getState();

    store.setSearch('john');
    await store.fetchPatients();

    expect(PatientService.searchPatient).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      search: 'john',
    });
  });

  it('should handle fetch failure', async () => {
    vi.mocked(PatientService.searchPatient).mockRejectedValue(
      new Error('API Error')
    );

    const store = usePatientStore.getState();

    await store.fetchPatients();

    const state = usePatientStore.getState();

    expect(state.patients).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.loading).toBe(false);
  });

  it('should update search and reset page', () => {
    const store = usePatientStore.getState();

    store.setSearch('test');

    const state = usePatientStore.getState();

    expect(state.search).toBe('test');
    expect(state.page).toBe(1);
  });

  it('should update page', () => {
    const store = usePatientStore.getState();

    store.setPage(3);

    expect(usePatientStore.getState().page).toBe(3);
  });

  it('should not fetch if already loading', async () => {
    usePatientStore.setState({ loading: true });

    const store = usePatientStore.getState();

    await store.fetchPatients();

    expect(PatientService.searchPatient).not.toHaveBeenCalled();
  });
});
