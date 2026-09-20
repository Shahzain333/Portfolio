import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Rocket, Search, X } from 'lucide-react'
import useProjectActions from '../../hooks/useProjectActions'
import Loader from '../../components/Loader'
import AdminProjectModal from '../../components/admin/AdminProjectModal'
import AdminProjectCard from '../../components/admin/AdminProjectCard'
import ConfirmDelete from '../../components/admin/ConfirmDelete'
import { PROJECT_STATUSES } from '../../constants/projectStatus'

export default function AdminProject() {
  const { fetchProjects, createProject, editProject, removeProjects } = useProjectActions()
  const { items: projects, loading } = useSelector(state => state.projects)
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteProject, setDeleteProject] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [activeFilter, setFilter] = useState('all')

  useEffect(() => { fetchProjects(1, 100) }, [])

  const filtered = projects
    .filter(project => activeFilter === 'all' || project.status === activeFilter)
    .filter(project => !search.trim() || project.title?.toLowerCase().includes(search.toLowerCase()))

  const stats = PROJECT_STATUSES.reduce((counts, status) => {
    counts[status] = projects.filter(project => project.status === status).length
    return counts
  }, {})

  const handleSave = async (formData, imageFile, id) => {
    setSaving(true)
    const saved = id ? await editProject(id, formData, imageFile) : await createProject(formData, imageFile)
    setSaving(false)
    if (saved) { setShowModal(false); setEditData(null) }
  }

  const handleDelete = async () => {
    if (!deleteProject) return
    await removeProjects(deleteProject._id)
    setDeleteProject(null)
  }

  const openAdd = () => { setEditData(null); setShowModal(true) }
  const openEdit = project => { setEditData(project); setShowModal(true) }

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold mb-0.5" style={{ color: 'var(--clr-text)' }}>Projects</h1>
          <p className="text-sm" style={{ color: 'var(--clr-text-3)' }}>{projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={16} /> Add Project</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', val: projects.length, color: 'var(--clr-primary)', filter: 'all' },
          { label: 'Completed', val: stats.completed || 0, color: '#10b981', filter: 'completed' },
          { label: 'In Progress', val: stats['in-progress'] || 0, color: '#f59e0b', filter: 'in-progress' },
          { label: 'Archived', val: stats.archived || 0, color: '#94a3b8', filter: 'archived' },
        ].map(({ label, val, color, filter }) => (
          <button key={label} onClick={() => setFilter(filter)} className="card p-4 text-left transition-all" style={{ borderColor: activeFilter === filter ? color : 'var(--clr-border)', background: activeFilter === filter ? `${color}0d` : 'var(--clr-bg-card)' }}>
            <div className="text-2xl font-extrabold mb-0.5" style={{ color }}>{val}</div>
            <div className="text-xs font-medium" style={{ color: 'var(--clr-text-3)' }}>{label}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-text-3)' }} />
          <input type="text" placeholder="Search projects…" value={search} onChange={event => setSearch(event.target.value)} className="input pl-10 pr-10" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-text-3)' }}><X size={14} /></button>}
        </div>
        {search && <p className="text-sm" style={{ color: 'var(--clr-text-3)' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>}
      </div>

      {loading ? <Loader /> : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,.08)' }}><Rocket size={28} style={{ color: 'var(--clr-primary)' }} /></div>
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--clr-text)' }}>{search ? 'No projects found' : 'No projects yet'}</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--clr-text-3)' }}>{search ? `No results for "${search}". Try a different keyword.` : 'Add your first project to showcase your work.'}</p>
          {!search && <button onClick={openAdd} className="btn btn-primary mx-auto"><Plus size={15} /> Add Your First Project</button>}
        </motion.div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>{filtered.map(project => <AdminProjectCard key={project._id} project={project} onEdit={openEdit} onDelete={setDeleteProject} />)}</AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <AdminProjectModal editData={editData} saving={saving} onClose={() => { setShowModal(false); setEditData(null) }} onSave={handleSave} />}
        {deleteProject && <ConfirmDelete title={deleteProject.title} itemLabel="Project" onConfirm={handleDelete} onCancel={() => setDeleteProject(null)} />}
      </AnimatePresence>
    </div>
  )
}
