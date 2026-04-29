# Project Setup & Local Development

This guide explains how to set up the AeroBay Lab Setup Form application locally.

## Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- Google Cloud Service Account (see [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md))

## 1. Clone & Install
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## 2. Environment Variables

### Frontend
Create `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=AeroBay Lab Setup Form
```

### Backend
Create `backend/.env`:
```
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Sheets
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_email
GOOGLE_PRIVATE_KEY="your_private_key"

# JWT Auth
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

## 3. Running Locally

You'll need two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server will start on port 5000 with nodemon/watch mode
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite server will start on port 5173
```

## 4. Accessing the Application
- Public Form: `http://localhost:5173`
- Admin Dashboard: `http://localhost:5173/admin/login`
- Default Admin Credentials:
  - Username: `JawadS`
  - Password: `JawadS`
