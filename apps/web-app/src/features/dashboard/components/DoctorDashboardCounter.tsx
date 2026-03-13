import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

import type { DoctorDashboardCountersProps } from "../../../types/dashboard.types"
import { CalendarDays, CheckCircle, XCircle } from "lucide-react"

export default function DoctorDashboardCounters({ data }: DoctorDashboardCountersProps) {

  const counters = [

    {
      label: "Today Appointments",
      value: data.todayAppointments,
      color: "border-blue-500",
      icon: CalendarDays,
      iconColor: "text-blue-500"
    },

    {
      label: "Completed",
      value: data.completedAppointments,
      color: "border-green-500",
      icon: CheckCircle,
      iconColor: "text-green-500"
    },

    {
      label: "Cancelled",
      value: data.cancelledAppointments,
      color: "border-purple-500",
      icon: XCircle,
      iconColor: "text-red-500"
    },

  ]
 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 
      {counters.map((c) => {
        const Icon = c.icon
 
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className={`border-l-4 ${c.color}`}>
              <CardContent className="p-4 flex items-center justify-between">
 
                {/* TEXT */}
                <div>
                  <p className="text-sm text-muted-foreground">
                    {c.label}
                  </p>
 
                  <p className="text-3xl font-bold">
                    {c.value}
                  </p>
                </div>
 
                {/* ICON */}
                <div className="p-2 rounded-lg bg-muted/40">
                  <Icon className={`w-6 h-6 ${c.iconColor}`} />
                </div>
 
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
 
    </div>
  )
}
 