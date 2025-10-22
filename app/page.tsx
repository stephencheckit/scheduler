import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Globe } from "lucide-react"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Embeddable Appointment Scheduling
            </h1>
            <p className="text-xl text-zinc-600 mb-8">
              Sync your Google Calendar, set your availability, and let visitors book appointments directly from your website.
            </p>
            <form action={async () => {
              "use server"
              const { signIn } = await import("@/lib/auth")
              await signIn("google", { redirectTo: "/dashboard" })
            }}>
              <Button type="submit" className="text-lg px-8 py-6">
                <Globe className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 mb-4">
                <Calendar className="h-6 w-6 text-zinc-900" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sync Calendar</h3>
              <p className="text-zinc-600">
                Connect your Google Calendar to automatically check availability
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 mb-4">
                <Clock className="h-6 w-6 text-zinc-900" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Set Hours</h3>
              <p className="text-zinc-600">
                Define your availability by day of week and time
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 mb-4">
                <Globe className="h-6 w-6 text-zinc-900" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Embed Widget</h3>
              <p className="text-zinc-600">
                Copy the code snippet and paste it into your website
              </p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ol className="space-y-3 text-zinc-600">
              <li className="flex items-start">
                <span className="font-semibold text-zinc-900 mr-2">1.</span>
                Sign in with your Google account
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-zinc-900 mr-2">2.</span>
                Set your weekly availability hours
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-zinc-900 mr-2">3.</span>
                Copy the embed code for your website
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-zinc-900 mr-2">4.</span>
                Visitors can book 30-minute appointments
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-zinc-900 mr-2">5.</span>
                Both you and your visitor receive email confirmations
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
