import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import type { PatientTypesProps } from "@/types/dashboard.types"

export default function DoctorPatientTypeChart({ data }: PatientTypesProps) {

  const chartData = [

    { name: "New Patients", value: data.newPatients },
    { name: "Returning", value: data.returningPatients }

  ]

  const colors = [
    "#6366f1",
    "#14b8a6"
  ]

  return (

    <div className="border rounded-lg p-4 bg-white">

      <h3 className="font-semibold mb-4">
        Patient Types
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