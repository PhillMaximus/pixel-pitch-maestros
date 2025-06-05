
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PixelButton from '@/components/pixel/PixelButton';

interface BackgroundMusicProps {
  className?: string;
  volume?: number;
  autoPlay?: boolean;
}

// Instância global para manter o estado da música entre navegações
class GlobalMusicManager {
  private static instance: GlobalMusicManager;
  private audio: HTMLAudioElement | null = null;
  private isInitialized = false;
  private subscribers: Set<(isPlaying: boolean) => void> = new Set();

  static getInstance(): GlobalMusicManager {
    if (!GlobalMusicManager.instance) {
      GlobalMusicManager.instance = new GlobalMusicManager();
    }
    return GlobalMusicManager.instance;
  }

  subscribe(callback: (isPlaying: boolean) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(isPlaying: boolean) {
    this.subscribers.forEach(callback => callback(isPlaying));
  }

  initialize(volume: number = 0.3) {
    if (this.isInitialized) return this.audio;

    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.volume = volume;
    this.audio.preload = 'auto';

    // Múltiplas fontes para compatibilidade
    const sources = [
      { src: "https://raw.githubusercontent.com/PhillMaximus/phillfoot-assets/main/phillfoot_theme.ogg", type: "audio/ogg" },
      { src: "/sounds/chiptune-menu.mp3", type: "audio/mpeg" }
    ];

    // Tentar carregar a primeira fonte disponível
    let sourceIndex = 0;
    const tryNextSource = () => {
      if (sourceIndex < sources.length) {
        const source = sources[sourceIndex];
        this.audio!.src = source.src;
        this.audio!.load();
        sourceIndex++;
      }
    };

    this.audio.addEventListener('error', tryNextSource);
    this.audio.addEventListener('play', () => this.notifySubscribers(true));
    this.audio.addEventListener('pause', () => this.notifySubscribers(false));
    this.audio.addEventListener('ended', () => this.notifySubscribers(false));

    tryNextSource();
    this.isInitialized = true;
    return this.audio;
  }

  async play() {
    if (!this.audio) return false;
    
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      console.log('Não foi possível reproduzir a música:', error);
      return false;
    }
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
  }

  setVolume(volume: number) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean) {
    if (!this.audio) return;
    this.audio.muted = muted;
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  isMuted(): boolean {
    return this.audio ? this.audio.muted : false;
  }
}

const BackgroundMusic = ({ className, volume = 0.3, autoPlay = true }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const musicManager = useRef(GlobalMusicManager.getInstance());

  useEffect(() => {
    const manager = musicManager.current;
    const audio = manager.initialize(volume);

    const unsubscribe = manager.subscribe(setIsPlaying);

    if (audio) {
      const handleCanPlayThrough = () => {
        setIsLoaded(true);
        if (autoPlay && !manager.isPlaying()) {
          manager.play();
        }
      };

      const handleLoadedData = () => setIsLoaded(true);
      
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('loadeddata', handleLoadedData);
      
      // Verificar estado inicial
      setIsPlaying(manager.isPlaying());
      setIsMuted(manager.isMuted());
      
      if (audio.readyState >= 3) { // HAVE_FUTURE_DATA
        setIsLoaded(true);
        if (autoPlay && !manager.isPlaying()) {
          manager.play();
        }
      }

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('loadeddata', handleLoadedData);
        unsubscribe();
      };
    }

    return unsubscribe;
  }, [autoPlay, volume]);

  useEffect(() => {
    musicManager.current.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const manager = musicManager.current;
    if (!isLoaded) return;

    if (isPlaying) {
      manager.pause();
    } else {
      await manager.play();
    }
  };

  const toggleMute = () => {
    const manager = musicManager.current;
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    manager.setMuted(newMutedState);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1 bg-retro-green-dark/80 rounded-lg px-2 py-1 border-2 border-retro-yellow-highlight">
        <PixelButton
          onClick={togglePlay}
          variant="secondary"
          size="sm"
          className="!px-2 !py-1 !text-xs"
          disabled={!isLoaded}
        >
          {!isLoaded ? '⏳' : isPlaying ? '⏸️' : '▶️'}
        </PixelButton>
        
        <PixelButton
          onClick={toggleMute}
          variant="secondary"
          size="sm"
          className="!px-2 !py-1"
          disabled={!isLoaded}
        >
          {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        </PixelButton>
        
        <span className="text-xs font-pixel text-retro-white-lines ml-1">
          🎵
        </span>
      </div>
    </div>
  );
};

export default BackgroundMusic;
