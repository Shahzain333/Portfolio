import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Braces, Palette, Server, Database, Rocket, Wrench, Package, Layers3 } from 'lucide-react'
import useSkillActions from '../../hooks/useSkillActions'
import Loader from '../../components/Loader'
import AdminField from '../../components/admin/AdminField'

const CATS  = ['language','frontend','backend','database','devops','tools','other']
const PROFS = ['beginner','intermediate','advanced','expert']
const CAT_LABELS = {
  language:'Languages', frontend:'Frontend', backend:'Backend',
  database:'Database',  devops:'DevOps',    tools:'Tools',   other:'Other',
}
const CAT_ICONS = { language: Braces, frontend: Palette, backend: Server, database: Database, devops: Rocket, tools: Wrench, other: Package }
const PROF_COLORS = {
  beginner:    { bg:'rgba(148,163,184,.12)', color:'#94a3b8' },
  intermediate:{ bg:'rgba(59,130,246,.12)',  color:'#60a5fa' },
  advanced:    { bg:'rgba(99,102,241,.12)',   color:'var(--clr-primary)' },
  expert:      { bg:'rgba(168,85,247,.12)',   color:'var(--clr-accent)'  },
}
const EMPTY = { name:'', category:'frontend', proficiency:'intermediate', iconUrl:'' }

function SkillModal({ editData, onClose, onSave, saving }) {
  const [form, setForm] = useState(editData
    ? { name:editData.name, category:editData.category, proficiency:editData.proficiency, iconUrl:editData.iconUrl||'' }
    : { ...EMPTY })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(p => ({ ...p, [k]:v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Skill name is required'
    if (!form.category)        e.category = 'Category is required'
    if (!form.proficiency)     e.proficiency = 'Proficiency is required'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validate()) return
    onSave(form, editData?._id)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ background:'rgba(0,0,0,.7)', backdropFilter:'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }}
        exit={{ opacity:0, scale:.95 }} transition={{ duration:.18 }}
        className="card w-full max-w-md max-h-[calc(100dvh-1rem)] overflow-y-auto" style={{ boxShadow:'0 25px 60px rgba(0,0,0,.4)' }}>

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5" style={{ borderBottom:'1px solid var(--clr-border)' }}>
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold truncate" style={{ color:'var(--clr-text)' }}>
              {editData ? 'Edit Skill' : 'Add Skill'}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color:'var(--clr-text-3)' }}>
              {editData ? 'Update skill details' : 'Add a technology to your stack'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ color:'var(--clr-text-3)', background:'var(--clr-bg-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,.1)'; e.currentTarget.style.color='var(--clr-error)' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--clr-bg-3)'; e.currentTarget.style.color='var(--clr-text-3)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <AdminField label="Skill Name" required error={errors.name}>
            <input className={`input ${errors.name?'error':''}`}
              placeholder="e.g. React, Node.js, Python"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </AdminField>

          <div className="grid sm:grid-cols-2 gap-4">
            <AdminField label="Category" required error={errors.category}>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </AdminField>
            <AdminField label="Proficiency" required error={errors.proficiency}>
              <select className="input" value={form.proficiency} onChange={e => set('proficiency', e.target.value)}>
                {PROFS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </AdminField>
          </div>

          <AdminField label="Icon URL (optional)">
            <input type="url" className="input" placeholder="https://cdn.example.com/icon.svg"
              value={form.iconUrl} onChange={e => set('iconUrl', e.target.value)} />
            {form.iconUrl && (
              <div className="flex items-center gap-2 mt-2 text-xs" style={{ color:'var(--clr-text-3)' }}>
                <img src={form.iconUrl} alt="preview" className="w-5 h-5 object-contain"
                  onError={e => { e.target.style.display='none' }} />
                Icon preview
              </div>
            )}
          </AdminField>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : <><Check size={14} /> {editData ? 'Save Changes' : 'Add Skill'}</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function ConfirmDialog({ name, onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = e => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,.7)', backdropFilter:'blur(8px)' }}>
      <motion.div initial={{ opacity:0, scale:.92 }} animate={{ opacity:1, scale:1 }}
        exit={{ opacity:0, scale:.92 }} transition={{ duration:.18 }}
        className="card p-6 max-w-sm w-full" style={{ boxShadow:'0 25px 60px rgba(0,0,0,.4)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background:'rgba(239,68,68,.1)' }}>
          <Trash2 size={22} style={{ color:'var(--clr-error)' }} />
        </div>
        <h3 className="font-extrabold text-lg mb-2" style={{ color:'var(--clr-text)' }}>Delete Skill?</h3>
        <p className="text-sm mb-6 leading-relaxed" style={{ color:'var(--clr-text-2)' }}>
          <strong style={{ color:'var(--clr-text)' }}>"{name}"</strong> will be permanently removed from your stack.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-ghost flex-1">Keep It</button>
          <button onClick={onConfirm} className="btn btn-danger flex-1">Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminSkill() {
  const { fetchSkills, createSkill, editSkill, removeSkills } = useSkillActions()
  const { items, loading } = useSelector(s => s.skills)

  const [showModal,  setShowModal]  = useState(false)
  const [editData,   setEditData]   = useState(null)
  const [deleteSkill,setDeleteSkill]= useState(null)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => { fetchSkills(1, 100) }, [])

  const grouped = items.reduce((acc, s) => {
    const c = s.category || 'other'
    if (!acc[c]) acc[c] = []
    acc[c].push(s)
    return acc
  }, {})
  const sortedCats = CATS.filter(c => grouped[c])

  const handleSave = async (data, id) => {
    setSaving(true)
    const ok = id ? await editSkill(id, data) : await createSkill(data)
    setSaving(false)
    if (ok) { setShowModal(false); setEditData(null) }
  }

  const handleDelete = async () => {
    await removeSkills(deleteSkill._id)
    setDeleteSkill(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold mb-0.5" style={{ color:'var(--clr-text)' }}>Skills</h1>
          <p className="text-sm" style={{ color:'var(--clr-text-3)' }}>{items.length} skill{items.length!==1?'s':''} in your stack</p>
        </div>
        <button onClick={() => { setEditData(null); setShowModal(true) }} className="btn btn-primary">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Content */}
      {loading ? <Loader /> : items.length === 0 ? (
        <div className="card p-16 text-center">
          <Wrench size={38} className="mx-auto mb-4" style={{ color:'var(--clr-primary)' }} />
          <h3 className="font-bold text-lg mb-2" style={{ color:'var(--clr-text)' }}>No skills yet</h3>
          <p className="text-sm mb-6" style={{ color:'var(--clr-text-3)' }}>Add the technologies you work with.</p>
          <button onClick={() => { setEditData(null); setShowModal(true) }} className="btn btn-primary mx-auto">
            <Plus size={15} /> Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedCats.map(cat => (
            <div key={cat}>
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color:'var(--clr-text-3)' }}>
                {(() => { const Icon = CAT_ICONS[cat] || Layers3; return <Icon size={15} style={{ color:'var(--clr-primary)' }} /> })()}
                {CAT_LABELS[cat] || cat}
              </h2>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {grouped[cat].map(s => {
                    const pc = PROF_COLORS[s.proficiency] || PROF_COLORS.intermediate
                    return (
                      <motion.div key={s._id} layout
                        initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
                        exit={{ opacity:0, scale:.9 }}
                        className="group flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl transition-all"
                        style={{ background:'var(--clr-bg-card)', border:'1px solid var(--clr-border)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor='var(--clr-primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor='var(--clr-border)'}>
                        {s.iconUrl && (
                          <img src={s.iconUrl} alt={s.name} className="w-4 h-4 object-contain flex-shrink-0"
                            onError={e => { e.target.style.display='none' }} />
                        )}
                        <span className="text-sm font-medium" style={{ color:'var(--clr-text)' }}>{s.name}</span>
                        <span className="badge text-xs" style={{ background:pc.bg, color:pc.color, border:`1px solid ${pc.bg}`, fontSize:'0.6rem', padding:'0.15rem 0.5rem' }}>
                          {s.proficiency}
                        </span>
                        {/* Actions — reveal on hover */}
                        <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditData(s); setShowModal(true) }}
                            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                            style={{ color:'var(--clr-text-3)' }}
                            onMouseEnter={e => { e.currentTarget.style.color='var(--clr-primary)'; e.currentTarget.style.background='rgba(99,102,241,.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color='var(--clr-text-3)'; e.currentTarget.style.background='transparent' }}>
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => setDeleteSkill(s)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                            style={{ color:'var(--clr-text-3)' }}
                            onMouseEnter={e => { e.currentTarget.style.color='var(--clr-error)'; e.currentTarget.style.background='rgba(239,68,68,.1)' }}
                            onMouseLeave={e => { e.currentTarget.style.color='var(--clr-text-3)'; e.currentTarget.style.background='transparent' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <SkillModal editData={editData} saving={saving}
            onClose={() => { setShowModal(false); setEditData(null) }}
            onSave={handleSave} />
        )}
        {deleteSkill && (
          <ConfirmDialog name={deleteSkill.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteSkill(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
