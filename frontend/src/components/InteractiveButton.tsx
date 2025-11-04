import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  className = '',
  href,
  target,
  rel
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 hover-lift hover-glow focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg focus:ring-green-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 shadow-lg focus:ring-gray-500',
    outline: 'bg-transparent hover:bg-green-50 text-green-600 border-2 border-green-500 hover:border-green-600 focus:ring-green-500'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm space-x-1',
    md: 'px-6 py-3 text-base space-x-2',
    lg: 'px-8 py-4 text-lg space-x-2'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    isPressed ? 'scale-95' : 'scale-100'
  }`;

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const content = (
    <>
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && !loading && <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={classes}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
};

export default InteractiveButton;