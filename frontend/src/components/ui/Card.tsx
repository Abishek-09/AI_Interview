import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'solid',
  padding = 'md',
  className = '',
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  };

  const variantStyles: Record<'solid' | 'glass', React.CSSProperties> = {
    solid: {
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)',
    },
    glass: {
      backgroundColor: 'var(--bg-panel)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)',
    }
  };

  const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: 'var(--spacing-3)' },
    md: { padding: 'var(--spacing-5)' },
    lg: { padding: 'var(--spacing-8)' },
  };

  const combinedStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...paddingStyles[padding],
    ...style,
  };

  return (
    <div style={combinedStyle} className={`ui-card ${className}`} {...props}>
      {children}
    </div>
  );
};
