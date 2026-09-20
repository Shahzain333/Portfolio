import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ExternalLink, Globe, Image, Upload, X } from 'lucide-react'
import AdminField from './AdminField'
import { PROJECT_STATUSES, PROJECT_STATUS_CONFIG } from '../../constants/projectStatus'

const CATEGORIES = ['frontend', 'backend', 'fullstack', 'mernstack', 'gen-ai', 'agent', 'other']
const EMPTY = { title: '', description: '', category: 'fullstack', projectUrl: '', sourceCodeUrl: '', status: 'completed' }

function ImageUpload({ preview, error, onFile }) {
  const fileRef = useRef()
  const [drag, setDrag] = useState(false)
  const handleDrop = (event) => {
    event.preventDefault()
    setDrag(false)
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFile(file)
  }

  return (
    <>
      <div onClick={() => fileRef.current?.click()} onDragOver={event => { event.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={handleDrop}
        className="relative h-36 sm:h-48 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200"
        style={{ borderColor: error ? 'var(--clr-error)' : drag ? 'var(--clr-primary)' : 'var(--clr-border)', background: drag ? 'rgba(99,102,241,.05)' : 'var(--clr-bg-2)' }}>
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(0,0,0,.55)' }}>
              <Upload size={22} className="text-white" /><p className="text-white text-sm font-semibold">Change Image</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ color: 'var(--clr-text-3)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,.1)' }}><Image size={26} style={{ color: 'var(--clr-primary)' }} /></div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--clr-text-2)' }}>Drop image here or <span style={{ color: 'var(--clr-primary)' }}>browse</span></p>
              <p className="text-xs mt-0.5">PNG, JPG, WEBP · Max 5MB</p>
            </div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={event => { const file = event.target.files[0]; if (file) onFile(file) }} />
    </>
  )
}

export default function AdminProjectModal({ editData, onClose, onSave, saving }) {
  const [form, setForm] = useState(editData ? {
    title: editData.title || '', description: editData.description || '',
    category: Array.isArray(editData.category) ? editData.category[0] : (editData.category || 'fullstack'),
    projectUrl: editData.projectUrl || '', sourceCodeUrl: editData.sourceCodeUrl || '', status: editData.status || 'completed',
  } : { ...EMPTY })
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(editData?.imageUrl || null)
  const [errors, setErrors] = useState({})
  const set = (key, value) => setForm(previous => ({ ...previous, [key]: value }))
  const handleFile = file => { setImgFile(file); setPreview(URL.createObjectURL(file)) }

  const validate = () => {
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Project title is required'
    if (!form.description.trim()) nextErrors.description = 'Description is required'
    if (!form.projectUrl.trim()) nextErrors.projectUrl = 'Live URL is required'
    if (!form.sourceCodeUrl.trim()) nextErrors.sourceCodeUrl = 'Source URL is required'
    if (!editData && !imgFile) nextErrors.image = 'Cover image is required'
    setErrors(nextErrors)
    return !Object.keys(nextErrors).length
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (validate()) onSave(form, imgFile, editData?._id)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKeyDown = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown) }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" style={{ background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)' }} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0, scale: .95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 16 }} transition={{ duration: .2, ease: [.22, .68, 0, 1.2] }} className="card w-full max-w-2xl flex flex-col" style={{ maxHeight: 'calc(100dvh - 1rem)', boxShadow: '0 25px 60px rgba(0,0,0,.4)', overflow: 'hidden' }}>
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-7 sm:py-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--clr-border)' }}>
          <div className="min-w-0"><h3 className="text-lg font-extrabold truncate" style={{ color: 'var(--clr-text)' }}>{editData ? 'Edit Project' : 'Add New Project'}</h3><p className="text-xs mt-0.5 truncate" style={{ color: 'var(--clr-text-3)' }}>{editData ? 'Update your project details' : 'Fill in the details to showcase your work'}</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0" style={{ color: 'var(--clr-text-3)', background: 'var(--clr-bg-3)' }}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--clr-border) transparent' }}>
            <div className="space-y-5 pr-0 sm:space-y-6 sm:pr-2">
              <AdminField label="Cover Image" required={!editData} error={errors.image} hint={editData ? 'Leave empty to keep current' : undefined}><ImageUpload preview={preview} error={errors.image} onFile={handleFile} /></AdminField>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <AdminField label="Project Title" required error={errors.title}><input className={`input ${errors.title ? 'error' : ''}`} placeholder="e.g. E-Commerce Platform" value={form.title} onChange={event => set('title', event.target.value)} /></AdminField>
                <AdminField label="Category"><select className="input" value={form.category} onChange={event => set('category', event.target.value)}>{CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}</select></AdminField>
              </div>
              <AdminField label="Description" required error={errors.description} hint={`${form.description.length}/300`}><textarea className="input resize-none leading-relaxed" rows={3} maxLength={300} placeholder="Briefly describe what this project does…" value={form.description} onChange={event => set('description', event.target.value)} /></AdminField>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <AdminField label="Live URL" required error={errors.projectUrl}><div className="relative"><Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-text-3)' }} /><input className={`input pl-9 ${errors.projectUrl ? 'error' : ''}`} type="url" placeholder="https://myproject.com" value={form.projectUrl} onChange={event => set('projectUrl', event.target.value)} /></div></AdminField>
                <AdminField label="Source Code URL" required error={errors.sourceCodeUrl}><div className="relative"><ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-text-3)' }} /><input className={`input pl-9 ${errors.sourceCodeUrl ? 'error' : ''}`} type="url" placeholder="https://github.com/user/repo" value={form.sourceCodeUrl} onChange={event => set('sourceCodeUrl', event.target.value)} /></div></AdminField>
              </div>
              <AdminField label="Project Status"><div className="flex gap-3 flex-wrap">{PROJECT_STATUSES.map(status => { const config = PROJECT_STATUS_CONFIG[status]; const StatusIcon = config.icon; const selected = form.status === status; return <button key={status} type="button" onClick={() => set('status', status)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all" style={{ background: selected ? config.bg : 'var(--clr-bg-3)', color: selected ? config.color : 'var(--clr-text-3)', border: `1.5px solid ${selected ? config.color + '40' : 'var(--clr-border)'}`, transform: selected ? 'scale(1.03)' : 'scale(1)' }}><StatusIcon size={13} />{config.label}</button> })}</div></AdminField>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 flex-shrink-0" style={{ borderTop: '1px solid var(--clr-border)', background: 'var(--clr-bg-card)' }}><p className="text-xs" style={{ color: 'var(--clr-text-3)' }}>Fields marked <span style={{ color: 'var(--clr-error)' }}>*</span> are required</p><div className="flex w-full gap-3 sm:w-auto"><button type="button" onClick={onClose} className="btn btn-ghost flex-1 sm:flex-none">Cancel</button><button type="submit" disabled={saving} className="btn btn-primary flex-1 sm:flex-none">{saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><Check size={15} />{editData ? 'Save Changes' : 'Add Project'}</>}</button></div></div>
        </form>
      </motion.div>
    </div>
  )
}
