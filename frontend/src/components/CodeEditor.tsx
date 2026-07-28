"use client";

import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    fontSize?: number;
    editorTheme?: string;
    onMount?: (editor: any, monaco: any) => void;
}

export default function CodeEditor({ 
    code, 
    onChange, 
    language = "javascript", 
    fontSize = 14, 
    editorTheme = "vs-dark",
    onMount 
}: CodeEditorProps) {
    return (
        <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            theme={editorTheme}
            value={code}
            onChange={onChange}
            onMount={onMount}
            options={{
                minimap: { enabled: false },
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
                formatOnType: true
            }}
        />
    );
}
