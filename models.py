from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    monthly_income = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    loans = relationship("Loan", back_populates="owner", cascade="all, delete-orphan")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lender_name = Column(String, nullable=False)
    loan_amount = Column(Float, nullable=False)
    emi_amount = Column(Float, nullable=False)
    overdue_months = Column(Integer, default=0)
    interest_rate = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="loans")
    settlements = relationship("SettlementRequest", back_populates="loan", cascade="all, delete-orphan")


class SettlementRequest(Base):
    __tablename__ = "settlement_requests"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    emi_to_income_ratio = Column(Float)
    monthly_surplus = Column(Float)
    debt_stress_level = Column(String)  # Low / Medium / High
    recommended_settlement_amount = Column(Float)
    discount_percentage = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

    loan = relationship("Loan", back_populates="settlements")
    negotiation_letters = relationship(
        "NegotiationHistory", back_populates="settlement", cascade="all, delete-orphan"
    )


class NegotiationHistory(Base):
    __tablename__ = "negotiation_history"

    id = Column(Integer, primary_key=True, index=True)
    settlement_id = Column(Integer, ForeignKey("settlement_requests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    letter_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    settlement = relationship("SettlementRequest", back_populates="negotiation_letters")
