from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from services.auth_utils import get_current_user
from services.financial import run_full_analysis

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


@router.post("/run", response_model=schemas.SettlementOut, status_code=status.HTTP_201_CREATED)
def run_analysis(
    request: schemas.AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    loan = db.query(models.Loan).filter(
        models.Loan.id == request.loan_id, models.Loan.user_id == current_user.id
    ).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    result = run_full_analysis(
        loan_amount=loan.loan_amount,
        emi_amount=loan.emi_amount,
        monthly_income=current_user.monthly_income,
        overdue_months=loan.overdue_months,
    )

    settlement = models.SettlementRequest(
        loan_id=loan.id,
        user_id=current_user.id,
        **result,
    )
    db.add(settlement)
    db.commit()
    db.refresh(settlement)
    return settlement


@router.get("/history", response_model=List[schemas.SettlementOut])
def analysis_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.SettlementRequest)
        .filter(models.SettlementRequest.user_id == current_user.id)
        .order_by(models.SettlementRequest.created_at.desc())
        .all()
    )


@router.get("/{settlement_id}", response_model=schemas.SettlementOut)
def get_settlement(
    settlement_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settlement = db.query(models.SettlementRequest).filter(
        models.SettlementRequest.id == settlement_id,
        models.SettlementRequest.user_id == current_user.id,
    ).first()
    if not settlement:
        raise HTTPException(status_code=404, detail="Settlement record not found")
    return settlement
