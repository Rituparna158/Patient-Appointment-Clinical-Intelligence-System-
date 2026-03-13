import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

import type { DashboardCountersProps } from "../../../types/dashboard.types"
import { Calendar, CheckCircle, RefreshCw, UserPlus } from "lucide-react"

export default function DashboardCounters({ data }: DashboardCountersProps) {

  const counters = [

    {
      label: "Total Appointments",
      value: data.totalAppointments,
      color: "border-blue-500",
      icon: Calendar,
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
      label: "New Patients",
      value: data.newPatients,
      color: "border-purple-500",
      icon: UserPlus,
      iconColor: "text-purple-500"
    },

    {
      label: "Follow Ups",
      value: data.followUpsScheduled,
      color: "border-orange-500",
      icon: RefreshCw,
      iconColor: "text-orange-500"
    }

  ]

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 
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





