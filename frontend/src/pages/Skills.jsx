import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import useSkillActions from '../hooks/useSkillActions'
import Loader from '../components/Loader'

const PROF_WIDTH  = { beginner:'25%', intermediate:'55%', advanced:'80%', expert:'100%' }
const PROF_COLORS = {
  beginner:    { bg:'rgba(148,163,184,.12)', color:'#94a3b8' },
  intermediate:{ bg:'rgba(59,130,246,.12)',  color:'#60a5fa' },
  advanced:    { bg:'rgba(99,102,241,.12)',   color:'var(--clr-primary)' },
  expert:      { bg:'rgba(168,85,247,.12)',   color:'var(--clr-accent)'  },
}
const CAT_ORDER  = ['language','frontend','backend','database','devops','tools','other']
const CAT_LABELS = {
  language:'💻 Languages', frontend:'🎨 Frontend', backend:'⚙️ Backend',
  database:'🗄️ Database',  devops:'🚀 DevOps',    tools:'🛠️ Tools',   other:'📦 Other',
}

export default function Skills() {
  const { fetchSkills } = useSkillActions()
  const { items, loading } = useSelector(s => s.skills)

  useEffect(() => { fetchSkills(1, 100) }, [])

  const grouped = items.reduce((acc, s) => {
    const c = s.category || 'other'
    if (!acc[c]) acc[c] = []
    acc[c].push(s)
    return acc
  }, {})

  const cats = [
    ...CAT_ORDER.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !CAT_ORDER.includes(c)),
  ]

  return (
    <div className="section" style={{ color:'var(--clr-text)' }}>
      <div className="container-page">

        <div className="text-center mb-12">
          <p className="section-label">Expertise</p>
          <h1 className="section-title mb-3">Skills & Technologies</h1>
          <p className="section-subtitle mx-auto">
            Tools and technologies I work with daily to build great products.
          </p>
        </div>

        {loading ? <Loader /> : cats.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛠️</div>
            <p className="font-semibold" style={{ color:'var(--clr-text-3)' }}>No skills added yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {cats.map((cat, ci) => (
              <motion.div key={cat}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: ci * 0.07 }}
                className="card p-6">
                <h3 className="font-bold mb-5 text-sm uppercase tracking-wider"
                  style={{ color:'var(--clr-text)' }}>
                  {CAT_LABELS[cat] || cat}
                </h3>
                <div className="space-y-4">
                  {grouped[cat].map((s, si) => {
                    const pc = PROF_COLORS[s.proficiency] || PROF_COLORS.intermediate
                    return (
                      <div key={s._id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {s.iconUrl && (
                              <img src={s.iconUrl} alt={s.name} className="w-4 h-4 object-contain"
                                onError={e => { e.target.style.display='none' }} />
                            )}
                            <span className="text-sm font-medium" style={{ color:'var(--clr-text)' }}>
                              {s.name}
                            </span>
                          </div>
                          <span className="badge text-xs"
                            style={{ background:pc.bg, color:pc.color, border:`1px solid ${pc.bg}`,
                              fontSize:'0.6rem', padding:'0.15rem 0.5rem' }}>
                            {s.proficiency}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden"
                          style={{ background:'var(--clr-bg-3)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background:'var(--grad-primary)' }}
                            initial={{ width:0 }}
                            animate={{ width: PROF_WIDTH[s.proficiency] || '55%' }}
                            transition={{ delay: ci*0.07 + si*0.04 + 0.3, duration:.7, ease:'easeOut' }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
