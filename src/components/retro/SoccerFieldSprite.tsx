
import React from 'react';

interface SoccerFieldSpriteProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const SoccerFieldSprite = ({ className = '', size = 'medium' }: SoccerFieldSpriteProps) => {
  const sizeClasses = {
    small: 'w-16 h-12',
    medium: 'w-32 h-24',
    large: 'w-48 h-36'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg 
        viewBox="0 0 100 60" 
        className="w-full h-full pixelated"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Campo verde */}
        <rect x="0" y="0" width="100" height="60" fill="#2E7D32" />
        
        {/* Linhas do campo */}
        <g stroke="#FFFFFF" strokeWidth="0.5" fill="none">
          {/* Bordas */}
          <rect x="1" y="1" width="98" height="58" />
          
          {/* Linha central */}
          <line x1="50" y1="1" x2="50" y2="59" />
          
          {/* Círculo central */}
          <circle cx="50" cy="30" r="8" />
          
          {/* Área grande esquerda */}
          <rect x="1" y="12" width="16" height="36" />
          
          {/* Área pequena esquerda */}
          <rect x="1" y="21" width="6" height="18" />
          
          {/* Área grande direita */}
          <rect x="83" y="12" width="16" height="36" />
          
          {/* Área pequena direita */}
          <rect x="93" y="21" width="6" height="18" />
        </g>
        
        {/* Gols */}
        <g fill="#FFFFFF">
          <rect x="0" y="27" width="1" height="6" />
          <rect x="99" y="27" width="1" height="6" />
        </g>
        
        {/* Pontos de penalti */}
        <g fill="#FFFFFF">
          <circle cx="11" cy="30" r="0.5" />
          <circle cx="89" cy="30" r="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default SoccerFieldSprite;
