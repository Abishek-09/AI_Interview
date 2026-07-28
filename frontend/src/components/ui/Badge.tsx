import React from 'react';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  pulse = false,
  className = '',
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-1)',
    padding: 'var(--spacing-1) var(--spacing-2)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    fontFamily: 'var(--font-family)',
    whiteSpace: 'nowrap',
  };

  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    success: { backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' },
    error: { backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' },
    warning: { backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' },
    info: { backgroundColor: 'var(--info-bg)', color: 'var(--info-text)' },
    neutral: { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' },
  };

  const combinedStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <span style={combinedStyle} className={`ui-badge ${className}`} {...props}>
      {pulse && (
        <span 
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            animation: 'pulseGlow 2s infinite',
          }} 
        />
      )}
      {children}
    </span>
  );
};
