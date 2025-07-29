from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base
from populate_achievements import populate_achievements
import crud, schemas
from auth import router as auth_router
from user import router as user_router

app = FastAPI()

# Crea las tablas si no existen
Base.metadata.create_all(bind=engine)
populate_achievements()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # puedes usar ["*"] en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)

# Dependency para la sesión
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.get("/")
def root():
    return {"message": "API disponible"}

@app.get("/api/player/{player_id}", response_model=schemas.PlayerOut)
def read_player(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.get_player(db, player_id)
    if not db_player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return db_player

@app.put("/api/player/{player_id}", response_model=schemas.PlayerOut)
def update_player(player_id: int, player: schemas.PlayerUpdate, db: Session = Depends(get_db)):
    db_player = crud.update_player(db, player_id, player)
    if not db_player:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return db_player

# Opcional: inicializar jugadores si no existen
@app.post("/api/player/{player_id}", response_model=schemas.PlayerOut)
def create_player(player_id: int, player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    existing = crud.get_player(db, player_id)
    if existing:
        raise HTTPException(status_code=400, detail="Jugador ya existe")
    return crud.create_player(db, player_id, player.x)
