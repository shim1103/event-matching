import React from 'react';
import { COLORS } from '../../../utils/constants';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.PRIMARY,
          color: 'white',
          borderColor: COLORS.PRIMARY
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.SECONDARY,
          color: COLORS.PRIMARY,
          borderColor: COLORS.SECONDARY
        };
      case 'success':
        return {
          backgroundColor: COLORS.SUCCESS,
          color: 'white',
          borderColor: COLORS.SUCCESS
        };
      case 'danger':
        return {
          backgroundColor: '#EF4444',
          color: 'white',
          borderColor: '#EF4444'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: COLORS.PRIMARY,
          borderColor: COLORS.PRIMARY
        };
      default:
        return {
          backgroundColor: COLORS.PRIMARY,
          color: 'white',
          borderColor: COLORS.PRIMARY
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'medium':
        return 'px-4 py-2 text-base';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const baseClasses = [
    'font-medium',
    'rounded-lg',
    'border',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    getSizeClasses(),
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:transform active:scale-95',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      style={getVariantStyles()}
    >
      {children}
    </button>
  );
};

export default Button;