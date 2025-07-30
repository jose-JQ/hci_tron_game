from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base
from populate_achievements import populate_achievements
import crud, schemas
from auth import router as auth_router
from user import router as user_router
from models import GameHistory
from schemas import GameHistoryCreate
import pickle
from fastapi import Request

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

# Cargar el modelo de machine learning
with open('tron_model.pkl', 'rb') as f:
    ml_model = pickle.load(f)

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

@app.post("/api/game_history")
def save_game_history(history: GameHistoryCreate, db: Session = Depends(get_db)):
    db_history = GameHistory(**history.dict())
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history

@app.post("/api/predict_difficulty")
async def predict_difficulty(request: Request):
    data = await request.json()
    features = [
        data['age'],
        data['games_won'],
        data['best_time'],
        data['games_loss'],
        data['max_score']
    ]
    dificultad = ml_model.predict([features])[0]
    return {"dificultad": str(dificultad)}
