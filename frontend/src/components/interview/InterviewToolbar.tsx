"use client";
import React from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, Settings, PhoneOff, CircleDot, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface InterviewToolbarProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isRecordingPaused: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onPauseRecording: () => void;
  onOpenSettings: () => void;
  onEndInterview: () => void;
}

export function InterviewToolbar({
  isMicOn,
  isCameraOn,
  isScreenSharing,
  isRecording,
  isRecordingPaused,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecording,
  onPauseRecording,
  onOpenSettings,
  onEndInterview
}: InterviewToolbarProps) {

  const ToolButton = ({ active, icon, label, onClick, variant = 'ghost', danger = false }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <button 
        onClick={onClick}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: danger ? 'var(--error)' : active ? 'var(--bg-panel)' : 'var(--bg-secondary)',
          border: `1px solid ${active ? 'var(--accent-color)' : 'var(--border-color)'}`,
          color: danger ? 'white' : active ? 'var(--accent-color)' : 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
        {icon}
        {active && !danger && <div style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--success)' }} />}
      </button>
      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--bg-surface)',
      padding: '12px 24px',
      borderRadius: '32px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border-color)',
      zIndex: 1000
    }}>
      <ToolButton 
        active={isMicOn} 
        icon={isMicOn ? <Mic size={20} /> : <MicOff size={20} color="var(--error)" />} 
        label={isMicOn ? 'Mute' : 'Unmute'} 
        onClick={onToggleMic} 
      />
      
      <ToolButton 
        active={isCameraOn} 
        icon={isCameraOn ? <Video size={20} /> : <VideoOff size={20} color="var(--error)" />} 
        label={isCameraOn ? 'Stop Video' : 'Start Video'} 
        onClick={onToggleCamera} 
      />
      
      <ToolButton 
        active={isScreenSharing} 
        icon={<MonitorUp size={20} />} 
        label={isScreenSharing ? 'Stop Share' : 'Share Screen'} 
        onClick={onToggleScreenShare} 
      />

      <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }} />

      <div style={{ display: 'flex', gap: '8px' }}>
        <ToolButton 
            active={isRecording} 
            icon={<CircleDot size={20} color={isRecording ? "var(--error)" : "currentColor"} />} 
            label={isRecording ? 'Stop Rec' : 'Record'} 
            onClick={onToggleRecording} 
        />
        {isRecording && (
          <ToolButton 
            active={!isRecordingPaused} 
            icon={isRecordingPaused ? <Play size={20} /> : <Pause size={20} />} 
            label={isRecordingPaused ? 'Resume' : 'Pause'} 
            onClick={onPauseRecording} 
          />
        )}
      </div>

      <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }} />

      <ToolButton 
        icon={<Settings size={20} />} 
        label="Settings" 
        onClick={onOpenSettings} 
      />

      <ToolButton 
        danger 
        icon={<PhoneOff size={20} />} 
        label="End" 
        onClick={onEndInterview} 
      />
    </div>
  );
}
