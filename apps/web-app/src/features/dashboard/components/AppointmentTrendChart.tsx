import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

import type { AppointmentTrendProps } from "../../../types/dashboard.types"


export default function AppointmentTrendChart({ data }: AppointmentTrendProps) {

  return (

    <div className="border rounded-lg p-4 bg-card text-card-foreground">

      <h3 className="font-semibold mb-4">
        Appointment Trend
      </h3>

      <ResponsiveContainer width="100%" height={260}>

        <AreaChart data={data}>

          <defs>

            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>

            </linearGradient>

          </defs>

          <XAxis dataKey="date"/>

          <YAxis/>

          <Tooltip/>

          <Area
            type="monotone"
            dataKey="totalAppointments"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorTrend)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  )
}
