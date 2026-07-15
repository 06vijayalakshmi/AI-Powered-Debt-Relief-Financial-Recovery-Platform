from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from services.auth_utils import get_current_user
from services.gemini_service import generate_negotiation_letter

router = APIRouter(prefix="/api/letters", tags=["letters"])


@router.post("/generate", response_model=schemas.LetterOut, status_code=status.HTTP_201_CREATED)
def generate_letter(
    request: schemas.LetterRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settlement = db.query(models.SettlementRequest).filter(
        models.SettlementRequest.id == request.settlement_id,
        models.SettlementRequest.user_id == current_user.id,
    ).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement record not found")

    loan = db.query(models.Loan).filter(models.Loan.id == settlement.loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Associated loan not found")

    letter_text = generate_negotiation_letter(
        borrower_name=current_user.full_name,
        lender_name=loan.lender_name,
        loan_amount=loan.loan_amount,
        emi_amount=loan.emi_amount,
        overdue_months=loan.overdue_months,
        debt_stress_level=settlement.debt_stress_level,
        recommended_settlement_amount=settlement.recommended_settlement_amount,
        discount_percentage=settlement.discount_percentage,
        tone=request.tone,
    )

    letter = models.NegotiationHistory(
        settlement_id=settlement.id,
        user_id=current_user.id,
        letter_content=letter_text,
    )
    db.add(letter)
    db.commit()
    db.refresh(letter)
    return letter


@router.get("/history", response_model=List[schemas.LetterOut])
def letter_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.NegotiationHistory)
        .filter(models.NegotiationHistory.user_id == current_user.id)
        .order_by(models.NegotiationHistory.created_at.desc())
        .all()
    )
