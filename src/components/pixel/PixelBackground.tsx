
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
      const pixelSize = 12;
      
      // Grama base - verde mais vibrante
      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Padrão de grama listrada mais realista
      ctx.fillStyle = '#388E3C';
      for (let x = 0; x < canvas.width; x += pixelSize * 4) {
        ctx.fillRect(x, 0, pixelSize * 2, canvas.height);
      }
      
      // Padrão de grama pontilhada para textura
      ctx.fillStyle = '#4CAF50';
      for (let x = 0; x < canvas.width; x += pixelSize * 2) {
        for (let y = 0; y < canvas.height; y += pixelSize * 3) {
          if (Math.random() > 0.7) {
            ctx.fillRect(x, y, pixelSize/2, pixelSize/2);
          }
        }
      }
      
      // Linhas do campo mais visíveis
      ctx.fillStyle = '#FFFFFF';
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Linha central mais espessa
      for (let y = 0; y < canvas.height; y += pixelSize/2) {
        ctx.fillRect(centerX - pixelSize/2, y, pixelSize, pixelSize/2);
      }
      
      // Círculo central pixelado
      const radius = 100;
      for (let angle = 0; angle < 360; angle += 8) {
        const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
        const y = centerY + Math.sin(angle * Math.PI / 180) * radius;
        ctx.fillRect(x - pixelSize/2, y - pixelSize/2, pixelSize, pixelSize);
      }
      
      // Áreas pequenas nas laterais
      const areaWidth = 80;
      const areaHeight = 120;
      
      // Área esquerda
      for (let x = 0; x < areaWidth; x += pixelSize) {
        ctx.fillRect(x, centerY - areaHeight/2, pixelSize/2, pixelSize/2);
        ctx.fillRect(x, centerY + areaHeight/2, pixelSize/2, pixelSize/2);
      }
      
      // Área direita
      for (let x = canvas.width - areaWidth; x < canvas.width; x += pixelSize) {
        ctx.fillRect(x, centerY - areaHeight/2, pixelSize/2, pixelSize/2);
        ctx.fillRect(x, centerY + areaHeight/2, pixelSize/2, pixelSize/2);
      }
    };

    const drawStadium = () => {
      drawField();
      
      // Arquibancadas com mais detalhes
      const pixelSize = 16;
      
      // Arquibancada superior com gradiente
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = 0; y < 80; y += pixelSize) {
          const intensity = y / 80;
          const gray = Math.floor(66 + intensity * 20);
          ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
          if ((x / pixelSize + y / pixelSize) % 3 === 0) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
      
      // Arquibancada inferior
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = canvas.height - 80; y < canvas.height; y += pixelSize) {
          const intensity = (canvas.height - y) / 80;
          const gray = Math.floor(66 + intensity * 20);
          ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
          if ((x / pixelSize + y / pixelSize) % 3 === 0) {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
      
      // Pessoas nas arquibancadas mais realistas
      const colors = ['#FF5722', '#2196F3', '#FFEB3B', '#E91E63', '#9C27B0', '#FF9800'];
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() < 0.5 ? 
          20 + Math.random() * 40 : 
          canvas.height - 60 + Math.random() * 40;
        
        // Pessoa pixelada (retângulo pequeno)
        ctx.fillRect(x, y, 6, 8);
        
        // Cabeça
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x + 1, y - 3, 4, 3);
      }
      
      // Refletores do estádio
      ctx.fillStyle = '#FFEB3B';
      for (let i = 0; i < 8; i++) {
        const x = (canvas.width / 8) * i + canvas.width / 16;
        ctx.fillRect(x - 4, 10, 8, 12);
        
        // Luz dos refletores
        ctx.fillStyle = 'rgba(255, 235, 59, 0.1)';
        for (let j = 0; j < 5; j++) {
          const lightY = 30 + j * 20;
          const lightWidth = 20 + j * 10;
          ctx.fillRect(x - lightWidth/2, lightY, lightWidth, 8);
        }
        ctx.fillStyle = '#FFEB3B';
      }
    };

    const drawMenu = () => {
      // Fundo base
      const pixelSize = 20;
      
      // Gradiente verde base
      for (let x = 0; x < canvas.width; x += pixelSize) {
        for (let y = 0; y < canvas.height; y += pixelSize) {
          const distance = Math.sqrt(
            Math.pow(x - canvas.width/2, 2) + 
            Math.pow(y - canvas.height/2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(canvas.width/2, 2) + 
            Math.pow(canvas.height/2, 2)
          );
          const intensity = 1 - (distance / maxDistance);
          const green = Math.floor(46 + intensity * 30);
          ctx.fillStyle = `rgb(46, ${green}, 50)`;
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
      
      // Padrão hexagonal para simular gramado
      const hexSize = 24;
      for (let x = 0; x < canvas.width; x += hexSize * 1.5) {
        for (let y = 0; y < canvas.height; y += hexSize * 1.3) {
          const offsetX = (y / (hexSize * 1.3)) % 2 === 0 ? 0 : hexSize * 0.75;
          if (Math.random() > 0.8) {
            ctx.fillStyle = 'rgba(76, 175, 80, 0.3)';
            drawHexagon(ctx, x + offsetX, y, hexSize/3);
          }
        }
      }
      
      // Bolas de futebol animadas
      const time = Date.now() * 0.001;
      const ballSize = 32;
      
      for (let i = 0; i < 6; i++) {
        const baseX = (canvas.width / 7) * (i + 1);
        const baseY = canvas.height / 2;
        const x = baseX + Math.sin(time + i * 1.2) * 80;
        const y = baseY + Math.cos(time * 0.8 + i * 1.5) * 120;
        
        // Sombra da bola
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(x - ballSize/2 + 4, y + ballSize/2 + 4, ballSize, ballSize/4);
        
        // Bola
        ctx.fillStyle = '#FFFFFF';
        drawPixelBall(ctx, x, y, ballSize);
      }
      
      // Elementos de UI temáticos
      drawUIElements(ctx, canvas.width, canvas.height);
    };

    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const hexX = x + size * Math.cos(angle);
        const hexY = y + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(hexX, hexY);
        } else {
          ctx.lineTo(hexX, hexY);
        }
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawPixelBall = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const pixelSize = size / 8;
      
      // Bola branca base
      for (let i = -3; i <= 3; i++) {
        for (let j = -3; j <= 3; j++) {
          if (i * i + j * j <= 9) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(
              x + i * pixelSize - pixelSize/2, 
              y + j * pixelSize - pixelSize/2, 
              pixelSize, 
              pixelSize
            );
          }
        }
      }
      
      // Padrão preto da bola
      ctx.fillStyle = '#000000';
      // Linha vertical
      ctx.fillRect(x - pixelSize/2, y - 2 * pixelSize, pixelSize, 4 * pixelSize);
      // Linhas curvas (simuladas com pixels)
      for (let i = -2; i <= 2; i++) {
        ctx.fillRect(x + i * pixelSize - pixelSize/2, y - pixelSize/2, pixelSize, pixelSize);
      }
    };

    const drawUIElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Estrelas cintilantes
      ctx.fillStyle = '#FFC107';
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const time = Date.now() * 0.003;
        const alpha = 0.5 + 0.5 * Math.sin(time + i);
        ctx.globalAlpha = alpha;
        drawPixelStar(ctx, x, y, 8);
      }
      ctx.globalAlpha = 1;
      
      // Partículas de energia
      const time = Date.now() * 0.002;
      for (let i = 0; i < 15; i++) {
        const x = width * 0.1 + (width * 0.8) * ((time + i * 0.1) % 1);
        const y = height * 0.2 + Math.sin(time * 2 + i) * height * 0.6;
        
        ctx.fillStyle = i % 2 === 0 ? '#4CAF50' : '#FFC107';
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    };

    const drawPixelStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const half = size / 2;
      // Cruz principal
      ctx.fillRect(x - half, y - 1, size, 2);
      ctx.fillRect(x - 1, y - half, 2, size);
      // Pontas diagonais
      ctx.fillRect(x - 2, y - 2, 4, 4);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animação contínua para menu
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
