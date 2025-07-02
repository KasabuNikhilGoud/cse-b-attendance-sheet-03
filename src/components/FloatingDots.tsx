import React, { useEffect, useRef } from 'react';

const FloatingDots: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing dots
    container.innerHTML = '';

    // Create 50 floating dots
    for (let i = 0; i < 50; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      
      // Random position
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top = Math.random() * 100 + '%';
      
      // Random animation delay and duration
      dot.style.animationDelay = Math.random() * 8 + 's';
      dot.style.animationDuration = (8 + Math.random() * 4) + 's';
      
      // Random size
      const size = 2 + Math.random() * 4;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      
      // Random color opacity
      const colors = [
        'hsl(0 84% 60% / 0.3)',
        'hsl(0 0% 10% / 0.2)',
        'hsl(0 76% 55% / 0.25)',
      ];
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      container.appendChild(dot);
    }

    // Clean up function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="floating-dots" />;
};

export default FloatingDots;