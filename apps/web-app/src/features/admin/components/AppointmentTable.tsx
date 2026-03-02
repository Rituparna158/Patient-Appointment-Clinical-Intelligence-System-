import {
  TableRow,
  TableCell,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import StatusBadge from "@/features/shared/components/StatusBadge"
import ConfirmDialog from "@/features/shared/components/ConfirmDialog"
import DataTable from "@/features/shared/components/DataTable"

import type { AppointmentTableProps } from "../types/appointment.types"

export default function AppointmentTable({
  appointments,
  onCancel,
}: AppointmentTableProps) {
  return (
    <DataTable
      headers={[
        "Status",
        "Payment",
        "Doctor",
        "Branch",
        "Actions",
      ]}
    >
      {appointments.map((appt) => (
        <TableRow key={appt.id}>
          <TableCell>
            <StatusBadge status={appt.status} />
          </TableCell>

          <TableCell>
            <StatusBadge status={appt.paymentStatus} />
          </TableCell>

          <TableCell>{appt.doctorId}</TableCell>
          <TableCell>{appt.branchId}</TableCell>

          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem>
                      Cancel Appointment
                    </DropdownMenuItem>
                  }
                  title="Cancel Appointment?"
                  description="If payment was made, refund will be triggered."
                  onConfirm={() => onCancel(appt.id)}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </DataTable>
  )
}
