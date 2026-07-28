"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { FileCode, FileJson, FileText, Plus, X, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FileData {
  name: string;
  language: string;
  content: string;
}

interface EditorWorkspaceProps {
  files: FileData[];
  onFilesChange: (files: FileData[]) => void;
  activeFileIndex: number;
  onActiveFileChange: (index: number) => void;
  editorTheme?: string;
  fontSize?: number;
  onRun?: () => void;
  onSaveSnapshot?: () => void;
}

export function EditorWorkspace({
  files,
  onFilesChange,
  activeFileIndex,
  onActiveFileChange,
  editorTheme = 'vs-dark',
  fontSize = 14,
  onRun,
  onSaveSnapshot
}: EditorWorkspaceProps) {
  const monaco = useMonaco();
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...' | 'Unsaved'>('Saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeFile = files[activeFileIndex];

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    setSaveStatus('Saving...');
    
    const newFiles = [...files];
    newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], content: value };
    onFilesChange(newFiles);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      // Simulate an autosave API/localStorage sync
      localStorage.setItem('interview_code_backup', JSON.stringify(newFiles));
      setSaveStatus('Saved');
      if (onSaveSnapshot) onSaveSnapshot();
    }, 1500);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.json')) return <FileJson size={14} className="file-icon" color="var(--info)" />;
    if (filename.endsWith('.md') || filename.endsWith('.txt')) return <FileText size={14} className="file-icon" />;
    return <FileCode size={14} className="file-icon" color="var(--accent-color)" />;
  };

  const handleAddTab = () => {
    const newFileName = `file${files.length + 1}.js`;
    onFilesChange([...files, { name: newFileName, language: 'javascript', content: '// New file\n' }]);
    onActiveFileChange(files.length);
  };

  const handleCloseTab = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (files.length <= 1) return; // Don't close the last tab
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    if (activeFileIndex >= newFiles.length) {
      onActiveFileChange(newFiles.length - 1);
    } else if (activeFileIndex > index) {
      onActiveFileChange(activeFileIndex - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--bg-panel)' }}>
      {/* Editor Tabs & Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', overflowX: 'auto' }}>
        <div style={{ display: 'flex' }}>
          {files.map((file, i) => (
            <div 
              key={i} 
              onClick={() => onActiveFileChange(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: 'var(--text-sm)',
                backgroundColor: i === activeFileIndex ? 'var(--bg-panel)' : 'transparent',
                borderTop: i === activeFileIndex ? '2px solid var(--accent-color)' : '2px solid transparent',
                color: i === activeFileIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderRight: '1px solid var(--border-color)'
              }}>
              {getFileIcon(file.name)}
              {file.name}
              {files.length > 1 && (
                <div onClick={(e) => handleCloseTab(e, i)} style={{ display: 'flex', padding: '2px', borderRadius: '4px', opacity: i === activeFileIndex ? 1 : 0.5, backgroundColor: 'transparent' }} className="hover-bg">
                  <X size={12} />
                </div>
              )}
            </div>
          ))}
          <div 
            onClick={handleAddTab}
            style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer', color: 'var(--text-secondary)' }}
            className="hover-bg">
            <Plus size={16} />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', paddingRight: 'var(--spacing-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: saveStatus === 'Saved' ? 'var(--success)' : 'var(--warning)' }}></span>
            {saveStatus}
          </span>
          <Button variant="ghost" size="sm" title="Upload File"><Upload size={14} /></Button>
          <Button variant="ghost" size="sm" title="Download Workspace"><Download size={14} /></Button>
        </div>
      </div>

      {/* Editor Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Editor
          height="100%"
          language={activeFile.language}
          theme={editorTheme}
          value={activeFile.content}
          onChange={handleEditorChange}
          path={activeFile.name} // Allows Monaco to treat this as a unique model for intellisense across tabs
          options={{
            minimap: { enabled: true },
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            wordWrap: "on",
            renderLineHighlight: "all",
            lineHeight: 24,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            dragAndDrop: true,
            links: true,
            mouseWheelZoom: true,
          }}
        />
      </div>
    </div>
  );
}
