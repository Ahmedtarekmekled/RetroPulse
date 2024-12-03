import { useEffect, useRef } from 'react';

function HackerBackground({ type = 'matrix' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log('HackerBackground mounted with type:', type);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Matrix rain effect
    const matrixEffect = () => {
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
      const fontSize = 16;
      const columns = canvas.width / fontSize;
      const drops = Array(Math.floor(columns)).fill(1);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Circuit board effect
    const circuitEffect = () => {
      ctx.strokeStyle = '#0F0';
      ctx.lineWidth = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gridSize = 30;
      const nodes = [];

      // Create nodes
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          if (Math.random() > 0.7) {
            nodes.push({ x, y });
          }
        }
      }

      // Draw connections
      nodes.forEach((node, i) => {
        const closest = nodes
          .map((other, j) => ({ dist: Math.hypot(node.x - other.x, node.y - other.y), node: other, index: j }))
          .filter(({ dist }) => dist < gridSize * 2 && dist > 0)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 2);

        closest.forEach(({ node: other }) => {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        });

        ctx.fillStyle = '#0F0';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Static TV effect
    const staticEffect = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // red
        data[i + 1] = value; // green
        data[i + 2] = value; // blue
        data[i + 3] = 25;    // alpha
      }

      ctx.putImageData(imageData, 0, 0);
    };

    // Glitch effect
    const glitchEffect = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() > 0.95) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 100 + 100;
        const height = Math.random() * 50;
        
        ctx.fillStyle = `rgba(0, ${Math.random() * 255}, 0, 0.1)`;
        ctx.fillRect(x, y, width, height);
      }
    };

    // Animation loop
    const animate = () => {
      switch (type) {
        case 'matrix':
          matrixEffect();
          break;
        case 'circuit':
          circuitEffect();
          break;
        case 'static':
          staticEffect();
          break;
        case 'glitch':
          glitchEffect();
          break;
        default:
          matrixEffect();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-50"
      style={{ zIndex: -1 }}
    />
  );
}

export default HackerBackground; 