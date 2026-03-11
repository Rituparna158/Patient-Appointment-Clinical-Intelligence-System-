import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import type { AppointmentStatusProps } from "../../../types/dashboard.types"

export default function AppointmentStatusChart({ data }: AppointmentStatusProps) {

  const chartData = [

    { name: "Confirmed", value: data.confirmedAppointments },
    { name: "Completed", value: data.completedAppointments },
    { name: "Cancelled", value: data.cancelledAppointments },
    { name: "Missed", value: data.missedAppointments }

  ]

  const colors = [
    "#3b82f6",
    "#22c55e",
    "#ef4444",
    "#f59e0b"
  ]

  return (

    <div className="border rounded-lg p-4 bg-white">

      <h3 className="font-semibold mb-4">
        Appointment Status
      </h3>

      <ResponsiveContainer width="100%" height={260}>

        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
          >

            {chartData.map((_, i) => (

              <Cell key={i} fill={colors[i]}/>

            ))}

          </Pie>

          <Tooltip/>

        </PieChart>

      </ResponsiveContainer>

    </div>

  )
}

