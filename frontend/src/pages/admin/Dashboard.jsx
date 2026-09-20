import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Layers, Code2, Briefcase, ArrowRight, Globe, ExternalLink, ShieldCheck } from 'lucide-react'
import useProjectActions from '../../hooks/useProjectActions'
import useSkillActions from '../../hooks/useSkillActions'
import useExperienceActions from '../../hooks/useExperienceActions'

const f = i => ({ initial:{ opacity:0, y:16 }, animate:{ opacity:1, y:0 }, transition:{ delay:i*.08, duration:.4 } })

const STATUS_COLORS = {
  completed:    { bg:'rgba(16,185,129,.12)',  color:'#10b981' },
  'in-progress':{ bg:'rgba(245,158,11,.12)',  color:'#f59e0b' },
  archived:     { bg:'rgba(148,163,184,.12)', color:'#94a3b8' },
}

export default function Dashboard() {
  const { fetchProjects }    = useProjectActions()
  const { fetchSkills }      = useSkillActions()
  const { fetchExperiences } = useExperienceActions()

  const { items: projects }    = useSelector(s => s.projects)
  const { items: skills }      = useSelector(s => s.skills)
  const { items: experiences } = useSelector(s => s.experiences)
  const { admin }              = useSelector(s => s.auth)

  useEffect(() => {
    fetchProjects(1, 100)
    fetchSkills(1, 100)
    fetchExperiences(1, 100)
  }, [])

  const currentJob = experiences.find(e => e.isCurrent)
  const recentExperiences = [...experiences].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    return new Date(b.startDate) - new Date(a.startDate)
  }).slice(0, 2)
  const recentSkills = skills.slice(0, 2)

  const STATS = [
    { label:'Total Projects',   val: projects.length,    icon: Layers,    to:'/admin/add-projects',    accent:'rgba(99,102,241,.12)',  ac:'var(--clr-primary)' },
    { label:'Skills Added',     val: skills.length,      icon: Code2,     to:'/admin/add-skills',      accent:'rgba(168,85,247,.12)',  ac:'var(--clr-accent)'  },
    { label:'Work Experiences', val: experiences.length, icon: Briefcase, to:'/admin/add-experiences', accent:'rgba(16,185,129,.12)',  ac:'var(--clr-success)' },
  ]

  return (
    <div className="space-y-3 max-w-5xl">

      {/* Welcome */}
      <motion.div {...f(0)}>
        <div className="card relative overflow-hidden p-5 sm:p-7" style={{ background:'var(--grad-card)', borderColor:'rgba(99,102,241,.2)' }}>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:'rgba(99,102,241,.14)', color:'var(--clr-primary)' }}>
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color:'var(--clr-primary)' }}>Admin overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color:'var(--clr-text)' }}>
              Welcome back{admin?.email ? `, ${admin.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color:'var(--clr-text-2)' }}>
              Keep your portfolio current and make every update count.
              {currentJob && (
                <span className="block sm:inline sm:ml-1 mt-1 sm:mt-0">
                  Currently working at <strong style={{ color:'var(--clr-primary)' }}>{currentJob.companyName}</strong>.
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div {...f(1)} className="grid sm:grid-cols-3 gap-2 md:gap-5">
        {STATS.map(({ label, val, icon:Icon, to, accent, ac }) => (
          <Link key={label} to={to} className="card p-3.5 sm:p-4 group card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background:accent }}>
                <Icon size={17} style={{ color:ac }} />
              </div>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1"
                style={{ color:'var(--clr-text-3)' }} />
            </div>
            <div className="text-2xl font-extrabold mb-0.5" style={{ color:'var(--clr-text)' }}>{val}</div>
            <div className="text-xs sm:text-sm" style={{ color:'var(--clr-text-2)' }}>{label}</div>
          </Link>
        ))}
      </motion.div>

      {/* Quick actions */}
      {/* <motion.div {...f(2)}>
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color:'var(--clr-text-3)' }}>
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label:'Add Project',    to:'/admin/add-projects',    desc:'Upload a new project with image'   },
            { label:'Add Skill',      to:'/admin/add-skills',      desc:'Add a technology to your stack'   },
            { label:'Add Experience', to:'/admin/add-experiences', desc:'Log a new work experience'        },
          ].map(({ label, to, desc }) => (
            <Link
              key={to}
              to={to}
              className="card p-4 flex items-center gap-3 group transition-all duration-200 min-w-0"
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--clr-bg-card-hover)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,.38)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                const title = e.currentTarget.querySelector('p.text-sm')
                const text = e.currentTarget.querySelector('p.text-xs')
                const iconBox = e.currentTarget.querySelector('.quick-action-icon')

                if (title) title.style.color = 'var(--clr-primary)'
                if (text) text.style.color = 'var(--clr-text-2)'
                if (iconBox) {
                  iconBox.style.background = 'var(--clr-primary)'
                  iconBox.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = ''
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
                const title = e.currentTarget.querySelector('p.text-sm')
                const text = e.currentTarget.querySelector('p.text-xs')
                const iconBox = e.currentTarget.querySelector('.quick-action-icon')

                if (title) title.style.color = 'var(--clr-text)'
                if (text) text.style.color = 'var(--clr-text-3)'
                if (iconBox) {
                  iconBox.style.background = 'rgba(99,102,241,.1)'
                  iconBox.style.color = 'var(--clr-primary)'
                }
              }}
            >
              <div className="quick-action-icon w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background:'rgba(99,102,241,.1)', color:'var(--clr-primary)' }}>
                <Plus size={16} style={{ color:'currentColor' }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color:'var(--clr-text)' }}>{label}</p>
                <p className="text-xs truncate" style={{ color:'var(--clr-text-3)' }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div> */}

      {/* Recent projects */}
      {projects.length > 0 && (
        <motion.div {...f(3)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color:'var(--clr-text-3)' }}>
              Recent Projects
            </h2>
            <Link to="/admin/add-projects" className="btn btn-ghost btn-sm">
              Manage <ArrowRight size={13} />
            </Link>
          </div>
          <div className="card overflow-hidden">
            {projects.slice(0, 2).map((p, i) => {
              const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean)
              const sc   = STATUS_COLORS[p.status] || STATUS_COLORS.completed
              return (
                <div key={p._id} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5"
                  style={{ borderBottom: i < Math.min(projects.length,2)-1 ? '1px solid var(--clr-border)' : 'none' }}>
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background:'var(--clr-bg-3)' }}>
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-base">🚀</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color:'var(--clr-text)' }}>{p.title}</p>
                    <p className="text-xs truncate" style={{ color:'var(--clr-text-3)' }}>{cats.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="badge text-xs"
                      style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.bg}` }}>
                      {p.status || 'completed'}
                    </span>
                    <div className="hidden sm:flex gap-1.5">
                      {p.projectUrl && (
                        <a href={p.projectUrl} target="_blank" rel="noreferrer"
                          className="transition-colors" style={{ color:'var(--clr-text-3)' }}
                          onMouseEnter={e => e.currentTarget.style.color='var(--clr-primary)'}
                          onMouseLeave={e => e.currentTarget.style.color='var(--clr-text-3)'}>
                          <Globe size={13} />
                        </a>
                      )}
                      {p.sourceCodeUrl && (
                        <a href={p.sourceCodeUrl} target="_blank" rel="noreferrer"
                          className="transition-colors" style={{ color:'var(--clr-text-3)' }}
                          onMouseEnter={e => e.currentTarget.style.color='var(--clr-text)'}
                          onMouseLeave={e => e.currentTarget.style.color='var(--clr-text-3)'}>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {(recentExperiences.length > 0 || recentSkills.length > 0) && (
        <motion.div {...f(4)} className="grid md:grid-cols-2 gap-5">
          {recentExperiences.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color:'var(--clr-text-3)' }}>Recent Experience</h2>
                <Link to="/admin/add-experiences" className="btn btn-ghost btn-sm">Manage <ArrowRight size={13} /></Link>
              </div>
              <div className="card overflow-hidden">
                {recentExperiences.map((experience, index) => (
                  <div key={experience._id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5" style={{ borderBottom:index < recentExperiences.length - 1 ? '1px solid var(--clr-border)' : 'none' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:experience.isCurrent ? 'rgba(99,102,241,.12)' : 'var(--clr-bg-3)', color:experience.isCurrent ? 'var(--clr-primary)' : 'var(--clr-text-3)' }}>
                      <Briefcase size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color:'var(--clr-text)' }}>{experience.role}</p>
                      <p className="text-xs truncate" style={{ color:'var(--clr-text-3)' }}>{experience.companyName}{experience.isCurrent ? ' · Current' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {recentSkills.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color:'var(--clr-text-3)' }}>Recent Skills</h2>
                <Link to="/admin/add-skills" className="btn btn-ghost btn-sm">Manage <ArrowRight size={13} /></Link>
              </div>
              <div className="card overflow-hidden">
                {recentSkills.map((skill, index) => (
                  <div key={skill._id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5" style={{ borderBottom:index < recentSkills.length - 1 ? '1px solid var(--clr-border)' : 'none' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(168,85,247,.12)', color:'var(--clr-accent)' }}>
                      <Code2 size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color:'var(--clr-text)' }}>{skill.name}</p>
                      <p className="text-xs truncate" style={{ color:'var(--clr-text-3)' }}>{skill.category} · {skill.proficiency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      )}

    </div>
  )
}
