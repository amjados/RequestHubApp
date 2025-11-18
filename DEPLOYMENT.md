# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables**

   Add these in Vercel Dashboard → Settings → Environment Variables:

   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Database (use Vercel Postgres or Neon)
   DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public

   # Linear Integration
   LINEAR_API_KEY=lin_api_xxxxx
   LINEAR_TEAM_ID=your-team-id

   # Pusher Real-time
   NEXT_PUBLIC_PUSHER_KEY=xxxxx
   PUSHER_SECRET=xxxxx
   NEXT_PUBLIC_PUSHER_CLUSTER=mt1
   PUSHER_APP_ID=xxxxx

   # Webhooks
   WEBHOOK_SECRET=your-secure-secret
   ```

4. **Database Setup**

   After deployment, run database migrations:
   ```bash
   # Using Vercel CLI
   vercel env pull .env
   npx prisma db push
   ```

5. **Configure Webhooks**

   In Linear Settings → Webhooks:
   - URL: `https://your-app.vercel.app/api/webhooks/linear`
   - Secret: Use the same value as `WEBHOOK_SECRET`
   - Events: Issue created, Issue updated

## Database Options

### Option 1: Vercel Postgres (Recommended)
1. In Vercel Dashboard, go to Storage
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`

### Option 2: Neon (Free Tier)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string to `DATABASE_URL`

### Option 3: Railway
1. Sign up at [railway.app](https://railway.app)
2. Create PostgreSQL service
3. Copy connection string to `DATABASE_URL`

## Clerk Setup

1. **Create Application**
   - Go to [clerk.com](https://clerk.com)
   - Create new application
   - Enable "Organizations" feature

2. **Configure Organizations**
   - Settings → Organizations → Enable
   - Set "Members can create organizations" if needed

3. **Set User Roles**
   - Users & Organizations → Metadata
   - Add custom metadata field: `role`
   - Values: `user`, `admin`, `super-admin`

4. **Create Test Users**
   ```
   Company 1:
   - user1@company1.com (role: user)
   
   Company 2:
   - user2@company2.com (role: user)
   
   Admins:
   - admin@htv.com (role: admin)
   - superadmin@htv.com (role: super-admin)
   ```

## Linear Setup

1. **Get API Key**
   - Settings → API → Create new API key
   - Copy to `LINEAR_API_KEY`

2. **Get Team ID**
   - Open your Linear team
   - Check URL: `linear.app/YOUR-TEAM/...`
   - `YOUR-TEAM` is your Team ID

3. **Configure Webhook**
   - Settings → Webhooks → Create webhook
   - URL: `https://your-app.vercel.app/api/webhooks/linear`
   - Secret: Match your `WEBHOOK_SECRET`
   - Subscribe to: Issue events

## Pusher Setup

1. **Create Account**
   - Go to [pusher.com](https://pusher.com)
   - Sign up and create new app

2. **Get Credentials**
   - Dashboard → App Keys
   - Copy:
     - `app_id` → `PUSHER_APP_ID`
     - `key` → `NEXT_PUBLIC_PUSHER_KEY`
     - `secret` → `PUSHER_SECRET`
     - `cluster` → `NEXT_PUBLIC_PUSHER_CLUSTER`

## Testing the Deployment

1. **Visit your app**: `https://your-app.vercel.app`

2. **Create organizations and users** in Clerk

3. **Test workflow**:
   - Sign in as user
   - Submit a request
   - Check Linear for created issue
   - Update issue status in Linear
   - Verify real-time update in app

4. **Test admin access**:
   - Sign in as admin/super-admin
   - Visit `/admin`
   - Verify cross-tenant visibility

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Vercel IPs
- Run `npx prisma db push` after deployment

### Clerk Authentication Issues
- Check publishable key starts with `pk_`
- Verify secret key starts with `sk_`
- Ensure organizations are enabled

### Linear Integration Issues
- Verify API key is valid
- Check Team ID matches your workspace
- Ensure webhook URL is publicly accessible

### Real-time Updates Not Working
- Verify Pusher credentials
- Check browser console for connection errors
- Ensure cluster matches your Pusher app

## CI/CD with GitHub Actions

The project includes a CI/CD pipeline that:
- Runs linting and type checking
- Builds the application
- Auto-deploys to Vercel on push to main

To enable:
1. Add secrets to GitHub repo settings:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Docker Deployment (Optional)

For containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:3000
```

## Performance Optimization

- Enable caching in Vercel settings
- Use Vercel Analytics for monitoring
- Consider Vercel Edge Functions for auth
- Enable ISR for static pages

## Security Best Practices

- Rotate API keys regularly
- Use strong webhook secrets
- Enable CORS only for your domain
- Set up rate limiting
- Monitor logs for suspicious activity

## Monitoring (Bonus)

Consider adding:
- Sentry for error tracking
- Vercel Analytics for performance
- LogRocket for session replay
- Custom metrics with Vercel Speed Insights
