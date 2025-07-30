export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  achivments: [string];
}

export interface UserCreate {
  name: string;
  email: string;
  age: number;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserStats {
  games_won: number;
  games_loss: number;
  max_score: number;
  best_time: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  unlocked: boolean;
}

export interface UserProgress {
  unlocked_achievements: number;
  total_achievements: number;
  completion_percentage: number;
}

export interface GameStats {
  won: boolean;
  score: number;
  time_seconds: number;
}