import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as repo from '../src/repositories/patient.repository';
import * as service from '../src/services/patient.service';
import { AppError } from '../src/utils/app-error';
import { Patient } from '../src/models/patient.model';

describe('patient.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create patient profile', async () => {
    vi.spyOn(repo, 'findByUserId').mockResolvedValue(null);

    const mockPatient = {
      id: '1',
      userId: '1',
      address: 'Delhi',
      emergencyContact: '9999999999',
      isActive: true,
    } as Patient;

    vi.spyOn(repo, 'createPatient').mockResolvedValue(mockPatient);

    const result = await service.createProfile('1', {
      address: 'Delhi',
      emergencyContact: '9999999999',
    });

    expect(repo.createPatient).toHaveBeenCalled();
    expect(result).toEqual(mockPatient);
  });

  it('should throw error if profile already exists', async () => {
    const existingPatient = {
      id: '1',
      userId: '1',
    } as Patient;

    vi.spyOn(repo, 'findByUserId').mockResolvedValue(existingPatient);

    await expect(
      service.createProfile('1', { address: 'Delhi' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should get profile successfully', async () => {
    const patient = {
      id: '1',
      userId: '1',
    } as Patient;

    vi.spyOn(repo, 'findByUserId').mockResolvedValue(patient);

    const result = await service.getProfile('1');

    expect(result).toEqual(patient);
  });

  it('should throw error if profile not found', async () => {
    vi.spyOn(repo, 'findByUserId').mockResolvedValue(null);

    await expect(service.getProfile('1')).rejects.toBeInstanceOf(AppError);
  });

  it('should update patient profile', async () => {
    const patient = {
      id: '1',
      userId: '1',
    } as Patient;

    const updatedPatient = {
      id: '1',
      userId: '1',
      address: 'Mumbai',
    } as Patient;

    vi.spyOn(repo, 'findByUserId').mockResolvedValue(patient);
    vi.spyOn(repo, 'updatePatient').mockResolvedValue(updatedPatient);

    const result = await service.updateProfile('1', {
      address: 'Mumbai',
    });

    expect(repo.updatePatient).toHaveBeenCalled();
    expect(result).toEqual(updatedPatient);
  });

  it('should delete patient profile', async () => {
    const patient = {
      id: '1',
      userId: '1',
    } as Patient;

    vi.spyOn(repo, 'findByUserId').mockResolvedValue(patient);
    vi.spyOn(repo, 'softDeletePatient').mockResolvedValue(patient);

    const result = await service.deleteProfile('1');

    expect(repo.softDeletePatient).toHaveBeenCalled();
    expect(result).toEqual(patient);
  });
});
