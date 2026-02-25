import { DoctorSlot } from '../models/doctorSlot.model';

export const findSlotById = (slotId: string) =>
  DoctorSlot.findOne({
    where: { id: slotId, isActive: true },
  });

export const findAvailableSlots = (doctorId: string, date: string) =>
  DoctorSlot.findAll({
    where: {
      doctorId,
      slotDate: date,
      isBooked: false,
      isActive: true,
    },
    order: [['startTime', 'ASC']],
  });

export const markSlotBooked = (slot: DoctorSlot) =>
  slot.update({ isBooked: true });

export const releaseSlot = (slot: DoctorSlot) =>
  slot.update({ isBooked: false });

export const createSlot = async (
  doctorId: string,
  branchId: string,
  slotDate: string,
  startTime: Date,
  endTime: Date
) => {
  return DoctorSlot.create({
    doctorId,
    branchId,
    slotDate,
    startTime,
    endTime,
    isBooked: false,
  });
};

export const findOverlappingSlot = async (
  doctorId: string,
  branchId: string,
  startTime: Date,
  endTime: Date
) => {
  return DoctorSlot.findOne({
    where: {
      doctorId,
      branchId,
      startTime,
      endTime,
    },
  });
};
