// hooks/useBackgroundMusic.ts
// src/hooks/useBackgroundMusic.ts
import { useEffect, useRef } from 'react';

export function useBackgroundMusic(url: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(url);
      audio.loop = true; // 🔁 Repetir indefinidamente
      audio.volume = 0.4; // Puedes ajustar el volumen si lo deseas
      audioRef.current = audio;
    }

    const playAudio = () => {
      audioRef.current?.play().catch((e) => {
        console.warn('No se pudo reproducir el audio:', e);
      });
    };

    // Requiere una interacción del usuario para reproducir
    document.addEventListener('click', playAudio, { once: true });

    return () => {
      document.removeEventListener('click', playAudio);
      audioRef.current?.pause();
    };
  }, [url]);
}
