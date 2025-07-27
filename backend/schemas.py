from pydantic import BaseModel

class PlayerBase(BaseModel):
    x: str

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(PlayerBase):
    pass

class PlayerOut(PlayerBase):
    id: int

    class Config:
        orm_mode = True
