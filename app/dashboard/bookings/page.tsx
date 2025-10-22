import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"
import { Calendar } from "lucide-react"

export default async function BookingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      startTime: "asc",
    },
  })

  const now = new Date()
  const upcomingBookings = bookings.filter(b => b.startTime > now && b.status === "confirmed")
  const pastBookings = bookings.filter(b => b.startTime <= now || b.status !== "confirmed")

  return (
    <div className="max-w-4xl">
      <div className="flex items-center mb-6">
        <Calendar className="h-8 w-8 mr-3" />
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-zinc-600">View your appointments</p>
        </div>
      </div>

      {upcomingBookings.length === 0 && pastBookings.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
          <p className="text-zinc-600">
            When visitors book appointments, they will appear here
          </p>
        </div>
      )}

      {upcomingBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-zinc-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{booking.guestName}</h3>
                    <p className="text-sm text-zinc-600">{booking.guestEmail}</p>
                    {booking.guestNotes && (
                      <p className="text-sm text-zinc-600 mt-2">{booking.guestNotes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {format(booking.startTime, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {format(booking.startTime, "h:mm a")} - {format(booking.endTime, "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 opacity-75"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.guestName}</h3>
                    <p className="text-sm text-zinc-600">{booking.guestEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {format(booking.startTime, "MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {format(booking.startTime, "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

