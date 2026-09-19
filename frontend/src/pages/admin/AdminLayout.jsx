import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Layers, Briefcase, Code2, LogOut, Menu, X } from 'lucide-react'
import useAuthActions from '../../hooks/useAuthActions'
import ThemeToggle from '../../components/ThemeToggle'

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
      
      <div className="py-5 px-2 flex justify-between" style={{borderBottom:'1px solid var(--clr-border)'}}>

        <div className="flex items-center gap-2.5">
      
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--grad-primary)'}}>
            <Code2 size={16} className="text-white"/>
          </div>
          <span className="font-bold" style={{color:'var(--clr-text)'}}>Admin Panel</span>
      
        </div>
        
        <div className=""><ThemeToggle /></div>
      
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

        {NAV.map(({ to, icon:Icon, label }) => (
        
          <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all`}
            style={({ isActive }) => isActive
              ? {color:'var(--clr-text)', boxShadow:'var(--shadow-lg)'}
              : {color:'var(--clr-text-2)'}
            }
            onMouseEnter={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'var(--clr-bg-3)' }}
            onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'transparent' }}>
            
            <Icon size={18}/>{label}

          </NavLink>
        
        ))}

      </nav>

      <div className="p-2 space-y-1" style={{borderTop:'1px solid var(--clr-border)'}}>
        
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
        text-sm font-medium transition-colors" style={{color:'var(--clr-text-2)'}}
          onMouseEnter={ e => { e.currentTarget.style.background='rgba(239,68,68,.1)';
          e.currentTarget.style.color='var(--clr-error)'}}
          onMouseLeave={ e => { e.currentTarget.style.background='transparent';
          e.currentTarget.style.color='var(--clr-text-2)'}}>
          
          <LogOut size={18}/> Logout

        </button>

      </div>
 
    </div>
  )
}

export default function AdminLayout() {

  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{background:'var(--clr-bg-2)'}}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 z-40"
        style={{background:'var(--clr-bg-card)', borderRight:'1px solid var(--clr-border)'}}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0" style={{background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)'}} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 z-10"
            style={{background:'var(--clr-bg-card)', borderRight:'1px solid var(--clr-border)'}}>
            <SidebarContent onClose={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
      
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 sticky top-0 z-30"
          style={{background:'var(--clr-bg-card)', borderBottom:'1px solid var(--clr-border)'}}>
          <button onClick={() => setOpen(true)} className="p-2 rounded-xl transition-colors"
            style={{color:'var(--clr-text-2)'}}>
            <Menu size={20}/>
          </button>
          <span className="font-bold" style={{color:'var(--clr-text)'}}>Admin</span>
          <ThemeToggle/>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet/>
        </main>

      </div>
    
    </div>
  )
}
