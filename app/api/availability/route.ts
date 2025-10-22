import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const availabilitySchema = z.object({
  availability: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime: z.string().regex(/^\d{2}:\d{2}$/),
    })
  ),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const availability = await db.availability.findMany({
      where: { userId: session.user.id },
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
      },
    })

    return NextResponse.json(availability)
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { availability } = availabilitySchema.parse(body)

    // Delete existing availability
    await db.availability.deleteMany({
      where: { userId: session.user.id },
    })

    // Create new availability
    await db.availability.createMany({
      data: availability.map((slot) => ({
        ...slot,
        userId: session.user.id!,
      })),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving availability:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

