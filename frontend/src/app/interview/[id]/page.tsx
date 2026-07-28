"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import CodeEditor from '../../../components/CodeEditor';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/ToastProvider';
import { AIInterviewCard } from '@/components/interview/AIInterviewCard';
import { InterviewStatus, AIState } from '@/components/interview/InterviewStatus';
import { ConversationUI, Message } from '@/components/interview/ConversationUI';
import { LiveTranscript } from '@/components/interview/LiveTranscript';
import { ProgressMetrics } from '@/components/interview/ProgressMetrics';
import { CandidateSummary } from '@/components/interview/CandidateSummary';
import { WelcomeScreen } from '@/components/interview/WelcomeScreen';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { EditorWorkspace, FileData } from '@/components/editor/EditorWorkspace';
import { ExecutionPanel } from '@/components/editor/ExecutionPanel';
import { TestCasesPanel, TestCase } from '@/components/editor/TestCasesPanel';
import { ConsolePanel } from '@/components/editor/ConsolePanel';
import { AICodeReviewPanel } from '@/components/editor/AICodeReviewPanel';
import { InterviewTimer } from '@/components/interview/InterviewTimer';
import { CheatingDetector, Infraction } from '@/components/interview/CheatingDetector';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useRecording } from '@/hooks/useRecording';
import { useSpeech } from '@/hooks/useSpeech';
import { AIAvatar } from '@/components/interview/AIAvatar';
import { CandidateVideo } from '@/components/interview/CandidateVideo';
import { InterviewToolbar } from '@/components/interview/InterviewToolbar';
import { SettingsModal } from '@/components/interview/SettingsModal';

type ExecutionResult = {
    id: string;
    timestamp: Date;
    code: string;
    status: 'success' | 'error';
    output: string[];
    runtime: string;
    memory: string;
};

export default function InterviewRoom({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileData[]>([
    { name: 'main.js', language: 'javascript', content: '// Implement your solution here\nfunction solve(input) {\n    return true;\n}' },
    { name: 'utils.js', language: 'javascript', content: '// Helper functions\n' }
  ]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Workspace UI State
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState('console'); // 'console' | 'test-cases' | 'ai-review'
  const editorRef = useRef<any>(null);

  // Workflow State
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<'Idle' | 'Running' | 'Completed' | 'Failed' | 'Timeout'>('Idle');
  
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', name: 'Basic Input', input: 'input = [1, 2, 3]', expectedOutput: 'true', isHidden: false },
    { id: '2', name: 'Edge Case (Empty)', input: 'input = []', expectedOutput: 'false', isHidden: false },
    { id: '3', name: 'Hidden Test 1', input: '...', expectedOutput: '...', isHidden: true },
  ]);

  const [aiReviewScore, setAiReviewScore] = useState<number | undefined>();
  const [aiReviewStrengths, setAiReviewStrengths] = useState<string[] | undefined>();
  const [aiReviewWeaknesses, setAiReviewWeaknesses] = useState<string[] | undefined>();
  const [aiReviewSuggestions, setAiReviewSuggestions] = useState<string[] | undefined>();
  const [aiRefactoredCode, setAiRefactoredCode] = useState<string | undefined>();
  const [infractions, setInfractions] = useState<Infraction[]>([]);

  // Restored State
  const [metrics, setMetrics] = useState({ communication: 85, problemSolving: 70, technical: 65, confidence: 90, coding: 0, leadership: 80 });
  const [questionCount, setQuestionCount] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'transcript'>('chat');
  const [isMuted, setIsMuted] = useState(false);
  const { addToast } = useToast();
  
  const overallScore = Math.round(Object.values(metrics).reduce((a,b)=>a+b,0) / 6);
  const getScoreColor = (score: number) => score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--error)';

  // --- Studio Media Hooks ---
  const { 
    localStream, 
    isCameraOn, 
    isMicOn, 
    isScreenSharing, 
    toggleCamera, 
    toggleMic, 
    toggleScreenShare, 
    stopAll: stopMedia 
  } = useWebRTC();

  const { 
    isRecording, 
    isPaused: isRecordingPaused, 
    startRecording, 
    stopRecording, 
    togglePause: pauseRecording 
  } = useRecording();

  const handleFinalTranscript = useCallback((text: string) => {
    setInput((prev: string) => prev + (prev ? ' ' : '') + text);
  }, []);

  const {
    isListening,
    isSpeaking,
    isThinking,
    setIsThinking,
    liveTranscript,
    toggleListening,
    speakText,
    stopSpeaking,
    availableVoices,
    speechVoice,
    setSpeechVoice,
    speechSpeed,
    setSpeechSpeed
  } = useSpeech(handleFinalTranscript);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem(`draft_files_${params.id}`);
    if (savedFiles) {
        try {
          setFiles(JSON.parse(savedFiles));
        } catch(e) {}
    }
  }, [params.id]);

  // Debounced Auto-Save
  useEffect(() => {
    const handler = setTimeout(() => {
        if (!isSubmitted) {
            localStorage.setItem(`draft_files_${params.id}`, JSON.stringify(files));
        }
    }, 3000);
    return () => clearTimeout(handler);
  }, [files, params.id, isSubmitted]);

  // Workspace Handlers
  const handleRun = useCallback(() => {
    if (isExecuting || isSubmitted) return;
    setIsExecuting(true);
    setExecutionStatus('Running');
    setActiveTab('console');
    setConsoleLogs(["> Executing code in secure sandbox..."]);
    
    // Mock Execution
    setTimeout(() => {
      setIsExecuting(false);
      const mainFile = files.find(f => f.name === 'main.js' || f.name === 'main.py' || f.name.includes('main'));
      const activeContent = mainFile ? mainFile.content : files[activeFileIndex].content;
      const isError = activeContent.includes('error') || activeContent.includes('fail');
      
      setExecutionStatus(isError ? 'Failed' : 'Completed');
      
      if (isError) {
        setConsoleLogs(prev => [...prev, "ReferenceError: fail is not defined", "    at solve (main.js:2:5)"]);
        setTestCases(prev => prev.map(tc => ({ ...tc, passed: false, actualOutput: 'Error occurred' })));
      } else {
        setConsoleLogs(prev => [...prev, "Hello World", "Processing node [1, 2, 3]", "✓ Execution finished in 14ms."]);
        setTestCases(prev => prev.map(tc => ({ 
          ...tc, 
          passed: true, 
          actualOutput: tc.expectedOutput,
          executionTimeMs: Math.floor(Math.random() * 20) + 1,
          memoryMb: Math.floor(Math.random() * 10) + 20
        })));
      }

      setMetrics(prev => ({
          ...prev,
          coding: Math.min(100, prev.coding + (isError ? 5 : 15)),
          technical: Math.min(100, prev.technical + (isError ? -5 : 5)),
          problemSolving: Math.min(100, prev.problemSolving + (isError ? -2 : 5))
      }));
    }, 1500);
  }, [isExecuting, isSubmitted, files, activeFileIndex]);

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return;
    if (confirm("Submit final solution? You cannot edit the code after submission.")) {
        setIsSubmitting(true);
        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setActiveTab('ai-review'); // Auto-open review tab
            
            // Mock AI Review Generation
            setTimeout(() => {
              setAiReviewScore(88);
              setAiReviewStrengths(["Excellent use of memoization", "Clean variable naming"]);
              setAiReviewWeaknesses(["Could handle edge cases better where array is empty"]);
              setAiReviewSuggestions(["Consider using a Set for O(1) lookups instead of Array.includes()"]);
              setAiRefactoredCode("// Optimized O(N) approach\nfunction solve(input) {\n  const seen = new Set();\n  // ...\n}");
            }, 3000);

            const successText = "Great job submitting your code! I am analyzing it now.";
            setMessages((prev) => [...prev, { role: 'agent', text: successText, timestamp: new Date() }]);
            speakText(successText);
            localStorage.removeItem(`draft_code_${params.id}`);
        }, 1500);
    }
  }, [isSubmitted, params.id]);

  const handleInfraction = useCallback((infraction: Infraction) => {
    setInfractions(prev => [...prev, infraction]);
    // Optionally notify interviewer via WebSocket
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
       ws.current.send(JSON.stringify({ type: 'cheating_alert', data: infraction }));
    }
  }, []);

  const handleStop = useCallback(() => {
    setIsExecuting(false);
    setExecutionStatus('Idle');
    setConsoleLogs(prev => [...prev, "Execution stopped by user."]);
  }, []);

  const handleReset = useCallback(() => {
    if (isSubmitted) return;
    if (confirm("Reset to initial state?")) {
      setFiles([
        { name: 'main.js', language: 'javascript', content: '// Implement your solution here\nfunction solve(input) {\n    return true;\n}' },
        { name: 'utils.js', language: 'javascript', content: '// Helper functions\n' }
      ]);
      setConsoleLogs([]);
    }
  }, [isSubmitted]);
  const handleEditorMount = (editor: any, monaco: any) => {
      editorRef.current = editor;
  };

  const formatCode = () => {
      if (editorRef.current && !isSubmitted) {
          editorRef.current.getAction('editor.action.formatDocument').run();
      }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    try {
        ws.current = new WebSocket(`ws://localhost:8000/api/v1/interviews/${params.id}/ws`);
        
        ws.current.onopen = () => {
            setIsConnected(true);
            const greeting = "Hello! I'm your AI Interviewer. To start, could you introduce yourself and walk me through your recent experience?";
            setMessages(prev => {
                if (prev.length === 0) {
                    speakText(greeting);
                    return [{role: 'agent', text: greeting, timestamp: new Date()}];
                }
                return prev;
            });
        };
        
        ws.current.onclose = () => {
            setIsConnected(false);
            reconnectTimeout.current = setTimeout(() => connectWebSocket(), 3000);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
        
        ws.current.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.event === 'agent_question' || data.event === 'error') {
                const text = data.payload.text || data.payload.message;
                setMessages((prev: Message[]) => [...prev, { role: 'agent', text: text, timestamp: new Date() }]);
                setIsThinking(false);
                speakText(text);
                if (data.event === 'agent_question') {
                    setQuestionCount(prev => Math.min(5, prev + 1));
                }
            }
        };
    } catch(e) {
        console.warn("Backend not reachable", e);
    }
  };

  useEffect(() => {
    if (!hasStarted) return;
    connectWebSocket();
    return () => {
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        ws.current?.close();
        stopSpeaking(); // Cleanup voice
    };
  }, [params.id, hasStarted]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev: Message[]) => [...prev, { role: 'candidate', text: input, timestamp: new Date() }]);
    
    if (ws.current?.readyState === WebSocket.OPEN) {
        setIsThinking(true);
        ws.current.send(JSON.stringify({
            event: 'candidate_answer',
            payload: { text: input, code: files[activeFileIndex]?.content || '' }
        }));
        
        // Update metrics dynamically
        setMetrics(prev => ({
            ...prev,
            communication: Math.min(100, prev.communication + Math.floor(Math.random() * 3)),
            confidence: Math.min(100, prev.confidence + Math.floor(Math.random() * 2)),
        }));
    } else {
        setMessages((prev: Message[]) => [...prev, { role: 'agent', text: "System: Cannot send message. Not connected to backend.", timestamp: new Date() }]);
    }
    
    setInput('');
  };

  if (!hasStarted) {
    return <WelcomeScreen onStart={() => { setHasStarted(true); }} />;
  }

  return (
    <div className="layout-root" style={{ position: 'relative' }}>
      {isFinished && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <Card variant="glass" padding="lg" className="animate-fade-in" style={{ width: '600px', maxWidth: '90vw' }}>
            <h2 style={{ fontSize: 'var(--text-3xl)', textAlign: 'center', marginBottom: 'var(--spacing-2)', color: 'var(--text-primary)' }}>Interview Complete</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-8)' }}>Thank you for your time. Your session has been recorded.</p>
            
            <div style={{ background: 'var(--bg-secondary)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-8)', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--spacing-2)' }}>Final Score</h3>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: getScoreColor(overallScore) }}>
                {overallScore}%
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: '4px' }}><span>Communication</span><span>{metrics.communication}%</span></div>
                <div className="metric-bar-bg"><div className="metric-fill" style={{ width: `${metrics.communication}%`, backgroundColor: getScoreColor(metrics.communication) }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: '4px' }}><span>Problem Solving</span><span>{metrics.problemSolving}%</span></div>
                <div className="metric-bar-bg"><div className="metric-fill" style={{ width: `${metrics.problemSolving}%`, backgroundColor: getScoreColor(metrics.problemSolving) }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: '4px' }}><span>Technical Skills</span><span>{metrics.technical}%</span></div>
                <div className="metric-bar-bg"><div className="metric-fill" style={{ width: `${metrics.technical}%`, backgroundColor: getScoreColor(metrics.technical) }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: '4px' }}><span>Coding Ability</span><span>{metrics.coding}%</span></div>
                <div className="metric-bar-bg"><div className="metric-fill" style={{ width: `${metrics.coding}%`, backgroundColor: getScoreColor(metrics.coding) }}></div></div>
              </div>
            </div>

            <div className="flex-center">
              <Button variant="primary" size="lg" onClick={() => window.location.href = '/'}>Return to Home</Button>
            </div>
          </Card>
        </div>
      )}
      {/* Top Header */}
      <AIInterviewCard
        name="Sarah Williams"
        role="Senior AI Technical Interviewer"
        isConnected={isConnected}
        round="Technical Round"
        questionCount={questionCount}
        totalQuestions={5}
        timeRemaining={timeRemaining}
        onEndInterview={() => setIsFinished(true)}
      />

      <CheatingDetector onInfraction={handleInfraction} />
      <PanelGroup direction="horizontal" style={{ height: 'calc(100vh - 85px)' }}>
        {/* Left Sidebar */}
        <Panel defaultSize={20} minSize={15}>
          <aside className="layout-sidebar" style={{ height: '100%', padding: 'var(--spacing-4)', gap: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderRight: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <InterviewTimer initialTimeSeconds={timeRemaining} />
            <CandidateSummary id={params.id} />
            <ProgressMetrics 
              metrics={metrics} 
              overallScore={overallScore} 
              questionCount={questionCount} 
              totalQuestions={5} 
            />
          </aside>
        </Panel>
        
        <PanelResizeHandle style={{ width: '4px', cursor: 'col-resize', backgroundColor: 'var(--border-color)' }} />

        {/* Center Workspace */}
        <Panel defaultSize={55} minSize={30}>
          <section className="layout-center" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <div className="layout-toolbar" style={{ padding: '8px var(--spacing-4)', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
              {/* Toolbar left */}
              <div style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                <select value={editorTheme} onChange={(e) => setEditorTheme(e.target.value)} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px', fontSize: 'var(--text-xs)' }}>
                  <option value="vs-dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                  <option value="hc-black">High Contrast</option>
                </select>
                <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '4px', fontSize: 'var(--text-xs)' }}>
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                </select>
              </div>

              {/* Toolbar Right */}
              <ExecutionPanel 
                onRun={handleRun}
                onSubmit={handleSubmit}
                onReset={handleReset}
                onStop={handleStop}
                isExecuting={isExecuting}
                isSubmitted={isSubmitted}
                executionStatus={executionStatus}
              />
            </div>

            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                <div style={{ height: '100%', position: 'relative' }}>
                  {isSubmitted && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                        <div style={{ background: 'var(--bg-panel)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                            <h3 style={{ margin: '0 0 var(--spacing-2) 0', color: 'var(--success)' }}>Code Submitted</h3>
                            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Your solution is locked and under review.</p>
                        </div>
                    </div>
                  )}
                  <EditorWorkspace 
                    files={files}
                    onFilesChange={setFiles}
                    activeFileIndex={activeFileIndex}
                    onActiveFileChange={setActiveFileIndex}
                    editorTheme={editorTheme}
                    fontSize={fontSize}
                  />
                </div>
              </Panel>
              
              <PanelResizeHandle style={{ height: '4px', cursor: 'row-resize', backgroundColor: 'var(--border-color)' }} />
              
              <Panel defaultSize={30} minSize={10}>
                <div className="layout-console" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                    {['console', 'test-cases', 'ai-review'].map(tab => (
                      <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ padding: 'var(--spacing-2) var(--spacing-4)', borderBottom: activeTab === tab ? '2px solid var(--accent-color)' : '2px solid transparent', fontSize: 'var(--text-sm)', fontWeight: activeTab === tab ? 'bold' : 'normal', color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', textTransform: 'capitalize' }}>
                        {tab.replace('-', ' ')}
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    {activeTab === 'console' && <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} isRunning={isExecuting} />}
                    {activeTab === 'test-cases' && <TestCasesPanel testCases={testCases} isRunning={isExecuting} />}
                    {activeTab === 'ai-review' && <AICodeReviewPanel isEvaluating={isSubmitted && !aiReviewScore} score={aiReviewScore} suggestions={aiReviewSuggestions} strengths={aiReviewStrengths} weaknesses={aiReviewWeaknesses} refactoredCode={aiRefactoredCode} />}
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </section>
        </Panel>

        <PanelResizeHandle style={{ width: '4px', cursor: 'col-resize', backgroundColor: 'var(--border-color)' }} />

        {/* Right AI Panel */}
        <Panel defaultSize={25} minSize={20}>
        <aside className="layout-right" style={{ width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
          
          <CandidateVideo stream={localStream} isCameraOn={isCameraOn} />

          <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', minHeight: '130px' }}>
             <AIAvatar state={!isConnected ? 'reconnecting' : isSpeaking ? 'speaking' : isThinking ? 'thinking' : isListening ? 'listening' : 'idle'} />
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
              <div 
                onClick={() => setRightPanelTab('chat')}
                style={{ flex: 1, textAlign: 'center', padding: 'var(--spacing-2)', borderBottom: rightPanelTab === 'chat' ? '2px solid var(--accent-color)' : '2px solid transparent', fontSize: 'var(--text-sm)', fontWeight: rightPanelTab === 'chat' ? 'bold' : 'normal', color: rightPanelTab === 'chat' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                Conversation
              </div>
              <div 
                onClick={() => setRightPanelTab('transcript')}
                style={{ flex: 1, textAlign: 'center', padding: 'var(--spacing-2)', borderBottom: rightPanelTab === 'transcript' ? '2px solid var(--accent-color)' : '2px solid transparent', fontSize: 'var(--text-sm)', fontWeight: rightPanelTab === 'transcript' ? 'bold' : 'normal', color: rightPanelTab === 'transcript' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}>
                Live Transcript
              </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {rightPanelTab === 'chat' ? (
                  <ConversationUI 
                    messages={messages as Message[]} 
                    isThinking={isThinking} 
                    onReplayAudio={speakText} 
                  />
              ) : (
                  <LiveTranscript messages={messages as Message[]} />
              )}
          </div>

          <div style={{ padding: 'var(--spacing-3)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <Button 
                variant={isListening ? 'danger' : 'outline'} 
                size="sm" 
                onClick={toggleListening}
                style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
                title={isListening ? 'Stop Listening' : 'Start Listening (Push to Talk)'}>
                🎤
              </Button>
              <div style={{ flex: 1, fontSize: 'var(--text-xs)', color: isListening ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isListening ? (liveTranscript || 'Listening...') : 'Push to talk...'}
              </div>
              <Button variant={isMuted ? 'danger' : 'outline'} size="sm" onClick={() => {setIsMuted(!isMuted); stopSpeaking();}} style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }} title={isMuted ? 'Unmute AI' : 'Mute AI'}>
                  {isMuted ? '🔇' : '🔊'}
              </Button>
              {isSpeaking && (
                  <Button variant="danger" size="sm" onClick={stopSpeaking} style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }} title="Stop Speaking">
                      ⏹
                  </Button>
              )}
          </div>

          <form onSubmit={sendMessage} style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 'var(--spacing-3)', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ flex: 1 }}>
                  <Input 
                      type="text" 
                      placeholder="Type your answer..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={!isConnected}
                  />
              </div>
              <Button type="submit" disabled={!isConnected} variant="primary">Send</Button>
          </form>
        </aside>
        </Panel>
      </PanelGroup>

      <InterviewToolbar 
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
        isScreenSharing={isScreenSharing}
        isRecording={isRecording}
        isRecordingPaused={isRecordingPaused}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onToggleRecording={() => isRecording ? stopRecording() : localStream && startRecording(localStream)}
        onPauseRecording={pauseRecording}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onEndInterview={() => { stopMedia(); setIsFinished(true); window.location.href='/'; }}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        availableVoices={availableVoices}
        selectedVoice={speechVoice}
        onVoiceChange={setSpeechVoice}
        speechSpeed={speechSpeed}
        onSpeedChange={setSpeechSpeed}
      />
    </div>
  );
}
