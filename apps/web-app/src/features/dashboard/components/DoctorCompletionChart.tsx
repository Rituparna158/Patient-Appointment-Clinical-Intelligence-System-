import type { CompletionRateProps } from "@/types/dashboard.types"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"



export default function DoctorCompletionChart({ data }: CompletionRateProps) {

  const chartData = [
    { name: "Completed", value: data.completed },
    { name: "Pending", value: data.pending },
    { name: "Cancelled", value: data.cancelled }
  ]

  const colors = [
    "#22c55e",
    "#3b82f6",
    "#ef4444"
  ]

  return (

    <div className="border rounded-lg p-4 bg-card text-card-foreground">

      <h3 className="font-semibold mb-4">
        Appointment Completion
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

