import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Home } from 'lucide-react';
import { useTronGame } from '../../hooks/useTronGame';
import { Screen, GameMode } from '../../types';
import { useClickSound } from '../../hooks/useClickSound';
import {useInitSound} from '../../hooks/useInitSound'
import {useEndSound} from  '../../hooks/useEndSound'

interface TronGamePageProps {
  onNavigate: (screen: Screen) => void;
  gameMode: GameMode;
}

export function TronGamePage({ onNavigate, gameMode }: TronGamePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState, initializeGame, startGame, pauseGame, resetGame } = useTronGame(canvasRef, gameMode);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const playClick = useClickSound();
  const initSound = useInitSound();
  const endSound = useEndSound();

  useEffect(() => {
    const player1Name = gameMode === 'practice' ? 'Tú' : 'Jugador 1';
    const player2Name = gameMode === 'practice' ? 'IA' : 'Jugador 2';
    initializeGame(player1Name, player2Name);
  }, [gameMode, initializeGame]);

  useEffect(() => {
  if (gameState.gameStatus === 'finished') {
    endSound(); // se ejecuta una sola vez al terminar
  }
}, [gameState.gameStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(15, 15, 30, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw players
      gameState.players.forEach(player => {
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (player.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(player.trail[0].x, player.trail[0].y);
          for (let i = 1; i < player.trail.length; i++) {
            ctx.lineTo(player.trail[i].x, player.trail[i].y);
          }
          ctx.stroke();
        }

        // Draw player head with glow effect
        if (player.alive) {
          ctx.shadowColor = player.color;
          ctx.shadowBlur = 15;
          ctx.fillStyle = player.color;
          ctx.fillRect(player.x - 4, player.y - 4, 8, 8);
          ctx.shadowBlur = 0;
        }
      });
    };

    render();
  }, [gameState]);

  const handleStartGame = () => {
    initSound();
    setShowCountdown(true);
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          startGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const player1 = gameState.players[0];
  const player2 = gameState.players[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {playClick();onNavigate('gameSelection')}}
              className="bg-purple-800/50 hover:bg-purple-700 text-purple-200 p-3 rounded-xl border border-purple-600 transition-colors"
            >
              <Home className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">
              {gameMode === 'practice' ? 'Modo Práctica' : 'Multijugador Local'}
            </h1>
          </div>

          <div className="flex gap-3">
            {gameState.gameStatus === 'waiting' && (
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-green-500/30"
              >
                <Play className="w-5 h-5" />
                Iniciar
              </button>
            )}

            {(gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') && (
              <button
                onClick={pauseGame}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-yellow-500/30"
              >
                <Pause className="w-5 h-5" />
                {gameState.gameStatus === 'playing' ? 'Pausar' : 'Continuar'}
              </button>
            )}

            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-800/40 backdrop-blur-sm rounded-xl p-4 border border-pink-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-pink-400 font-bold text-lg">{player1?.name}</h3>
                <p className="text-white text-2xl font-bold">Puntos: {player1?.score || 0}</p>
              </div>
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">1</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-pink-200">
              Controles: {gameMode === 'practice' ? 'WASD o Flechas' : 'WASD'}
            </div>
          </div>

          <div className="bg-purple-800/40 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-cyan-400 font-bold text-lg">{player2?.name}</h3>
                <p className="text-white text-2xl font-bold">Puntos: {player2?.score || 0}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">2</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-cyan-200">
              Controles: {gameMode === 'celular' ? 'Automático' : 'Flechas'}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative bg-gray-900 rounded-2xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-400/20 overflow-hidden"
            onClick={() => {
              if (gameState.gameStatus === 'waiting') {
                handleStartGame();
              } else if (gameState.gameStatus === 'paused') {
                pauseGame();
              }
            }} >
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full max-w-full pointer-events-none "
          />

          {/* Game Overlays */}
          {showCountdown && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl font-bold text-white mb-4 animate-pulse">
                  {countdown}
                </div>
                <p className="text-2xl text-cyan-400">¡Prepárate!</p>
              </div>
            </div>
          )}

          {gameState.gameStatus === 'paused' && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <Pause className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-3xl font-bold text-white">PAUSADO</p>
                <p className="text-cyan-400 mt-2">Presiona el botón para continuar</p>
              </div>
            </div>
          )}

          {gameState.gameStatus === 'finished' && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center bg-purple-800/80 p-8 rounded-2xl border border-cyan-400/50">
                <h2 className="text-4xl font-bold text-white mb-4">¡Juego Terminado!</h2>
                {gameState.winner ? (
                  <>
                    <p className="text-2xl mb-2" style={{ color: gameState.winner.color }}>
                      🎉 ¡{gameState.winner.name} Gana! 🎉
                    </p>
                    <p className="text-cyan-400 text-lg">
                      Puntuación Final: {gameState.winner.score}
                    </p>
                  </>
                ) : (
                  <p className="text-yellow-400 text-2xl">¡Empate! Ambos chocaron</p>
                )}
                <button
                  onClick={resetGame}
                  className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 mx-auto shadow-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  Jugar de Nuevo
                </button>
              </div>
            </div>
          )}

          {gameState.gameStatus === 'waiting' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
                <p className="text-2xl font-bold text-white mb-2">¡Listo para Jugar!</p>
                <p className="text-cyan-400">Presiona "Iniciar" cuando estés preparado</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="bg-purple-800/20 rounded-xl p-4 border border-pink-400/30">
            <h3 className="text-pink-400 font-bold mb-2">🎮 Objetivo</h3>
            <p className="text-white">¡Evita chocar contra las paredes y las líneas de luz!</p>
          </div>
          <div className="bg-purple-800/20 rounded-xl p-4 border border-cyan-400/30">
            <h3 className="text-cyan-400 font-bold mb-2">⚡ Consejo</h3>
            <p className="text-white">¡Usa estrategia para hacer que tu oponente choque primero!</p>
          </div>
        </div>
      </div>
    </div>
  );
}