import type { WorkloadRowProps } from "@/types/dashboard.types"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"


export default function DoctorWorkloadTrendChart({ data }: WorkloadRowProps) {

  return (

    <div className="border rounded-lg p-4 bg-white">

      <h3 className="font-semibold mb-4">
        Workload Trend
      </h3>

      <ResponsiveContainer width="100%" height={260}>

        <AreaChart data={data}>

          <defs>

            <linearGradient id="doctorTrend" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>

            </linearGradient>

          </defs>

          <XAxis dataKey="date"/>

          <YAxis/>

          <Tooltip/>

          <Area
            type="monotone"
            dataKey="totalAppointments"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#doctorTrend)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  )
}




