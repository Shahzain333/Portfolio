import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Calendar, Briefcase } from 'lucide-react'
import useExperienceActions from '../../hooks/useExperienceActions'
import Loader from '../../components/Loader'
import AdminField from '../../components/admin/AdminField'

// ── Must match backend enum exactly ─────────────────────────────────────────
const EMP_TYPES = ['full-time','part-time','internship','freelance','contract']

const EMP_COLORS = {
  'full-time':  { bg:'rgba(59,130,246,.12)',  color:'#60a5fa'            },
  'part-time':  { bg:'rgba(245,158,11,.12)',  color:'var(--clr-warning)' },
  internship:   { bg:'rgba(16,185,129,.12)',  color:'var(--clr-success)' },
  freelance:    { bg:'rgba(168,85,247,.12)',  color:'var(--clr-accent)'  },
  contract:     { bg:'rgba(249,115,22,.12)',  color:'#fb923c'            },
}

// Convert ISO date → input[type=date] value (YYYY-MM-DD)
const toInputDate = d => d ? new Date(d).toISOString().split('T')[0] : ''

// Format for display
const fmtDate = d => d
  ? new Date(d).toLocaleDateString('en-US', { month:'short', year:'numeric' })
  : ''

// Duration string
const duration = (start, end, isCurrent) => {
  if (!start) return ''
  const s = new Date(start)
  const e = isCurrent ? new Date() : new Date(end)
  const m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
  if (m < 1)  return '< 1 mo'
  if (m < 12) return `${m} mo${m > 1 ? 's' : ''}`
  const y = Math.floor(m / 12), r = m % 12
  return r ? `${y}y ${r}mo` : `${y} yr${y > 1 ? 's' : ''}`
}

const EMPTY = {
  companyName: '', role: '', position: '', description: '',
  startDate: '', endDate: '', employmentType: 'full-time', isCurrent: false,
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function ExperienceModal({ editData, onClose, onSave, saving }) {
  const [form, setForm] = useState(editData ? {
    companyName:    editData.companyName    || '',
    role:           editData.role           || '',
    position:       editData.position       || '',
    description:    editData.description    || '',
    startDate:      toInputDate(editData.startDate),
    endDate:        toInputDate(editData.endDate),
    employmentType: editData.employmentType || 'full-time',
    isCurrent:      !!editData.isCurrent,
  } : { ...EMPTY })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const toggleCurrent = checked => setForm(p => ({
    ...p,
    isCurrent: checked,
    endDate: checked ? '' : p.endDate, // clear endDate when switching to current
  }))

  const validate = () => {
    const e = {}
    if (!form.companyName.trim())    e.companyName    = 'Company name is required'
    if (!form.role.trim())           e.role           = 'Role is required'
    if (!form.position.trim())       e.position       = 'Position is required'
    if (!form.startDate)             e.startDate      = 'Start date is required'
    if (!form.employmentType)        e.employmentType = 'Employment type is required'

    // Backend rule: if isCurrent=true → endDate must NOT be sent
    // Backend rule: if isCurrent=false → endDate IS required
    if (!form.isCurrent && !form.endDate) {
      e.endDate = 'End date is required when not currently working'
    }

    // Backend rule: startDate must be before endDate
    if (form.startDate && form.endDate && !form.isCurrent) {
      if (new Date(form.startDate) >= new Date(form.endDate)) {
        e.endDate = 'End date must be after start date'
      }
    }

    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validate()) return

    // Build payload — backend will reject endDate if isCurrent=true
    const payload = {
      companyName:    form.companyName.trim(),
      role:           form.role.trim(),
      position:       form.position.trim(),
      description:    form.description.trim(),
      startDate:      form.startDate,
      isCurrent:      form.isCurrent,
      employmentType: form.employmentType,
    }
    // Only include endDate when not current
    if (!form.isCurrent && form.endDate) {
      payload.endDate = form.endDate
    }

    onSave(payload, editData?._id)
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

      <motion.div initial={{ opacity:0, scale:.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:.95, y:16 }} transition={{ duration:.2, ease:[.22,.68,0,1.2] }}
        className="card w-full max-w-2xl flex flex-col"
        style={{ maxHeight:'calc(100dvh - 1rem)', boxShadow:'0 25px 60px rgba(0,0,0,.4)', overflow:'hidden' }}>

        {/* Sticky header */}
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-7 sm:py-5 flex-shrink-0"
          style={{ borderBottom:'1px solid var(--clr-border)' }}>
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold truncate" style={{ color:'var(--clr-text)' }}>
              {editData ? 'Edit Experience' : 'Add Experience'}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color:'var(--clr-text-3)' }}>
              {editData ? 'Update work experience details' : 'Add a new work experience to your timeline'}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{ color:'var(--clr-text-3)', background:'var(--clr-bg-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,.1)'; e.currentTarget.style.color='var(--clr-error)' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--clr-bg-3)'; e.currentTarget.style.color='var(--clr-text-3)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6"
            style={{ scrollbarWidth:'thin', scrollbarColor:'var(--clr-border) transparent' }}>
            <div className="space-y-5 pr-0 sm:pr-2">

              {/* Company + Employment type */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <AdminField label="Company Name" required error={errors.companyName}>
                  <input className={`input ${errors.companyName ? 'error' : ''}`}
                    placeholder="e.g. Google, Meta, Freelance"
                    value={form.companyName} onChange={e => set('companyName', e.target.value)} />
                </AdminField>
                <AdminField label="Employment Type" required error={errors.employmentType}>
                  <select className="input" value={form.employmentType}
                    onChange={e => set('employmentType', e.target.value)}>
                    {EMP_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </AdminField>
              </div>

              {/* Role + Position */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <AdminField label="Role / Job Title" required error={errors.role}>
                  <input className={`input ${errors.role ? 'error' : ''}`}
                    placeholder="e.g. Software Engineer"
                    value={form.role} onChange={e => set('role', e.target.value)} />
                </AdminField>
                <AdminField label="Position / Level" required error={errors.position}>
                  <input className={`input ${errors.position ? 'error' : ''}`}
                    placeholder="e.g. Senior, Mid-level, Intern"
                    value={form.position} onChange={e => set('position', e.target.value)} />
                </AdminField>
              </div>

              {/* Description */}
              <AdminField label="Description" hint={`${form.description.length}/3000`}>
                <textarea className="input resize-none leading-relaxed" rows={3} maxLength={3000}
                  placeholder="What did you work on? Key responsibilities and achievements…"
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </AdminField>

              {/* Currently working toggle */}
              <div className="flex items-center gap-3 py-1">
                <button type="button"
                  onClick={() => toggleCurrent(!form.isCurrent)}
                  className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                  style={{ background: form.isCurrent ? 'var(--clr-primary)' : 'var(--clr-bg-3)', border:'1px solid var(--clr-border)' }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                    style={{ left: form.isCurrent ? 'calc(100% - 1.35rem)' : '0.1rem' }} />
                </button>
                <div>
                  <p className="text-sm font-semibold" style={{ color:'var(--clr-text)' }}>
                    I currently work here
                  </p>
                  <p className="text-xs" style={{ color:'var(--clr-text-3)' }}>
                    Enabling this will remove the end date requirement
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <AdminField label="Start Date" required error={errors.startDate}>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color:'var(--clr-text-3)' }} />
                    <input type="date" className={`input pl-9 ${errors.startDate ? 'error' : ''}`}
                      value={form.startDate} onChange={e => set('startDate', e.target.value)} />
                  </div>
                </AdminField>
                <AdminField
                  label={form.isCurrent ? 'End Date (not required)' : 'End Date'}
                  required={!form.isCurrent}
                  error={errors.endDate}>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: form.isCurrent ? 'var(--clr-text-3)' : 'var(--clr-text-3)', opacity: form.isCurrent ? .4 : 1 }} />
                    <input type="date"
                      className={`input pl-9 ${errors.endDate ? 'error' : ''}`}
                      style={{ opacity: form.isCurrent ? .45 : 1, cursor: form.isCurrent ? 'not-allowed' : 'auto' }}
                      disabled={form.isCurrent}
                      min={form.startDate || undefined}
                      value={form.endDate} onChange={e => set('endDate', e.target.value)} />
                  </div>
                </AdminField>
              </div>

            </div>
          </div>

          {/* Sticky footer */}
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 flex-shrink-0"
            style={{ borderTop:'1px solid var(--clr-border)', background:'var(--clr-bg-card)' }}>
            <p className="text-xs" style={{ color:'var(--clr-text-3)' }}>
              Fields marked <span style={{ color:'var(--clr-error)' }}>*</span> are required
            </p>
            <div className="flex w-full gap-3 sm:w-auto">
              <button type="button" onClick={onClose} className="btn btn-ghost flex-1 sm:flex-none">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary flex-1 sm:flex-none">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                  : <><Check size={14} /> {editData ? 'Save Changes' : 'Add Experience'}</>
                }
              </button>
            </div>
          </div>
        </form>

      </motion.div>
    </div>
  )
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function ConfirmDelete({ label, onConfirm, onCancel }) {
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
        <h3 className="font-extrabold text-lg mb-2" style={{ color:'var(--clr-text)' }}>Delete Experience?</h3>
        <p className="text-sm mb-6 leading-relaxed" style={{ color:'var(--clr-text-2)' }}>
          <strong style={{ color:'var(--clr-text)' }}>"{label}"</strong> will be permanently removed from your portfolio.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-ghost flex-1">Keep It</button>
          <button onClick={onConfirm} className="btn btn-danger flex-1">Yes, Delete</button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Experience Card ───────────────────────────────────────────────────────────
function ExpCard({ exp, onEdit, onDelete }) {
  const ec = EMP_COLORS[exp.employmentType] || EMP_COLORS['full-time']
  return (
    <motion.div layout initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:.97 }}
      className="card group relative overflow-hidden p-5 transition-all"
      style={{ borderColor: exp.isCurrent ? 'rgba(99,102,241,.38)' : 'var(--clr-border)', boxShadow: exp.isCurrent ? 'var(--shadow-md)' : 'var(--shadow-card)' }}>

      <div className="flex items-start gap-3 pr-16">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: exp.isCurrent ? 'rgba(99,102,241,.12)' : 'var(--clr-bg-3)' }}>
          <Briefcase size={18} style={{ color: exp.isCurrent ? 'var(--clr-primary)' : 'var(--clr-text-3)' }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-bold text-base" style={{ color:'var(--clr-text)' }}>{exp.role}</h3>
            {exp.isCurrent && <span className="badge text-xs" style={{ background:'rgba(16,185,129,.12)', color:'var(--clr-success)', border:'1px solid rgba(16,185,129,.25)', fontSize:'0.6rem', padding:'0.1rem 0.5rem' }}><span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background:'var(--clr-success)' }} />Current</span>}
          </div>
          <p className="text-sm font-semibold" style={{ color:'var(--clr-primary)' }}>{exp.companyName}{exp.position && <span className="font-normal" style={{ color:'var(--clr-text-2)' }}> · {exp.position}</span>}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-4">
        <span className="badge text-xs" style={{ background:ec.bg, color:ec.color, border:`1px solid ${ec.bg}`, fontSize:'0.6rem', padding:'0.15rem 0.5rem' }}>{exp.employmentType}</span>
        <span className="flex items-center gap-1 text-xs" style={{ color:'var(--clr-text-3)' }}><Calendar size={11} />{fmtDate(exp.startDate)} — {exp.isCurrent ? 'Present' : fmtDate(exp.endDate)}{exp.startDate && <span className="opacity-60 ml-1">· {duration(exp.startDate, exp.endDate, exp.isCurrent)}</span>}</span>
      </div>

      {exp.description && <div className="mt-4 pt-3" style={{ borderTop:'1px solid var(--clr-border)' }}><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color:'var(--clr-text-3)' }}>Description</p><p className="text-sm leading-6 whitespace-pre-line" style={{ color:'var(--clr-text-2)' }}>{exp.description}</p></div>}

      <div className="absolute top-4 right-4 flex items-center gap-1 sm:gap-1.5">
        <button onClick={() => onEdit(exp)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ color:'var(--clr-text-3)', background:'var(--clr-bg-3)' }}
          onMouseEnter={e => { e.currentTarget.style.color='var(--clr-primary)'; e.currentTarget.style.background='rgba(99,102,241,.1)' }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--clr-text-3)'; e.currentTarget.style.background='var(--clr-bg-3)' }}>
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(exp)}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ color:'var(--clr-text-3)', background:'var(--clr-bg-3)' }}
          onMouseEnter={e => { e.currentTarget.style.color='var(--clr-error)'; e.currentTarget.style.background='rgba(239,68,68,.1)' }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--clr-text-3)'; e.currentTarget.style.background='var(--clr-bg-3)' }}>
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminExperience() {
  const { fetchExperiences, createExperience, editExperience, removeExperiences } = useExperienceActions()
  const { items, loading } = useSelector(s => s.experiences)

  const [showModal,  setShowModal]  = useState(false)
  const [editData,   setEditData]   = useState(null)
  const [deleteExp,  setDeleteExp]  = useState(null)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => { fetchExperiences(1, 100) }, [])

  const handleSave = async (payload, id) => {
    setSaving(true)
    const ok = id
      ? await editExperience(id, payload)
      : await createExperience(payload)
    setSaving(false)
    if (ok) { setShowModal(false); setEditData(null) }
  }

  const handleDelete = async () => {
    await removeExperiences(deleteExp._id)
    setDeleteExp(null)
  }

  const openAdd  = () => { setEditData(null); setShowModal(true) }
  const openEdit = exp => { setEditData(exp); setShowModal(true) }

  // Sort: current jobs first, then by startDate desc
  const sorted = [...items].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    return new Date(b.startDate) - new Date(a.startDate)
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col items-stretch gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
        <div>
          <h1 className="text-2xl font-extrabold mb-0.5" style={{ color:'var(--clr-text)' }}>
            Experience
          </h1>
          <p className="text-sm" style={{ color:'var(--clr-text-3)' }}>
            {items.length} work experience{items.length !== 1 ? 's' : ''} on your timeline
          </p>
        </div>
        <button onClick={openAdd} className="btn btn-primary w-full sm:w-auto">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {/* List */}
      {loading ? <Loader /> : sorted.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background:'rgba(99,102,241,.08)' }}>
            <Briefcase size={28} style={{ color:'var(--clr-primary)' }} />
          </div>
          <h3 className="font-bold text-lg mb-2" style={{ color:'var(--clr-text)' }}>No experience yet</h3>
          <p className="text-sm mb-6" style={{ color:'var(--clr-text-3)' }}>
            Add your work history to show visitors your professional journey.
          </p>
          <button onClick={openAdd} className="btn btn-primary mx-auto">
            <Plus size={15} /> Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sorted.map(exp => (
              <ExpCard key={exp._id} exp={exp} onEdit={openEdit} onDelete={setDeleteExp} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <ExperienceModal editData={editData} saving={saving}
            onClose={() => { setShowModal(false); setEditData(null) }}
            onSave={handleSave} />
        )}
        {deleteExp && (
          <ConfirmDelete
            label={`${deleteExp.role} @ ${deleteExp.companyName}`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteExp(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
