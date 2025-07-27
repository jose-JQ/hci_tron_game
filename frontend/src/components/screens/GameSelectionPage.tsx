import React from 'react';
import { Users, Zap, ArrowRight } from 'lucide-react';
import { Screen, GameMode } from '../../types';
import { useClickSound } from '../../hooks/useClickSound';


interface GameSelectionPageProps {
  onNavigate: (screen: Screen) => void;
  onStartGame: (mode: GameMode) => void;
}

export function GameSelectionPage({ onNavigate, onStartGame }: GameSelectionPageProps) {
  const playClick = useClickSound();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-4">
            ¡Elige tu Modo de Juego!
          </h1>
          <p className="text-xl text-cyan-100">
            Selecciona cómo quieres jugar la carrera de luz
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Local Multiplayer */}
          <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 group">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-400/50 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">Multijugador Local</h2>
              <p className="text-cyan-100 text-lg">¡Juega con un amigo en la misma pantalla!</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span>Jugador 1: Teclas WASD</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <span>Jugador 2: Flechas del teclado</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>¡El último en pie gana!</span>
              </div>
            </div>

            <button
              onClick={() => {playClick(); 
                onStartGame('local');
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-2xl shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ArrowRight className="w-6 h-6" />
              ¡JUGAR JUNTOS!
            </button>
          </div>

          {/* Local Multiplayer cellphone*/}
          <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 group">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-400/50 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">Jugador Local Cellphone</h2>
              <p className="text-yellow-100 text-lg">¡Juega desde la comodidad de tu celular!</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span>Jugador 1: Celular </span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                <span>Jugador 2: IA</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>¡El último en pie gana!</span>
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                onStartGame('celular');
              }}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-2xl shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ArrowRight className="w-6 h-6" />
              ¡JUGAR!
            </button>
          </div>

          {/* Practice Mode */}
          <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-400/30 hover:border-pink-400 transition-all duration-300 group">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/50 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-pink-400 mb-2">Modo Práctica</h2>
              <p className="text-cyan-100 text-lg">¡Practica contra una computadora inteligente!</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span>Tú: Teclas WASD o Flechas</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span>IA: Jugador automático</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span>¡Perfecto para aprender!</span>
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                onStartGame('practice');}}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-2xl shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <ArrowRight className="w-6 h-6" />
              ¡PRACTICAR!
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => {
              playClick();
              onNavigate('rules');}}
            className="text-cyan-400 hover:text-cyan-300 underline text-lg font-medium"
          >
            ¿Necesitas ayuda? Ver las reglas del juego
          </button>
        </div>
      </div>
    </div>
  );
}