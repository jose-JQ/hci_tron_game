import React from 'react';
import { Home, User, Trophy, HelpCircle } from 'lucide-react';
import { Screen } from '../../types';
import { useClickSound } from '../../hooks/useClickSound';


interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  userName?: string;
}

export function Header({ currentScreen, onNavigate, userName }: HeaderProps) {
  const playClick = useClickSound();
  return (
    <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 p-4 shadow-2xl border-b-2 border-cyan-400">
      <nav className="max-w-8xl mx-auto flex items-center justify-between">
        <div 
          onClick={() => {
            playClick();
            onNavigate('home')}}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-400/50">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            Tron Kids
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {userName && (
            <div className="flex items-center gap-2 bg-purple-800/50 px-4 py-2 rounded-full border border-cyan-400/30">
              <User className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-100 font-medium">{userName}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                playClick();
                onNavigate('home')}}
              className={`p-3 rounded-full transition-all duration-300 ${
                currentScreen === 'home'
                  ? 'bg-cyan-400 text-purple-900 shadow-lg shadow-cyan-400/50'
                  : 'bg-purple-800/50 text-cyan-400 hover:bg-cyan-400 hover:text-purple-900 border border-cyan-400/30'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                playClick();
                onNavigate('rules');
              }}
              className={`p-3 rounded-full transition-all duration-300 ${
                currentScreen === 'rules'
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/50'
                  : 'bg-purple-800/50 text-pink-400 hover:bg-pink-500 hover:text-white border border-pink-400/30'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}