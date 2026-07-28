import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  className = '',
  id,
  style,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1)',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: error ? 'var(--error)' : 'var(--text-secondary)',
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: 'var(--spacing-3)',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `var(--spacing-2) var(--spacing-3)`,
    paddingLeft: leftIcon ? 'calc(var(--spacing-8) + var(--spacing-2))' : 'var(--spacing-3)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: `1px solid ${error ? 'var(--error)' : 'var(--border-color)'}`,
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    ...style,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--error)' : 'var(--text-muted)',
    marginTop: '2px',
  };

  React.useEffect(() => {
    if (!document.getElementById('input-focus-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'input-focus-styles';
      styleEl.innerHTML = `
        .ui-input:focus {
          border-color: var(--accent-color) !important;
          box-shadow: 0 0 0 2px var(--accent-glow) !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <div style={containerStyle} className={className}>
      {label && <label htmlFor={inputId} style={labelStyle}>{label}</label>}
      
      <div style={inputWrapperStyle}>
        {leftIcon && <div style={iconStyle}>{leftIcon}</div>}
        <input
          id={inputId}
          className="ui-input"
          style={inputStyle}
          {...props}
        />
      </div>

      {(error || helperText) && (
        <span style={messageStyle}>{error || helperText}</span>
      )}
    </div>
  );
};
