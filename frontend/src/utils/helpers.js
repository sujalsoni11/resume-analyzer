import { format, parseISO } from 'date-fns'

/**
 * Format a date string like "Jan 15, 2025"
 */
export function formatDate(dateString) {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    return format(date, 'MMM d, yyyy')
  } catch {
    return 'Unknown date'
  }
}

/**
 * Format date with time: "Jan 15, 2025 at 3:45 PM"
 */
export function formatDateTime(dateString) {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString)
    return format(date, "MMM d, yyyy 'at' h:mm a")
  } catch {
    return 'Unknown date'
  }
}

/**
 * Get Tailwind text color class based on ATS score
 */
export function getScoreColor(score) {
  if (score >= 75) return 'text-lime'
  if (score >= 60) return 'text-yellow-400'
  if (score >= 40) return 'text-orange-400'
  return 'text-red-400'
}

/**
 * Get Tailwind bg color class based on ATS score
 */
export function getScoreBg(score) {
  if (score >= 75) return 'bg-lime text-dark-teal'
  if (score >= 60) return 'bg-yellow-400 text-dark-teal'
  if (score >= 40) return 'bg-orange-400 text-white'
  return 'bg-red-500 text-white'
}

/**
 * Get hex color string for score (used in charts/gauges)
 */
export function getScoreHex(score) {
  if (score >= 75) return '#C8FF00'
  if (score >= 60) return '#facc15'
  if (score >= 40) return '#fb923c'
  return '#ef4444'
}

/**
 * Get rating label based on score
 */
export function getScoreRating(score) {
  if (score >= 85) return 'EXCELLENT'
  if (score >= 75) return 'STRONG'
  if (score >= 60) return 'GOOD'
  if (score >= 40) return 'FAIR'
  return 'NEEDS WORK'
}

/**
 * Truncate text to maxLength characters, appending ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Format file size from bytes to human-readable
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Get priority badge styles
 */
export function getPriorityStyle(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return { bg: 'bg-red-500', text: 'text-white', label: 'HIGH' }
    case 'medium':
      return { bg: 'bg-yellow-400', text: 'text-dark-teal', label: 'MEDIUM' }
    case 'low':
      return { bg: 'bg-lime', text: 'text-dark-teal', label: 'LOW' }
    default:
      return { bg: 'bg-gray-500', text: 'text-white', label: priority?.toUpperCase() || 'N/A' }
  }
}

/**
 * Get difficulty badge styles for interview questions
 */
export function getDifficultyStyle(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'hard':
      return { bg: 'bg-red-500', text: 'text-white' }
    case 'medium':
      return { bg: 'bg-yellow-400', text: 'text-dark-teal' }
    case 'easy':
      return { bg: 'bg-lime', text: 'text-dark-teal' }
    default:
      return { bg: 'bg-gray-500', text: 'text-white' }
  }
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str) {
  if (!str) return ''
  return str.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}

/**
 * Generate initials from a name
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
