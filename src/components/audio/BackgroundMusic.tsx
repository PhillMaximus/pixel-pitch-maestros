
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import PixelButton from '@/components/pixel/PixelButton';

interface BackgroundMusicProps {
  className?: string;
  volume?: number; // 0.0 to 1.0
  autoPlay?: boolean;
}

const BackgroundMusic = ({ className, volume = 0.3, autoPlay = true }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      console.log('Audio loaded, attempting autoplay');
      
      if (autoPlay) {
        // Try to autoplay when loaded
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Audio autoplay started successfully');
            setIsPlaying(true);
          }).catch((error) => {
            console.log('Autoplay blocked by browser:', error);
            setIsPlaying(false);
          });
        }
      }
    };

    const handlePlay = () => {
      console.log('Audio started playing');
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      console.log('Audio paused');
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      console.log('Audio ended, looping');
      // Loop the music
      audio.currentTime = 0;
      audio.play();
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsLoaded(false);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [autoPlay, volume]);

  // Update volume when prop changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && !isMuted) {
      audio.volume = volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
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
        <source src="https://raw.githubusercontent.com/PhillMaximus/phillfoot-assets/main/phillfoot_theme.ogg" type="audio/ogg" />
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
