import { useEffect, useState } from "react"
import { useAppointmentStore } from "../store/appointment.store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AppointmentList() {
  const appointments = useAppointmentStore(s => s.appointments)
  const loading = useAppointmentStore(s => s.loading)
  const page = useAppointmentStore(s => s.page)
  const total = useAppointmentStore(s => s.total)
  const limit = useAppointmentStore(s => s.limit)
  const search = useAppointmentStore(s => s.search)
  const statusFilter = useAppointmentStore(s => s.statusFilter)

  const setSearch = useAppointmentStore(s => s.setSearch)
  const setStatusFilter = useAppointmentStore(s => s.setStatusFilter)
  const setPage = useAppointmentStore(s => s.setPage)
  const fetchAppointments = useAppointmentStore(s => s.fetchAppointments)

  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    fetchAppointments()
  }, [page, debouncedSearch, statusFilter])

  const totalPages =
    total > 0 ? Math.ceil(total / limit) : 1

  return (
    <div className="page-container">
      <h2 className="page-heading">
        Appointments
      </h2>

      <div className="table-filters">
        <Input
          placeholder="Search doctor or patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="select-content-fix">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="table-wrapper">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {appointment.Doctor?.user?.full_name ?? "-"}
                  </TableCell>

                  <TableCell>
                    {appointment.Patient?.user?.full_name ?? "-"}
                  </TableCell>

                  <TableCell>
                    {appointment.slot?.slotDate ?? "-"} <br />
                    {appointment.slot?.startTime ?? ""} -{" "}
                    {appointment.slot?.endTime ?? ""}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`status-${appointment.status}`}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {appointment.paymentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="table-pagination">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          <Button
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}


