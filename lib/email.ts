import { Resend } from 'resend'
import { format } from 'date-fns'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateICS(booking: {
  guestName: string
  guestEmail: string
  startTime: Date
  endTime: Date
  guestNotes?: string | null
  adminEmail: string
  adminName?: string | null
}): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Scheduler//EN
BEGIN:VEVENT
UID:${Date.now()}@scheduler.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(booking.startTime)}
DTEND:${formatDate(booking.endTime)}
SUMMARY:Appointment with ${booking.adminName || 'Admin'}
DESCRIPTION:${booking.guestNotes || ''}
ATTENDEE;CN=${booking.guestName};RSVP=TRUE:mailto:${booking.guestEmail}
ORGANIZER;CN=${booking.adminName || 'Admin'}:mailto:${booking.adminEmail}
LOCATION:
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`
}

export async function sendBookingConfirmation(
  booking: {
    guestName: string
    guestEmail: string
    startTime: Date
    endTime: Date
    guestNotes?: string | null
  },
  admin: {
    email: string
    name?: string | null
  }
) {
  try {
    const icsContent = generateICS({
      ...booking,
      adminEmail: admin.email,
      adminName: admin.name,
    })

    await resend.emails.send({
      from: 'Scheduler <onboarding@resend.dev>',
      to: booking.guestEmail,
      subject: 'Appointment Confirmed',
      html: `
        <h2>Your appointment is confirmed!</h2>
        <p>Hello ${booking.guestName},</p>
        <p>Your appointment has been scheduled with ${admin.name || 'us'}.</p>
        <p><strong>Date & Time:</strong> ${format(booking.startTime, 'EEEE, MMMM d, yyyy')} at ${format(booking.startTime, 'h:mm a')}</p>
        ${booking.guestNotes ? `<p><strong>Notes:</strong> ${booking.guestNotes}</p>` : ''}
        <p>A calendar invite is attached to this email.</p>
        <p>We look forward to meeting with you!</p>
      `,
      attachments: [
        {
          filename: 'appointment.ics',
          content: Buffer.from(icsContent).toString('base64'),
        },
      ],
    })
  } catch (error) {
    console.error('Error sending booking confirmation:', error)
  }
}

export async function sendAdminNotification(
  booking: {
    guestName: string
    guestEmail: string
    startTime: Date
    endTime: Date
    guestNotes?: string | null
  },
  adminEmail: string
) {
  try {
    await resend.emails.send({
      from: 'Scheduler <onboarding@resend.dev>',
      to: adminEmail,
      subject: 'New Appointment Booked',
      html: `
        <h2>New Appointment Booked</h2>
        <p>You have a new appointment scheduled.</p>
        <p><strong>Guest:</strong> ${booking.guestName} (${booking.guestEmail})</p>
        <p><strong>Date & Time:</strong> ${format(booking.startTime, 'EEEE, MMMM d, yyyy')} at ${format(booking.startTime, 'h:mm a')}</p>
        ${booking.guestNotes ? `<p><strong>Notes:</strong> ${booking.guestNotes}</p>` : ''}
        <p>This event has been added to your Google Calendar.</p>
      `,
    })
  } catch (error) {
    console.error('Error sending admin notification:', error)
  }
}

