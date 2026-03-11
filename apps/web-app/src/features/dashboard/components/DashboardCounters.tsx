import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

import type { DashboardCountersProps } from "../../../types/dashboard.types"

export default function DashboardCounters({ data }: DashboardCountersProps) {

  const counters = [

    {
      label: "Total Appointments",
      value: data.totalAppointments,
      color: "border-blue-500"
    },

    {
      label: "Completed",
      value: data.completedAppointments,
      color: "border-green-500"
    },

    {
      label: "New Patients",
      value: data.newPatients,
      color: "border-purple-500"
    },

    {
      label: "Follow Ups",
      value: data.followUpsScheduled,
      color: "border-orange-500"
    }

  ]

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {counters.map(c => (

        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <Card className={`border-l-4 ${c.color}`}>

            <CardContent className="p-4">

              <p className="text-sm text-muted-foreground">
                {c.label}
              </p>

              <p className="text-3xl font-bold">
                {c.value}
              </p>

            </CardContent>

          </Card>

        </motion.div>

      ))}

    </div>

  )
}





