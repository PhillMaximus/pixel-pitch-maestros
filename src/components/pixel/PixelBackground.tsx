
import React from 'react';

interface PixelBackgroundProps {
  type?: 'field' | 'stadium' | 'menu';
  children?: React.ReactNode;
}

const PixelBackground: React.FC<PixelBackgroundProps> = ({ type = 'field', children }) => {
  const getSoccerBalls = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className="soccer-ball"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${8 + Math.random() * 4}s`
        }}
      >
        ⚽
      </div>
    ));
  };

  const getBackgroundElements = () => {
    switch (type) {
      case 'stadium':
        return (
          <>
            <div className="stadium-stands" />
            <div className="field-lines" />
            {getSoccerBalls()}
          </>
        );
      case 'menu':
        return (
          <>
            <div className="menu-pattern" />
            {getSoccerBalls()}
          </>
        );
      case 'field':
      default:
        return (
          <>
            <div className="field-grass" />
            <div className="field-center-circle" />
            <div className="field-goals" />
            {getSoccerBalls()}
          </>
        );
    }
  };

  return (
    <div className={`pixel-background pixel-background-${type}`}>
      {getBackgroundElements()}
      {children}
    </div>
  );
};

export default PixelBackground;
