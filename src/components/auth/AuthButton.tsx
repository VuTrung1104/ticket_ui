import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'social';
  icon?: React.ReactNode;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, children, isLoading, variant = 'primary', icon, disabled, ...props }, ref) => {
    const baseStyles = 'w-full py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3';
    
    const variants = {
      primary: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/50',
      social: 'bg-white/5 border border-white/20 text-white hover:bg-white/15 hover:border-white/30',
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${className || ''}`.trim();

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClasses}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';
