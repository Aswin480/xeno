import React from 'react';

export function Card({ children, className }: any) {
  return <div className={`p-4 bg-white rounded shadow ${className || ''}`}>{children}</div>;
}

export default Card;
