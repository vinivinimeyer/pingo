import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const showHelperText = error || helperText;

    return (
      <div className={`pingo-input-wrapper ${className}`}>
        {label && (
          <label htmlFor={inputId} className="pingo-input__label">
            {label}
          </label>
        )}
        <div className="pingo-input__container">
          {leftIcon && (
            <span className="pingo-input__icon pingo-input__icon--left">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`pingo-input ${hasError ? 'pingo-input--error' : ''} ${
              leftIcon ? 'pingo-input--with-left-icon' : ''
            } ${rightIcon ? 'pingo-input--with-right-icon' : ''}`}
            aria-invalid={hasError}
            aria-describedby={showHelperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="pingo-input__icon pingo-input__icon--right">
              {rightIcon}
            </span>
          )}
        </div>
        {showHelperText && (
          <span
            id={`${inputId}-helper`}
            className={`pingo-input__helper ${
              hasError ? 'pingo-input__helper--error' : ''
            }`}
          >
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
