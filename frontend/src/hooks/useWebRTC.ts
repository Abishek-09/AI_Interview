"use client";
import { useState, useCallback, useRef, useEffect } from 'react';

export function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMedia = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false,
        audio: audio ? { echoCancellation: true, noiseSuppression: true, autoGainControl: true } : false,
      });
      setLocalStream(stream);
      if (video) setIsCameraOn(true);
      if (audio) setIsMicOn(true);
      setError(null);
      return stream;
    } catch (err: any) {
      setError(err.message || "Failed to access media devices");
      return null;
    }
  }, []);

  const toggleCamera = useCallback(async () => {
    if (isCameraOn && localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.stop();
        localStream.removeTrack(track);
      });
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = stream.getVideoTracks()[0];
        
        if (localStream) {
          localStream.addTrack(videoTrack);
          // Trigger re-render by creating new stream reference
          setLocalStream(new MediaStream(localStream.getTracks())); 
        } else {
          setLocalStream(stream);
        }
        setIsCameraOn(true);
      } catch (err: any) {
        setError("Camera permission denied");
      }
    }
  }, [isCameraOn, localStream]);

  const toggleMic = useCallback(async () => {
    if (isMicOn && localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = false; // Soft mute so we don't drop the track completely
      });
      setIsMicOn(false);
    } else if (!isMicOn && localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = true;
        setIsMicOn(true);
      } else {
         // Hard re-request if track was dropped
         try {
           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
           localStream.addTrack(stream.getAudioTracks()[0]);
           setLocalStream(new MediaStream(localStream.getTracks()));
           setIsMicOn(true);
         } catch(e) {
           setError("Microphone permission denied");
         }
      }
    }
  }, [isMicOn, localStream]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing && screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'monitor' },
          audio: true // Optional system audio
        });
        
        // Handle native "Stop sharing" button in browser
        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setIsScreenSharing(false);
        };
        
        setScreenStream(stream);
        setIsScreenSharing(true);
      } catch (err: any) {
        setError("Screen sharing cancelled or denied");
      }
    }
  }, [isScreenSharing, screenStream]);

  const stopAll = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    setIsCameraOn(false);
    setIsMicOn(false);
    setIsScreenSharing(false);
  }, [localStream, screenStream]);

  return {
    localStream,
    screenStream,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    error,
    startMedia,
    toggleCamera,
    toggleMic,
    toggleScreenShare,
    stopAll
  };
}
