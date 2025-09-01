# Timesheet Application

A modern, mobile-first timesheet tracking application with Google authentication and multi-user support.

## Project Structure

```
timesheet/
├── index.html              # Original single-file application (preserved)
├── timesheet-app/          # React frontend
├── timesheet-backend/      # Node.js backend
└── database/               # Database migrations
```

## Features

- ✅ Google SSO Authentication
- ✅ Multi-user data isolation
- ✅ 3-step time entry flow (Date → Client → Hours)
- ✅ Saturday-Friday week format
- ✅ Client management (default + custom)
- ✅ Weekly reports with navigation
- ✅ Mobile-first responsive design
- ✅ Recent entries with delete
- ✅ Professional deployment ready

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- Vite
- Zustand (state management)
- date-fns
- Supabase client

### Backend
- Node.js with TypeScript
- Express.js
- Passport.js (Google OAuth)
- Supabase (database)

### Database
- PostgreSQL (via Supabase)
- Row Level Security (RLS)

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google OAuth credentials

### 1. Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the migration scripts in order:
   ```sql
   -- Run each file in database/migrations/ folder in order
   ```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3001/auth/google/callback`
   - Production: `https://your-backend-url/auth/google/callback`

### 3. Frontend Setup

```bash
cd timesheet-app
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

### 4. Backend Setup

```bash
cd timesheet-backend
npm install

# Create .env file with your credentials
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
```

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy using Dockerfile

## Data Migration

For existing users with data in the old system:

1. Review `database/migrations/05_migrate_existing_data.sql`
2. Update the default user email and name
3. Run the migration script
4. Verify data migration success

## Development

```bash
# Run frontend
cd timesheet-app
npm run dev

# Run backend
cd timesheet-backend
npm run dev
```

## Production Build

```bash
# Build frontend
cd timesheet-app
npm run build

# Build backend
cd timesheet-backend
npm run build
```

## Success Criteria Checklist

- ✅ All current functionality preserved
- ✅ Google SSO login/logout
- ✅ User-specific data isolation
- ✅ Mobile responsive (better than current)
- ✅ Client management without breaking
- ✅ Saturday-Friday weeks maintained
- ✅ Professional production deployment ready
- ✅ Performance better than HTML version

## License

MIT