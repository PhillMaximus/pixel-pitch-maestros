
import React from 'react';

interface PlayerSpriteProps {
  position: 'GK' | 'DEF' | 'MID' | 'ATK';
  teamColor?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const PlayerSprite = ({ position, teamColor = '#2196F3', size = 'medium', className = '' }: PlayerSpriteProps) => {
  const sizeClasses = {
    small: 'w-4 h-6',
    medium: 'w-6 h-8',
    large: 'w-8 h-10'
  };

  const positionColors = {
    GK: '#FF9800',
    DEF: '#2196F3',
    MID: '#4CAF50',
    ATK: '#F44336'
  };

  const color = teamColor || positionColors[position];

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg 
        viewBox="0 0 8 12" 
        className="w-full h-full pixelated"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Cabeça */}
        <rect x="2" y="0" width="4" height="3" fill="#FFDBAC" />
        
        {/* Corpo/Camisa */}
        <rect x="1" y="3" width="6" height="5" fill={color} />
        
        {/* Braços */}
        <rect x="0" y="4" width="2" height="3" fill={color} />
        <rect x="6" y="4" width="2" height="3" fill={color} />
        
        {/* Shorts */}
        <rect x="1" y="8" width="6" height="2" fill="#333333" />
        
        {/* Pernas */}
        <rect x="2" y="10" width="2" height="2" fill="#FFDBAC" />
        <rect x="4" y="10" width="2" height="2" fill="#FFDBAC" />
        
        {/* Número na camisa (opcional) */}
        <rect x="3" y="5" width="2" height="1" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );
};

export default PlayerSprite;
