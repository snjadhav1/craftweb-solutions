-- ==========================================
-- CRAFTWEB SOLUTIONS - SUPABASE SQL QUERIES
-- Run these queries in Supabase SQL Editor
-- ==========================================

-- STEP 1: Create the contact_submissions table
-- Copy this entire block and paste in Supabase SQL Editor, then click "Run"

CREATE TABLE IF NOT EXISTS contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    notes TEXT
);

-- STEP 2: Add comments to the table (optional but helpful)
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from Craftweb Solutions website';
COMMENT ON COLUMN contact_submissions.name IS 'Full name of the person submitting the form';
COMMENT ON COLUMN contact_submissions.email IS 'Email address of the submitter';
COMMENT ON COLUMN contact_submissions.service IS 'Type of service they are interested in';
COMMENT ON COLUMN contact_submissions.message IS 'Their message/project details';
COMMENT ON COLUMN contact_submissions.submitted_at IS 'When the form was submitted';
COMMENT ON COLUMN contact_submissions.is_read IS 'Whether the message has been read by admin';
COMMENT ON COLUMN contact_submissions.notes IS 'Internal notes about this submission';

-- STEP 3: Enable Row Level Security (RLS) - Required for security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- STEP 4: Create policy to allow INSERT from anonymous users (your frontend)
CREATE POLICY "Allow anonymous insert" ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- STEP 5: Create policy to allow SELECT (reading) - Optional, for admin/testing
CREATE POLICY "Allow anonymous select" ON contact_submissions
    FOR SELECT
    TO anon
    USING (true);

-- ==========================================
-- HELPFUL QUERIES FOR VIEWING YOUR DATA
-- ==========================================

-- View all contact submissions (newest first)
-- SELECT * FROM contact_submissions ORDER BY submitted_at DESC;

-- Count total submissions
-- SELECT COUNT(*) as total_submissions FROM contact_submissions;

-- View submissions from today
-- SELECT * FROM contact_submissions WHERE DATE(submitted_at) = CURRENT_DATE;

-- Search by email
-- SELECT * FROM contact_submissions WHERE email LIKE '%example@email.com%';

-- Mark a submission as read (replace 1 with actual id)
-- UPDATE contact_submissions SET is_read = true WHERE id = 1;
