"""
Core financial analysis logic:
- EMI-to-income ratio
- Monthly surplus
- Debt stress classification
- Recommended settlement amount & discount
"""


def calculate_emi_to_income_ratio(emi_amount: float, monthly_income: float) -> float:
    if monthly_income <= 0:
        return 0.0
    return round((emi_amount / monthly_income) * 100, 2)


def calculate_monthly_surplus(monthly_income: float, emi_amount: float) -> float:
    return round(monthly_income - emi_amount, 2)


def classify_debt_stress(emi_ratio: float, overdue_months: int) -> str:
    """
    Simple, explainable rule-based classification.
    emi_ratio: EMI as % of monthly income
    overdue_months: number of months payment has been overdue
    """
    if emi_ratio >= 50 or overdue_months >= 6:
        return "High"
    elif emi_ratio >= 30 or overdue_months >= 3:
        return "Medium"
    else:
        return "Low"


def recommend_settlement(
    loan_amount: float, debt_stress_level: str, overdue_months: int
) -> tuple[float, float]:
    """
    Returns (recommended_settlement_amount, discount_percentage)

    Discount logic (illustrative, not financial/legal advice):
    - High stress + long overdue -> lenders more willing to negotiate -> bigger discount
    - Low stress -> smaller discount, borrower has more leverage to just repay
    """
    base_discount = {
        "Low": 10.0,
        "Medium": 25.0,
        "High": 40.0,
    }.get(debt_stress_level, 15.0)

    # Extra discount for very long overdue periods, capped at 60%
    overdue_bonus = min(overdue_months * 1.5, 20.0)
    discount_percentage = min(base_discount + overdue_bonus, 60.0)

    recommended_amount = round(loan_amount * (1 - discount_percentage / 100), 2)

    return recommended_amount, round(discount_percentage, 2)


def run_full_analysis(
    loan_amount: float,
    emi_amount: float,
    monthly_income: float,
    overdue_months: int,
) -> dict:
    emi_ratio = calculate_emi_to_income_ratio(emi_amount, monthly_income)
    surplus = calculate_monthly_surplus(monthly_income, emi_amount)
    stress_level = classify_debt_stress(emi_ratio, overdue_months)
    settlement_amount, discount_pct = recommend_settlement(
        loan_amount, stress_level, overdue_months
    )

    return {
        "emi_to_income_ratio": emi_ratio,
        "monthly_surplus": surplus,
        "debt_stress_level": stress_level,
        "recommended_settlement_amount": settlement_amount,
        "discount_percentage": discount_pct,
    }
