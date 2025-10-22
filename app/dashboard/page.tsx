import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { startOfWeek, endOfWeek } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Code } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  const weekStart = startOfWeek(new Date())
  const weekEnd = endOfWeek(new Date())

  const bookingsThisWeek = await db.booking.count({
    where: {
      userId: session.user.id,
      startTime: {
        gte: weekStart,
        lte: weekEnd,
      },
      status: "confirmed",
    },
  })

  const hasAvailability = await db.availability.count({
    where: { userId: session.user.id },
  })

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Welcome back{user?.name ? `, ${user.name}` : ""}!</h1>
      <p className="text-zinc-600 mb-8">Manage your appointments and availability</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Bookings This Week</h3>
            <Calendar className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-3xl font-bold">{bookingsThisWeek}</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Availability Set</h3>
            <Clock className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-3xl font-bold">{hasAvailability > 0 ? "Yes" : "No"}</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Widget ID</h3>
            <Code className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm font-mono truncate">{user?.widgetId}</p>
        </div>
      </div>

      {hasAvailability === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Get Started</h3>
          <p className="text-blue-800 mb-4">
            Set your availability to start accepting bookings
          </p>
          <Link href="/dashboard/availability">
            <Button>Set Availability</Button>
          </Link>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link href="/dashboard/availability" className="block">
            <div className="p-4 border border-zinc-200 rounded hover:border-zinc-300 transition">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-zinc-600" />
                <div>
                  <h3 className="font-medium">Manage Availability</h3>
                  <p className="text-sm text-zinc-600">Set your weekly schedule</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/bookings" className="block">
            <div className="p-4 border border-zinc-200 rounded hover:border-zinc-300 transition">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-zinc-600" />
                <div>
                  <h3 className="font-medium">View Bookings</h3>
                  <p className="text-sm text-zinc-600">See your upcoming appointments</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/embed" className="block">
            <div className="p-4 border border-zinc-200 rounded hover:border-zinc-300 transition">
              <div className="flex items-center">
                <Code className="h-5 w-5 mr-3 text-zinc-600" />
                <div>
                  <h3 className="font-medium">Get Embed Code</h3>
                  <p className="text-sm text-zinc-600">Add the widget to your website</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

