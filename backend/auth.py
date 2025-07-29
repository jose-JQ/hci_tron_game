from models import Achievement
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi import Request
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserAchievement
from schemas import UserCreate, UserLogin, UserOut
from utils import hash_password, verify_password, create_access_token
from schemas import GameResult


router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_achievement(user: User, achievement_name: str):
    return next((ua for ua in user.achievements if ua.achievement.name == achievement_name), None)


def update_achievement(user: User, achievement_name: str, increment: int, db: Session):
    """
    Incrementa el progreso del logro indicado para el usuario.
    Si alcanza la meta, desbloquea el logro.
    """
    ua = get_achievement(user, achievement_name)
    if ua is None or ua.unlocked:
        return
    ua.current_progress += increment
    if ua.current_progress >= ua.achievement.goal:
        ua.unlocked = True
    db.add(ua)


def reset_achievement(user: User, achievement_name: str, db: Session):
    """
    Reinicia el progreso y estado desbloqueado del logro indicado para el usuario.
    """
    ua = get_achievement(user, achievement_name)
    if ua is None:
        return
    ua.current_progress = 0
    ua.unlocked = False
    db.add(ua)

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    new_user = User(
        name=user.name,
        email=user.email,
        age=user.age,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Obtener todos los logros existentes
    all_achievements = db.query(Achievement).all()

    # Asociar cada logro con el usuario
    for achievement in all_achievements:
        user_achievement = UserAchievement(
            user_id=new_user.id,
            achievement_id=achievement.id,
            current_progress=0,
            unlocked=False
        )
        db.add(user_achievement)

    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

# servicios para la tablita de tron


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from utils import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.post("/update-stats")
def update_stats(
    result: GameResult,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Actualizar estadísticas básicas
    if result.won:
        current_user.games_won += 1
        update_achievement(current_user, "Primer Rastro", 1,db)
        update_achievement(current_user, "Campeón Consecutivo", 1, db)

        # Actualizar "Líder del Circuito" con total acumulado de partidas ganadas
        ua_lider = next((ua for ua in current_user.achievements if ua.achievement.name == "Líder del Circuito"), None)
        if ua_lider and not ua_lider.unlocked:
            ua_lider.current_progress = current_user.games_won
            if ua_lider.current_progress >= ua_lider.achievement.goal:
                ua_lider.unlocked = True
            db.add(ua_lider)

        # Logro "Duelo Épico" ganar en menos de 15 segundos
        if result.time_seconds < 15:
            update_achievement(current_user, "Duelo Épico", 1,db)
    else:
        current_user.games_loss += 1

    current_user.max_score = max(current_user.max_score, result.score)

    if current_user.best_time is None or result.time_seconds < current_user.best_time:
        current_user.best_time = result.time_seconds

    # Logro "Superviviente": sobrevivir más de 60 segundos
    if result.time_seconds > 60:
        update_achievement(current_user, "Superviviente", result.time_seconds,db)

    db.add(current_user)
    db.commit()

    return {"message": "Estadísticas actualizadas correctamente"}