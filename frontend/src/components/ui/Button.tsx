import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    fontFamily: 'var(--font-family)',
    transition: 'all var(--transition-fast)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: '1px solid transparent',
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--accent-color)',
      color: '#ffffff',
      boxShadow: '0 0 10px var(--accent-glow)',
    },
    secondary: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
    },
    danger: {
      backgroundColor: 'var(--error)',
      color: '#ffffff',
    },
    success: {
      backgroundColor: 'var(--success)',
      color: '#ffffff',
    },
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: {
      padding: 'var(--spacing-1) var(--spacing-3)',
      fontSize: 'var(--text-sm)',
    },
    md: {
      padding: 'var(--spacing-2) var(--spacing-4)',
      fontSize: 'var(--text-base)',
    },
    lg: {
      padding: 'var(--spacing-3) var(--spacing-6)',
      fontSize: 'var(--text-lg)',
    },
  };

  const hoverEffect = React.useRef<HTMLStyleElement | null>(null);

  React.useEffect(() => {
    // Inject dynamic hover styles since inline styles don't support :hover
    if (!document.getElementById('button-hover-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'button-hover-styles';
      styleEl.innerHTML = `
        .ui-btn-primary:not(:disabled):hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 0 15px var(--accent-glow); }
        .ui-btn-secondary:not(:disabled):hover { background: var(--border-color); }
        .ui-btn-outline:not(:disabled):hover { background: var(--bg-secondary); }
        .ui-btn-ghost:not(:disabled):hover { background: var(--bg-secondary); }
        .ui-btn-danger:not(:disabled):hover { opacity: 0.9; }
        .ui-btn-success:not(:disabled):hover { opacity: 0.9; box-shadow: 0 0 10px var(--success); }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  const combinedStyle = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      className={`ui-btn-${variant} ${className}`}
      style={combinedStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%' }} />
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
