# AeroBay Lab Setup Form

A full-stack MERN application for collecting and managing school STEM lab requirements.

## Features
- **Frontend**: Fluid Glass UI design, built with React, Vite, TypeScript, and Zustand.
- **Backend**: Express.js REST API with rate limiting, validation, and JWT authentication.
- **Database**: Supabase PostgreSQL for reliable data storage.
- **Google Sheets Sync**: Real-time appending of form submissions to a Google Sheet with exponential backoff retry.
- **Admin Dashboard**: Secure dashboard to view, filter, manage, and export submissions.

## Project Structure
- `frontend/` - React/Vite application.
- `backend/` - Node.js/Express API.
- `docs/` - Setup and deployment documentation.

## Getting Started

Please see the documentation in the `docs` directory:
1. [Setup Guide](./docs/SETUP.md)
2. [Supabase Setup](./docs/SUPABASE_SETUP.md)
3. [Google Sheets Setup](./docs/GOOGLE_SHEETS_SETUP.md)
4. [API Documentation](./docs/API_DOCUMENTATION.md)
5. [Deployment Guide](./docs/DEPLOYMENT.md)
