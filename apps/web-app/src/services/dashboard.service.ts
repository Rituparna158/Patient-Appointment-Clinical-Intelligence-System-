import { api } from '@/services/api';

import type {
  DashboardCounters,
  DoctorDashboard,
  AppointmentTrend,
  AppointmentStatus,
  DashboardTableResponse,
  PatientDashboard,
  PatientDashboardTableResponse,
  DoctorDashboardTableResponse,
} from '../types/dashboard.types';

export const DashboardService = {
  async getCounters(range?: string): Promise<DashboardCounters> {
    const res = await api(
      `/reports-analytics/analytics/admin/dashboard/counters?range=${range}`
    );
    return res.data;
  },

  async getStatus(range?: string): Promise<AppointmentStatus> {
    const res = await api(
      `/reports-analytics/analytics/admin/dashboard/status?range=${range}`
    );
    return res.data;
  },

  async getTrend(range?: string): Promise<AppointmentTrend[]> {
    const res = await api(
      `/reports-analytics/analytics/admin/dashboard/trend?range=${range}`
    );
    return res.data;
  },

  async getDaily(query: string): Promise<DashboardTableResponse> {
    const res = await api(
      `/reports-analytics/analytics/admin/dashboard/daily${query}`
    );
    return res;
  },

  async getDoctorDashboard(): Promise<DoctorDashboard> {
    const res = await api(`/reports-analytics/analytics/doctor/dashboard`);
    return res.data;
  },

  async getPatientDashboard(): Promise<PatientDashboard> {
    const res = await api(`/reports-analytics/analytics/patient/dashboard`);
    return res.data;
  },

  async getDoctorTable(query: string): Promise<DoctorDashboardTableResponse> {
    const res = await api(
      `/reports-analytics/analytics/doctor/dashboard/table${query}`
    );
    return res;
  },

  async getPatientTable(query: string): Promise<PatientDashboardTableResponse> {
    const res = await api(
      `/reports-analytics/analytics/patient/dashboard/table${query}`
    );
    return res;
  },
  //    async getDoctorCounters(): Promise<DoctorDashboardCounters> {
  //     const res = await api(`/reports-analytics/analytics/doctor`)
  //     return res.data
  //   }
};
