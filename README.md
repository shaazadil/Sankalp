<div align="center">

# Sankalp (संकल्प)
### India-First AI Financial Life Planner & Zero-Based Cashflow System

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/Supabase_PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![Groq LPU](https://img.shields.io/badge/Groq_LPU-Llama_3.3_70B-f55036?style=for-the-badge)](https://groq.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

<p align="center">
  <strong>Proactive zero-based cashflow planning built for Indian professionals.</strong><br />
  Accurately calculates real in-hand salary (after EPF, standard deduction, and tax), models brutal metro landlord deposit shocks, treats parents' family support as a non-negotiable priority, and pairs deterministic Indian tax math with a 24/7 AI Milestone Advisor.
</p>

</div>

---

## 📑 Table of Contents

1. [Why Sankalp? The Problem in Indian Personal Finance](#-why-sankalp-the-problem-in-indian-personal-finance)
2. [The 4 Pillars of Sankalp](#-the-4-pillars-of-sankalp)
3. [The 5 Smart Money Pots Architecture](#-the-5-smart-money-pots-architecture)
4. [Key Features & How to Use Them](#-key-features--how-to-use-them)
   * [1. Interactive Cashflow Sandbox (Landing Page)](#1-interactive-cashflow-sandbox)
   * [2. Passwordless Email OTP Authentication](#2-passwordless-email-otp-authentication)
   * [3. User-Controlled Financial Profile Modal](#3-user-controlled-financial-profile-modal)
   * [4. Private Life Milestone Dashboard](#4-private-life-milestone-dashboard)
   * [5. Dedicated AI Milestone Advisor Workstation](#5-dedicated-ai-milestone-advisor-workstation)
   * [6. Metro Relocation & Landlord Deposit Radar](#6-metro-relocation--landlord-deposit-radar)
   * [7. Deterministic Indian Income Tax Engine](#7-deterministic-indian-income-tax-engine)
5. [System Architecture](#-system-architecture)
6. [Digital Database Schema (ERD & Models)](#-digital-database-schema-erd--models)
7. [REST API Documentation](#-rest-api-documentation)
8. [Technology Stack](#-technology-stack)
9. [Getting Started & Installation Guide](#-getting-started--installation-guide)
10. [Security & Privacy Standards](#-security--privacy-standards)
11. [License](#-license)

---

## 💡 Why Sankalp? The Problem in Indian Personal Finance

Traditional personal finance apps in India fail young professionals in three critical ways:

### 1. The Cost-to-Company (CTC) Illusion
In India, tech and corporate salaries are quoted as annual CTC. A **₹9 LPA or ₹15 LPA CTC** does not mean ₹75,000 or ₹1,25,000 in your bank account:
* Statutory Employee Provident Fund (EPF: 12% of basic).
* Gratuity deductions.
* State Professional Tax (typically ₹200/month).
* Income Tax TDS (with wide differences between the Old Tax Regime with HRA & 80E vs. the New Section 115BAC Regime).
* **The Result:** Employees sign high rent agreements based on paper CTC and suffer liquidity crunches by the 20th of every month.

### 2. The Metro Landlord Deposit Shock
Relocating to IT hubs like **Bengaluru, Mumbai, or Gurgaon** requires an upfront cash lockup of **6 to 10 months of rent as an interest-free security deposit** (₹1.2L to ₹2.5L+), plus broker fees and moving costs. Without proactive amortisation, fresh hires are forced into high-interest credit card debt or personal loans.

### 3. The Backward-Looking Guilt Trap
Existing budgeting tools read your bank SMS and notify you *after* you have overspent on food delivery or shopping. Sankalp replaces backward-looking tracking with **proactive zero-based cashflow assignment**: giving every single rupee a job before the month begins.

---

## 🏛️ The 4 Pillars of Sankalp

```
┌─────────────────────────┐  ┌─────────────────────────┐
│        Pillar 1         │  │        Pillar 2         │
│  Give Every Rupee a Job │  │  Embrace True Expenses  │
│ Zero-based allocation:  │  │ Amortize huge upcoming  │
│  no rupee left unspent  │  │  deposits & insurance   │
└─────────────────────────┘  └─────────────────────────┘
┌─────────────────────────┐  ┌─────────────────────────┐
│        Pillar 3         │  │        Pillar 4         │
│  Roll With The Punches  │  │     Age Your Money      │
│ Flexible rebalancing    │  │  Live on last month's   │
│   with zero guilt       │  │  income with runway     │
└─────────────────────────┘  └─────────────────────────┘
```

1. **Pillar 1: Give Every Rupee a Job** — As soon as your salary is credited, assign 100% of it into specific pots. No money is left to vanish into thin air.
2. **Pillar 2: Embrace True Expenses** — Break giant upcoming cash shocks (e.g. 8-month Bengaluru landlord deposits, annual term insurance, Diwali home travel) into predictable monthly bites.
3. **Pillar 3: Roll With The Punches** — When real life happens (urgent doctor visit or friend's wedding), shift money between pots with one tap without breaking your budget.
4. **Pillar 4: Age Your Money** — Grow your emergency runway until you are spending money you earned last month, permanently ending the paycheck-to-paycheck cycle.

---

## 🏺 The 5 Smart Money Pots Architecture

Every rupee of your monthly take-home salary is divided into five dedicated, non-overlapping envelopes:

| Pot | Category | Target % | What It Covers |
| :--- | :--- | :--- | :--- |
| 🏠 **Survival Pot** | Fixed Necessities | **40% – 50%** | Monthly rent, society maintenance, electricity, broadband, groceries, and daily transit. |
| 💳 **Obligations Pot** | Fixed Liabilities | **0% – 20%** | Education loan EMIs, vehicle EMIs, and existing credit card balances. |
| 👨‍👩‍👧 **Family First Pot** | Cultural Remittance | **10% – 20%** | Money sent home to parents, medicines, and family support (treated as a non-negotiable priority). |
| ☕ **Guilt-Free UPI Pot** | Discretionary Fun | **10% – 15%** | Swiggy/Zomato, dining out, weekend getaways, movies, and hobbies (spend guilt-free if this pot has funds). |
| 📈 **Wealth & Runway Pot** | Future Resilience | **15% – 30%** | Liquid Emergency Runway (in Savings/FD), Equity Mutual Fund SIPs, and Sovereign Gold Bonds (SGB). |

---

## 🚀 Key Features & How to Use Them

### 1. Interactive Cashflow Sandbox
* **Location:** Home page (`/`) under the `#live-simulator` anchor.
* **How to use:**
  1. Slide your Annual CTC (₹5L to ₹35L), Monthly Rent, and Family Remittance.
  2. Toggle between **New Tax Regime** and **Old Regime (HRA & 80E)**.
  3. Instantly watch all 5 Smart Pots, Net Monthly Take-Home, and the Emergency Runway gauge animate in real time.
  4. Click **"Input My Exact Numbers"** to open the custom profile modal with direct rupee inputs.

### 2. Passwordless Email OTP Authentication
* **How to use:**
  1. Click **"Sign In with Email"** in the top navigation bar.
  2. Enter your email address (and optional name).
  3. Receive a secure 6-digit cryptographic verification code directly in your Gmail inbox (or local dev console).
  4. Enter the 6-digit code to log in. Your private JWT token is generated and stored locally, instantly unlocking your private workspace.

### 3. User-Controlled Financial Profile Modal
* **How to use:**
  1. In the Dashboard or Landing Page, click **"Input My Exact Numbers"**.
  2. Input your exact numbers:
     * **Annual CTC (₹):** Type or select chips (`₹6L`, `₹9L`, `₹12L`, `₹15L`, `₹24L+`).
     * **Tax Regime:** Let the engine auto-recommend or choose Old/New.
     * **City Route:** Choose Current City (e.g., Kolkata) and Target Relocation City (e.g., Bengaluru).
     * **Rent Commitment:** Enter expected monthly rent (with live Max Safe Rent Cap feedback).
     * **Family Support:** Enter exact amount sent to parents.
     * **Active EMIs & Liquid Savings:** Enter loan repayments and bank balance.
     * **Milestone Goal:** Select your focus (*Metro Relocation, ₹15L Wedding, Education Loan, First Car, Emergency Buffer, or Wealth Optimization*).
  3. Click **"Calculate What's Best For My Numbers"**. All calculations re-run deterministically and sync to your private cloud profile.

### 4. Private Life Milestone Dashboard
* **Route:** `/dashboard` (Strictly protected by authentication gate).
* **Highlights:**
  * **Master Status Banner:** Displays Monthly In-Hand, Total Allocated, Emergency Runway, and custom title.
  * **Smart 5-Pots Dashboard:** Visual progress bars, percentage shares, and target amounts for each pot.
  * **Interactive What-If Sliders:** Adjust rent, parents' remittance, SIP investment, and tax regime on the fly to see live recalculation.
  * **Save to Cloud:** Click **"Save Plan"** to store custom life plans to your account in Supabase.

### 5. Dedicated AI Milestone Advisor Workstation
* **Route:** `/chat`
* **Features:**
  * **Sidebar Milestone Starters:** One-click prompts for *Bengaluru Move @ ₹9 LPA*, *₹15L Wedding in 18 Months*, *Old vs New Tax Regime*, *₹25L Education Loan 60/40 Split*, and *First Car Purchase*.
  * **Computed Financial Blueprints:** The AI generates rich verified cards showing exact take-home, recommended rent caps, and pot allocations.
  * **1-Click Apply to Dashboard:** Click **"Apply to My Live Dashboard"** on any AI recommendation to instantly load those parameters into your active budget.
  * **Sub-300ms Inference:** Powered by Groq Cloud LPU running Meta Llama 3.3 70B.

### 6. Metro Relocation & Landlord Deposit Radar
* Simulates origin-to-destination city relocations (e.g. Kolkata $\rightarrow$ Bengaluru, Pune $\rightarrow$ Mumbai).
* Computes:
  * **Locked Security Deposit** (e.g. 8 months of rent in Bengaluru = ₹1.28L).
  * **Sunk Moving Costs** (Brokerage, packers & movers, flight/train travel).
  * **Deposit Recovery Timeline** (Exact number of months required to restore liquid savings).

### 7. Deterministic Indian Income Tax Engine
* Automatically compares the **Old Tax Regime** vs. **New Section 115BAC Regime**:
  * Calculates Section 87A rebate (zero tax up to ₹7 LPA in New Regime).
  * Evaluates Section 10(13A) HRA exemptions based on metro (50%) vs non-metro (40%) rules.
  * Deducts ₹75,000 Standard Deduction.
  * Evaluates Section 80E interest deduction for higher education loans.

---

## 🏗️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             Client Web Browser               │
                               │  - Next.js 16 App Router (Turbopack)         │
                               │  - React 19 + TypeScript + Tailwind CSS      │
                               │  - Plus Jakarta Sans + Outfit Google Fonts   │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTPS / REST (JWT Bearer)
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │            FastAPI Backend Service           │
                               │  - Uvicorn ASGI Server (Port 8000)           │
                               │  - Anti-DDoS Rate Limiter Middleware         │
                               │  - Security Headers & CORS Enforcement       │
                               └──────────┬───────────────────────┬───────────┘
                                          │                       │
                     ┌────────────────────┴───────────┐           │
                     ▼                                ▼           ▼
       ┌───────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
       │   Deterministic Engines   │    │   Groq AI LPU Pipeline   │    │   Database & Storage     │
       │ - salary_engine.py (Taxes)│    │ - Meta Llama 3.3 70B     │    │ - SQLAlchemy 2.0 Async   │
       │ - relocation_engine.py    │    │ - Structured JSON Schema │    │ - Supabase PostgreSQL    │
       │ - budget_engine.py (Pots) │    │ - Milestone Consultations│    │ - SQLite fallback        │
       └───────────────────────────┘    └──────────────────────────┘    └──────────────────────────┘
```

---

## 💾 Digital Database Schema (ERD & Models)

The backend uses **SQLAlchemy 2.0 Async** declarative models mapped to **Supabase Cloud PostgreSQL** (with local `aiosqlite` development support):

```
┌──────────────────┐          1:1          ┌───────────────────────────┐
│      users       ├──────────────────────►│    financial_profiles     │
├──────────────────┤                       ├───────────────────────────┤
│ id (PK, UUID)    │                       │ id (PK, UUID)             │
│ email (Unique)   │                       │ user_id (FK -> users.id)  │
│ full_name        │                       │ annual_ctc (Float)        │
│ current_city     │                       │ monthly_take_home (Float) │
│ target_city      │                       │ tax_regime (String)       │
│ is_active (Bool) │                       │ current_rent (Float)      │
│ created_at       │                       │ family_support (Float)    │
│ updated_at       │                       │ existing_emis (Float)     │
└────────┬─────────┘                       │ current_savings (Float)   │
         │                                 │ current_monthly_sip (Flt) │
         │ 1:N                             └───────────────────────────┘
         ├────────────────────────┐
         ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│ financial_plans  │    │  chat_messages   │
├──────────────────┤    ├──────────────────┤
│ id (PK, UUID)    │    │ id (PK, UUID)    │
│ user_id (FK)     │    │ user_id (FK)     │
│ title (String)   │    │ role (user/asst) │
│ goal_category    │    │ content (Text)   │
│ monthly_income   │    │ extracted_data   │
│ survival_pot     │    │ created_at       │
│ obligations_pot  │    └──────────────────┘
│ family_pot       │
│ growth_pot       │    ┌──────────────────┐
│ guilt_free_upi   │    │    email_otps    │
│ health_score     │    ├──────────────────┤
│ emergency_months │    │ id (PK, UUID)    │
│ created_at       │    │ email (String)   │
└──────────────────┘    │ otp_code (6-chr) │
                        │ expires_at       │
                        │ is_used (Bool)   │
                        └──────────────────┘
```

### Table Details:
1. **`users`**: Master user account record storing email identity and location preferences.
2. **`email_otps`**: Stores transient 6-digit cryptographic verification codes with 10-minute expiry timestamps.
3. **`financial_profiles`**: 1-to-1 relationship with `users` holding user's real annual CTC, rent, parents' support, EMIs, and savings.
4. **`financial_plans`**: 1-to-Many saved life milestone plans with individual pot breakdowns and health scores.
5. **`chat_messages`**: 1-to-Many conversation records storing natural language exchanges and structured JSON previews.

---

## 🔌 REST API Documentation

### Authentication & Profiles (`/api/auth`)
* `POST /api/auth/send-otp`: Generates and dispatches a 6-digit verification code to the user's email.
* `POST /api/auth/verify-otp`: Validates the code, creates/retrieves user profile, and returns an RFC-7519 JWT Bearer token.
* `GET /api/auth/me`: Returns the authenticated user's profile details.
* `GET /api/auth/profile/financial`: Fetches the user's saved financial numbers (CTC, rent, EMIs, family support).
* `PUT /api/auth/profile/financial`: Updates the user's financial profile and persists custom numbers.

### Deterministic Calculators (`/api/calculate`)
* `POST /api/calculate/salary`: Computes gross monthly, EPF, standard deduction, Old vs. New tax breakdown, and net in-hand.
* `POST /api/calculate/relocation`: Computes locked deposit shock, sunk moving expenses, and scenario breakdowns for any origin $\rightarrow$ destination city pair.
* `POST /api/calculate/5pots`: Takes monthly income and liabilities to generate the 5 Smart Pots, Runway Clock, and Health Score.
* `POST /api/calculate/goal`: Computes required monthly SIP and tenure for weddings, cars, or custom milestones.
* `POST /api/calculate/loan`: Computes EMI amortisation, interest burden, and family split ratio for education/vehicle loans.

### AI Financial Advisor (`/api/chat`)
* `POST /api/chat/message`: Sends user's natural language query to the Groq LPU pipeline; returns Markdown response + structured blueprint preview.
* `GET /api/chat/history`: Retrieves past consultation history for the authenticated user.

### Financial Plans CRUD (`/api/plan`)
* `POST /api/plan/create`: Saves an active financial scenario to the user's account.
* `GET /api/plan/my-plans`: Lists all saved milestone plans.
* `DELETE /api/plan/{plan_id}`: Deletes a saved plan.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | Next.js 16.4 (App Router) | Server-side rendering, client hydration, and routing |
| **UI Components** | React 19.3 + TypeScript 5 | Strict type-safe interactive components |
| **Styling** | Tailwind CSS v4 | Responsive utility styles and design tokens |
| **Typography** | Plus Jakarta Sans & Outfit | Modern, readable fintech typography |
| **Backend Framework** | FastAPI 0.110 (Python 3.13) | Asynchronous high-throughput REST API |
| **ASGI Server** | Uvicorn (standard) | Low-latency async server |
| **Database ORM** | SQLAlchemy 2.0 (Async) | Non-blocking database session management |
| **Database Driver** | `asyncpg` (PostgreSQL) / `aiosqlite` | High-performance async connection pool |
| **Cloud Database** | Supabase PostgreSQL | Scalable cloud database hosting |
| **Authentication** | Python-Jose + PyJWT | Cryptographic JWT tokens |
| **AI Inference** | Groq Cloud LPU (Llama 3.3 70B) | Sub-300ms natural language financial guidance |

---

## 💻 Getting Started & Installation Guide

### Prerequisites
* **Node.js** >= 20.0.0
* **Python** >= 3.11 (tested on Python 3.13)
* **npm** or **pnpm**
* **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/shaazadil/Sankalp.git
cd Sankalp
```

---

### Step 2: Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   python -m pip install -r requirements.txt
   ```

4. Configure environment variables in `backend/.env`:
   ```env
   PROJECT_NAME="Sankalp"
   SECRET_KEY="sankalp_super_secret_jwt_key_india_2026_change_in_prod"
   ENVIRONMENT="development"
   DEV_DEMO_OTP="123456"

   # Supabase PostgreSQL Database (or leave default for local SQLite)
   DATABASE_URL="sqlite+aiosqlite:///./sankalp.db"

   # Groq AI Key for sub-300ms AI Financial Advisor
   GROQ_API_KEY="your-groq-api-key-here"
   GROQ_MODEL="llama-3.3-70b-versatile"

   # Optional Gmail SMTP (for real email delivery)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER=""
   SMTP_PASSWORD=""
   SMTP_FROM_EMAIL=""
   ```

5. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * The backend will be available at `http://127.0.0.1:8000`
   * Interactive Swagger API Docs at `http://127.0.0.1:8000/docs`

---

### Step 3: Frontend Setup (Next.js)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🔒 Security & Privacy Standards

1. **Zero Bank Passwords or Scraping:** Sankalp never asks for your bank net-banking passwords, UPI MPIN, or SMS permissions.
2. **Deterministic Mathematical Integrity:** Calculations for salary take-home, income tax, and loan EMIs are computed using deterministic Python algorithms—not hallucinated by the LLM.
3. **Passwordless Authentication:** 6-digit email verification codes prevent password leaks and credential stuffing attacks.
4. **Anti-DDoS Middleware:** Built-in rate limiting restricts abusive traffic and protects API endpoints.
5. **Private Data Isolation:** Each user's financial profile and saved plans are segregated by unique UUID foreign keys.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for Indian professionals navigating ambitious life milestones.</sub>
</div>
