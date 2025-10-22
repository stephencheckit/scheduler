import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, Code, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="font-semibold text-lg">
                Scheduler
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/dashboard/availability"
                  className="flex items-center text-sm text-zinc-600 hover:text-zinc-900"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Availability
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="flex items-center text-sm text-zinc-600 hover:text-zinc-900"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Bookings
                </Link>
                <Link
                  href="/dashboard/embed"
                  className="flex items-center text-sm text-zinc-600 hover:text-zinc-900"
                >
                  <Code className="h-4 w-4 mr-1" />
                  Embed
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-zinc-600">{session.user?.email}</span>
              <form action={async () => {
                "use server"
                const { signOut } = await import("@/lib/auth")
                await signOut({ redirectTo: "/" })
              }}>
                <Button variant="ghost" type="submit">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

