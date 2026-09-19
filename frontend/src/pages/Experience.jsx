import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Calendar, Briefcase } from 'lucide-react'
import useExperienceActions from '../hooks/useExperienceActions'
import Loader from '../components/Loader'

const EMP_COLORS = {
  'full-time':  { bg:'rgba(59,130,246,.12)',  color:'#60a5fa'            },
  'part-time':  { bg:'rgba(245,158,11,.12)',  color:'var(--clr-warning)' },
  internship:   { bg:'rgba(16,185,129,.12)',  color:'var(--clr-success)' },
  freelance:    { bg:'rgba(168,85,247,.12)',  color:'var(--clr-accent)'  },
  contract:     { bg:'rgba(249,115,22,.12)',  color:'#fb923c'            },
}

const fmt = d => d
  ? new Date(d).toLocaleDateString('en-US', { month:'short', year:'numeric' })
  : ''

const duration = (start, end, isCurrent) => {
  if (!start) return ''
  const s = new Date(start)
  const e = isCurrent ? new Date() : new Date(end)
  const m = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth())
  if (m < 1)  return '< 1 mo'
  if (m < 12) return `${m} mo${m>1?'s':''}`
  const y = Math.floor(m/12), r = m%12
  return r ? `${y}y ${r}mo` : `${y} yr${y>1?'s':''}`
}

export default function Experience() {
  const { fetchExperiences } = useExperienceActions()
  const { items, loading }   = useSelector(s => s.experiences)

  useEffect(() => { fetchExperiences(1, 50) }, [])

  // Sort: current first, then by startDate desc
  const sorted = [...items].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    return new Date(b.startDate) - new Date(a.startDate)
  })

  return (
    <div className="section" style={{ color:'var(--clr-text)' }}>
      <div className="container-page max-w-4xl">

        <div className="text-center mb-12">
          <p className="section-label">Career</p>
          <h1 className="section-title mb-3">Work Experience</h1>
          <p className="section-subtitle mx-auto">
            My professional journey and the companies I've had the pleasure to work with.
          </p>
        </div>

        {loading ? <Loader /> : sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">💼</div>
            <p className="font-semibold" style={{ color:'var(--clr-text-3)' }}>No experience listed yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px hidden sm:block"
              style={{ background:'linear-gradient(to bottom, var(--clr-primary), transparent)' }} />

            <div className="space-y-6">
              {sorted.map((exp, i) => {
                const ec = EMP_COLORS[exp.employmentType] || EMP_COLORS['full-time']
                return (
                  <motion.div key={exp._id}
                    initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6">

                    {/* Timeline dot */}
                    <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center z-10 shadow-md"
                        style={exp.isCurrent
                          ? { background:'var(--grad-primary)' }
                          : { background:'var(--clr-bg-card)', border:'2px solid var(--clr-border)' }}>
                        <Briefcase size={18}
                          style={{ color: exp.isCurrent ? '#fff' : 'var(--clr-text-3)' }} />
                      </div>
                    </div>

                    {/* Card */}
                    <div className="card flex-1 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="text-lg font-bold" style={{ color:'var(--clr-text)' }}>
                              {exp.role}
                            </h3>
                            {exp.isCurrent && (
                              <span className="badge text-xs font-semibold"
                                style={{ background:'rgba(16,185,129,.12)', color:'var(--clr-success)',
                                  border:'1px solid rgba(16,185,129,.25)', fontSize:'0.6rem', padding:'0.15rem 0.5rem' }}>
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                                  style={{ background:'var(--clr-success)' }} />
                                Current
                              </span>
                            )}
                          </div>
                          <p className="font-semibold" style={{ color:'var(--clr-primary)' }}>
                            {exp.companyName}
                          </p>
                          {exp.position && (
                            <p className="text-sm mt-0.5" style={{ color:'var(--clr-text-2)' }}>
                              {exp.position}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="badge text-xs"
                            style={{ background:ec.bg, color:ec.color, border:`1px solid ${ec.bg}`,
                              fontSize:'0.6rem', padding:'0.15rem 0.5rem' }}>
                            {exp.employmentType}
                          </span>
                          <div className="flex items-center gap-1 text-xs"
                            style={{ color:'var(--clr-text-3)' }}>
                            <Calendar size={11} />
                            {fmt(exp.startDate)} — {exp.isCurrent ? 'Present' : fmt(exp.endDate)}
                            {exp.startDate && (
                              <span className="ml-1 opacity-60">
                                · {duration(exp.startDate, exp.endDate, exp.isCurrent)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-sm leading-relaxed pt-3"
                          style={{ color:'var(--clr-text-2)', borderTop:'1px solid var(--clr-border)' }}>
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
