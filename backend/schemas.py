from pydantic import BaseModel, EmailStr
from typing import List, Optional
from pydantic import BaseModel

class GameHistoryCreate(BaseModel):
    user_id: int
    duration: float
    moves: int
    difficulty: str
    result: str

class PlayerBase(BaseModel):
    x: str

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(PlayerBase):
    pass

class PlayerOut(PlayerBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: int
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class AchievementBase(BaseModel):
    id: int
    name: str
    icon: str
    description: str
    goal: int

    class Config:
        from_attributes = True

class UserAchievementSchema(BaseModel):
    id: int
    user_id: int
    achievement_id: int
    current_progress: int
    unlocked: bool

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int
    games_won: int
    games_loss: int
    best_time: Optional[int]
    max_score: int
    achievements: List[UserAchievementSchema] = []

    class Config:
        from_attributes = True


class GameResult(BaseModel):
    won: bool
    time_seconds: int
    score: int