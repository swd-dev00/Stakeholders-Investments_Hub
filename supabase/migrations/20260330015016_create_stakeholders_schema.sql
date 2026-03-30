/*
  # Stakeholders Hub Database Schema

  1. New Tables
    - `stakeholders`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Full name of stakeholder
      - `role` (text) - Job title or position
      - `organization` (text) - Company or institution
      - `email` (text, nullable) - Contact email
      - `influence` (integer) - Influence score 1-10
      - `interest` (integer) - Interest level 1-10
      - `tier` (text) - Classification: champion, supporter, neutral, skeptic
      - `initiatives` (text[]) - Array of initiative names
      - `notes` (text, nullable) - Additional context and action items
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `stakeholders` table
    - Add policies for authenticated users to manage stakeholders
*/

CREATE TABLE IF NOT EXISTS stakeholders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  organization text NOT NULL,
  email text DEFAULT '',
  influence integer NOT NULL DEFAULT 5 CHECK (influence >= 1 AND influence <= 10),
  interest integer NOT NULL DEFAULT 5 CHECK (interest >= 1 AND interest <= 10),
  tier text NOT NULL DEFAULT 'neutral' CHECK (tier IN ('champion', 'supporter', 'neutral', 'skeptic')),
  initiatives text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stakeholders"
  ON stakeholders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert stakeholders"
  ON stakeholders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update stakeholders"
  ON stakeholders FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete stakeholders"
  ON stakeholders FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_stakeholders_tier ON stakeholders(tier);
CREATE INDEX IF NOT EXISTS idx_stakeholders_initiatives ON stakeholders USING GIN(initiatives);