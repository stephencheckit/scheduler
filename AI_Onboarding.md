# Scheduler Widget - AI Onboarding

## Project Overview

An embeddable calendar scheduling widget that allows admins to sync their Google Calendar and let website visitors book 30-minute appointments.

## Product Purpose

Enable anyone to:
1. Sign up as admin with Google account
2. Authenticate and sync their Google Calendar
3. Set weekly availability hours
4. Generate an embeddable widget for their website
5. Allow visitors to book 30-minute appointments
6. Receive email notifications for bookings

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: NextAuth.js v5 with Google OAuth
- **Calendar Integration**: Google Calendar API (googleapis)
- **Email Service**: Resend
- **Hosting**: Vercel
- **UI Components**: Radix UI + Custom Components

## Key Features

### Admin Features
- Google OAuth sign-in
- Weekly availability management (Mon-Sun, custom hours)
- View upcoming and past bookings
- Unique widget ID for embedding
- Copy embed code (iframe)

### Visitor Features
- View available dates and times
- Select 30-minute appointment slots
- Fill booking form (name, email, notes)
- Receive email confirmation with calendar invite

### System Features
- Two-way Google Calendar sync
- Prevents double-booking
- Checks availability against existing bookings
- Mobile-responsive design
- Embeddable via iframe

## Architecture

### File Structure

```
/app
  /api
    /auth/[...nextauth]/route.ts    # NextAuth handlers
    /user/route.ts                   # User data endpoint
    /availability/route.ts           # Availability CRUD
    /bookings/route.ts               # Booking creation
    /slots/route.ts                  # Available slots lookup
  /dashboard
    /layout.tsx                      # Protected dashboard layout
    /page.tsx                        # Dashboard home
    /availability/page.tsx           # Availability settings
    /bookings/page.tsx               # Bookings list
    /embed/page.tsx                  # Widget embed code
  /widget/[widgetId]/page.tsx        # Public booking page
  /embed/[widgetId]/page.tsx         # Embeddable version (iframe)
  /page.tsx                          # Landing page
  /layout.tsx                        # Root layout
  /globals.css                       # Global styles

/components
  /ui                                # Reusable UI components
    /button.tsx
    /input.tsx
    /label.tsx
    /select.tsx
    /dialog.tsx
    /textarea.tsx
  /booking                           # Booking-specific components
    /calendar-view.tsx               # Month calendar picker
    /time-slots.tsx                  # Available time slots
    /booking-form.tsx                # Guest information form

/lib
  /auth.ts                           # NextAuth configuration
  /db.ts                             # Prisma client singleton
  /google-calendar.ts                # Google Calendar API wrapper
  /availability.ts                   # Availability logic
  /email.ts                          # Email notifications (Resend)
  /utils.ts                          # Utility functions

/prisma
  /schema.prisma                     # Database schema

/types
  /next-auth.d.ts                    # NextAuth type extensions
```

## Database Schema

### Tables

**User**
- Admins who sign up
- Stores email, name, image, widgetId, timeZone
- Links to accounts, sessions, availability, bookings

**Account**
- OAuth account data (Google)
- Stores tokens for Calendar API access

**Session**
- NextAuth session management

**Availability**
- Weekly recurring hours (dayOfWeek 0-6, startTime, endTime)
- Multiple slots per user

**Booking**
- Confirmed appointments
- Includes guest info, times, Google Calendar event ID

**VerificationToken**
- Email verification (NextAuth requirement)

## Environment Variables

```bash
# Database (Supabase)
DATABASE_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...supabase.com:5432/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated-secret-key

# Google OAuth & Calendar
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Email
RESEND_API_KEY=re_your_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account (free tier)
- Google Cloud Console project
- Resend account (free tier)
- Vercel account (optional, for deployment)

### Installation Steps

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create new project at supabase.com
   - Copy connection strings (use pooling URL for DATABASE_URL)

3. **Configure Google OAuth**
   - Go to console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourapp.vercel.app/api/auth/callback/google`
   - Enable Google Calendar API
   - Add scopes: email, profile, calendar.readonly, calendar.events

4. **Set up Resend**
   - Sign up at resend.com
   - Create API key
   - Verify domain (or use onboarding@resend.dev for testing)

5. **Configure environment variables**
   - Create `.env.local` with all required variables (see .env.example)

6. **Initialize database**
   ```bash
   npx prisma db push
   ```

7. **Run development server**
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. **Connect GitHub repository** to Vercel

2. **Set environment variables** in Vercel dashboard

3. **Build settings**:
   - Build command: `prisma generate && next build` (already in package.json)
   - Output directory: `.next`

4. **Deploy** - Automatic on push to main

## Activity Log

### October 22, 2025 - Database Initialization & Deployment

**Environment & Node.js Setup**
- Fixed database connection strings (URL-encoded password special character, corrected username format)
- Upgraded Node.js from v20.5.0 to v20.11.0 using nvm to meet Next.js 16 requirements
- Successfully initialized Supabase database with 6 tables (User, Account, Session, Availability, Booking, VerificationToken)
- Generated Prisma Client for database access

**Development Server**
- Started Next.js development server on http://localhost:3000
- Verified application loads successfully with landing page
- Confirmed authentication flow is ready for testing

**Status**: Application fully operational in development mode, ready for production deployment

---

### October 22, 2025 - Initial Development

**Project Setup**
- Initialized Next.js 16 project with TypeScript and Tailwind CSS 4
- Added all required dependencies (NextAuth, Prisma, googleapis, Resend, etc.)
- Created comprehensive Prisma schema for User, Account, Session, Availability, Booking tables
- Set up environment configuration

**Authentication & Database**
- Implemented NextAuth.js v5 with Google OAuth provider
- Configured offline access for Google Calendar API token refresh
- Created Prisma client singleton for database access
- Set up Supabase connection with pooling support

**Core Libraries**
- Built Google Calendar integration (getBusyTimes, createCalendarEvent)
- Implemented availability slot calculation algorithm
- Created email notification system with Resend (includes .ics attachments)
- Added utility functions for class name merging

**UI Components**
- Created reusable UI component library (Button, Input, Label, Select, Dialog, Textarea)
- Built booking-specific components (CalendarView, TimeSlots, BookingForm)
- Implemented responsive calendar picker with date selection
- Added time slot grid display

**Admin Dashboard**
- Built protected dashboard layout with navigation
- Created dashboard home with stats and quick actions
- Implemented availability management page (set weekly hours)
- Built bookings list page (upcoming and past appointments)
- Created embed code page with copy functionality

**Public Widget**
- Implemented full-page booking widget (/widget/[widgetId])
- Created embeddable iframe version (/embed/[widgetId])
- Built complete booking flow: date → time → form → confirmation
- Added success state with booking details

**API Routes**
- Created /api/user endpoint for user data
- Built /api/availability for GET/POST availability settings
- Implemented /api/bookings for booking creation with validation
- Added /api/slots for fetching available time slots

**Configuration**
- Updated Next.js config for iframe embedding (CORS headers)
- Configured X-Frame-Options and Content-Security-Policy
- Set up build script to include Prisma generation

**Documentation**
- Created AI_Onboarding.md with comprehensive project documentation
- Updated README.md with setup instructions

**Status**: Core MVP complete and ready for testing

---

## Known Limitations (MVP)

1. **Timezone**: All times in admin's timezone (no visitor timezone detection)
2. **Appointment Length**: Fixed 30-minute slots only
3. **No Cancellation**: Cancellation/rescheduling not implemented
4. **Single User**: No team scheduling
5. **Email Domain**: Using Resend's test domain (need to verify custom domain)
6. **Rate Limiting**: Not implemented (should add for production)

## Future Enhancements

- Custom appointment lengths (15, 30, 60 minutes)
- Visitor timezone detection and conversion
- Cancellation and rescheduling
- Buffer time between appointments
- Date-specific availability overrides
- Team scheduling with multiple calendars
- Custom branding and colors
- Payment integration
- SMS notifications
- Analytics dashboard
- Webhook notifications
- Multiple event types per user

## Support

For issues or questions:
1. Check environment variables are set correctly
2. Verify database connection (run `npx prisma studio`)
3. Check Google OAuth scopes include calendar access
4. Review server logs for API errors
5. Test email delivery with Resend dashboard

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **API Keys**: Rotate keys regularly
3. **CORS**: Configured for iframe embedding (adjust for production if needed)
4. **OAuth Scopes**: Only request necessary Google Calendar permissions
5. **Input Validation**: All API routes use Zod for validation
6. **Database**: Use parameterized queries (Prisma handles this)

---

Last Updated: October 22, 2025

