import { FindOptions, Transaction } from 'sequelize';
import { DoctorSlot } from '@repo/shared-database';
import {
  RepositoryOptions,
  RepositoryLockOptions,
} from '../types/appointment.types';

export const findSlotById = (
  slotId: string,
  options: RepositoryLockOptions = {}
) => {
  return DoctorSlot.findByPk(slotId, {
    transaction: options.transaction,
    lock: options.lock,
  });
};

export const findValidSlotForBooking = (
  slotId: string,
  doctorId: string,
  branchId: string,
  options: RepositoryLockOptions = {}
) => {
  return DoctorSlot.findOne({
    where: {
      id: slotId,
      doctorId,
      branchId,
      isActive: true,
    },
    transaction: options.transaction,
    lock: options.lock,
  });
};

export const findAvailableSlots = (
  doctorId: string,
  branchId: string,
  date: string
) =>
  DoctorSlot.findAll({
    where: {
      doctorId,
      branchId,
      slotDate: date,
      isBooked: false,
      isActive: true,
    },
    order: [['startTime', 'ASC']],
  });

export const markSlotBooked = (
  slot: DoctorSlot,
  options: RepositoryOptions = {}
) => slot.update({ isBooked: true }, { transaction: options.transaction });

export const releaseSlot = (
  slot: DoctorSlot,
  options: RepositoryOptions = {}
) => slot.update({ isBooked: false }, { transaction: options.transaction });

export const createSlot = async (
  doctorId: string,
  branchId: string,
  slotDate: string,
  startTime: string,
  endTime: string
) => {
  return DoctorSlot.create({
    doctorId,
    branchId,
    slotDate,
    startTime,
    endTime,
    isBooked: false,
    isActive: true,
  });
};

export const findOverlappingSlot = async (
  doctorId: string,
  branchId: string,
  slotDate: string,
  startTime: string,
  endTime: string
) => {
  return DoctorSlot.findOne({
    where: {
      doctorId,
      branchId,
      slotDate,
      startTime,
      endTime,
    },
  });
};

export const findSlotsByIdsForUpdate = async (
  slotIds: string[],
  transaction: Transaction
) => {
  const uniqueSortedIds = [...new Set(slotIds)].sort();

  return DoctorSlot.findAll({
    where: {
      id: uniqueSortedIds,
    },
    transaction,
    lock: transaction.LOCK.UPDATE as FindOptions['lock'],
    order: [['id', 'ASC']],
  });
};
