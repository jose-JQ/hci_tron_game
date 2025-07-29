import { useState, useEffect, useCallback, useRef } from 'react';
import { Player, GameState, GameMode } from '../types';
import { useClickSound } from './useClickSound';


const GRID_SIZE = 8;
const INITIAL_SPEED = 50;
const API_URL = "http://192.168.162.106:8000";

export function useTronGame(canvasRef: React.RefObject<HTMLCanvasElement>, gameMode:GameMode) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    gameStatus: 'waiting',
    winner: null,
    round: 1
  });

  const gameLoopRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const speedRef = useRef<number>(INITIAL_SPEED);

  const gameStatusRef = useRef<GameState['gameStatus']>('waiting');

  const playClick = useClickSound();
  

  const update = async (id: number, x: string) => {
    try {
      await fetch(`${API_URL}/api/player/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x })
      });
    } catch (error) {
      console.error(`Error actualizando jugador ${id}:`, error);
    }
  };

  const fetchPlayerPosition = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/api/player/${id}`);
    if (!response.ok) throw new Error('Error al obtener datos del jugador');
    const { x } = await response.json();
    return { x };
  } catch (error) {
    console.error(`Error obteniendo posición del jugador ${id}:`, error);
    return null;
  }
};

    if (gameMode == 'local' || gameMode == 'practice') {

      const createPlayer = useCallback((id: 1 | 2, name: string): Player => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not available');

        const valX = Math.floor(Math.random() * canvas.width);
        let valY = id === 2
          ? Math.floor(Math.random() * (canvas.height / 2)) + canvas.height / 2
          : Math.floor(Math.random() * (canvas.height / 2));

        return {
          id,
          name,
          x: valX,
          y: valY,
          direction: id === 1 ? 'RIGHT' : 'LEFT',
          trail: [{ x: valX, y: valY }],
          color: id === 1 ? '#ff0080' : '#00ffff',
          alive: true,
          score: 0
        };
      }, [canvasRef]);

      const initializeGame = useCallback((player1Name: string, player2Name: string) => {
        const players = [
          createPlayer(1, player1Name),
          createPlayer(2, player2Name)
        ];

        setGameState(prev => ({
          ...prev,
          players,
          gameStatus: 'waiting',
          winner: null
        }));
      }, [createPlayer]);

      const checkCollision = useCallback((player: Player, allPlayers: Player[]): boolean => {
        const canvas = canvasRef.current;
        if (!canvas) return false;

        if (player.x < 0 || player.x >= canvas.width || player.y < 0 || player.y >= canvas.height) {
          return true;
        }

        for (const p of allPlayers) {
          for (let i = 0; i < p.trail.length - (p.id === player.id ? 1 : 0); i++) {
            const trailPoint = p.trail[i];
            if (Math.abs(player.x - trailPoint.x) < GRID_SIZE &&
                Math.abs(player.y - trailPoint.y) < GRID_SIZE) {
              
              return true;
            }
          }
        }

        return false;
      }, [canvasRef]);

      const updatePlayerPosition = useCallback((player: Player): Player => {
        let newX = player.x;
        let newY = player.y;

        switch (player.direction) {
          case 'UP': newY -= GRID_SIZE; break;
          case 'DOWN': newY += GRID_SIZE; break;
          case 'LEFT': newX -= GRID_SIZE; break;
          case 'RIGHT': newX += GRID_SIZE; break;
        }

        return {
          ...player,
          x: newX,
          y: newY,
          trail: [...player.trail, { x: newX, y: newY }]
        };
      }, []);

      const handleKeyPress = useCallback((event: KeyboardEvent) => {
        keysRef.current.add(event.key);
      }, []);

      const handleKeyRelease = useCallback((event: KeyboardEvent) => {
        keysRef.current.delete(event.key);
      }, []);

      const updateGame = useCallback((timestamp: number) => {
        if (gameStatusRef.current !== 'playing') {
          gameLoopRef.current = requestAnimationFrame(updateGame);
          return;
        }

        if (timestamp - lastUpdateRef.current < speedRef.current) {
          gameLoopRef.current = requestAnimationFrame(updateGame);
          return;
        }

        setGameState(prev => {
          if (prev.gameStatus !== 'playing') return prev;

          let updatedPlayers = [...prev.players];

          // Control input
          updatedPlayers = updatedPlayers.map(player => {
            if (!player.alive) return player;

            let newDirection = player.direction;

            if (player.id === 1) {
              if (keysRef.current.has('w') && player.direction !== 'DOWN') newDirection = 'UP';
              else if (keysRef.current.has('s') && player.direction !== 'UP') newDirection = 'DOWN';
              else if (keysRef.current.has('a') && player.direction !== 'RIGHT') newDirection = 'LEFT';
              else if (keysRef.current.has('d') && player.direction !== 'LEFT') newDirection = 'RIGHT';
            } else {
              if (keysRef.current.has('ArrowUp') && player.direction !== 'DOWN') newDirection = 'UP';
              else if (keysRef.current.has('ArrowDown') && player.direction !== 'UP') newDirection = 'DOWN';
              else if (keysRef.current.has('ArrowLeft') && player.direction !== 'RIGHT') newDirection = 'LEFT';
              else if (keysRef.current.has('ArrowRight') && player.direction !== 'LEFT') newDirection = 'RIGHT';
            }

            return { ...player, direction: newDirection };
          });

          // Move and detect collision
          updatedPlayers = updatedPlayers.map(player =>
            player.alive ? updatePlayerPosition(player) : player
          );

          updatedPlayers = updatedPlayers.map(player => ({
            ...player,
            alive: player.alive && !checkCollision(player, prev.players)
          }));

          const alivePlayers = updatedPlayers.filter(p => p.alive);
          let winner = null;

          if (alivePlayers.length <= 1) {
            if (alivePlayers.length === 1) {
              winner = alivePlayers[0];
              winner.score += 1;
            }

            return {
              ...prev,
              players: updatedPlayers,
              gameStatus: 'finished',
              winner
            };
          }

          return {
            ...prev,
            players: updatedPlayers
          };
        });

        lastUpdateRef.current = timestamp;
        gameLoopRef.current = requestAnimationFrame(updateGame);
      }, [updatePlayerPosition, checkCollision]);

      const startGame = useCallback(() => {
        setGameState(prev => {
          const newState: GameState = { ...prev, gameStatus: 'playing' };
          gameStatusRef.current = 'playing';
          return newState;
        });
        lastUpdateRef.current = 0;
        gameLoopRef.current = requestAnimationFrame(updateGame);
      }, [updateGame]);

      const pauseGame = useCallback(() => {
        setGameState(prev => {
          playClick();
          const newStatus = prev.gameStatus === 'paused' ? 'playing' : 'paused';
          gameStatusRef.current = newStatus;
          return { ...prev, gameStatus: newStatus };
        });

        if (gameStatusRef.current === 'paused') {
          if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
          }
        } else {
          gameLoopRef.current = requestAnimationFrame(updateGame);
        }
      }, [updateGame]);

      const resetGame = useCallback(() => {
        playClick();
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }

        setGameState(prev => {
          const players = prev.players.map(player => createPlayer(player.id, player.name));
          gameStatusRef.current = 'waiting';
          return {
            ...prev,
            players,
            gameStatus: 'waiting',
            winner: null
          };
        });
      }, [createPlayer]);

      useEffect(() => {
        gameStatusRef.current = gameState.gameStatus;
      }, [gameState.gameStatus]);

      useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyRelease);

        return () => {
          window.removeEventListener('keydown', handleKeyPress);
          window.removeEventListener('keyup', handleKeyRelease);
          if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
          }
        };
      }, [handleKeyPress, handleKeyRelease]);

      return {
        gameState,
        initializeGame,
        startGame,
        pauseGame,
        resetGame
      };
  } else {
      const createPlayer = useCallback((id: 1 | 2, name: string): Player => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not available');

        const valX = Math.floor(Math.random() * canvas.width);
        let valY = id === 2
          ? Math.floor(Math.random() * (canvas.height / 2)) + canvas.height / 2
          : Math.floor(Math.random() * (canvas.height / 2));
        
        if (id == 1) {
         update(id, "LEFT");
        }


        return {
          id,
          name,
          x: valX,
          y: valY,
          direction: id === 1 ? 'RIGHT' : 'LEFT',
          trail: [{ x: valX, y: valY }],
          color: id === 1 ? '#ff0080' : '#00ffff',
          alive: true,
          score: 0
        };
    }, [canvasRef]);

    const initializeGame = useCallback((player1Name: string, player2Name: string) => {

      if (gameMode == "celular") {
        player2Name = "Chappie IA"
      }
      const players = [
        createPlayer(1, player1Name),
        createPlayer(2, player2Name)
      ];

      setGameState(prev => ({
        ...prev,
        players,
        gameStatus: 'waiting',
        winner: null
      }));
    }, [createPlayer]);

    const checkCollision = useCallback((player: Player, allPlayers: Player[]): boolean => {
      const canvas = canvasRef.current;
      if (!canvas) return false;

      if (player.x < 0 || player.x >= canvas.width || player.y < 0 || player.y >= canvas.height) {
        return true;
      }

      for (const p of allPlayers) {
        for (let i = 0; i < p.trail.length - (p.id === player.id ? 1 : 0); i++) {
          const trailPoint = p.trail[i];
          if (Math.abs(player.x - trailPoint.x) < GRID_SIZE &&
              Math.abs(player.y - trailPoint.y) < GRID_SIZE) {
            return true;
          }
        }
      }

      return false;
    }, [canvasRef]);

    const updatePlayerPosition = useCallback((player: Player): Player => {
      let newX = player.x;
      let newY = player.y;

      switch (player.direction) {
        case 'UP': newY -= GRID_SIZE; break;
        case 'DOWN': newY += GRID_SIZE; break;
        case 'LEFT': newX -= GRID_SIZE; break;
        case 'RIGHT': newX += GRID_SIZE; break;
      }

      return {
        ...player,
        x: newX,
        y: newY,
        trail: [...player.trail, { x: newX, y: newY }]
      };
    }, []);

    const predictDirectionAI = (player: Player, enemy: Player, allPlayers: Player[]): "UP" | "DOWN" | "LEFT" | "RIGHT" => {
      const directions: ("UP" | "DOWN" | "LEFT" | "RIGHT")[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

      const getNextPosition = (dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
        let x = player.x;
        let y = player.y;
        switch (dir) {
          case 'UP': y -= GRID_SIZE; break;
          case 'DOWN': y += GRID_SIZE; break;
          case 'LEFT': x -= GRID_SIZE; break;
          case 'RIGHT': x += GRID_SIZE; break;
        }
        return { x, y };
      };

      // Filtra movimientos que causarían colisión
      const safeDirections = directions.filter(dir => {
        const nextPos = getNextPosition(dir);
        const simulatedPlayer = { ...player, ...nextPos };
        return !checkCollision(simulatedPlayer, allPlayers);
      });

      if (safeDirections.length === 0) {
        return player.direction; // No hay salida, continúa en su camino
      }

      // Ordenar los caminos seguros por cercanía al enemigo
      safeDirections.sort((a, b) => {
        const posA = getNextPosition(a);
        const posB = getNextPosition(b);
        const distA = Math.hypot(posA.x - enemy.x, posA.y - enemy.y);
        const distB = Math.hypot(posB.x - enemy.x, posB.y - enemy.y);
        return distA - distB; // Menor distancia es mejor
      });

      return safeDirections[0]; // Retorna dirección óptima
    };


    const updateGame = useCallback(async(timestamp: number) => {
      if (gameStatusRef.current !== 'playing') {
        gameLoopRef.current = requestAnimationFrame(updateGame);
        return;
      }

      if (timestamp - lastUpdateRef.current < speedRef.current) {
        gameLoopRef.current = requestAnimationFrame(updateGame);
        return;
      } 

      const direction = await fetchPlayerPosition (1);
      
      if (direction) {
         setGameState(prev => {
        if (prev.gameStatus !== 'playing') return prev;

        let updatedPlayers = [...prev.players];

        // Control input
        updatedPlayers = updatedPlayers.map(player => {
          if (!player.alive) return player;

          let newDirection = player.direction;

          if (player.id === 1) {
            const remoteDirection = direction.x as "UP" | "DOWN" | "LEFT" | "RIGHT";
            
            if (remoteDirection == "UP" && player.direction !== 'DOWN') newDirection = 'UP';
              else if (remoteDirection == "DOWN" && player.direction !== 'UP') newDirection = 'DOWN';
              else if (remoteDirection == "LEFT" && player.direction !== 'RIGHT') newDirection = 'LEFT';
              else if (remoteDirection == "RIGHT" && player.direction !== 'LEFT') newDirection = 'RIGHT';
          } else {
              const enemy = prev.players.find(p => p.id === 1);
              if (enemy) {
                newDirection = predictDirectionAI(player, enemy, prev.players);
              }
          }

          return { ...player, direction: newDirection };
        });

        // Move and detect collision
        updatedPlayers = updatedPlayers.map(player =>
          player.alive ? updatePlayerPosition(player) : player
        );

        updatedPlayers = updatedPlayers.map(player => ({
          ...player,
          alive: player.alive && !checkCollision(player, prev.players)
        }));

        const alivePlayers = updatedPlayers.filter(p => p.alive);
        let winner = null;

        if (alivePlayers.length <= 1) {
          if (alivePlayers.length === 1) {
            winner = alivePlayers[0];
            winner.score += 1;
          }

          return {
            ...prev,
            players: updatedPlayers,
            gameStatus: 'finished',
            winner
          };
        }

        return {
          ...prev,
          players: updatedPlayers
        };
      });
      }

      lastUpdateRef.current = timestamp;
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }, [updatePlayerPosition, checkCollision]);

    const startGame = useCallback(() => {
      setGameState(prev => {
        const newState: GameState = { ...prev, gameStatus: 'playing' };
        gameStatusRef.current = 'playing';
        return newState;
      });
      lastUpdateRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(updateGame);
    }, [updateGame]);

    const pauseGame = useCallback(() => {
      setGameState(prev => {
        playClick();
        const newStatus = prev.gameStatus === 'paused' ? 'playing' : 'paused';
        gameStatusRef.current = newStatus;
        return { ...prev, gameStatus: newStatus };
      });

      if (gameStatusRef.current === 'paused') {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      } else {
        gameLoopRef.current = requestAnimationFrame(updateGame);
      }
    }, [updateGame]);

    const resetGame = useCallback(() => {
      playClick();
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }

      setGameState(prev => {
        const players = prev.players.map(player => createPlayer(player.id, player.name));
        gameStatusRef.current = 'waiting';
        return {
          ...prev,
          players,
          gameStatus: 'waiting',
          winner: null
        };
      });
    }, [createPlayer]);

    return {
      gameState,
      initializeGame,
      startGame,
      pauseGame,
      resetGame
    };

  }

}