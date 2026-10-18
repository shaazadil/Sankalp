import re
from typing import Dict, Any, List, Optional
from app.config import settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.engines.salary_engine import calculate_salary
from app.engines.relocation_engine import calculate_relocation
from app.engines.loan_engine import calculate_loan
from app.engines.goal_engine import calculate_goal
from app.engines.budget_engine import calculate_budget_5_pots
from app.schemas.financial import (
    SalaryCalculationRequest, RelocationCalculationRequest,
    LoanCalculationRequest, GoalCalculationRequest, Budget5PotsRequest
)

def extract_indian_financial_figures(text: str) -> Dict[str, Any]:
    """Extracts numbers, LPA, Lakhs, thousands, cities, and life events from natural language."""
    data: Dict[str, Any] = {}
    lower = text.lower()
    
    # 1. Annual CTC / Salary in LPA
    lpa_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lpa|lakh(?:\s*per\s*annum)?|lac(?:\s*per\s*annum)?)', lower)
    if lpa_match:
        lpa_val = float(lpa_match.group(1))
        data["annual_ctc"] = lpa_val * 100000.0
        data["ctc_lpa"] = lpa_val
        
    # 2. Monthly income or figures in thousands (k) or Lakhs
    k_matches = re.findall(r'(?:earn|salary|income|take-home|in-hand)?\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*k\b', lower)
    if k_matches and "annual_ctc" not in data:
        data["monthly_in_hand"] = float(k_matches[0]) * 1000.0

    # 3. Lakh values (e.g. ₹2 lakh, 15 lakhs)
    lakh_matches = re.findall(r'(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)\b', lower)
    if lakh_matches:
        data["lakh_amount"] = float(lakh_matches[0]) * 100000.0

    # 4. EMI values
    emi_match = re.search(r'(\d+(?:,\d+)?|\d+k?)\s*(?:emi|loan\s*repayment)', lower)
    if emi_match:
        raw_val = emi_match.group(1).replace(',', '')
        if 'k' in raw_val:
            data["emi"] = float(raw_val.replace('k', '')) * 1000.0
        else:
            try:
                data["emi"] = float(raw_val)
            except ValueError:
                pass

    # 5. Cities
    cities = ["bengaluru", "bangalore", "kolkata", "mumbai", "delhi", "gurgaon", "hyderabad", "pune", "chennai"]
    found_cities = [c.capitalize() for c in cities if c in lower]
    if len(found_cities) >= 2:
        data["origin_city"] = found_cities[0]
        data["destination_city"] = found_cities[1]
    elif len(found_cities) == 1:
        data["destination_city"] = found_cities[0]

    # 6. Intent classification
    if any(w in lower for w in ["relocat", "move", "moving", "shifting", "transfer"]):
        data["intent"] = "relocation"
    elif any(w in lower for w in ["education", "college", "fees", "ms", "mba", "student loan"]):
        data["intent"] = "education_loan"
    elif any(w in lower for w in ["wedding", "marriage", "shaadi", "ring", "reception"]):
        data["intent"] = "wedding"
    elif any(w in lower for w in ["car", "bike", "vehicle", "two-wheeler", "scooter"]):
        data["intent"] = "vehicle"
    elif any(w in lower for w in ["invest", "sip", "save", "budget", "expenses", "spend"]):
        data["intent"] = "monthly_budget"
    else:
        data["intent"] = "general"

    return data

async def generate_conversational_response(req: ChatRequest) -> ChatResponse:
    text = req.message
    extracted = extract_indian_financial_figures(text)
    intent = extracted.get("intent", "general")
    
    # 1. Check if Groq API Key is configured (Blazing-Fast Indian AI Inference)
    if settings.GROQ_API_KEY:
        try:
            import httpx
            system_prompt = (
                "You are Sankalp AI, an empathetic, financially savvy Indian financial co-pilot (like a supportive, practical elder sibling). "
                "CRITICAL RULES: "
                "1. NEVER use intimidating Wall Street or fintech jargon (no 'debt service coverage', 'amortization schedules', 'disposable remuneration'). "
                "2. Speak warm, relatable Indian English. Use natural terms: 'in-hand salary', 'money sent to mummy-papa', 'Diwali & festival fund', 'Bangalore deposit shock', 'guilt-free UPI spend'. "
                "3. If ₹9 LPA is mentioned, explain that ₹9 LPA is annual CTC and NOT ₹75,000 monthly take-home (explain EPF, standard deduction, and professional tax make it ~₹62k–₹64k in-hand). "
                "4. Keep your answer concise (2-3 short paragraphs max), highly practical, and ask 1 or 2 bite-sized follow-up questions for missing numbers. "
                "5. Use Indian Rupee formatting (e.g. ₹62,000/month, ₹1.5 Lakh)."
            )
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": settings.GROQ_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": f"User query: {text}\nExtracted financial context: {extracted}"}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 600
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    groq_text = data["choices"][0]["message"]["content"]
                    # Redact any accidental secret/key reflections
                    clean_text = re.sub(r'gsk_[a-zA-Z0-9_\-]{15,}', '[REDACTED_KEY]', groq_text)
                    clean_text = re.sub(r'eyJ[a-zA-Z0-9_\-\.]{25,}', '[REDACTED_TOKEN]', clean_text)
                    return ChatResponse(
                        response=clean_text,
                        detected_intent=intent,
                        extracted_parameters=extracted,
                        suggested_quick_replies=[
                            "Show my 3-tier living plan",
                            "What is my exact in-hand salary?",
                            "How can I save on rent & deposit?"
                        ],
                        ready_for_plan_generation="annual_ctc" in extracted or "monthly_in_hand" in extracted
                    )
        except Exception as e:
            print(f"Notice: Groq API call fallback: {e}")

    # 2. Check if Gemini API Key is provided for dynamic LLM generation
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            system_prompt = (
                "You are Sankalp AI, an empathetic, financially savvy Indian financial co-pilot (like a supportive elder sibling). "
                "CRITICAL RULES: "
                "1. NEVER use intimidating Wall Street jargon (no 'debt service coverage', 'amortization schedules', 'disposable remuneration'). "
                "2. Speak warm, clear Indian English. Use natural terms: 'in-hand salary', 'money sent to mummy-papa', 'Diwali fund', 'Bangalore deposit shock', 'guilt-free UPI spend'. "
                "3. Explain that ₹9 LPA is annual CTC and NOT ₹75,000 monthly take-home (explain EPF, standard deduction, and professional tax). "
                "4. Keep your answer brief, supportive, and ask 1 or 2 bite-sized follow-up questions for missing numbers. "
                "5. Use Indian Rupee formatting (e.g. ₹62,000/month, ₹1.5 Lakh)."
            )
            
            prompt = f"{system_prompt}\n\nUser says: {text}\nExtracted info: {extracted}"
            response = await model.generate_content_async(prompt)
            llm_text = response.text
            
            return ChatResponse(
                response=llm_text,
                detected_intent=intent,
                extracted_parameters=extracted,
                suggested_quick_replies=["Show my Bangalore relocation plan", "What will my in-hand salary be?", "Help me adjust rent"],
                ready_for_plan_generation="annual_ctc" in extracted or "monthly_in_hand" in extracted
            )
        except Exception as e:
            print(f"Notice: Gemini LLM call fallback: {e}")

    # --- HIGH QUALITY LOCAL RULE-BASED INDIAN ADVISOR (Zero Hallucination, Immediate) ---
    response_text = ""
    quick_replies: List[str] = []
    ready = False
    preview = None

    if intent == "relocation" or ("bengaluru" in text.lower() or "bangalore" in text.lower()):
        ctc = extracted.get("annual_ctc", 900000.0)
        ctc_lpa = extracted.get("ctc_lpa", 9.0)
        dest = extracted.get("destination_city", "Bengaluru")
        orig = extracted.get("origin_city", "Kolkata")
        
        # Calculate real in-hand
        sal = calculate_salary(SalaryCalculationRequest(annual_ctc=ctc, tax_regime="new", monthly_rent=16000.0))
        in_hand = sal.estimated_monthly_in_hand
        
        # Relocation preview
        relo_res = calculate_relocation(RelocationCalculationRequest(
            origin_city=orig,
            destination_city=dest,
            annual_ctc=ctc,
            expected_rent=16000.0,
            family_support=10000.0,
            current_savings=150000.0
        ))
        
        response_text = (
            f"Congrats on the {dest} offer! Moving from {orig} to {dest} is a big milestone. 🚀\n\n"
            f"First things first: on a **₹{ctc_lpa:.1f} LPA offer**, your company does **not** send ₹{ctc/12:,.0f} to your bank account every month. "
            f"After Employee EPF (Provident Fund), Professional Tax, and standard tax deductions, your **actual in-hand salary will be around ₹{in_hand:,.0f}/month**.\n\n"
            f"💡 **The Big Bengaluru Reality Check (Deposit Shock):**\n"
            f"Landlords in Bengaluru typically ask for **6 to 8 months rent upfront** as a security deposit. "
            f"For an independent 1BHK (around ₹16k–₹18k/month), that means around **₹1.1 Lakh – ₹1.3 Lakh locked up** on day one.\n\n"
            f"Quick question to personalize your plan: Are you looking at staying in a **shared flat/PG** (around ₹12k) or an **independent 1BHK**? And do you send money home to your parents each month?"
        )
        quick_replies = [
            "Shared PG / Flatshare (₹12k/mo)",
            "Independent 1BHK (₹18k/mo)",
            "I send ₹10,000 home to parents",
            "Generate my 3-tier living plan now"
        ]
        ready = True
        preview = {
            "annual_ctc": ctc,
            "estimated_in_hand": in_hand,
            "balanced_rent": 16000.0,
            "security_deposit_shock": 112000.0,
            "monthly_savings_potential": relo_res.scenarios[1].monthly_savings_potential
        }

    elif intent == "education_loan":
        loan_amount = extracted.get("lakh_amount", 2500000.0)
        calc = calculate_loan(LoanCalculationRequest(
            principal=loan_amount,
            annual_interest_rate=9.5,
            tenure_years=7,
            family_contribution_percent=50.0,
            monthly_income=65000.0
        ))
        response_text = (
            f"Higher education is a big leap! Let’s make sure this loan doesn't turn into financial stress later. 🎓\n\n"
            f"For a **₹{loan_amount/100000:.1f} Lakh loan** at 9.5% over 7 years, the total monthly EMI comes to **₹{calc.monthly_emi:,.0f}/month**.\n\n"
            f"If your family contributes 50%, your personal share is **₹{calc.user_share_emi:,.0f}/month**.\n\n"
            f"💡 **Tax Secret (Section 80E):** Under India's Old Tax Regime, 100% of the interest you pay on an education loan is deductible from your taxable income with NO upper ceiling for 8 years! That could save you around **₹{calc.section_80e_monthly_tax_saving:,.0f}/month in taxes**."
        )
        quick_replies = [
            "Family pays 60%, I pay 40%",
            "Calculate for 10-year tenure",
            "How does Section 80E save tax?"
        ]
        ready = True
        preview = {
            "total_emi": calc.monthly_emi,
            "user_share_emi": calc.user_share_emi,
            "tax_saving_80e": calc.section_80e_monthly_tax_saving
        }

    elif intent == "wedding":
        target = extracted.get("lakh_amount", 1200000.0)
        goal_res = calculate_goal(GoalCalculationRequest(
            goal_name="Wedding",
            target_amount=target,
            target_months=18,
            current_savings=200000.0,
            monthly_income=70000.0,
            is_wedding_or_gold_goal=True
        ))
        response_text = (
            f"Congratulations on planning the big day! 💍 Indian weddings are beautiful, but they can easily blow past budgets if not mapped out.\n\n"
            f"To build a **₹{target/100000:.1f} Lakh wedding fund** in 18 months, with ₹2 Lakh already saved, you need to set aside **₹{goal_res.required_monthly_sip:,.0f}/month** in a disciplined SIP/RD.\n\n"
            f"💡 **The Smart Gold Strategy:** Rather than saving 100% in cash, allocating 30% into **Sovereign Gold Bonds (SGB) or Digital Gold** protects you against gold jewelry price inflation as the wedding date gets closer."
        )
        quick_replies = [
            "What if family helps with ₹3 Lakh?",
            "Can we stretch timeline to 24 months?",
            "Show my monthly gold + SIP split"
        ]
        ready = True
        preview = {
            "target": target,
            "monthly_sip_required": goal_res.required_monthly_sip,
            "verdict": goal_res.affordability_verdict
        }

    elif intent == "vehicle":
        target = extracted.get("lakh_amount", 800000.0)
        goal_res = calculate_goal(GoalCalculationRequest(
            goal_name="First Car",
            target_amount=target,
            target_months=12,
            current_savings=150000.0,
            monthly_income=75000.0
        ))
        alt = goal_res.loan_alternative or {}
        response_text = (
            f"Buying your first vehicle is such an awesome milestone! 🚗 Let’s look at the smartest way to do it without wiping out your emergency savings.\n\n"
            f"For an **₹{target/100000:.1f} Lakh vehicle**:\n"
            f"• **Buy Outright:** Save **₹{goal_res.required_monthly_sip:,.0f}/month** for 12 months (Total Interest Paid: ₹0).\n"
            f"• **Auto Loan:** Put 20% down (₹{alt.get('down_payment_required', 160000):,.0f}) and pay **₹{alt.get('monthly_emi', 16000):,.0f}/month EMI** for 4 years (Total Extra Interest: ₹{alt.get('total_interest_paid', 125000):,.0f}).\n\n"
            f"Do you want to buy outright with disciplined savings, or take an EMI so you can drive home sooner?"
        )
        quick_replies = [
            "Compare Loan vs Cash Outright",
            "What EMI can I safely afford?",
            "Build my vehicle savings plan"
        ]
        ready = True
        preview = {
            "target": target,
            "loan_emi": alt.get("monthly_emi", 0.0),
            "total_interest_cost": alt.get("total_interest_paid", 0.0)
        }

    else:
        # General welcoming assistance
        response_text = (
            "Namaste! I'm your Sankalp financial co-pilot. 🙏\n\n"
            "Think of me like a financially savvy friend who understands Indian realities — from real take-home salary and Bangalore landlord deposit shocks, to sending money home to parents and festival budgets.\n\n"
            "Tell me what's on your mind in plain English, for example:\n"
            "• *\"I got a ₹9 LPA offer in Bengaluru, moving from Kolkata. How much will I actually save?\"*\n"
            "• *\"I earn ₹70,000/month and want to plan my sister's wedding in 18 months.\"*\n"
            "• *\"How should I plan a ₹25 Lakh education loan with my parents?\"*"
        )
        quick_replies = [
            "Moving Kolkata to Bengaluru (₹9 LPA)",
            "Plan ₹15L Wedding in 18 Months",
            "Plan ₹25L Education Loan Repayment",
            "Optimize my monthly ₹60k salary"
        ]

    return ChatResponse(
        response=response_text,
        detected_intent=intent,
        extracted_parameters=extracted,
        suggested_quick_replies=quick_replies,
        ready_for_plan_generation=ready,
        computed_preview=preview
    )
