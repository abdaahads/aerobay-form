#!/bin/bash
set -e

# Ensure we're on the new branch
git checkout -b feature/mern-conversion || git checkout feature/mern-conversion

# 1. Project Scaffolding
git add .gitignore backend/.gitignore aerobay-form/.gitignore aerobay-form/package.json aerobay-form/tsconfig.* aerobay-form/vite.config.ts backend/package.json
git commit -m "chore: scaffold MERN project structure and dependencies" || true

# 2. Styles and Configuration
git add aerobay-form/index.html aerobay-form/src/styles/ aerobay-form/src/main.tsx aerobay-form/src/App.tsx aerobay-form/.env.example backend/.env.example
git commit -m "feat(ui): configure Fluid Glass UI and base application setup" || true

# 3. Data and Types
git add aerobay-form/src/types/ aerobay-form/src/data/
git commit -m "feat(data): extract lab items data and define TypeScript types" || true

# 4. State Management
git add aerobay-form/src/store/
git commit -m "feat(state): implement Zustand stores for form state and auth" || true

# 5. API Services
git add aerobay-form/src/services/ backend/src/utils/ backend/src/services/
git commit -m "feat(api): implement Axios client and Google Sheets/Supabase backend services" || true

# 6. Frontend Components and Pages
git add aerobay-form/src/components/ aerobay-form/src/pages/
git commit -m "feat(frontend): build React form components and admin dashboard pages" || true

# 7. Backend Routes and Controllers
git add backend/src/controllers/ backend/src/routes/ backend/src/middleware/ backend/src/app.js backend/src/server.js
git commit -m "feat(backend): implement Express REST API controllers, middleware, and routing" || true

# 8. Documentation and Assets
git add docs/ README.md *.pdf aerobay_form.html
git commit -m "docs: add comprehensive setup, deployment, and API documentation" || true

echo "Commits created successfully."
