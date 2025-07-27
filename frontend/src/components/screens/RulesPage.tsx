import React from 'react';
import { ArrowLeft, Gamepad2, Target, Trophy, Zap } from 'lucide-react';
import { Screen } from '../../types';

interface RulesPageProps {
  onNavigate: (screen: Screen) => void;
}

export function RulesPage({ onNavigate }: RulesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inicio
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-4">
              ¿Cómo Jugar Tron Kids?
            </h1>
            <p className="text-xl text-cyan-100">
              ¡Aprende las reglas y conviértete en un maestro de la carrera de luz!
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Objetivo del Juego */}
          <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-cyan-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-cyan-400">🎯 Objetivo del Juego</h2>
            </div>
            <div className="text-lg text-cyan-100 space-y-3">
              <p>
                <strong className="text-white">¡Sobrevive el mayor tiempo posible!</strong> Controla tu línea de luz neón y evita chocar contra:
              </p>
              <ul className="list-disc list-inside space-y-2 text-cyan-200 ml-4">
                <li>Las paredes del área de juego</li>
                <li>Tu propia línea de luz (tu rastro)</li>
                <li>La línea de luz de tu oponente</li>
              </ul>
              <p className="text-pink-400 font-medium">
                ¡El último jugador que quede sin chocar gana la ronda!
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-pink-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-pink-400">🎮 Controles</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-pink-400 mb-4">Jugador 1 (Línea Rosa)</h3>
                <div className="bg-purple-900/50 rounded-2xl p-6 border border-pink-400/30">
                  <div className="space-y-3 text-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Arriba:</span>
                      <kbd className="bg-pink-500 text-white px-3 py-1 rounded font-bold">W</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Abajo:</span>
                      <kbd className="bg-pink-500 text-white px-3 py-1 rounded font-bold">S</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Izquierda:</span>
                      <kbd className="bg-pink-500 text-white px-3 py-1 rounded font-bold">A</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Derecha:</span>
                      <kbd className="bg-pink-500 text-white px-3 py-1 rounded font-bold">D</kbd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">Jugador 2 (Línea Cian)</h3>
                <div className="bg-purple-900/50 rounded-2xl p-6 border border-cyan-400/30">
                  <div className="space-y-3 text-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Arriba:</span>
                      <kbd className="bg-cyan-500 text-white px-3 py-1 rounded font-bold">↑</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Abajo:</span>
                      <kbd className="bg-cyan-500 text-white px-3 py-1 rounded font-bold">↓</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Izquierda:</span>
                      <kbd className="bg-cyan-500 text-white px-3 py-1 rounded font-bold">←</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Derecha:</span>
                      <kbd className="bg-cyan-500 text-white px-3 py-1 rounded font-bold">→</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips y Estrategias */}
          <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-yellow-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-yellow-400">⚡ Tips y Estrategias</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-yellow-400">🧠 Estrategias Básicas:</h3>
                <ul className="space-y-3 text-cyan-100">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Mantente en el centro al principio para tener más opciones</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Observa los movimientos de tu oponente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>Intenta "encerrar" a tu oponente en un espacio pequeño</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 font-bold">✓</span>
                    <span>¡No tengas miedo de hacer movimientos arriesgados!</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-red-400">⚠️ Evita Estos Errores:</h3>
                <ul className="space-y-3 text-cyan-100">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>No te acerques demasiado a las paredes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>Evita hacer círculos cerrados muy pequeños</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>No sigas patrones predecibles por mucho tiempo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 font-bold">✗</span>
                    <span>¡No presiones teclas opuestas al mismo tiempo!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sistema de Puntuación */}
          <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-green-400/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-green-400">🏆 Sistema de Puntuación</h2>
            </div>
            <div className="text-lg text-cyan-100 space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-purple-900/50 rounded-xl border border-green-400/30">
                  <div className="text-3xl font-bold text-green-400 mb-2">+1</div>
                  <p>Punto por ganar cada ronda</p>
                </div>
                <div className="text-center p-4 bg-purple-900/50 rounded-xl border border-yellow-400/30">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">0</div>
                  <p>Puntos en caso de empate</p>
                </div>
                <div className="text-center p-4 bg-purple-900/50 rounded-xl border border-cyan-400/30">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">∞</div>
                  <p>¡Juega tantas rondas como quieras!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('gameSelection')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-2xl shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <Gamepad2 className="w-6 h-6" />
            ¡Entendido, Vamos a Jugar!
          </button>
        </div>
      </div>
    </div>
  );
}