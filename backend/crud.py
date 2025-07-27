from sqlalchemy.orm import Session
from models import Player
from schemas import PlayerUpdate

def get_player(db: Session, player_id: int):
    return db.query(Player).filter(Player.id == player_id).first()

def update_player(db: Session, player_id: int, player_data: PlayerUpdate):
    player = db.query(Player).filter(Player.id == player_id).first()
    if player:
        player.x = player_data.x
        db.commit()
        db.refresh(player)
    return player

def create_player(db: Session, player_id: int, x: int):
    player = Player(id=player_id, x=x)
    db.add(player)
    db.commit()
    db.refresh(player)
    return player
