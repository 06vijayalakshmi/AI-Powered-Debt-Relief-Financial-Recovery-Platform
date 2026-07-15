from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


# ---------- Auth / User ----------

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    monthly_income: float = 0.0


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    monthly_income: float
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Loan ----------

class LoanCreate(BaseModel):
    lender_name: str
    loan_amount: float
    emi_amount: float
    overdue_months: int = 0
    interest_rate: float = 0.0


class LoanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    lender_name: str
    loan_amount: float
    emi_amount: float
    overdue_months: int
    interest_rate: float
    created_at: datetime


# ---------- Analysis / Settlement ----------

class AnalyzeRequest(BaseModel):
    loan_id: int


class SettlementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    loan_id: int
    user_id: int
    emi_to_income_ratio: float
    monthly_surplus: float
    debt_stress_level: str
    recommended_settlement_amount: float
    discount_percentage: float
    created_at: datetime


# ---------- Negotiation Letter ----------

class LetterRequest(BaseModel):
    settlement_id: int
    tone: Optional[str] = "formal"  # formal / firm / friendly


class LetterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    settlement_id: int
    user_id: int
    letter_content: str
    created_at: datetime
