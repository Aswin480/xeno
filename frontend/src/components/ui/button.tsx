import React from 'react';

export function Button({ children, className, ...props }: any) {
  return (
    <button className={`px-3 py-2 rounded bg-primary hover:bg-primary-hover text-white transition-all ${className || ''}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
