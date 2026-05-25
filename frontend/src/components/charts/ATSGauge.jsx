import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { motion } from 'framer-motion'
import { getScoreHex, getScoreRating } from '../../utils/helpers.js'

export default function ATSGauge({ score = 0, size = 'lg', animated = true }) {
  const color = getScoreHex(score)
  const rating = getScoreRating(score)

  const sizeClasses = {
    sm: 'w-28 h-28',
    md: 'w-40 h-40',
    lg: 'w-52 h-52',
    xl: 'w-64 h-64',
  }

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-6xl',
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={animated ? { scale: 0.8, opacity: 0 } : {}}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className={sizeClasses[size] || sizeClasses.lg}
      >
        <CircularProgressbar
          value={score}
          text=""
          strokeWidth={8}
          styles={buildStyles({
            pathColor: color,
            trailColor: 'rgba(255,255,255,0.1)',
            strokeLinecap: 'butt',
            pathTransitionDuration: animated ? 1.2 : 0,
          })}
        />
        {/* Center text overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ position: 'relative', marginTop: '-100%' }}
        >
          <span
            className={`font-display font-black leading-none ${textSizes[size]}`}
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-cream/60 text-xs font-bold tracking-widest uppercase mt-1">
            / 100
          </span>
        </div>
      </motion.div>

      {/* Score overlay approach — positioned relative to the progress bar */}
      <motion.div
        initial={animated ? { opacity: 0, y: 10 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <span
          className="font-display text-sm font-black tracking-[0.2em] uppercase px-4 py-1 border-2"
          style={{ color, borderColor: color }}
        >
          {rating}
        </span>
      </motion.div>
    </div>
  )
}

/* Simpler inline score display for cards/tables */
export function ScoreBadge({ score }) {
  const color = getScoreHex(score)
  return (
    <span
      className="font-display font-black text-sm px-3 py-1 border-2 inline-block"
      style={{ color, borderColor: color }}
    >
      {score}
    </span>
  )
}
