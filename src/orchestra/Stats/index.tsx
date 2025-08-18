'use client'

import React, { useState, useEffect, useRef } from 'react';
import './stats.scss';

interface StatsData {
  fps: number;
  ms: number;
  memory: {
    used: number;
    limit: number;
  } | null;
}

const Stats: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    fps: 0,
    ms: 0,
    memory: null,
  });
  const [minimized, setMinimized] = useState(false);
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const msHistory = useRef<number[]>([]);
  const animationId = useRef<number | undefined>(undefined);

  useEffect(() => {
    let lastFrameTime = performance.now();
    
    const measure = () => {
      const now = performance.now();
      const delta = now - lastFrameTime;
      
      // Calculate FPS
      frameCount.current++;
      if (now >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
        frameCount.current = 0;
        lastTime.current = now;
        
        fpsHistory.current.push(fps);
        if (fpsHistory.current.length > 60) {
          fpsHistory.current.shift();
        }
        
        // Get memory info if available
        let memory = null;
        if ('memory' in performance) {
          const perfMemory = (performance as any).memory;
          memory = {
            used: Math.round(perfMemory.usedJSHeapSize / 1048576), // Convert to MB
            limit: Math.round(perfMemory.jsHeapSizeLimit / 1048576),
          };
        }
        
        setStats({
          fps,
          ms: Math.round(delta),
          memory,
        });
      }
      
      // Track frame time
      msHistory.current.push(delta);
      if (msHistory.current.length > 60) {
        msHistory.current.shift();
      }
      
      lastFrameTime = now;
      animationId.current = requestAnimationFrame(measure);
    };
    
    animationId.current = requestAnimationFrame(measure);
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#00ff00';
    if (fps >= 30) return '#ffff00';
    return '#ff0000';
  };

  const getMSColor = (ms: number) => {
    if (ms <= 16) return '#00ff00';
    if (ms <= 33) return '#ffff00';
    return '#ff0000';
  };

  const getMemoryColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage <= 50) return '#00ff00';
    if (percentage <= 75) return '#ffff00';
    return '#ff0000';
  };

  if (minimized) {
    return (
      <div className="stats stats--minimized" onClick={() => setMinimized(false)}>
        <div className="stats__mini">
          <span style={{ color: getFPSColor(stats.fps) }}>{stats.fps} FPS</span>
        </div>
      </div>
    );
  }

  return (
    <div className="stats">
      <div className="stats__header">
        <h3 className="stats__title">Performance</h3>
        <button
          className="stats__minimize"
          onClick={() => setMinimized(true)}
          aria-label="Minimize stats"
        >
          _
        </button>
      </div>
      
      <div className="stats__panels">
        {/* FPS Panel */}
        <div className="stats__panel">
          <div className="stats__label">FPS</div>
          <div className="stats__value" style={{ color: getFPSColor(stats.fps) }}>
            {stats.fps}
          </div>
          <div className="stats__graph">
            <svg width="60" height="30" className="stats__graph-svg">
              <polyline
                points={fpsHistory.current
                  .map((fps, i) => `${i},${30 - (fps / 60) * 30}`)
                  .join(' ')}
                fill="none"
                stroke={getFPSColor(stats.fps)}
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
        
        {/* Frame Time Panel */}
        <div className="stats__panel">
          <div className="stats__label">MS</div>
          <div className="stats__value" style={{ color: getMSColor(stats.ms) }}>
            {stats.ms}
          </div>
          <div className="stats__graph">
            <svg width="60" height="30" className="stats__graph-svg">
              <polyline
                points={msHistory.current
                  .map((ms, i) => `${i},${30 - Math.min(ms / 50, 1) * 30}`)
                  .join(' ')}
                fill="none"
                stroke={getMSColor(stats.ms)}
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>
        
        {/* Memory Panel */}
        {stats.memory && (
          <div className="stats__panel">
            <div className="stats__label">MEM</div>
            <div 
              className="stats__value" 
              style={{ color: getMemoryColor(stats.memory.used, stats.memory.limit) }}
            >
              {stats.memory.used}MB
            </div>
            <div className="stats__sub">
              {Math.round((stats.memory.used / stats.memory.limit) * 100)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;