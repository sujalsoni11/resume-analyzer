import React from 'react'

const variantStyles = {
  lime: 'bg-lime text-dark-teal',
  dark: 'bg-dark-teal text-cream',
  white: 'bg-white text-dark-teal border border-dark-teal',
  red: 'bg-red-500 text-white',
  orange: 'bg-orange-400 text-white',
  yellow: 'bg-yellow-400 text-dark-teal',
  green: 'bg-green-500 text-white',
  gray: 'bg-gray-500 text-white',
  'outline-lime': 'bg-transparent text-lime border border-lime',
  'outline-dark': 'bg-transparent text-dark-teal border border-dark-teal',
}

const sizeStyles = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1.5 text-xs',
}

export default function Badge({
  children,
  variant = 'lime',
  size = 'sm',
  className = '',
  ...props
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1',
        'rounded-none',
        'font-bold uppercase tracking-widest',
        variantStyles[variant] || variantStyles.lime,
        sizeStyles[size] || sizeStyles.sm,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
