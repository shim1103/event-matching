import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  border?: boolean;
  rounded?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  border = true,
  rounded = 'medium',
  onClick,
  hover = false
}) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'p-3';
      case 'medium':
        return 'p-4';
      case 'large':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const getShadowClass = () => {
    switch (shadow) {
      case 'none':
        return '';
      case 'small':
        return 'shadow-sm';
      case 'medium':
        return 'shadow-md';
      case 'large':
        return 'shadow-lg';
      default:
        return 'shadow-md';
    }
  };

  const getRoundedClass = () => {
    switch (rounded) {
      case 'none':
        return '';
      case 'small':
        return 'rounded';
      case 'medium':
        return 'rounded-lg';
      case 'large':
        return 'rounded-xl';
      default:
        return 'rounded-lg';
    }
  };

  const baseClasses = [
    'bg-white',
    getPaddingClass(),
    getShadowClass(),
    getRoundedClass(),
    border ? 'border border-gray-200' : '',
    onClick ? 'cursor-pointer' : '',
    hover && onClick ? 'hover:shadow-lg transition-shadow duration-200' : '',
    className
  ].filter(Boolean).join(' ');

  if (onClick) {
    return (
      <div
        className={baseClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default Card;