import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ArrowRight, Code2, Layers, Briefcase, Globe, ExternalLink, Zap, Shield, Sparkles } from 'lucide-react'
import useProjectActions from '../hooks/useProjectActions'
import useSkillActions from '../hooks/useSkillActions'
import useExperienceActions from '../hooks/useExperienceActions'
import Loader from '../components/Loader'

const fd = i => ({ initial:{opacity:0,y:28}, animate:{opacity:1,y:0}, transition:{delay:i*.1,duration:.55,ease:[.22,.68,0,1.2]} })

const STATUS_COLORS = {
  completed:    'rgba(16,185,129,.12)',
  'in-progress':'rgba(245,158,11,.12)',
  archived:     'rgba(148,163,184,.12)',
}
const STATUS_TEXT = {
  completed:    '#10b981',
  'in-progress':'#f59e0b',
  archived:     '#94a3b8',
}

export default function Home() {
  const { fetchProjects }    = useProjectActions()
  const { fetchSkills }      = useSkillActions()
  const { fetchExperiences } = useExperienceActions()

  const { items: projects, loading: pLoad } = useSelector(s => s.projects)
  const { items: skills }                   = useSelector(s => s.skills)
  const { items: experiences }              = useSelector(s => s.experiences)

  useEffect(() => {
    fetchProjects(1, 3)
    fetchSkills(1, 18)
    fetchExperiences(1, 10)
  }, [])

  const currentJob = experiences.find(e => e.isCurrent)

  return (
    <div style={{ color:'var(--clr-text)' }}>

      {/* ── HERO ── */}
      <section className="section relative overflow-hidden">
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[.06]"
            style={{ background:'var(--grad-primary)', filter:'blur(80px)' }} />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[.04]"
            style={{ background:'var(--clr-accent)', filter:'blur(60px)' }} />
        </div>

        <div className="container-page relative z-10">
          <div className="max-w-3xl">

            {currentJob && (
              <motion.div {...fd(0)} className="mb-6">
                <span className="badge badge-success">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:'var(--clr-success)' }} />
                  {currentJob.role} @ {currentJob.companyName}
                </span>
              </motion.div>
            )}

            <motion.h1 {...fd(1)}
              className="font-extrabold tracking-tight leading-none mb-6"
              style={{ fontSize:'clamp(2.8rem,6vw,5rem)', letterSpacing:'-0.04em' }}>
              Building{' '}
              <span className="gradient-text">Digital</span>
              <br />Experiences
            </motion.h1>

            <motion.p {...fd(2)}
              className="leading-relaxed mb-10 max-w-xl"
              style={{ fontSize:'clamp(1rem,2vw,1.2rem)', color:'var(--clr-text-2)' }}>
              Full-stack developer crafting fast, accessible, production-ready web applications.
              Passionate about clean code, great UX, and solving real-world problems.
            </motion.p>

            <motion.div {...fd(3)} className="flex flex-wrap gap-3 mb-16">
              <Link to="/projects" className="btn btn-primary btn-lg">
                View My Work <ArrowRight size={18} />
              </Link>
              <Link to="/experience" className="btn btn-ghost btn-lg">
                My Journey
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div {...fd(4)} className="flex flex-wrap gap-4">
              {[
                { icon:Layers,    val:projects.length,    label:'Projects Built'    },
                { icon:Code2,     val:skills.length,      label:'Technologies'      },
                { icon:Briefcase, val:experiences.length, label:'Work Experiences'  },
              ].map(({ icon:Icon, val, label }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
                  style={{ background:'var(--clr-bg-card)', border:'1px solid var(--clr-border)', boxShadow:'var(--shadow-card)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:'rgba(99,102,241,.1)' }}>
                    <Icon size={18} style={{ color:'var(--clr-primary)' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold leading-none" style={{ color:'var(--clr-text)' }}>{val}</div>
                    <div className="text-xs mt-0.5" style={{ color:'var(--clr-text-3)' }}>{label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY ME ── */}
      <section className="section-sm" style={{ background:'var(--clr-bg-2)' }}>
        <div className="container-page">
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon:Zap,      title:'Fast & Performant', desc:'Optimized code and best practices for lightning-fast load times.' },
              { icon:Shield,   title:'Secure & Reliable', desc:'Security-first approach with robust error handling and validation.' },
              { icon:Sparkles, title:'Clean & Scalable',  desc:'Maintainable, well-documented code that grows with your business.' },
            ].map(({ icon:Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background:'rgba(99,102,241,.1)' }}>
                  <Icon size={22} style={{ color:'var(--clr-primary)' }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color:'var(--clr-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color:'var(--clr-text-2)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="section">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label">Portfolio</p>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            <Link to="/projects" className="btn btn-ghost btn-sm">All Projects <ArrowRight size={14} /></Link>
          </div>

          {pLoad ? <Loader /> : projects.length === 0 ? (
            <p className="text-center py-16" style={{ color:'var(--clr-text-3)' }}>No projects yet — add from the admin panel.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((p, i) => {
                const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean)
                return (
                  <motion.div key={p._id} {...fd(i)} className="card group overflow-hidden">
                    <div className="relative h-48 overflow-hidden" style={{ background:'var(--grad-card)' }}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        : <div className="w-full h-full flex items-center justify-center text-5xl">🚀</div>}
                      {p.status && (
                        <span className="absolute top-3 right-3 badge text-xs font-semibold"
                          style={{ background:STATUS_COLORS[p.status]||STATUS_COLORS.completed, color:STATUS_TEXT[p.status]||STATUS_TEXT.completed }}>
                          {p.status}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {cats.map(c => <span key={c} className="badge badge-primary text-xs">{c}</span>)}
                      </div>
                      <h3 className="font-bold mb-1.5 truncate" style={{ color:'var(--clr-text)', fontSize:'1rem' }}>{p.title}</h3>
                      <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color:'var(--clr-text-2)' }}>{p.description}</p>
                      <div className="flex gap-4 pt-3" style={{ borderTop:'1px solid var(--clr-border)' }}>
                        {p.projectUrl && (
                          <a href={p.projectUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold"
                            style={{ color:'var(--clr-primary)' }}>
                            <Globe size={12} /> Live Demo
                          </a>
                        )}
                        {p.sourceCodeUrl && (
                          <a href={p.sourceCodeUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold"
                            style={{ color:'var(--clr-text-2)' }}>
                            <ExternalLink size={12} /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── TECH STACK PREVIEW ── */}
      {skills.length > 0 && (
        <section className="section-sm" style={{ background:'var(--clr-bg-2)' }}>
          <div className="container-page">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label">Tech Stack</p>
                <h2 className="section-title" style={{ fontSize:'1.75rem' }}>Skills & Tools</h2>
              </div>
              <Link to="/skills" className="btn btn-ghost btn-sm">All Skills <ArrowRight size={14} /></Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <div key={s._id} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200"
                  style={{ background:'var(--clr-bg-card)', border:'1px solid var(--clr-border)', color:'var(--clr-text-2)', fontSize:'.875rem', fontWeight:500, cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--clr-primary)'; e.currentTarget.style.color='var(--clr-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--clr-border)'; e.currentTarget.style.color='var(--clr-text-2)' }}>
                  {s.iconUrl && <img src={s.iconUrl} alt={s.name} className="w-4 h-4 object-contain" onError={e => { e.target.style.display='none' }} />}
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
