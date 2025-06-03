
import { useEffect, useRef } from 'react';

interface PixelBackgroundProps {
  type: 'field' | 'stadium' | 'menu';
  className?: string;
}

const PixelBackground = ({ type, className = '' }: PixelBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground();
    };

    const drawBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (type === 'field') {
        drawField();
      } else if (type === 'stadium') {
        drawStadium();
      } else if (type === 'menu') {
        drawMenu();
      }
    };

    const drawField = () => {
      // Campo de futebol em pixel art
      const pixelSize = 8;
      
      // Grama base
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Padrão de grama mais escura
      ctx.fillStyle = '#388E3C';
      for (let x = 0; x < canvas.width; x += pixelSize * 2) {
        for (let y = 0; y < canvas.height; y += pixelSize * 4) {
          if ((x / pixelSize + y / pixelSize) % 2 === 0) {
            ctx.fillRect(x, y, pixelSize, pixelSize * 2);
          }
        }
      }
      
      // Linhas do campo
      ctx.fillStyle = '#FFFFFF';
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Linha central
      for (let x = 0; x < canvas.width; x += pixelSize) {
        ctx.fillRect(x, centerY - pixelSize/2, pixelSize/2, pixelSize);
      }
      
      // Círculo central (aproximado)
      const radius = 80;
      for (let angle = 0; angle < 360; angle += 10) {
        const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
        const y = centerY + Math.sin(angle * Math.PI / 180) * radius;
        ctx.fillRect(x - pixelSize/2, y - pixelSize/2, pixelSize, pixelSize);
      }
    };

    const drawStadium = () => {
      drawField();
      
      // Arquibancadas
      const pixelSize = 12;
      ctx.fillStyle = '#424242';
      
      // Arquibancada superior
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = 0; y < 60; y += pixelSize) {
          if ((x / pixelSize + y / pixelSize) % 3 === 0) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
      
      // Arquibancada inferior
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = canvas.height - 60; y < canvas.height; y += pixelSize) {
          if ((x / pixelSize + y / pixelSize) % 3 === 0) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
      
      // Pessoas nas arquibancadas (pontos coloridos)
      const colors = ['#FF5722', '#2196F3', '#FFEB3B', '#E91E63'];
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() < 0.5 ? Math.random() * 40 : canvas.height - 40 + Math.random() * 40;
        ctx.fillRect(x, y, 4, 4);
      }
    };

    const drawMenu = () => {
      // Fundo degradê 8-bit
      const pixelSize = 16;
      
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = 0; y < canvas.height; y += pixelSize) {
          const intensity = Math.sin(x * 0.01) * Math.cos(y * 0.01);
          const green = Math.floor(76 + intensity * 20);
          ctx.fillStyle = `rgb(46, ${green}, 50)`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
      
      // Bolas de futebol pixeladas flutuantes
      ctx.fillStyle = '#FFFFFF';
      const ballSize = 24;
      const time = Date.now() * 0.001;
      
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 6) * (i + 1) + Math.sin(time + i) * 50;
        const y = canvas.height / 3 + Math.cos(time * 0.7 + i) * 100;
        
        // Bola branca
        ctx.fillRect(x - ballSize/2, y - ballSize/2, ballSize, ballSize);
        
        // Padrão preto da bola
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - ballSize/4, y - ballSize/2, ballSize/8, ballSize);
        ctx.fillRect(x - ballSize/2, y - ballSize/4, ballSize, ballSize/8);
        ctx.fillStyle = '#FFFFFF';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animação para o menu
    let animationId: number;
    if (type === 'menu') {
      const animate = () => {
        drawBackground();
        animationId = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default PixelBackground;
