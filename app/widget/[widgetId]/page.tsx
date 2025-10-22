"use client"

import { useState, useEffect } from "react"
import { CalendarView } from "@/components/booking/calendar-view"
import { TimeSlots } from "@/components/booking/time-slots"
import { BookingForm } from "@/components/booking/booking-form"
import { format, parse, setHours, setMinutes } from "date-fns"
import { Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WidgetPage({ params }: { params: { widgetId: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (selectedDate) {
      fetchSlots()
    }
  }, [selectedDate])

  async function fetchSlots() {
    if (!selectedDate) return
    
    setLoadingSlots(true)
    setSelectedSlot(null)
    setSlots([])
    
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const res = await fetch(`/api/slots?widgetId=${params.widgetId}&date=${dateStr}`)
      
      if (res.ok) {
        const data = await res.json()
        setSlots(data.slots || [])
      } else {
        setError("Failed to load available times")
      }
    } catch (error) {
      setError("Failed to load available times")
    } finally {
      setLoadingSlots(false)
    }
  }

  async function handleBooking(data: { name: string; email: string; notes: string }) {
    if (!selectedDate || !selectedSlot) return

    setBooking(true)
    setError("")

    try {
      // Parse the selected slot time (HH:mm) and combine with date
      const [hours, minutes] = selectedSlot.split(":").map(Number)
      const startTime = setMinutes(setHours(selectedDate, hours), minutes)

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetId: params.widgetId,
          guestName: data.name,
          guestEmail: data.email,
          guestNotes: data.notes,
          startTime: startTime.toISOString(),
        }),
      })

      if (res.ok) {
        setBooked(true)
      } else {
        const errorData = await res.json()
        setError(errorData.error || "Failed to book appointment")
      }
    } catch (error) {
      setError("Failed to book appointment")
    } finally {
      setBooking(false)
    }
  }

  function resetBooking() {
    setBooked(false)
    setSelectedDate(null)
    setSelectedSlot(null)
    setSlots([])
    setError("")
  }

  if (booked) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-zinc-200 rounded-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-zinc-600 mb-4">
            Your appointment has been scheduled for{" "}
            <strong>{selectedDate && format(selectedDate, "MMMM d, yyyy")}</strong> at{" "}
            <strong>{selectedSlot}</strong>
          </p>
          <p className="text-sm text-zinc-600 mb-6">
            You will receive a confirmation email shortly with calendar invite.
          </p>
          <Button onClick={resetBooking} variant="outline" className="w-full">
            Book Another Appointment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 text-white mb-4">
            <Calendar className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-zinc-600">Select a date and time that works for you</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          <div className="space-y-6">
            {selectedDate && (
              <>
                <TimeSlots
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  loading={loadingSlots}
                />

                {selectedSlot && (
                  <BookingForm
                    onSubmit={handleBooking}
                    loading={booking}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

