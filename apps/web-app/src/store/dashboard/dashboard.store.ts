import { create } from 'zustand';
import { DashboardService } from '../../services/dashboard.service';

import type { DashboardState } from '../../types/dashboard.types';

export const useDashboardStore = create<DashboardState>((set, get) => ({
  counters: null,
  doctorDashboard: null,
  patientDashboard: null,

  status: null,
  trend: [],

  doctorTrend: [],
  completionRate: null,
  patientTypes: null,

  rows: [],
  total: 0,

  page: 1,
  limit: 10,

  range: 'week',

  sortBy: undefined,
  sortOrder: undefined,

  from: undefined,
  to: undefined,

  async fetchAdminDashboard() {
    const { range } = get();

    const counters = await DashboardService.getCounters(range);
    const status = await DashboardService.getStatus(range);
    const trend = await DashboardService.getTrend(range);

    set({ counters, status, trend });
  },

  async fetchDoctorDashboard() {
    const res = await DashboardService.getDoctorDashboard();

    set({
      doctorDashboard: res,
    });
  },

  async fetchPatientDashboard() {
    const res = await DashboardService.getPatientDashboard();
    set({
      patientDashboard: res,
    });
  },
  async fetchDoctorCharts() {
    const { range } = get();

    const trend = await DashboardService.getDoctorTrend(range);
    const completionRate = await DashboardService.getDoctorCompletion(range);
    const patientTypes = await DashboardService.getDoctorPatients(range);

    set({ doctorTrend: trend, completionRate, patientTypes });
  },
  async fetchAdminTable() {
    const { page, limit, from, to, sortBy, sortOrder } = get();

    const params = new URLSearchParams();

    params.set('page', String(page));
    params.set('limit', String(limit));

    if (from) params.set('from', from);
    if (to) params.set('to', to);

    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);

    const res = await DashboardService.getDaily(`?${params.toString()}`);

    set({
      rows: res.rows,
      total: res.total,
    });
  },
  async fetchDoctorTable() {
    const { page, limit, from, to, sortBy, sortOrder } = get();

    const params = new URLSearchParams();

    params.set('page', String(page));
    params.set('limit', String(limit));

    if (from) params.set('from', from);
    if (to) params.set('to', to);

    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);

    const res = await DashboardService.getDoctorTable(`?${params.toString()}`);

    set({
      //rows: res.rows,
      total: res.total,
    });
  },
  async fetchPatientTable() {
    const { page, limit, from, to, sortBy, sortOrder } = get();

    const params = new URLSearchParams();

    params.set('page', String(page));
    params.set('limit', String(limit));

    if (from) params.set('from', from);
    if (to) params.set('to', to);

    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);

    const res = await DashboardService.getPatientTable(`?${params.toString()}`);

    set({
      // rows: res.rows,
      total: res.total,
    });
  },

  setRange(range) {
    set({ range });
    //get().fetchAdminDashboard();
  },

  setPage(page) {
    set({ page });
  },

  setSort(key) {
    const { sortBy, sortOrder } = get();

    const order = sortBy === key && sortOrder === 'ASC' ? 'DESC' : 'ASC';

    set({
      sortBy: key,
      sortOrder: order,
    });
  },

  setFrom(v) {
    set({ from: v });
  },

  setTo(v) {
    set({ to: v });
  },
}));
