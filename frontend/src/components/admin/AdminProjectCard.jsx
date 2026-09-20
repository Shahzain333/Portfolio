import { ExternalLink, Globe, Pencil, Rocket, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ProjectStatusBadge from '../ProjectStatusBadge'

export default function AdminProjectCard({ project: project, onEdit, onDelete }) {
  const categories = Array.isArray(project.category) ? project.category : [project.category].filter(Boolean)

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .95 }} className="card group overflow-hidden" style={{ cursor: 'default' }}>
      <div className="relative h-44 overflow-hidden" style={{ background: 'var(--grad-card)' }}>
        {project.imageUrl ? <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center"><Rocket size={36} style={{ color: 'var(--clr-text-3)' }} /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <ProjectStatusBadge status={project.status} className="absolute top-3 left-3" />
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <button onClick={() => onEdit(project)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }} onMouseEnter={event => { event.currentTarget.style.background = 'rgba(99,102,241,.8)' }} onMouseLeave={event => { event.currentTarget.style.background = 'rgba(255,255,255,.15)' }}><Pencil size={13} /></button>
          <button onClick={() => onDelete(project)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,.2)' }} onMouseEnter={event => { event.currentTarget.style.background = 'rgba(239,68,68,.8)' }} onMouseLeave={event => { event.currentTarget.style.background = 'rgba(255,255,255,.15)' }}><Trash2 size={13} /></button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">{categories.map(category => <span key={category} className="badge badge-primary" style={{ fontSize: '.65rem', padding: '.2rem .6rem' }}>{category}</span>)}</div>
        <h3 className="font-bold text-sm mb-1.5 truncate" style={{ color: 'var(--clr-text)' }}>{project.title}</h3>
        <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--clr-text-2)' }}>{project.description}</p>
        <div className="flex items-center gap-3 pt-3.5" style={{ borderTop: '1px solid var(--clr-border)' }}>
          {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--clr-primary)' }}><Globe size={12} /> Live Demo</a>}
          {project.sourceCodeUrl && <a href={project.sourceCodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--clr-text-2)' }}><ExternalLink size={12} /> Source</a>}
        </div>
      </div>
    </motion.div>
  )
}
