# Supabase Setup Guide

This project requires a Supabase PostgreSQL database to store form submissions.

## 1. Create a Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once created, go to **Project Settings > API** to find your:
   - `Project URL` (SUPABASE_URL)
   - `anon` `public` key (SUPABASE_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

## 2. Run Database Schema
Navigate to the **SQL Editor** in your Supabase dashboard and run the following SQL to create the table and indexes:

```sql
-- Main form_submissions table
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_date TIMESTAMP DEFAULT NOW(),
  
  -- School Information
  school_name VARCHAR(255) NOT NULL,
  school_code VARCHAR(100),
  contact_person VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  
  -- Lab Details
  lab_category VARCHAR(50) NOT NULL CHECK (lab_category IN ('Basix', 'Standard', 'Advanced', 'Premium')),
  selected_items JSONB NOT NULL DEFAULT '[]',
  custom_items JSONB NOT NULL DEFAULT '[]',
  
  -- Submitted By
  submitted_by_name VARCHAR(255) NOT NULL,
  target_date DATE,
  additional_notes TEXT,
  
  -- System Fields
  google_sheets_row_id VARCHAR(100),
  sync_status VARCHAR(50) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  sync_attempts INTEGER DEFAULT 0,
  sync_error TEXT,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_submission UNIQUE(submission_date, contact_email)
);

-- Create indexes for better query performance
CREATE INDEX idx_lab_category ON form_submissions(lab_category);
CREATE INDEX idx_sync_status ON form_submissions(sync_status);
CREATE INDEX idx_created_at ON form_submissions(created_at DESC);
CREATE INDEX idx_contact_email ON form_submissions(contact_email);
```

## 3. Row Level Security (RLS)
The backend uses the `service_role` key to bypass RLS, so you don't strictly need to configure policies. However, if you use the `anon` key, you should configure RLS policies to allow inserts.

## 4. Add to Environment
Add the credentials to your backend `.env` file:
```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
