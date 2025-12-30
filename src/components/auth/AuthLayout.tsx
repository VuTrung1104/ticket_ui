import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle,
  backgroundImage = '/assets/images/login.jpg'
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-md mx-4 my-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-300 text-sm">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
