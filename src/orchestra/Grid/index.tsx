'use client'

import React, { useState, useEffect } from 'react';
import './grid.scss';

interface GridProps {
  columns?: number;
  maxWidth?: number;
  gutter?: number;
  color?: string;
  opacity?: number;
}

const Grid: React.FC<GridProps> = ({
  columns = 12,
  maxWidth = 1440,
  gutter = 24,
  color = 'rgba(255, 0, 255, 0.15)',
  opacity = 1,
}) => {
  const [showBaseline, setShowBaseline] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut for baseline grid (G key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setShowBaseline(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const containerWidth = Math.min(windowWidth, maxWidth);
  const marginHorizontal = Math.max(0, (windowWidth - containerWidth) / 2);

  return (
    <div className="grid-overlay" style={{ opacity }}>
      {/* Column Grid */}
      <div 
        className="grid-overlay__columns"
        style={{
          paddingLeft: `${marginHorizontal}px`,
          paddingRight: `${marginHorizontal}px`,
        }}
      >
        {Array.from({ length: columns }, (_, i) => (
          <div
            key={i}
            className="grid-overlay__column"
            style={{
              backgroundColor: color,
              marginLeft: i === 0 ? 0 : `${gutter / 2}px`,
              marginRight: i === columns - 1 ? 0 : `${gutter / 2}px`,
            }}
          />
        ))}
      </div>

      {/* Baseline Grid */}
      {showBaseline && (
        <div className="grid-overlay__baseline">
          {Array.from({ length: 200 }, (_, i) => (
            <div
              key={i}
              className="grid-overlay__baseline-line"
              style={{ top: `${i * 8}px` }}
            />
          ))}
        </div>
      )}

      {/* Grid Info */}
      <div className="grid-overlay__info">
        <div className="grid-overlay__info-item">
          Columns: {columns}
        </div>
        <div className="grid-overlay__info-item">
          Max Width: {maxWidth}px
        </div>
        <div className="grid-overlay__info-item">
          Gutter: {gutter}px
        </div>
        <div className="grid-overlay__info-item">
          Baseline: {showBaseline ? 'ON' : 'OFF'} (Press G)
        </div>
      </div>
    </div>
  );
};

export default Grid;