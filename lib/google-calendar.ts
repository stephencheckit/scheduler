import { google } from 'googleapis'
import { db } from './db'

export async function getCalendarClient(userId: string) {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: 'google',
    },
  })

  if (!account || !account.access_token) {
    throw new Error('No Google account connected')
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function getBusyTimes(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ start: Date; end: Date }>> {
  try {
    const calendar = await getCalendarClient(userId)
    
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: 'primary' }],
      },
    })

    const busy = response.data.calendars?.primary?.busy || []
    return busy.map((slot) => ({
      start: new Date(slot.start!),
      end: new Date(slot.end!),
    }))
  } catch (error) {
    console.error('Error fetching busy times:', error)
    return []
  }
}

export async function createCalendarEvent(
  userId: string,
  booking: {
    guestName: string
    guestEmail: string
    startTime: Date
    endTime: Date
    guestNotes?: string | null
  }
) {
  try {
    const calendar = await getCalendarClient(userId)
    
    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `Appointment with ${booking.guestName}`,
        description: booking.guestNotes || '',
        start: {
          dateTime: booking.startTime.toISOString(),
        },
        end: {
          dateTime: booking.endTime.toISOString(),
        },
        attendees: [
          { email: booking.guestEmail },
        ],
      },
    })

    return event.data.id
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
}

