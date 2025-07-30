import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src="https://colegiosagradafamilia.cl/www/wp-content/uploads/2022/04/cropped-logo-hd-1.png"
          alt="Colegio Sagrada Familia Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-blue-800 ${textSizeClasses[size]}`}>
            Colegio Sagrada Familia
          </span>
          <span className="text-sm text-gray-600">
            Sistema de Retiro
          </span>
        </div>
      )}
    </div>
  );
};
