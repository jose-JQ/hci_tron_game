from sqlalchemy.orm import Session
from models import Achievement, Player # Asegúrate de importar desde tu módulo correcto
from database import SessionLocal

DEFAULT_ACHIEVEMENTS = [
    {
        "name": "Primer Rastro",
        "icon": "🚦",
        "description": "Juega tu primera partida de Tron",
        "goal": 1,
    },
    {
        "name": "Destructor de Rutas",
        "icon": "💥",
        "description": "Haz que tu oponente choque contra tu estela 5 veces",
        "goal": 5,
    },
    {
        "name": "Superviviente",
        "icon": "🛡️",
        "description": "Sobrevive más de 60 segundos en una partida",
        "goal": 60,
    },
    {
        "name": "Velocidad Total",
        "icon": "⚡",
        "description": "Juega una partida completa en la velocidad máxima",
        "goal": 1,
    },
    {
        "name": "Campeón Consecutivo",
        "icon": "🏆",
        "description": "Gana 5 partidas seguidas",
        "goal": 5,
    },
    {
        "name": "Líder del Circuito",
        "icon": "🎮",
        "description": "Gana 20 partidas en total",
        "goal": 20,
    },
    {
        "name": "Evasor de Estelas",
        "icon": "🚀",
        "description": "Evita 10 colisiones por un margen estrecho",
        "goal": 10,
    },
    {
        "name": "Duelo Épico",
        "icon": "⚔️",
        "description": "Gana una partida en menos de 15 segundos",
        "goal": 1,
    },
]

def populate_achievements():
    db: Session = SessionLocal()
    try:
        for ach in DEFAULT_ACHIEVEMENTS:
            exists = db.query(Achievement).filter_by(name=ach["name"]).first()
            if not exists:
                db.add(Achievement(**ach))

        existing = db.query(Player).filter(Player.id == 1).first()
        if not existing:
            new_player = Player(id=1, x="LEFT")
            db.add(new_player)
            db.commit()
    finally:
        db.close()
