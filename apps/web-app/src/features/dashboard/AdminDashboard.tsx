import { useEffect } from "react"
 
import DashboardLayout from "@/app/layout/AppLayout"
 
import { useDashboardStore } from "../../store/dashboard/dashboard.store"
 
import DashboardCounters from "./components/DashboardCounters"
import AppointmentTrendChart from "./components/AppointmentTrendChart"
import AppointmentStatusChart from "./components/AppointmentStatusChart"
import DashboardTable from "./components/DashboardTable"
import ExportButton from "./components/ExportButton"
 
export default function AdminDashboard() {
 
  const {
    counters,
    status,
    trend,
    range,
    page,
    sortBy,
    sortOrder,
    from,
    to,
    setRange,
    fetchAdminDashboard
  } = useDashboardStore()
 
  useEffect(() => {
 
    fetchAdminDashboard()
 
  }, [ range, page , sortBy , sortOrder , from , to])
 
  return (
 
    <DashboardLayout>
 
      <div className="space-y-6">
 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview of clinic operations and appointments
            </p>
          </div>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
 
          <ExportButton/>
 
        </div>
 
        {counters && (
          <DashboardCounters data={counters}/>
        )}
 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentTrendChart data={trend}/>
          {status && (
            <AppointmentStatusChart data={status}/>
          )}
 
        </div>
        <DashboardTable/>
      </div>
 
    </DashboardLayout>
 
  )
}

  // const result: CSVRow[] = rows.map((r)=>({

  //   date:r.date,
  //   totalAppointments:r.totalAppointments,
  //   completedAppointments:r.completedAppointments,
  //   cancelledAppointments:r.cancelledAppointments,
  //   missedAppointments:r.missedAppointments,
  //   newPatients:r.newPatients,
  //   uniquePatients:r.uniquePatients,
  //   followUpsScheduled:r.followUpsScheduled

  // }));