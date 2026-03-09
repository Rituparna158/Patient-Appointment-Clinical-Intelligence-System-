import type { AppointmentTableQuery } from '@/types/table.types';
import { api } from './api';
// import type {
//   Appointment,
//   Slot,
//   AppointmentStatus,
// } from '@/types/appointment.types';

// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

// export const AppointmentService = {
//   async book(data: {
//     doctorId: string;
//     branchId: string;
//     slotId: string;
//     appointmentReason?: string;
//   }): Promise<Appointment> {
//     const res: ApiResponse<Appointment> = await api('/appointments/book', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });

//     return res.data;
//   },

//   async pay(appointmentId: string): Promise<Appointment> {
//     const res: ApiResponse<Appointment> = await api('/appointments/pay', {
//       method: 'POST',
//       body: JSON.stringify({
//         appointmentId,
//         //PaymentStatus: "paid",
//       }),
//     });

//     return res.data;
//   },

//   async myAppointments(page = 1, limit = 10) {
//     const res: ApiResponse<any> = await api(
//       `/appointments/me?page=${page}&limit=${limit}`
//     );

//     return res.data;
//   },

//   async doctorAppointments(doctorId: string, page = 1, limit = 10) {
//     const res: ApiResponse<any> = await api(
//       `/appointments/doctor/${doctorId}?page=${page}&limit=${limit}`
//     );

//     return res.data;
//   },

//   async updateStatus(
//     id: string,
//     status: AppointmentStatus
//   ): Promise<Appointment> {
//     const res: ApiResponse<Appointment> = await api(
//       `/appointments/${id}/status`,
//       {
//         method: 'PATCH',
//         body: JSON.stringify({ status }),
//       }
//     );

//     return res.data;
//   },

//   async adminSearch(params: {
//     page: number;
//     limit: number;
//     search?: string;
//     status?: string;
//   }) {
//     const query = new URLSearchParams({
//       page: String(params.page),
//       limit: String(params.limit),
//       ...(params.search ? { search: params.search } : {}),
//       ...(params.status ? { status: params.status } : {}),
//     }).toString();

//     const res = await api(`/appointments?${query}`);

//     return res.data;
//   },
//   async createSlot(data: {
//     doctorId: string;
//     branchId: string;
//     startTime: string;
//     endTime: string;
//   }): Promise<Slot> {
//     const res: ApiResponse<Slot> = await api(
//       '/appointments/admin/create-slot',
//       {
//         method: 'POST',
//         body: JSON.stringify(data),
//       }
//     );

//     return res.data;
//   },

//   async getAvailableSlots(doctorId: string, date: string): Promise<Slot[]> {
//     const res: ApiResponse<Slot[]> = await api(
//       `/appointments/slots?doctorId=${doctorId}&date=${date}`
//     );

//     return res.data;
//   },

//  async getDoctorAppointments(query: AppointmentTableQuery) {

//   const params = new URLSearchParams()

//   params.append("page", query.page.toString())
//   params.append("limit", query.limit.toString())

//   if (query.search) params.append("search", query.search)
//   if (query.sortBy) params.append("sortBy", query.sortBy)
//   if (query.sortOrder) params.append("sortOrder", query.sortOrder)

//   if (query.status) params.append("status", query.status)
//   if (query.branchId) params.append("branchId", query.branchId)

//   if (query.fromDate) params.append("fromDate", query.fromDate)
//   if (query.toDate) params.append("toDate", query.toDate)

//   return api(`/appointments/doctor/me?${params.toString()}`)
// },

//   changeStatus(appointmentId: string, status: string) {
//     return api(`/appointments/${appointmentId}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ status }),
//     });
//   },

//   async getDoctors() {
//     const res = await api('/appointments/doctors');
//     return res.data;
//   },

//   async getBranches() {
//     const res = await api('/appointments/branches');
//     return res.data;
//   },

//   async createBranch(data: { name: string; address: string; phone: string }) {
//     const res = await api('/appointments/', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//     return res.data;
//   },

//   async cancelWithRefund(id: string) {
//     return api(`/appointments/${id}/cancel-refund`, {
//       method: 'PATCH',
//     });
//   },

//   async reschedule(id: string, newSlotId: string) {
//     return api(`/appointments/${id}/reschedule`, {
//       method: 'PATCH',
//       body: JSON.stringify({ newSlotId }),
//     });
//   },

//   // async getAvailableSlotsForDoctor() {
//   //   const res = await api('/appointments/branches');
//   // }
// };
import type {
  Appointment,
  Slot,
  AppointmentStatus,
  ApiResponse,
  PaginatedAppointments,
} from '@/types/appointment.types';

function buildQuery(query: AppointmentTableQuery) {
  const params = new URLSearchParams();

  params.append('page', query.page.toString());
  params.append('limit', query.limit.toString());

  if (query.search?.trim()) params.append('search', query.search);

  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.sortOrder) params.append('sortOrder', query.sortOrder);

  if (query.status) params.append('status', query.status);

  if (query.branchId) params.append('branchId', query.branchId);

  if (query.fromDate) params.append('fromDate', query.fromDate);
  if (query.toDate) params.append('toDate', query.toDate);

  return params.toString();
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
      body: JSON.stringify({ appointmentId }),
    });

    return res.data;
  },

  async getMyAppointments(
    query: AppointmentTableQuery
  ): Promise<PaginatedAppointments> {
    const qs = buildQuery(query);

    const res: ApiResponse<PaginatedAppointments> = await api(
      `/appointments/me?${qs}`
    );

    return res.data;
  },

  async getDoctorAppointments(
    query: AppointmentTableQuery
  ): Promise<PaginatedAppointments> {
    const qs = buildQuery(query);

    const res: ApiResponse<PaginatedAppointments> = await api(
      `/appointments/doctor/me?${qs}`
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

  async adminSearch(
    query: AppointmentTableQuery
  ): Promise<PaginatedAppointments> {
    const qs = buildQuery(query);

    const res: ApiResponse<PaginatedAppointments> = await api(
      `/appointments?${qs}`
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

  async getDoctors() {
    const res = await api('/appointments/doctors');

    return res.data;
  },

  async getBranches() {
    const res = await api('/appointments/branches');

    return res.data;
  },

  async createBranch(data: { name: string; address: string; phone: string }) {
    const res = await api('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return res.data;
  },

  async cancelWithRefund(id: string) {
    return api(`/appointments/${id}/cancel-refund`, {
      method: 'PATCH',
    });
  },

  async reschedule(id: string, newSlotId: string) {
    return api(`/appointments/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify({ newSlotId }),
    });
  },
};
