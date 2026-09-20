import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

export default function ConfirmDelete({ title, itemLabel = 'Item', onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKeyDown = event => { if (event.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown) }
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .92 }} className="card p-7 max-w-sm w-full" style={{ boxShadow: '0 25px 60px rgba(0,0,0,.4)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'rgba(239,68,68,.1)' }}><Trash2 size={22} style={{ color: 'var(--clr-error)' }} /></div>
        <h3 className="text-lg font-extrabold mb-2" style={{ color: 'var(--clr-text)' }}>Delete {itemLabel}?</h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--clr-text-2)' }}><strong style={{ color: 'var(--clr-text)' }}>&quot;{title}&quot;</strong> will be permanently deleted. This cannot be undone.</p>
        <div className="flex gap-3"><button onClick={onCancel} className="btn btn-ghost flex-1">Keep It</button><button onClick={onConfirm} className="btn btn-danger flex-1">Yes, Delete</button></div>
      </motion.div>
    </div>
  )
}
