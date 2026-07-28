"use client";
import React, { useEffect, useRef, useState } from 'react';
import { CameraOff, Maximize2, Minimize2, Move } from 'lucide-react';

interface CandidateVideoProps {
  stream: MediaStream | null;
  isCameraOn: boolean;
}

export function CandidateVideo({ stream, isCameraOn }: CandidateVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isExpanded) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: Math.max(0, dragRef.current.initialX + dx),
      y: Math.max(0, dragRef.current.initialY + dy)
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (!isCameraOn && !stream) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: isExpanded ? 0 : position.y,
        right: isExpanded ? 0 : position.x,
        width: isExpanded ? '100%' : '240px',
        height: isExpanded ? '100%' : '135px',
        zIndex: 100,
        backgroundColor: 'var(--bg-panel)',
        borderRadius: isExpanded ? '0' : 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: isExpanded ? 'none' : '2px solid var(--border-color)',
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
    >
      {/* Drag Handle & Controls */}
      {!isExpanded && (
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            padding: '4px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'move',
            zIndex: 10
          }}
        >
          <Move size={14} color="white" />
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <Maximize2 size={14} color="white" />
          </button>
        </div>
      )}

      {isExpanded && (
        <button 
            onClick={() => setIsExpanded(false)}
            style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px' }}
          >
            <Minimize2 size={20} color="white" />
        </button>
      )}

      {isCameraOn ? (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transform: 'scaleX(-1)' // Mirror local video
          }} 
        />
      ) : (
        <div className="flex-center" style={{ width: '100%', height: '100%', backgroundColor: 'var(--bg-secondary)' }}>
          <CameraOff size={32} color="var(--text-muted)" />
        </div>
      )}
    </div>
  );
}
