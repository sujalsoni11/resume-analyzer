import React from 'react'

const variants = {
  primary: 'bg-lime text-dark-teal hover:bg-lime-dark border-2 border-lime font-bold',
  secondary: 'bg-dark-teal text-cream hover:bg-teal-800 border-2 border-dark-teal font-bold',
  outline: 'bg-transparent text-dark-teal border-2 border-dark-teal hover:bg-dark-teal hover:text-cream font-bold',
  'outline-lime': 'bg-transparent text-lime border-2 border-lime hover:bg-lime hover:text-dark-teal font-bold',
  ghost: 'bg-transparent text-dark-teal hover:bg-dark-teal/10 border-2 border-transparent font-medium',
  danger: 'bg-red-500 text-white hover:bg-red-600 border-2 border-red-500 font-bold',
}

const sizes = {
  xs: 'px-3 py-1 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
  xl: 'px-10 py-5 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-none',
        'transition-all duration-150',
        'uppercase tracking-widest',
        'font-display',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95',
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
