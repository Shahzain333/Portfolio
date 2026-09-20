import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, Layers, Briefcase, Code2, LogOut, Menu, X } from 'lucide-react'
import useAuthActions from '../../hooks/useAuthActions'
import ThemeToggle from '../../components/ThemeToggle'

function AdminLogo({ size = 'sm' }) {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 16, text: 'text-base' },
    md: { box: 'w-9 h-9', icon: 18, text: 'text-lg' },
  }

  const s = sizeMap[size] || sizeMap.sm

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${s.box} rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{ background: 'var(--grad-primary)', boxShadow: 'var(--shadow-md)' }}
      >
        <Code2 size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>

      <div className="flex flex-col leading-none">
        <span className={`${s.text} font-extrabold tracking-tight`} style={{ color: 'var(--clr-text)', letterSpacing: '-0.03em' }}>
          <span className="gradient-text">Admin</span> Panel
        </span>
      </div>
    </div>
  )
}

const NAV = [
  { to:'/admin/dashboard',       icon:LayoutDashboard, label:'Dashboard'  },
  { to:'/admin/add-projects',    icon:Layers,          label:'Projects'   },
  { to:'/admin/add-experiences', icon:Briefcase,       label:'Experience' },
  { to:'/admin/add-skills',      icon:Code2,           label:'Skills'     },
]

function SidebarContent({ onClose }) {

  const { logout } = useAuthActions()
  const navigate   = useNavigate()
  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <div className="flex flex-col h-full">
      
      <div className="py-5 px-2 flex justify-between items-center" style={{borderBottom:'1px solid var(--clr-border)'}}>

        <div className="flex items-center gap-2.5">
          <AdminLogo size="sm" />
        </div>
        
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin menu"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color:'var(--clr-text-2)', background:'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color='var(--clr-primary)'; e.currentTarget.style.background='rgba(99,102,241,.12)' }}
            onMouseLeave={e => { e.currentTarget.style.color='var(--clr-text-2)'; e.currentTarget.style.background='transparent' }}>
            <X size={19} />
          </button>
        ) : <ThemeToggle />}
      
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

        {NAV.map(({ to, icon:Icon, label }) => (
        
            <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? 'var(--clr-primary)' : 'var(--clr-text-2)',
              background: isActive ? 'rgba(99,102,241,.12)' : 'transparent',
              borderColor: isActive ? 'rgba(99,102,241,.2)' : 'transparent',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'rgba(99,102,241,.12)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,.2)'
                e.currentTarget.style.color = 'var(--clr-primary)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.color = 'var(--clr-text-2)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}>
            
            <Icon size={18}/>{label}

          </NavLink>
        
        ))}

      </nav>

      <div className="p-2 space-y-1" style={{borderTop:'1px solid var(--clr-border)'}}>
        
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
        text-sm font-medium transition-all border" style={{color:'var(--clr-text-2)', background:'transparent', borderColor:'transparent'}}
          onMouseEnter={ e => { e.currentTarget.style.background='rgba(239,68,68,.1)';
          e.currentTarget.style.borderColor='rgba(239,68,68,.2)';
          e.currentTarget.style.color='var(--clr-error)'}}
          onMouseLeave={ e => { e.currentTarget.style.background='transparent';
          e.currentTarget.style.borderColor='transparent';
          e.currentTarget.style.color='var(--clr-text-2)'}}>
          
          <LogOut size={18}/> Logout

        </button>

      </div>
 
    </div>
  )
}

export default function AdminLayout() {

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <div className="min-h-screen flex" style={{background:'var(--clr-bg-2)'}}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-40"
        style={{background:'var(--clr-bg-card)', borderRight:'1px solid var(--clr-border)'}}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:.28, ease:[.22,.68,0,1] }}
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setOpen(false)}>
            <div className="absolute inset-0" style={{background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)'}} />
            <motion.aside
              initial={{ x:'-100%', opacity:.9, scaleX:.98 }}
              animate={{ x:0, opacity:1, scaleX:1 }}
              exit={{ x:'-100%', opacity:.9, scaleX:.98 }}
              transition={{ type:'spring', stiffness:400, damping:34, mass:.8 }}
              className="absolute left-0 top-0 bottom-0 w-64 z-10 overflow-y-auto overscroll-contain"
              onClick={event => event.stopPropagation()}
              style={{background:'var(--clr-bg-card)', borderRight:'1px solid var(--clr-border)', transformOrigin:'left center', boxShadow:'18px 0 45px rgba(15,23,42,.16)'}}>
              <SidebarContent onClose={() => setOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
      
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-30"
          style={{background:'var(--clr-bg-card)', borderBottom:'1px solid var(--clr-border)'}}>
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl transition-colors"
            style={{color:'var(--clr-text-2)'}}>
            <Menu size={20}/>
          </button>
          <AdminLogo size="sm" />
          <ThemeToggle/>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet/>
        </main>

      </div>
    
    </div>
  )
}
