'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Grid from './Grid';
import Stats from './Stats';
import Minimap from './Minimap';
import './orchestra.scss';

interface OrchestraState {
  isOpen: boolean;
  showGrid: boolean;
  showStats: boolean;
  showMinimap: boolean;
}

const STORAGE_KEY = 'orchestra-preferences';

const Orchestra: React.FC = () => {
  const [state, setState] = useState<OrchestraState>(() => {
    // Load preferences from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse Orchestra preferences:', e);
        }
      }
    }
    return {
      isOpen: false,
      showGrid: false,
      showStats: false,
      showMinimap: false,
    };
  });

  // Save preferences when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Keyboard shortcut handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // CMD+O on Mac, CTRL+O on Windows/Linux
    if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
      e.preventDefault();
      setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!state.isOpen) {
    return null;
  }

  const toggleTool = (tool: keyof Omit<OrchestraState, 'isOpen'>) => {
    setState(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  return (
    <div className="orchestra">
      <div className="orchestra__panel">
        <div className="orchestra__header">
          <h2 className="orchestra__title">Orchestra Debug Tools</h2>
          <button
            className="orchestra__close"
            onClick={() => setState(prev => ({ ...prev, isOpen: false }))}
            aria-label="Close Orchestra"
          >
            ×
          </button>
        </div>
        <div className="orchestra__controls">
          <label className="orchestra__toggle">
            <input
              type="checkbox"
              checked={state.showGrid}
              onChange={() => toggleTool('showGrid')}
            />
            <span>Grid Overlay</span>
          </label>
          <label className="orchestra__toggle">
            <input
              type="checkbox"
              checked={state.showStats}
              onChange={() => toggleTool('showStats')}
            />
            <span>Performance Stats</span>
          </label>
          <label className="orchestra__toggle">
            <input
              type="checkbox"
              checked={state.showMinimap}
              onChange={() => toggleTool('showMinimap')}
            />
            <span>Page Minimap</span>
          </label>
        </div>
        <div className="orchestra__info">
          <p>Press {navigator.platform.includes('Mac') ? 'CMD' : 'CTRL'}+O to toggle</p>
        </div>
      </div>

      {/* Tools will be rendered here */}
      {state.showGrid && <Grid />}
      {state.showStats && <Stats />}
      {state.showMinimap && <Minimap />}
    </div>
  );
};

export default Orchestra;