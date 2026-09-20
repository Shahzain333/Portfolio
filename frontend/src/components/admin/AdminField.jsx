import { motion, AnimatePresence } from 'framer-motion'

export default function AdminField({ label, required, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--clr-text-2)' }}>
          {label}{required && <span style={{ color: 'var(--clr-error)' }}> *</span>}
        </label>
        {hint && <span className="text-xs" style={{ color: 'var(--clr-text-3)' }}>{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs flex items-center gap-1" style={{ color: 'var(--clr-error)' }}>
            <span className="w-3 h-3 rounded-full inline-flex items-center justify-center text-white" style={{ background: 'var(--clr-error)', fontSize: '8px' }}>!</span>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
