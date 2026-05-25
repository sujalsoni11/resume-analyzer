import React from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { formatFileSize } from '../../utils/helpers.js'

export default function DropZone({ onFileAccepted, file, onRemove }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropAccepted: (files) => onFileAccepted(files[0]),
  })

  const rejectionError = fileRejections[0]?.errors[0]

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {file ? (
          /* File Selected State */
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-2 border-lime bg-dark-teal p-6 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-lime flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-dark-teal" />
              </div>
              <div>
                <p className="font-bold text-cream text-sm truncate max-w-[280px]">{file.name}</p>
                <p className="text-cream/60 text-xs mt-0.5">{formatFileSize(file.size)} · PDF</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-lime" />
              <button
                onClick={onRemove}
                className="w-8 h-8 flex items-center justify-center text-cream/60 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Drop Zone State */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={[
                'border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200',
                isDragActive && !isDragReject
                  ? 'border-lime bg-lime/5 scale-[1.01]'
                  : isDragReject
                  ? 'border-red-500 bg-red-500/5'
                  : 'border-dark-teal hover:border-lime hover:bg-lime/5',
              ].join(' ')}
            >
              <input {...getInputProps()} />

              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center gap-4"
              >
                <div className={[
                  'w-20 h-20 flex items-center justify-center border-2 transition-colors',
                  isDragActive ? 'border-lime bg-lime/10' : 'border-dark-teal',
                ].join(' ')}>
                  <Upload className={`w-9 h-9 transition-colors ${isDragActive ? 'text-lime' : 'text-dark-teal dark:text-cream'}`} />
                </div>

                <div>
                  <p className="font-display text-3xl font-black text-dark-teal dark:text-cream uppercase tracking-tight">
                    {isDragReject
                      ? 'INVALID FILE'
                      : isDragActive
                      ? 'DROP IT!'
                      : 'DRAG YOUR RESUME HERE'}
                  </p>
                  <p className="text-dark-teal/60 dark:text-cream/60 text-sm mt-2">
                    {isDragReject
                      ? 'Only PDF files are accepted'
                      : 'or click to browse — PDF only, max 5MB'}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 border border-dark-teal/40 text-xs font-bold uppercase tracking-widest text-dark-teal/60 dark:text-cream/60">
                    PDF ✓
                  </span>
                  <span className="px-3 py-1 border border-dark-teal/20 text-xs font-bold uppercase tracking-widest text-dark-teal/30 dark:text-cream/30 relative">
                    DOCX
                    <span className="ml-1 text-[10px] text-lime">SOON</span>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Rejection error */}
            <AnimatePresence>
              {rejectionError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mt-3 px-4 py-3 bg-red-500/10 border border-red-500"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-red-500 text-sm font-medium">
                    {rejectionError.code === 'file-too-large'
                      ? 'File is too large. Max size is 5MB.'
                      : rejectionError.code === 'file-invalid-type'
                      ? 'Invalid file type. Please upload a PDF.'
                      : rejectionError.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
