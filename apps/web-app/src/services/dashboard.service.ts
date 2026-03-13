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
  DoctorCompletionRate,
  DoctorPatientTypes,
  DoctorWorkloadTrend,
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

  async getDoctorTrend(range?: string): Promise<DoctorWorkloadTrend[]> {
    const res = await api(
      `/reports-analytics/analytics/doctor/charts/workload?range=${range}`
    );

    return res.data;
  },

  async getDoctorCompletion(range?: string): Promise<DoctorCompletionRate> {
    const res = await api(
      `/reports-analytics/analytics/doctor/charts/completion-rate?range=${range}`
    );

    return res.data;
  },

  async getDoctorPatients(range?: string): Promise<DoctorPatientTypes> {
    const res = await api(
      `/reports-analytics/analytics/doctor/charts/patient-types?range=${range}`
    );

    return res.data;
  },
};
