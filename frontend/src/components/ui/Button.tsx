import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

  const variantClasses = {
    primary: 'bg-gold hover:bg-gold-light text-bg-primary shadow-[0_4px_20px_rgba(201,169,110,0.3)] hover:shadow-[0_6px_25px_rgba(201,169,110,0.5)] hover:scale-[1.02]',
    secondary: 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-bg-primary shadow-sm hover:shadow-[0_4px_20px_rgba(201,169,110,0.3)] hover:scale-[1.02]',
    danger: 'bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
    ghost: 'hover:bg-gold/10 text-text-secondary hover:text-gold',
  };

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-[11px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
