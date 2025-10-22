import { db } from "@/lib/db"
import { getAvailableSlots } from "@/lib/availability"
import { NextResponse } from "next/server"
import { z } from "zod"

const slotsSchema = z.object({
  widgetId: z.string(),
  date: z.string(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const widgetId = searchParams.get("widgetId")
    const date = searchParams.get("date")

    if (!widgetId || !date) {
      return NextResponse.json(
        { error: "Missing widgetId or date" },
        { status: 400 }
      )
    }

    // Find user by widget ID
    const user = await db.user.findUnique({
      where: { widgetId },
    })

    if (!user) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 })
    }

    const dateObj = new Date(date)
    const slots = await getAvailableSlots(user.id, dateObj, user.timeZone)

    return NextResponse.json({ slots })
  } catch (error) {
    console.error("Error fetching slots:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

