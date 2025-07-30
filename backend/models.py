from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime

class GameHistory(Base):
    __tablename__ = "game_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    duration = Column(Float)  # segundos
    moves = Column(Integer)
    difficulty = Column(String)
    result = Column(String)  # "win" o "lose"
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)  # 1 o 2
    x = Column(String, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    age = Column(Integer)
    hashed_password = Column(String)
    games_won = Column(Integer, default=0)
    best_time = Column(Integer, nullable=True)
    games_loss = Column(Integer, default=0)
    max_score = Column(Integer, default=0)

    achievements = relationship("UserAchievement", back_populates="user")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    icon = Column(String)
    description = Column(String)
    goal = Column(Integer)

    users = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    current_progress = Column(Integer, default=0)
    unlocked = Column(Boolean, default=False)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="users")