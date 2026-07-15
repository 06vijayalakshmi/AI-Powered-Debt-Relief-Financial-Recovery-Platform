import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    genai.configure(api_key=GEMINI_API_KEY)
    _model = genai.GenerativeModel("gemini-1.5-flash")
else:
    _model = None


def _build_prompt(
    borrower_name: str,
    lender_name: str,
    loan_amount: float,
    emi_amount: float,
    overdue_months: int,
    debt_stress_level: str,
    recommended_settlement_amount: float,
    discount_percentage: float,
    tone: str = "formal",
) -> str:
    return f"""
You are a financial writing assistant helping a borrower draft a polite, professional
debt settlement negotiation letter to send to their lender.

Borrower name: {borrower_name}
Lender name: {lender_name}
Original loan amount: {loan_amount}
Monthly EMI: {emi_amount}
Months overdue: {overdue_months}
Assessed financial stress level: {debt_stress_level}
Proposed settlement amount: {recommended_settlement_amount}
Proposed discount: {discount_percentage}%

Write a {tone} negotiation letter, addressed to the lender, that:
1. Explains the borrower's financial hardship honestly but without oversharing private details.
2. Proposes the settlement amount as a one-time or structured payment.
3. Requests written confirmation of any agreement before payment.
4. Maintains a respectful, cooperative tone throughout.
5. Is signed off generically (no fabricated personal details beyond what's given).

Keep it under 300 words. Return only the letter text, no extra commentary.
""".strip()


def generate_negotiation_letter(
    borrower_name: str,
    lender_name: str,
    loan_amount: float,
    emi_amount: float,
    overdue_months: int,
    debt_stress_level: str,
    recommended_settlement_amount: float,
    discount_percentage: float,
    tone: str = "formal",
) -> str:
    prompt = _build_prompt(
        borrower_name, lender_name, loan_amount, emi_amount, overdue_months,
        debt_stress_level, recommended_settlement_amount, discount_percentage, tone
    )

    if _model is None:
        # Fallback so the app still works before a Gemini API key is configured
        return (
            f"[DEMO MODE - add GEMINI_API_KEY to backend/.env for AI-generated letters]\n\n"
            f"Dear {lender_name},\n\n"
            f"I am writing regarding my loan account with an outstanding balance of "
            f"{loan_amount}. Due to financial hardship, I am currently unable to continue "
            f"payments at the original terms. I would like to propose a one-time settlement "
            f"of {recommended_settlement_amount} ({discount_percentage}% discount) to fully "
            f"resolve this obligation. Please confirm this arrangement in writing so I may "
            f"proceed with payment.\n\nSincerely,\n{borrower_name}"
        )

    response = _model.generate_content(prompt)
    return response.text.strip()
