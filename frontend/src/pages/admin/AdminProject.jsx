import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Image, Globe, ExternalLink, Search, Upload, Check, Rocket } from 'lucide-react'
import useProjectActions from '../../hooks/useProjectActions'
import Loader from '../../components/Loader'

const CATEGORIES    = ['frontend','backend','fullstack','mernstack','gen-ai','agent','other']
const STATUSES      = ['completed','in-progress','archived']
const EMPTY         = { title:'', description:'', category:'fullstack', projectUrl:'', sourceCodeUrl:'', status:'completed' }
const STATUS_CONFIG = {
  completed:    { bg:'rgba(16,185,129,.12)',  color:'#10b981', label:'Completed'   },
  'in-progress':{ bg:'rgba(245,158,11,.12)',  color:'#f59e0b', label:'In Progress' },
  archived:     { bg:'rgba(148,163,184,.12)', color:'#94a3b8', label:'Archived'    },
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-widest" style={{ color:'var(--clr-text-2)' }}>
          {label}{required && <span style={{ color:'var(--clr-error)' }}> *</span>}
        </label>
        {hint && <span className="text-xs" style={{ color:'var(--clr-text-3)' }}>{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="text-xs flex items-center gap-1" style={{ color:'var(--clr-error)' }}>
            <span className="w-3 h-3 rounded-full inline-flex items-center justify-center text-white"
              style={{ background:'var(--clr-error)', fontSize:'8px' }}>!</span>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function ImageUpload({ preview, error, onFile }) {
  const fileRef = useRef()
  const [drag, setDrag] = useState(false)
  const handleDrop = e => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) onFile(f)
  }
  return (
    <>
      <div onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)} onDrop={handleDrop}
        className="relative h-48 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-200"
        style={{ borderColor: error ? 'var(--clr-error)' : drag ? 'var(--clr-primary)' : 'var(--clr-border)', background: drag ? 'rgba(99,102,241,.05)' : 'var(--clr-bg-2)' }}>
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity duration-200" style={{ background:'rgba(0,0,0,.55)' }}>
              <Upload size={22} className="text-white" /><p className="text-white text-sm font-semibold">Change Image</p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ color:'var(--clr-text-3)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background:'rgba(99,102,241,.1)' }}>
              <Image size={26} style={{ color:'var(--clr-primary)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color:'var(--clr-text-2)' }}>Drop image here or <span style={{ color:'var(--clr-primary)' }}>browse</span></p>
              <p className="text-xs mt-0.5">PNG, JPG, WEBP · Max 5MB</p>
            </div>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) onFile(f) }} />
    </>
  )
}

function ProjectModal({ editData, onClose, onSave, saving }) {
  const [form, setForm] = useState(editData ? {
    title: editData.title||'', description: editData.description||'',
    category: Array.isArray(editData.category) ? editData.category[0] : (editData.category||'fullstack'),
    projectUrl: editData.projectUrl||'', sourceCodeUrl: editData.sourceCodeUrl||'',
    status: editData.status||'completed',
  } : { ...EMPTY })
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(editData?.imageUrl||null)
  const [errors,  setErrors]  = useState({})
  const set = (k,v) => setForm(p => ({ ...p, [k]:v }))
  const handleFile = f => { setImgFile(f); setPreview(URL.createObjectURL(f)) }

  const validate = () => {
    const e = {}
    if (!form.title.trim())         e.title         = 'Project title is required'
    if (!form.description.trim())   e.description   = 'Description is required'
    if (!form.projectUrl.trim())    e.projectUrl    = 'Live URL is required'
    if (!form.sourceCodeUrl.trim()) e.sourceCodeUrl = 'Source URL is required'
    if (!editData && !imgFile)      e.image         = 'Cover image is required'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validate()) return
    // Pass form data and image file separately — hook builds FormData
    onSave(form, imgFile, editData?._id)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,.7)', backdropFilter:'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity:0, scale:.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:.95, y:16 }} transition={{ duration:.2, ease:[.22,.68,0,1.2] }}
        className="card w-full max-w-2xl flex flex-col"
        style={{ maxHeight:'90vh', boxShadow:'0 25px 60px rgba(0,0,0,.4)', overflow:'hidden' }}>

        {/* Sticky header */}
        <div className="flex items-center justify-between px-7 py-5 flex-shrink-0" style={{ borderBottom:'1px solid var(--clr-border)' }}>
          <div>
            <h3 className="text-lg font-extrabold" style={{ color:'var(--clr-text)' }}>{editData ? 'Edit Project' : 'Add New Project'}</h3>
            <p className="text-xs mt-0.5" style={{ color:'var(--clr-text-3)' }}>{editData ? 'Update your project details' : 'Fill in the details to showcase your work'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{ color:'var(--clr-text-3)', background:'var(--clr-bg-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,.1)'; e.currentTarget.style.color='var(--clr-error)' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--clr-bg-3)'; e.currentTarget.style.color='var(--clr-text-3)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-7 py-6" style={{ scrollbarWidth:'thin', scrollbarColor:'var(--clr-border) transparent' }}>
            <div className="space-y-6 pr-2">

              <Field label="Cover Image" required={!editData} error={errors.image} hint={editData ? 'Leave empty to keep current' : undefined}>
                <ImageUpload preview={preview} error={errors.image} onFile={handleFile} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Project Title" required error={errors.title}>
                  <input className={`input ${errors.title?'error':''}`} placeholder="e.g. E-Commerce Platform"
                    value={form.title} onChange={e=>set('title',e.target.value)} />
                </Field>
                <Field label="Category">
                  <select className="input" value={form.category} onChange={e=>set('category',e.target.value)}>
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Description" required error={errors.description} hint={`${form.description.length}/300`}>
                <textarea className="input resize-none leading-relaxed" rows={3} maxLength={300}
                  placeholder="Briefly describe what this project does…"
                  value={form.description} onChange={e=>set('description',e.target.value)} />
              </Field>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Live URL" required error={errors.projectUrl}>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--clr-text-3)' }} />
                    <input className={`input pl-9 ${errors.projectUrl?'error':''}`} type="url" placeholder="https://myproject.com"
                      value={form.projectUrl} onChange={e=>set('projectUrl',e.target.value)} />
                  </div>
                </Field>
                <Field label="Source Code URL" required error={errors.sourceCodeUrl}>
                  <div className="relative">
                    <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--clr-text-3)' }} />
                    <input className={`input pl-9 ${errors.sourceCodeUrl?'error':''}`} type="url" placeholder="https://github.com/user/repo"
                      value={form.sourceCodeUrl} onChange={e=>set('sourceCodeUrl',e.target.value)} />
                  </div>
                </Field>
              </div>

              <Field label="Project Status">
                <div className="flex gap-3 flex-wrap">
                  {STATUSES.map(s => {
                    const cfg = STATUS_CONFIG[s]; const selected = form.status === s
                    return (
                      <button key={s} type="button" onClick={()=>set('status',s)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background:selected?cfg.bg:'var(--clr-bg-3)', color:selected?cfg.color:'var(--clr-text-3)', border:`1.5px solid ${selected?cfg.color+'40':'var(--clr-border)'}`, transform:selected?'scale(1.03)':'scale(1)' }}>
                        {selected && <Check size={11} />}{cfg.label}
                      </button>
                    )
                  })}
                </div>
              </Field>

            </div>
          </div>

          {/* Sticky footer */}
          <div className="flex items-center justify-between px-7 py-4 flex-shrink-0" style={{ borderTop:'1px solid var(--clr-border)', background:'var(--clr-bg-card)' }}>
            <p className="text-xs" style={{ color:'var(--clr-text-3)' }}>Fields marked <span style={{ color:'var(--clr-error)' }}>*</span> are required</p>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary">
                {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><Check size={15}/>{editData?'Save Changes':'Add Project'}</>}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function ConfirmDelete({ title, onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = e => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,.7)', backdropFilter:'blur(8px)' }}>
      <motion.div initial={{ opacity:0, scale:.92 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.92 }}
        className="card p-7 max-w-sm w-full" style={{ boxShadow:'0 25px 60px rgba(0,0,0,.4)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background:'rgba(239,68,68,.1)' }}>
          <Trash2 size={22} style={{ color:'var(--clr-error)' }} />
        </div>
        <h3 className="text-lg font-extrabold mb-2" style={{ color:'var(--clr-text)' }}>Delete Project?</h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color:'var(--clr-text-2)' }}>
          <strong style={{ color:'var(--clr-text)' }}>"{title}"</strong> will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-ghost flex-1">Keep It</button>
          <button onClick={onConfirm} className="btn btn-danger flex-1">Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  )
}

function ProjectCard({ project: p, onEdit, onDelete }) {
  const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean)
  const st   = STATUS_CONFIG[p.status] || STATUS_CONFIG.completed
  return (
    <motion.div layout initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:.95 }}
      className="card group overflow-hidden" style={{ cursor:'default' }}>
      <div className="relative h-44 overflow-hidden" style={{ background:'var(--grad-card)' }}>
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          : <div className="w-full h-full flex items-center justify-center"><Rocket size={36} style={{ color:'var(--clr-text-3)' }} /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-3 left-3 badge text-xs font-bold" style={{ backdropFilter:'blur(8px)', background:'rgba(0,0,0,.4)', color:'#fff' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background:st.color }} />{st.label}
        </span>
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <button onClick={() => onEdit(p)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(255,255,255,.2)' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,.8)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}>
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(p)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', color:'#fff', border:'1px solid rgba(255,255,255,.2)' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,.8)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">{cats.map(c=><span key={c} className="badge badge-primary" style={{ fontSize:'0.65rem', padding:'0.2rem 0.6rem' }}>{c}</span>)}</div>
        <h3 className="font-bold text-sm mb-1.5 truncate" style={{ color:'var(--clr-text)' }}>{p.title}</h3>
        <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color:'var(--clr-text-2)' }}>{p.description}</p>
        <div className="flex items-center gap-3 pt-3.5" style={{ borderTop:'1px solid var(--clr-border)' }}>
          {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color:'var(--clr-primary)' }}><Globe size={12}/> Live Demo</a>}
          {p.sourceCodeUrl && <a href={p.sourceCodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color:'var(--clr-text-2)' }}><ExternalLink size={12}/> Source</a>}
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminProject() {
  const { fetchProjects, createProject, editProject, removeProjects } = useProjectActions()
  const { items: projects, loading } = useSelector(s => s.projects)
  const [showModal,    setShowModal]  = useState(false)
  const [editData,     setEditData]   = useState(null)
  const [deleteProj,   setDeleteProj] = useState(null)
  const [saving,       setSaving]     = useState(false)
  const [search,       setSearch]     = useState('')
  const [activeFilter, setFilter]     = useState('all')

  useEffect(() => { fetchProjects(1, 100) }, [])

  const filtered = projects
    .filter(p => activeFilter === 'all' || p.status === activeFilter)
    .filter(p => !search.trim() || p.title?.toLowerCase().includes(search.toLowerCase()))

  const stats = STATUSES.reduce((acc,s) => { acc[s] = projects.filter(p=>p.status===s).length; return acc }, {})

  // Updated signature: createProject(formData, imageFile)
  const handleSave = async (formData, imageFile, id) => {
    setSaving(true)
    const ok = id
      ? await editProject(id, formData, imageFile)
      : await createProject(formData, imageFile)
    setSaving(false)
    if (ok) { setShowModal(false); setEditData(null) }
  }

  const handleDelete = async () => {
    if (!deleteProj) return
    await removeProjects(deleteProj._id)
    setDeleteProj(null)
  }

  const openAdd  = () => { setEditData(null); setShowModal(true) }
  const openEdit = p  => { setEditData(p); setShowModal(true) }

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold mb-0.5" style={{ color:'var(--clr-text)' }}>Projects</h1>
          <p className="text-sm" style={{ color:'var(--clr-text-3)' }}>{projects.length} project{projects.length!==1?'s':''} in your portfolio</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={16}/> Add Project</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total',       val:projects.length,             color:'var(--clr-primary)', filter:'all'         },
          { label:'Completed',   val:stats.completed||0,          color:'#10b981',            filter:'completed'   },
          { label:'In Progress', val:stats['in-progress']||0,     color:'#f59e0b',            filter:'in-progress' },
          { label:'Archived',    val:stats.archived||0,           color:'#94a3b8',            filter:'archived'    },
        ].map(({ label, val, color, filter }) => (
          <button key={label} onClick={()=>setFilter(filter)} className="card p-4 text-left transition-all"
            style={{ borderColor:activeFilter===filter?color:'var(--clr-border)', background:activeFilter===filter?`${color}0d`:'var(--clr-bg-card)' }}>
            <div className="text-2xl font-extrabold mb-0.5" style={{ color }}>{val}</div>
            <div className="text-xs font-medium" style={{ color:'var(--clr-text-3)' }}>{label}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--clr-text-3)' }} />
          <input type="text" placeholder="Search projects…" value={search} onChange={e=>setSearch(e.target.value)} className="input pl-10 pr-10" />
          {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--clr-text-3)' }}><X size={14}/></button>}
        </div>
        {search && <p className="text-sm" style={{ color:'var(--clr-text-3)' }}>{filtered.length} result{filtered.length!==1?'s':''}</p>}
      </div>

      {loading ? <Loader /> : filtered.length === 0 ? (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background:'rgba(99,102,241,.08)' }}>
            <Rocket size={28} style={{ color:'var(--clr-primary)' }} />
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color:'var(--clr-text)' }}>{search?'No projects found':'No projects yet'}</h3>
          <p className="text-sm mb-6" style={{ color:'var(--clr-text-3)' }}>{search?`No results for "${search}". Try a different keyword.`:'Add your first project to showcase your work.'}</p>
          {!search && <button onClick={openAdd} className="btn btn-primary mx-auto"><Plus size={15}/> Add Your First Project</button>}
        </motion.div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>{filtered.map(p=><ProjectCard key={p._id} project={p} onEdit={openEdit} onDelete={setDeleteProj}/>)}</AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <ProjectModal editData={editData} saving={saving} onClose={()=>{ setShowModal(false); setEditData(null) }} onSave={handleSave}/>}
        {deleteProj && <ConfirmDelete title={deleteProj.title} onConfirm={handleDelete} onCancel={()=>setDeleteProj(null)}/>}
      </AnimatePresence>
    </div>
  )
}
