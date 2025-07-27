export interface Player {
  id: 1 | 2;
  name: string;
  x: number;
  y: number;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  trail: { x: number; y: number }[];
  color: string;
  alive: boolean;
  score: number;
}

export interface GameState {
  players: Player[];
  gameStatus: 'waiting' | 'playing' | 'paused' | 'finished';
  winner: Player | null;
  round: number;
}

export interface User {
  name: string;
  email: string;
  age: number;
  isGuest: boolean;
}

export type GameMode = 'local' | 'practice' | 'celular';
export type Screen = 'home' | 'login' | 'gameSelection' | 'game' | 'results' | 'rules';