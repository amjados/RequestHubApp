# Request Hub - High Ticket Ventures

A production-ready multi-tenant request management platform built with Next.js 15, Clerk, Prisma, Linear, and Pusher.

## Features

- ✅ Multi-tenant authentication with Clerk Organizations
- ✅ Role-based access control (User, Admin, Super-Admin)
- ✅ Request submission with Linear integration
- ✅ Real-time status updates via Pusher
- ✅ Admin dashboard with cross-tenant visibility
- ✅ Responsive UI with shadcn/ui components
- ✅ PostgreSQL database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL + Prisma
- **Auth**: Clerk (with Organizations)
- **Real-time**: Pusher
- **UI**: TailwindCSS + shadcn/ui
- **Integration**: Linear API

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account with Organizations enabled
- Linear account and API access
- Pusher account

## Environment Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/requesthub?schema=public"

# Linear
LINEAR_API_KEY=your_linear_api_key
LINEAR_TEAM_ID=your_linear_team_id

# Pusher
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
PUSHER_APP_ID=your_pusher_app_id

# Webhook
WEBHOOK_SECRET=your_webhook_secret
```

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Clerk Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Enable Organizations in your Clerk dashboard
3. Configure user metadata to include a `role` field
4. Create test organizations and users with different roles:
   - User: Can view and submit requests for their organization
   - Admin: Can view all requests across organizations
   - Super-Admin: Full access to all features

## Linear Setup

1. Create a Linear account and workspace
2. Generate an API key from Settings > API
3. Get your Team ID from the Linear app URL
4. Configure a webhook to point to: `https://your-domain.com/api/webhooks/linear`

## Pusher Setup

1. Create a Pusher account at [pusher.com](https://pusher.com)
2. Create a new app in the Pusher dashboard
3. Copy your app credentials to the `.env` file

## Database Schema

The application uses two main models:

- **Organization**: Represents a company/tenant
- **Request**: Represents a support request submitted by users

## Project Structure

```
app/
├── api/
│   ├── requests/          # Request CRUD operations
│   ├── admin/             # Admin-only endpoints
│   └── webhooks/          # Linear webhook handler
├── dashboard/             # Main user dashboard
├── admin/                 # Admin dashboard
├── sign-in/              # Authentication pages
└── sign-up/
components/
├── ui/                   # shadcn/ui components
├── request-form.tsx      # Request submission form
├── request-list.tsx      # User request list
└── admin-request-list.tsx # Admin view
lib/
├── prisma.ts             # Prisma client
├── auth.ts               # Authentication helpers
├── linear.ts             # Linear integration
└── pusher.ts             # Real-time updates
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

Make sure to update the webhook URLs in Linear to point to your production domain.

## Testing Credentials

Create test users with these roles in Clerk:
- `user@company1.com` - User role in Company 1
- `user@company2.com` - User role in Company 2
- `admin@htv.com` - Admin role
- `superadmin@htv.com` - Super-admin role

## Features Breakdown

### Core Features
- ✅ Multi-tenant auth with Clerk Organizations
- ✅ Request submission form
- ✅ Linear issue creation
- ✅ Real-time status updates
- ✅ Admin dashboard
- ✅ Responsive design

### Bonus Features (Optional)
- E2E Testing with Playwright
- CI/CD Pipeline with GitHub Actions
- Docker support
- Error monitoring with Sentry

## License

MIT
