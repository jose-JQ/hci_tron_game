import React, { useState } from 'react';
import { User, Mail, Calendar, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Screen, User as UserType } from '../../types';
import { useClickSound } from '../../hooks/useClickSound';

interface LoginPageProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (user: UserType) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const playClick = useClickSound();

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    const age = parseInt(formData.age);
    if (!formData.age) {
      newErrors.age = 'La edad es requerida';
    } else if (isNaN(age) || age < 5 || age > 18) {
      newErrors.age = 'La edad debe estar entre 5 y 18 años';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: UserType = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: parseInt(formData.age),
      isGuest: false
    };

    onLogin(user);
    setIsSubmitting(false);
    onNavigate('gameSelection');
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-purple-800/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-cyan-400/30">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-400/50">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Únete a la Diversión!</h2>
            <p className="text-cyan-200">Crea tu cuenta para jugar Tron Kids</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-cyan-100 font-medium mb-2">
                <User className="w-5 h-5 inline mr-2" />
                Tu Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                className={`w-full px-4 py-3 bg-purple-900/50 border-2 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-cyan-400 transition-colors ${
                  errors.name ? 'border-red-400' : 'border-purple-600'
                }`}
                placeholder="Ej: Alex, María, Juan..."
              />
              {errors.name && (
                <p className="mt-2 text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-cyan-100 font-medium mb-2">
                <Mail className="w-5 h-5 inline mr-2" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className={`w-full px-4 py-3 bg-purple-900/50 border-2 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-cyan-400 transition-colors ${
                  errors.email ? 'border-red-400' : 'border-purple-600'
                }`}
                placeholder="tuemail@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-2 text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-cyan-100 font-medium mb-2">
                <Calendar className="w-5 h-5 inline mr-2" />
                Tu Edad
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={handleChange('age')}
                min="5"
                max="18"
                className={`w-full px-4 py-3 bg-purple-900/50 border-2 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-cyan-400 transition-colors ${
                  errors.age ? 'border-red-400' : 'border-purple-600'
                }`}
                placeholder="¿Cuántos años tienes?"
              />
              {errors.age && (
                <p className="mt-2 text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="block text-cyan-100 font-medium mb-2">
                <Lock className="w-5 h-5 inline mr-2" />
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                className={`w-full px-4 py-3 bg-purple-900/50 border-2 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-cyan-400 transition-colors ${
                  errors.password ? 'border-red-400' : 'border-purple-600'
                }`}
                placeholder="Mínimo 4 caracteres"
              />
              {errors.password && (
                <p className="mt-2 text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-2xl shadow-pink-500/50 transform hover:scale-105 disabled:scale-100 transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
              onClick={() => {
                playClick();
              }}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-6 h-6" />
                  ¡CREAR CUENTA Y JUGAR!
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('gameSelection')}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              ¿Prefieres jugar como invitado?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}