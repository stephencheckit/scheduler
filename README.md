# Scheduler Widget

An embeddable calendar scheduling widget that syncs with Google Calendar and lets visitors book appointments directly from your website.

## Features

- 🔐 Google OAuth sign-in
- 📅 Two-way Google Calendar sync
- ⏰ Weekly availability management
- 🎨 Embeddable widget (iframe)
- 📧 Email notifications with calendar invites
- 📱 Mobile-responsive design
- ⚡ Built with Next.js 16 and React 19

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL) + Prisma
- **Auth**: NextAuth.js v5
- **Calendar**: Google Calendar API
- **Email**: Resend
- **UI**: Tailwind CSS 4 + Radix UI
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- Supabase account ([supabase.com](https://supabase.com))
- Google Cloud Console project ([console.cloud.google.com](https://console.cloud.google.com))
- Resend account ([resend.com](https://resend.com))

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > Database
3. Copy the connection strings (use the pooling connection for DATABASE_URL)

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable APIs:
   - Google Calendar API
   - Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.vercel.app/api/auth/callback/google`
5. Configure OAuth consent screen and add scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `calendar.readonly`
   - `calendar.events`

### 4. Set Up Resend

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. (Optional) Verify your domain or use `onboarding@resend.dev` for testing

### 5. Environment Variables

Create `.env.local` in the root directory:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[ref]:[password]@[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@[region].supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Email
RESEND_API_KEY="re_your_api_key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate a secret for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 6. Initialize Database

```bash
npx prisma db push
```

This creates all necessary tables in your Supabase database.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Admins

1. **Sign in** with your Google account
2. **Set availability**: Go to Dashboard > Availability
   - Enable days of the week
   - Set start and end times
   - Save your schedule
3. **Get embed code**: Go to Dashboard > Embed
   - Copy the iframe code
   - Paste it into your website's HTML
4. **View bookings**: Go to Dashboard > Bookings
   - See upcoming and past appointments

### For Visitors

1. Visit the embedded widget on your website
2. Select a date from the calendar
3. Choose an available time slot
4. Fill in name, email, and optional notes
5. Confirm booking
6. Receive email confirmation with calendar invite

## Project Structure

```
/app
  /api              # API routes
  /dashboard        # Admin dashboard
  /widget           # Public booking page
  /embed            # Embeddable widget version
  /page.tsx         # Landing page

/components
  /ui               # Reusable UI components
  /booking          # Booking-specific components

/lib
  /auth.ts          # NextAuth configuration
  /db.ts            # Prisma client
  /google-calendar.ts  # Calendar API
  /availability.ts  # Slot calculation
  /email.ts         # Email notifications

/prisma
  /schema.prisma    # Database schema
```

## Database Commands

```bash
# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

The build command is already configured in `package.json`:
```bash
prisma generate && next build
```

Remember to update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain.

## Embedding the Widget

### iframe Method

```html
<iframe 
  src="https://your-domain.vercel.app/embed/YOUR_WIDGET_ID" 
  width="100%" 
  height="700" 
  frameborder="0"
></iframe>
```

Get your `WIDGET_ID` from the Dashboard > Embed page.

## Troubleshooting

### Database Connection Issues
- Verify Supabase connection strings are correct
- Check if Prisma schema is pushed: `npx prisma db push`
- Test connection with: `npx prisma studio`

### Google Calendar Not Syncing
- Verify Google Calendar API is enabled
- Check OAuth scopes include `calendar.readonly` and `calendar.events`
- Ensure "Access type" is set to "offline" for refresh tokens

### Emails Not Sending
- Verify Resend API key is correct
- Check Resend dashboard for delivery status
- For production, verify your sending domain

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check that all environment variables are set
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Contributing

This is an MVP project. Future enhancements could include:
- Custom appointment lengths
- Timezone detection for visitors
- Cancellation/rescheduling
- Team scheduling
- Custom branding
- Payment integration

## License

MIT

## Support

For detailed documentation, see [AI_Onboarding.md](./AI_Onboarding.md)
