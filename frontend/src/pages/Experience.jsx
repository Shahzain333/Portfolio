import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Calendar, Briefcase, Milestone } from 'lucide-react'
import useExperienceActions from '../hooks/useExperienceActions'
import Loader from '../components/Loader'

const EMP_COLORS = {
  'full-time': { bg: 'rgba(59,130,246,.12)', color: '#60a5fa' },
  'part-time': { bg: 'rgba(245,158,11,.12)', color: 'var(--clr-warning)' },
  internship: { bg: 'rgba(16,185,129,.12)', color: 'var(--clr-success)' },
  freelance: { bg: 'rgba(168,85,247,.12)', color: 'var(--clr-accent)' },
  contract: { bg: 'rgba(249,115,22,.12)', color: '#fb923c' },
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')

const duration = (start, end, isCurrent) => {
  if (!start) return ''
  const s = new Date(start)
  const e = isCurrent ? new Date() : new Date(end)
  const m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
  if (m < 1) return '< 1 mo'
  if (m < 12) return `${m} mo${m > 1 ? 's' : ''}`
  const y = Math.floor(m / 12), r = m % 12
  return r ? `${y}y ${r}mo` : `${y} yr${y > 1 ? 's' : ''}`
}

export default function Experience() {
  const { fetchExperiences } = useExperienceActions()
  const { items, loading } = useSelector((s) => s.experiences)

  useEffect(() => { fetchExperiences(1, 50) }, [])

  const sorted = [...items].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    return new Date(b.startDate) - new Date(a.startDate)
  })

  return (
    <div className="section" style={{ color: 'var(--clr-text)' }}>
      <div className="container-page md:pt-3">
        <div className="text-center mb-8">
          <p className="section-label">Career</p>
          <h1 className="section-title mb-3">Work Experience</h1>
          <p className="section-subtitle mx-auto">A quick look at the roles and teams I’ve been part of while building products and experiences.</p>
        </div>

        {loading ? <Loader /> : sorted.length === 0 ? (
          <div className="card max-w-md mx-auto px-6 py-12 text-center">
            <div className="relative w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--grad-card)', border: '1px solid rgba(99,102,241,.2)', boxShadow: 'var(--shadow-md)' }}>
              <div className="absolute w-12 h-12 rounded-full" style={{ border: '1px solid rgba(99,102,241,.24)' }} />
              <Milestone size={34} strokeWidth={1.7} style={{ color: 'var(--clr-primary)' }} />
            </div>
            <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--clr-text)' }}>Career timeline coming soon</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--clr-text-3)' }}>Professional experience will appear here as the journey grows.</p>
          </div>
        ) : (
          <div className="relative">
            
            <div className="absolute left-6 top-11 bottom-6 w-px hidden sm:block" style={{ background: 'linear-gradient(to bottom, var(--clr-primary), transparent)' }} />

            <div className="space-y-6">
              {sorted.map((exp, i) => {
                const ec = EMP_COLORS[exp.employmentType] || EMP_COLORS['full-time']
                return (
                  <motion.div key={exp._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-6">
                    <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center z-10 shadow-md" style={exp.isCurrent ? { background: 'var(--grad-primary)' } : { background: 'var(--clr-bg-card)', border: '2px solid var(--clr-border)' }}>
                        <Briefcase size={18} style={{ color: exp.isCurrent ? '#fff' : 'var(--clr-text-3)' }} />
                      </div>
                    </div>

                    <div className="card flex-1 p-4 sm:p-6 card-hover">
                      <div className="flex flex-col items-start gap-3 mb-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--clr-text)' }}>{exp.role}</h3>
                            {exp.isCurrent && (
                              <span className="badge text-xs font-semibold" style={{ background: 'rgba(16,185,129,.12)', color: 'var(--clr-success)', border: '1px solid rgba(16,185,129,.25)', fontSize: '0.6rem', padding: '0.15rem 0.5rem' }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: 'var(--clr-success)' }} />
                                Current
                              </span>
                            )}
                          </div>
                          <p className="font-semibold" style={{ color: 'var(--clr-primary)' }}>{exp.companyName}</p>
                          {exp.position && <p className="text-sm mt-0.5" style={{ color: 'var(--clr-text-2)' }}>{exp.position}</p>}
                        </div>

                        <div className="flex flex-wrap items-start gap-2 sm:flex-col sm:items-end">
                          <span className="badge text-xs" style={{ background: ec.bg, color: ec.color, border: `1px solid ${ec.bg}`, fontSize: '0.6rem', padding: '0.15rem 0.5rem' }}>
                            {exp.employmentType}
                          </span>
                          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--clr-text-3)' }}>
                            <Calendar size={11} />
                            {fmt(exp.startDate)} — {exp.isCurrent ? 'Present' : fmt(exp.endDate)}
                            {exp.startDate && <span className="ml-1 opacity-60">· {duration(exp.startDate, exp.endDate, exp.isCurrent)}</span>}
                          </div>
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-sm leading-7 pt-3 whitespace-pre-line" style={{ color: 'var(--clr-text-2)', borderTop: '1px solid var(--clr-border)' }}>
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}
