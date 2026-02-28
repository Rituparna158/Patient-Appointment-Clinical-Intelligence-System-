import { api } from './api';
import type {
  Appointment,
  Slot,
  AppointmentStatus,
} from '@/types/appointment.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const AppointmentService = {
  async book(data: {
    doctorId: string;
    branchId: string;
    slotId: string;
    appointmentReason?: string;
  }): Promise<Appointment> {
    const res: ApiResponse<Appointment> = await api('/appointments/book', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.data;
  },

  async pay(appointmentId: string): Promise<Appointment> {
    const res: ApiResponse<Appointment> = await api('/appointments/pay', {
      method: 'POST',
      body: JSON.stringify({
        appointmentId,
        //PaymentStatus: "paid",
      }),
    });

    return res.data;
  },

  async myAppointments(page = 1, limit = 10) {
    const res: ApiResponse<any> = await api(
      `/appointments/me?page=${page}&limit=${limit}`
    );

    return res.data;
  },

  async doctorAppointments(doctorId: string, page = 1, limit = 10) {
    const res: ApiResponse<any> = await api(
      `/appointments/doctor/${doctorId}?page=${page}&limit=${limit}`
    );

    return res.data;
  },

  async updateStatus(
    id: string,
    status: AppointmentStatus
  ): Promise<Appointment> {
    const res: ApiResponse<Appointment> = await api(
      `/appointments/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );

    return res.data;
  },

  async adminSearch(page = 1, limit = 10) {
    const res: ApiResponse<any> = await api(
      `/appointments?page=${page}&limit=${limit}`
    );

    return res.data;
  },

  async createSlot(data: {
    doctorId: string;
    branchId: string;
    startTime: string;
    endTime: string;
  }): Promise<Slot> {
    const res: ApiResponse<Slot> = await api(
      '/appointments/admin/create-slot',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    return res.data;
  },

  async getAvailableSlots(doctorId: string, date: string): Promise<Slot[]> {
    const res: ApiResponse<Slot[]> = await api(
      `/appointments/slots?doctorId=${doctorId}&date=${date}`
    );

    return res.data;
  },

  getDoctorAppointments(page = 1, limit = 10) {
    return api(`/appointments/doctor/me?page=${page}&limit=${limit}`);
  },

  changeStatus(appointmentId: string, status: string) {
    return api(`/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
