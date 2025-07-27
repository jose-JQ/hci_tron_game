from sqlalchemy import Column, Integer, String
from database import Base

class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True, index=True)  # 1 o 2
    x = Column(String, nullable=False)
