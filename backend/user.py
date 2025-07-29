from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Achievement
from schemas import UserOut, UserAchievementSchema
from auth import get_current_user

router = APIRouter(prefix="/user", tags=["user"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=UserOut)
def get_user_data(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/me/stats")
def get_user_stats(current_user: User = Depends(get_current_user)):
    return {
        "games_won": current_user.games_won,
        "games_less": get_current_user.games_loss,
        "best_time": current_user.best_time,
        "max_score": current_user.max_score
    }

@router.get("/me/achievements", response_model=list[UserAchievementSchema])
def get_user_achievements(current_user: User = Depends(get_current_user)):
    return current_user.achievements

@router.get("/me/progress")
def get_progress_summary(current_user: User = Depends(get_current_user)):
    total = len(current_user.achievements)
    unlocked = len([a for a in current_user.achievements if a.unlocked])
    return {
        "unlocked": unlocked,
        "total": total,
        "percent": round((unlocked / total) * 100, 2) if total else 0.0
    }