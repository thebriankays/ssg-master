'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './minimap.scss';

interface MinimapProps {
  scale?: number;
  width?: number;
  opacity?: number;
}

const Minimap: React.FC<MinimapProps> = ({
  scale = 0.1,
  width = 200,
  opacity = 0.8,
}) => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [documentSize, setDocumentSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const minimapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLIFrameElement>(null);

  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update viewport and document sizes
  useEffect(() => {
    const updateSizes = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setDocumentSize({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      });
    };

    const observer = new ResizeObserver(updateSizes);
    observer.observe(document.documentElement);
    updateSizes();

    window.addEventListener('resize', updateSizes);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSizes);
    };
  }, []);

  // Handle minimap click/drag to scroll
  const handleMinimapInteraction = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!minimapRef.current) return;

    const rect = minimapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scrollX = (x / scale) - (viewportSize.width / 2);
    const scrollY = (y / scale) - (viewportSize.height / 2);

    window.scrollTo({
      left: Math.max(0, Math.min(scrollX, documentSize.width - viewportSize.width)),
      top: Math.max(0, Math.min(scrollY, documentSize.height - viewportSize.height)),
      behavior: isDragging ? 'auto' : 'smooth',
    });
  }, [scale, viewportSize, documentSize, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMinimapInteraction(e);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMinimapInteraction(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMinimapInteraction]);

  // Create content snapshot
  useEffect(() => {
    const updateContent = () => {
      if (!contentRef.current) return;

      const iframe = contentRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      // Clone the current document
      const html = document.documentElement.cloneNode(true) as HTMLElement;
      
      // Remove scripts and interactive elements
      html.querySelectorAll('script, style, iframe, video, audio').forEach(el => el.remove());
      
      // Add base styles
      const style = iframeDoc.createElement('style');
      style.textContent = `
        * { 
          pointer-events: none !important;
          animation: none !important;
          transition: none !important;
        }
        body {
          margin: 0;
          transform: scale(${scale});
          transform-origin: 0 0;
          width: ${100 / scale}%;
          overflow: hidden;
        }
      `;

      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html>');
      iframeDoc.write(html.outerHTML);
      iframeDoc.close();
      iframeDoc.head.appendChild(style);
    };

    const timer = setTimeout(updateContent, 100);
    const interval = setInterval(updateContent, 5000); // Update every 5 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [scale]);

  const minimapHeight = documentSize.height * scale;
  const viewportHeight = viewportSize.height * scale;
  const viewportWidth = viewportSize.width * scale;
  const viewportTop = scrollPosition.y * scale;
  const viewportLeft = scrollPosition.x * scale;

  return (
    <div className="minimap" style={{ width: `${width}px`, opacity }}>
      <div className="minimap__container">
        <div
          ref={minimapRef}
          className="minimap__content"
          style={{ height: `${minimapHeight}px` }}
          onMouseDown={handleMouseDown}
          onClick={handleMinimapInteraction}
        >
          <iframe
            ref={contentRef}
            className="minimap__iframe"
            title="Page minimap"
            sandbox="allow-same-origin"
          />
          
          {/* Viewport indicator */}
          <div
            className="minimap__viewport"
            style={{
              top: `${viewportTop}px`,
              left: `${viewportLeft}px`,
              width: `${viewportWidth}px`,
              height: `${viewportHeight}px`,
            }}
          />
        </div>
      </div>
      
      <div className="minimap__info">
        <div>Scale: {(scale * 100).toFixed(0)}%</div>
        <div>Page: {documentSize.height}px</div>
      </div>
    </div>
  );
};

export default Minimap;