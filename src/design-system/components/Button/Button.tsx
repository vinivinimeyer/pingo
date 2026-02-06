import React from 'react';
import { colors, spacing, borderRadius, typography } from '../../tokens';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClass = 'pingo-button';
  const variantClass = `pingo-button--${variant}`;
  const sizeClass = `pingo-button--${size}`;
  const widthClass = fullWidth ? 'pingo-button--full-width' : '';
  const loadingClass = isLoading ? 'pingo-button--loading' : '';
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="pingo-button__spinner" aria-hidden="true">
          <svg
            className="pingo-button__spinner-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="pingo-button__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 40;40 40;40 40;40 40;0 40"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-10;-20;-30;-40"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      )}
      <span className="pingo-button__content">{children}</span>
    </button>
  );
};
