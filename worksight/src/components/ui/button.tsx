import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles =
    variant === 'outline' ? 'border border-gray-300 text-gray-700' : 'bg-blue-600 text-white';
  const sizeStyles =
    size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-2 text-lg' : 'px-3 py-2';

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
