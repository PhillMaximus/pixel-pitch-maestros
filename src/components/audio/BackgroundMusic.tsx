
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PixelButton from '@/components/pixel/PixelButton';

interface BackgroundMusicProps {
  className?: string;
}

const BackgroundMusic = ({ className }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      // Try to autoplay when loaded
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked by browser, user needs to interact first
        setIsPlaying(false);
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Loop the music
      audio.currentTime = 0;
      audio.play();
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.log('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <audio
        ref={audioRef}
        preload="auto"
        loop
        muted={isMuted}
      >
        <source src="https://limewire.com/d/H9HlC#Ui9SoyL7Rp" type="audio/ogg" />
        <source src="/sounds/chiptune-menu.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
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
