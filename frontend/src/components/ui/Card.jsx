import React from 'react'

const variantStyles = {
  light: 'bg-white border-2 border-dark-teal text-dark-teal',
  dark: 'bg-dark-teal border-2 border-dark-teal text-cream',
  cream: 'bg-cream border-2 border-dark-teal text-dark-teal',
  lime: 'bg-lime border-2 border-lime text-dark-teal',
  ghost: 'bg-transparent border-2 border-dark-teal/30 text-dark-teal',
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  variant = 'light',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={[
        'rounded-none',
        variantStyles[variant] || variantStyles.light,
        paddingStyles[padding] || paddingStyles.md,
        hover ? 'card-hover cursor-pointer' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
