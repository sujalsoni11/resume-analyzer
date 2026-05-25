import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingSpinner({ message = 'Loading...', fullPage = false }) {
  const dots = [0, 1, 2]

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated dots */}
      <div className="flex items-center gap-3">
        {dots.map((i) => (
          <motion.span
            key={i}
            className="w-4 h-4 bg-lime rounded-none block"
            animate={{
              scaleY: [1, 2.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <p className="font-display text-xl tracking-widest text-dark-teal dark:text-cream uppercase">
        {message}
      </p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-cream dark:bg-teal-900 dot-grid flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-20">
      {content}
    </div>
  )
}

export function InlineSpinner({ className = '' }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-cream dark:bg-teal-900 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 border-4 border-dark-teal border-t-lime mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="font-display text-2xl text-dark-teal dark:text-lime tracking-widest uppercase">
          AI IS THINKING...
        </p>
      </div>
    </div>
  )
}
