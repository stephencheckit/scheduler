import { db } from './db'
import { getBusyTimes } from './google-calendar'
import { startOfDay, endOfDay, addMinutes, format, parse, getDay } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'

export async function getAvailableSlots(
  userId: string,
  date: Date,
  timeZone: string
): Promise<string[]> {
  try {
    // Get user's availability for this day of week
    const dayOfWeek = getDay(date)
    
    const availability = await db.availability.findMany({
      where: {
        userId,
        dayOfWeek,
      },
    })

    if (availability.length === 0) {
      return []
    }

    // Get existing bookings for this day
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)

    const bookings = await db.booking.findMany({
      where: {
        userId,
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: 'confirmed',
      },
    })

    // Get Google Calendar busy times
    const busyTimes = await getBusyTimes(userId, dayStart, dayEnd)

    // Generate all possible 30-min slots
    const slots: string[] = []
    
    for (const avail of availability) {
      const startTime = parse(avail.startTime, 'HH:mm', date)
      const endTime = parse(avail.endTime, 'HH:mm', date)
      
      let currentSlot = startTime
      
      while (currentSlot < endTime) {
        const slotEnd = addMinutes(currentSlot, 30)
        
        if (slotEnd <= endTime) {
          // Check if slot is available
          const isBooked = bookings.some(booking => {
            return (
              currentSlot < booking.endTime &&
              slotEnd > booking.startTime
            )
          })

          const isBusy = busyTimes.some(busy => {
            return (
              currentSlot < busy.end &&
              slotEnd > busy.start
            )
          })

          if (!isBooked && !isBusy) {
            slots.push(format(currentSlot, 'HH:mm'))
          }
        }
        
        currentSlot = slotEnd
      }
    }

    return slots.sort()
  } catch (error) {
    console.error('Error getting available slots:', error)
    return []
  }
}

export async function isSlotAvailable(
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const dayOfWeek = getDay(startTime)
  
  // Check if user has availability set for this day
  const availability = await db.availability.findFirst({
    where: {
      userId,
      dayOfWeek,
    },
  })

  if (!availability) {
    return false
  }

  // Check if time is within availability hours
  const startTimeStr = format(startTime, 'HH:mm')
  const endTimeStr = format(endTime, 'HH:mm')
  
  if (startTimeStr < availability.startTime || endTimeStr > availability.endTime) {
    return false
  }

  // Check for existing bookings
  const existingBooking = await db.booking.findFirst({
    where: {
      userId,
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
      status: 'confirmed',
    },
  })

  if (existingBooking) {
    return false
  }

  // Check Google Calendar busy times
  const busyTimes = await getBusyTimes(userId, startTime, endTime)
  const isBusy = busyTimes.some(busy => {
    return startTime < busy.end && endTime > busy.start
  })

  return !isBusy
}

