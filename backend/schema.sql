CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_date TIMESTAMP DEFAULT NOW(),
  school_name VARCHAR(255) NOT NULL,
  school_code VARCHAR(100),
  contact_person VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  lab_category VARCHAR(50) NOT NULL CHECK (lab_category IN ('Basix', 'Standard', 'Advanced', 'Premium')),
  selected_items JSONB NOT NULL DEFAULT '[]',
  custom_items JSONB NOT NULL DEFAULT '[]',
  shipments JSONB NOT NULL DEFAULT '[]',
  submitted_by_name VARCHAR(255) NOT NULL,
  target_date DATE,
  additional_notes TEXT,
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

CREATE INDEX IF NOT EXISTS idx_lab_category ON form_submissions(lab_category);
CREATE INDEX IF NOT EXISTS idx_sync_status ON form_submissions(sync_status);
CREATE INDEX IF NOT EXISTS idx_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_email ON form_submissions(contact_email);
