import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Globe, ExternalLink, FolderSearch } from 'lucide-react'
import useProjectActions from '../hooks/useProjectActions'
import Loader from '../components/Loader'
import ProjectStatusBadge from '../components/ProjectStatusBadge'

const CATS = ['all', 'frontend', 'backend', 'fullstack', 'mernstack', 'gen-ai', 'agent', 'other']
export default function Projects() {
  const { fetchProjects, searchProject } = useProjectActions()
  const { items, searchResults, loading, pagination } = useSelector((s) => s.projects)

  const [typed, setTyped] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => { fetchProjects(page, 9) }, [page])

  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(typed)
      if (typed.trim()) searchProject(typed.trim())
    }, 400)
    return () => clearTimeout(t)
  }, [typed])

  const base = query.trim() ? searchResults : items
  const filtered = filter === 'all' ? base : base.filter((p) => (Array.isArray(p.category) ? p.category : [p.category]).includes(filter))

  return (
    <div className="section" style={{ color: 'var(--clr-text)' }}>
      <div className="container-page md:pt-3">
        <div className="mb-8">
          <p className="section-label">Portfolio</p>
          <h1 className="section-title mb-3">My Projects</h1>
          <p className="section-subtitle">Things I've built — from full-stack apps to AI experiences with measurable impact.</p>
        </div>

        <div className="card p-4 mb-8" style={{ background: 'rgba(255,255,255,0.4)' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-text-3)' }} />
              <input type="text" placeholder="Search projects…" value={typed} onChange={(e) => setTyped(e.target.value)} className="input pl-10 pr-10" />
              {typed && (
                <button onClick={() => { setTyped(''); setQuery('') }} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--clr-text-3)' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className="btn btn-sm transition-all"
                  style={filter === c ? { background: 'var(--grad-primary)', color: '#fff', border: 'none' } : { background: 'var(--clr-bg-card)', color: 'var(--clr-text-2)', border: '1px solid var(--clr-border)' }}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!loading && (
          <p className="text-sm mb-6" style={{ color: 'var(--clr-text-3)' }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}
          </p>
        )}

        {loading ? <Loader /> : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                color: 'var(--clr-primary)',
                background: 'var(--grad-card)',
                border: '1px solid var(--clr-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <FolderSearch size={30} strokeWidth={1.8} />
            </div>
            <p className="font-semibold mb-1" style={{ color: 'var(--clr-text)' }}>No projects found</p>
            <p className="text-sm" style={{ color: 'var(--clr-text-3)' }}>Try a different search or category</p>
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((p) => {
                const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean)
                return (
                  <motion.article key={p._id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }} className="card group overflow-hidden card-hover">
                    <div className="relative h-52 overflow-hidden" style={{ background: 'var(--grad-card)' }}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🚀</div>
                      )}
                      {p.status && <ProjectStatusBadge status={p.status} className="absolute top-3 right-3" />}
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {cats.map((c) => <span key={c} className="badge badge-primary text-xs">{c}</span>)}
                      </div>
                      <h3 className="font-bold mb-1.5 truncate" style={{ color: 'var(--clr-text)' }}>{p.title}</h3>
                      <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--clr-text-2)' }}>{p.description}</p>
                      <div className="flex gap-4 pt-3" style={{ borderTop: '1px solid var(--clr-border)' }}>
                        {p.projectUrl && (
                          <a href={p.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--clr-primary)' }}>
                            <Globe size={12} /> Live Demo
                          </a>
                        )}
                        {p.sourceCodeUrl && (
                          <a href={p.sourceCodeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--clr-text-2)' }}>
                            <ExternalLink size={12} /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {pagination?.totalPages > 1 && !query && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className="btn btn-sm" style={page === p ? { background: 'var(--grad-primary)', color: '#fff', border: 'none' } : { background: 'var(--clr-bg-card)', color: 'var(--clr-text-2)', border: '1px solid var(--clr-border)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
