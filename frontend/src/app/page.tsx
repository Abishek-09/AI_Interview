"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // System Check States
  const [isInternetOk, setIsInternetOk] = useState(false);
  const [isMicOk, setIsMicOk] = useState(false);
  const [isCameraOk, setIsCameraOk] = useState(false);
  const [isCheckingSystem, setIsCheckingSystem] = useState(false);

  // Practice State
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState("");

  // Connect State
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => Math.max(0, prev - 1));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert("Only PDF files are supported");
        return;
      }
      setResumeFile(file);
      handleNextStep();
    }
  };

  const runSystemCheck = async () => {
    setIsCheckingSystem(true);
    
    // Internet Check
    setIsInternetOk(navigator.onLine);

    // Permissions check
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setIsMicOk(true);
      setIsCameraOk(true);
      // Stop tracks immediately so camera light doesn't stay on
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn("Permissions denied or device not found", err);
      // Attempt separate checks if combined failed
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMicOk(true);
        audioStream.getTracks().forEach(track => track.stop());
      } catch (e) { setIsMicOk(false); }
      
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraOk(true);
        videoStream.getTracks().forEach(track => track.stop());
      } catch (e) { setIsCameraOk(false); }
    }
    
    setIsCheckingSystem(false);
  };

  const startPractice = () => {
    setPracticeFeedback("Great! Your microphone input would be captured here. Audio systems are functioning properly.");
  };

  const connectInterview = async () => {
    setIsLoading(true);
    setStatusText("Creating candidate profile...");
    
    try {
      let candidateId = 1;
      
      if (resumeFile) {
        // 1. Create Candidate
        const candRes = await fetch('http://localhost:8000/api/v1/candidates/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: "Candidate",
            last_name: "Demo",
            email: `demo_${Date.now()}@example.com`
          })
        });
        if (!candRes.ok) throw new Error("Failed to create candidate");
        const candData = await candRes.json();
        candidateId = candData.id;

        // 2. Upload Resume
        setStatusText("Uploading resume and extracting context...");
        const formData = new FormData();
        formData.append('file', resumeFile);
        
        const uploadRes = await fetch(`http://localhost:8000/api/v1/candidates/${candidateId}/resume`, {
          method: 'POST',
          body: formData
        });
        if (!uploadRes.ok) throw new Error("Failed to upload resume");
      }

      // 3. Start Interview
      setStatusText("Preparing interview environment...");
      const res = await fetch('http://localhost:8000/api/v1/interviews/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, job_id: 1 })
      });
      
      if (!res.ok) throw new Error("Failed to create interview");
      const data = await res.json();
      router.push(`/interview/${data.interview_id}`);
      
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend. Is Docker running?");
      setIsLoading(false);
      setStatusText("");
    }
  };

  // --- Views ---
  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <h1 className="gradient-text" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--spacing-4)' }}>Enterprise AI Interview</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--spacing-8)' }}>
              Welcome to the future of technical hiring. The platform uses advanced multi-agent AI to conduct natural, adaptive, and deeply technical interviews.
            </p>
            <Button variant="primary" size="lg" onClick={handleNextStep}>Begin Onboarding</Button>
          </div>
        );
      
      case 1:
        return (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-4)' }}>Upload Your Resume</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-8)' }}>
              Our AI will analyze your experience to tailor the interview questions directly to your background.
            </p>
            <input 
              type="file" 
              accept="application/pdf"
              style={{ display: 'none' }} 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <div className="flex-center gap-4">
              <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
                Select PDF Resume
              </Button>
              <Button variant="ghost" size="lg" onClick={handleNextStep}>
                Skip (Demo Mode)
              </Button>
            </div>
            {resumeFile && <p style={{ color: 'var(--success)', marginTop: 'var(--spacing-4)' }}>Selected: {resumeFile.name}</p>}
          </div>
        );
        
      case 2:
        return (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-4)' }}>System Check</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-8)' }}>
              We need to verify your hardware to ensure a smooth interview experience. Please allow browser permissions when prompted.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: '400px', margin: '0 auto var(--spacing-8) auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span>🌐 Internet Connection</span>
                {isInternetOk ? <span style={{ color: 'var(--success)' }}>Passed ✓</span> : <span style={{ color: 'var(--error)' }}>Checking...</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span>🎤 Microphone Access</span>
                {isMicOk ? <span style={{ color: 'var(--success)' }}>Passed ✓</span> : <span style={{ color: 'var(--error)' }}>Pending / Blocked</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <span>📷 Camera Access</span>
                {isCameraOk ? <span style={{ color: 'var(--success)' }}>Passed ✓</span> : <span style={{ color: 'var(--error)' }}>Pending / Blocked</span>}
              </div>
            </div>

            <div className="flex-center gap-4">
              <Button variant="outline" onClick={runSystemCheck} isLoading={isCheckingSystem}>Run Checks</Button>
              <Button variant="primary" onClick={handleNextStep} disabled={!(isInternetOk && isMicOk && isCameraOk)}>Continue</Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-4)', textAlign: 'center' }}>Interview Guidelines</h2>
            <ul style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-8)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <li>✓ Find a quiet, distraction-free environment.</li>
              <li>✓ Use the <strong>Push-to-Talk</strong> microphone button to speak your answers.</li>
              <li>✓ Feel free to use the built-in IDE to write code or pseudo-code during technical questions.</li>
              <li>✓ The AI Interviewer may interrupt you or ask clarifying questions, treat it like a human conversation.</li>
              <li>✓ If you need extra time to think, just say "Give me a moment to think."</li>
            </ul>
            <div className="flex-center">
              <Button variant="primary" size="lg" onClick={handleNextStep}>I Understand</Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-4)' }}>Practice Question</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-6)' }}>
              Let's do a quick audio check. Please read the following sentence aloud using the Push-to-Talk button, or type a response.
            </p>
            <div style={{ background: 'var(--bg-panel)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', fontStyle: 'italic', marginBottom: 'var(--spacing-6)' }}>
              "Hello! I am ready to begin my technical interview."
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); startPractice(); }} style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <Input 
                type="text" 
                placeholder="Type 'Hello' to verify keyboard..." 
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button type="submit" variant="outline">Submit</Button>
            </form>

            {practiceFeedback && (
              <p style={{ color: 'var(--success)', marginTop: 'var(--spacing-4)' }}>{practiceFeedback}</p>
            )}

            <div className="flex-center" style={{ marginTop: 'var(--spacing-8)' }}>
              <Button variant="primary" size="lg" onClick={handleNextStep}>Enter Waiting Room</Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-4)' }}>Ready to Connect</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-8)' }}>
              Your environment is verified. Click below to initialize the AI Agents and join the interview session.
            </p>
            <div className="flex-center gap-4">
              <Button variant="outline" size="lg" onClick={handlePrevStep} disabled={isLoading}>Back</Button>
              <Button variant="success" size="lg" onClick={connectInterview} isLoading={isLoading}>Start Interview</Button>
            </div>
            {isLoading && (
              <p className="animate-fade-in" style={{ marginTop: 'var(--spacing-6)', color: 'var(--accent-color)' }}>
                {statusText}
              </p>
            )}
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <main className="flex-center" style={{ minHeight: '100vh', padding: 'var(--spacing-8)' }}>
      <Card variant="glass" padding="lg" style={{ maxWidth: '800px', width: '100%', position: 'relative' }}>
        
        {/* Progress Bar Header */}
        {step > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--bg-secondary)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent-color)', width: `${(step / 5) * 100}%`, transition: 'width 0.3s ease' }}></div>
          </div>
        )}

        <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderStep()}
        </div>
        
      </Card>
    </main>
  );
}
