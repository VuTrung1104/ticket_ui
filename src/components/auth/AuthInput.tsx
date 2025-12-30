import { InputHTMLAttributes, forwardRef } from 'react';

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, error, ...props }, ref) => {
    const baseClasses = 'w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all';
    const errorClasses = error ? 'border-red-500/50' : '';
    const combinedClasses = `${baseClasses} ${errorClasses} ${className || ''}`.trim();

    return (
      <div className="w-full">
        <input
          ref={ref}
          className={combinedClasses}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
