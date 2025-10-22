import { db } from "@/lib/db"
import { isSlotAvailable } from "@/lib/availability"
import { createCalendarEvent } from "@/lib/google-calendar"
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email"
import { NextResponse } from "next/server"
import { z } from "zod"
import { addMinutes } from "date-fns"

const bookingSchema = z.object({
  widgetId: z.string(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestNotes: z.string().optional(),
  startTime: z.string().datetime(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { widgetId, guestName, guestEmail, guestNotes, startTime } = bookingSchema.parse(body)

    // Find user by widget ID
    const user = await db.user.findUnique({
      where: { widgetId },
    })

    if (!user) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    const startTimeDate = new Date(startTime)
    const endTimeDate = addMinutes(startTimeDate, 30)

    // Check if slot is still available
    const available = await isSlotAvailable(user.id, startTimeDate, endTimeDate)

    if (!available) {
      return NextResponse.json(
        { error: "This time slot is no longer available" },
        { status: 409 }
      )
    }

    // Create booking in transaction
    const booking = await db.booking.create({
      data: {
        userId: user.id,
        guestName,
        guestEmail,
        guestNotes: guestNotes || null,
        startTime: startTimeDate,
        endTime: endTimeDate,
        timeZone: user.timeZone,
        status: "confirmed",
      },
    })

    // Create Google Calendar event (async, don't block)
    createCalendarEvent(user.id, {
      guestName,
      guestEmail,
      startTime: startTimeDate,
      endTime: endTimeDate,
      guestNotes,
    })
      .then((eventId) => {
        if (eventId) {
          db.booking.update({
            where: { id: booking.id },
            data: { googleEventId: eventId },
          })
        }
      })
      .catch((error) => console.error("Error creating calendar event:", error))

    // Send emails (async, don't block)
    sendBookingConfirmation(
      {
        guestName,
        guestEmail,
        startTime: startTimeDate,
        endTime: endTimeDate,
        guestNotes,
      },
      { email: user.email, name: user.name }
    ).catch((error) => console.error("Error sending confirmation:", error))

    sendAdminNotification(
      {
        guestName,
        guestEmail,
        startTime: startTimeDate,
        endTime: endTimeDate,
        guestNotes,
      },
      user.email
    ).catch((error) => console.error("Error sending notification:", error))

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error("Error creating booking:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid booking data", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

