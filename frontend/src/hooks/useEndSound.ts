// src/hooks/useClickSound.ts
import { useCallback, useRef } from 'react';

export function useEndSound (url: string = '/audio/end.mp3') {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(url);
  }

  const playClick = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reinicia el sonido
      audioRef.current.play().catch((e) => {
        // Puede fallar si el usuario aún no ha interactuado con la página
        console.warn('No se pudo reproducir el sonido:', e);
      });
    }
  }, []);

  return playClick;
}
