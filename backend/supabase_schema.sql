-- =========================================================================
-- Sankalp: India-First AI Financial Life Planner
-- Supabase / PostgreSQL Database Schema with Row-Level Security (RLS)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    current_city VARCHAR(100) DEFAULT 'Kolkata',
    target_city VARCHAR(100) DEFAULT 'Bengaluru',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Email OTPs Table
CREATE TABLE IF NOT EXISTS email_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE
);

-- Index for fast OTP verification
CREATE INDEX IF NOT EXISTS idx_email_otps_email_code ON email_otps(email, otp_code, is_used);

-- 3. Financial Profiles Table
CREATE TABLE IF NOT EXISTS financial_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    annual_ctc NUMERIC(15, 2) DEFAULT 900000.00,
    monthly_take_home NUMERIC(15, 2) DEFAULT 62400.00,
    tax_regime VARCHAR(10) DEFAULT 'new',
    current_rent NUMERIC(15, 2) DEFAULT 16000.00,
    family_support NUMERIC(15, 2) DEFAULT 10000.00,
    existing_emis NUMERIC(15, 2) DEFAULT 0.00,
    current_savings NUMERIC(15, 2) DEFAULT 150000.00,
    current_monthly_sip NUMERIC(15, 2) DEFAULT 10000.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Financial Plans Table
CREATE TABLE IF NOT EXISTS financial_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    goal_category VARCHAR(100) NOT NULL,
    target_amount NUMERIC(15, 2) DEFAULT 0.00,
    target_months INT DEFAULT 12,
    monthly_income NUMERIC(15, 2) NOT NULL,
    total_fixed_expenses NUMERIC(15, 2) DEFAULT 0.00,
    total_emis NUMERIC(15, 2) DEFAULT 0.00,
    family_support NUMERIC(15, 2) DEFAULT 0.00,
    monthly_savings_potential NUMERIC(15, 2) DEFAULT 0.00,
    emergency_runway_months NUMERIC(5, 2) DEFAULT 0.00,
    health_score INT DEFAULT 85,
    summary TEXT,
    assumptions JSONB DEFAULT '[]'::jsonb,
    action_steps JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_plans_user_id ON financial_plans(user_id);

-- 5. Plan Scenarios Table (Conservative, Balanced, Comfort)
CREATE TABLE IF NOT EXISTS plan_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES financial_plans(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_recommended BOOLEAN DEFAULT FALSE,
    survival_pot NUMERIC(15, 2) DEFAULT 0.00,
    family_pot NUMERIC(15, 2) DEFAULT 0.00,
    obligations_pot NUMERIC(15, 2) DEFAULT 0.00,
    growth_pot NUMERIC(15, 2) DEFAULT 0.00,
    guilt_free_upi_pot NUMERIC(15, 2) DEFAULT 0.00,
    one_time_cost NUMERIC(15, 2) DEFAULT 0.00,
    locked_deposit NUMERIC(15, 2) DEFAULT 0.00,
    recovery_months NUMERIC(5, 2) DEFAULT 0.00,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_scenarios_plan_id ON plan_scenarios(plan_id);

-- 6. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    extracted_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_messages(user_id);

-- =========================================================================
-- Enable Row Level Security (RLS) for multi-tenant data isolation
-- =========================================================================
ALTER TABLE financial_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
