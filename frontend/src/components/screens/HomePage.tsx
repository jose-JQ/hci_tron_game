import React, { useEffect, useState } from 'react';
import { Play, UserPlus, Sparkles } from 'lucide-react';
import { Screen } from '../../types';
import { useClickSound } from '../../hooks/useClickSound';

interface HomePageProps {
  onNavigate: (screen: Screen) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const playClick = useClickSound();

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100
        }
      ]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-70"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDuration: '2s'
          }}
        />
      ))}

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" 
             style={{
               backgroundImage: `
                 linear-gradient(cyan 1px, transparent 1px),
                 linear-gradient(90deg, cyan 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }} 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo and title */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50 animate-pulse">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full animate-bounce" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-pulse">
            TRON KIDS
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-pink-400 mb-6">
            ¡Carrera de Luz!
          </h2>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed">
            ¡Controla tu línea de luz y evita chocar! Un juego futurista lleno de diversión para dos jugadores.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
          <button
            onClick={() => {
              playClick();
              onNavigate('gameSelection');
            }}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-pink-400"
          >
            <Play className="w-8 h-8" />
            ¡JUGAR COMO INVITADO!
          </button>

          <button
            onClick={() => {
              playClick();
              onNavigate('login');
            }}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-cyan-400"
          >
            <UserPlus className="w-8 h-8" />
            REGISTRARSE
          </button>
        </div>

        {/* Features highlight */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center p-6 bg-purple-800/30 rounded-2xl border border-cyan-400/30 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Fácil de Jugar</h3>
            <p className="text-cyan-100">Controles simples: WASD vs Flechas</p>
          </div>

          <div className="text-center p-6 bg-purple-800/30 rounded-2xl border border-pink-400/30 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-pink-400 mb-2">Efectos Increíbles</h3>
            <p className="text-cyan-100">Luces neón y animaciones geniales</p>
          </div>

          <div className="text-center p-6 bg-purple-800/30 rounded-2xl border border-yellow-400/30 backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Para Todos</h3>
            <p className="text-cyan-100">Perfecto para niños de 7 a 12 años</p>
          </div>
        </div>
      </div>
    </div>
  );
}