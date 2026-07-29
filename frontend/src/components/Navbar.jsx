import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2, LayoutDashboard, LogOut } from 'lucide-react'
import { useSelector } from 'react-redux'
import ThemeToggle from './ThemeToggle'
import useAuthActions from '../hooks/useAuthActions'
import Logo from '../components/Logo.jsx'

const LINKS = [
  { to: '/',           label: 'Home'       },
  { to: '/projects',   label: 'Projects'   },
  { to: '/skills',     label: 'Skills'     },
  { to: '/experience', label: 'Experience' },
]

const Navbar = () => {
  
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { logout } = useAuthActions()
  const navigate = useNavigate()
  const { isLoggedIn, admin } = useSelector(
    // state => state.auth ?? { isLoggedIn: false, admin: null }
    state => state.auth
  )
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Track scroll for navbar shadow/blur
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
 
  // Track screen size — close drawer when resizing to desktop
  useEffect(() => {
    const h = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setOpen(false) // auto-close drawer on desktop resize
    }
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
 

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setOpen(false)
  }

  const linkCls = ({ isActive }) =>
    `text-sm md:text-[1rem] font-medium transition-colors duration-200 ${
    isActive ? 'text-[var(--clr-primary)]' : 
    'text-[var(--clr-text-2)] hover:text-[var(--clr-primary)]'
  }`

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(var(--clr-bg-rgb,255,255,255),.85)' : 'var(--clr-bg)',
        borderBottom: scrolled ? '1px solid var(--clr-border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      {/* Desktop View */}
      <div className="container-page">

        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          {/* <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>

            <div className="w-8 h-8 rounded-lg flex items-center justify-center 
            transition-transform group-hover:scale-110"
              style={{ background: 'var(--grad-primary)' }}>
              <Code2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-[1.25rem]" style={{ color: 'var(--clr-text)' }}>
              SK_<span className="gradient-text">DEV</span>
            </span>

          </Link> */}
          <Logo onClick={() => setOpen(false)} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkCls}>{label}</NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            
            <ThemeToggle />
            
            {/* Admin buttons — only render in DOM when NOT on mobile */}
            {!isMobile && (
              (isLoggedIn && admin) ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin/dashboard"
                    className="btn btn-sm"
                    style={{ background: 'rgba(99,102,241,.1)', color: 'var(--clr-primary)' }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/admin/login" className="btn btn-primary btn-sm">
                  Admin
                </Link>
              )
            )}
            
            {/* Hamburger — mobile only */}
            <button className="md:hidden p-2 rounded-lg transition-colors" 
            style={{ color: 'var(--clr-text-2)' }} onClick={() => setOpen(!open)}
              aria-label="Toggle menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>

      </div>
    
      {/* Mobile Drawer View */}
      <AnimatePresence>
        
        {open && (
          
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--clr-border)', background: 'var(--clr-bg)', 
              paddingTop: '0.5rem', paddingBottom: '0.5rem'
            }}
          >
        
            <div className="container-page py-4 flex flex-col gap-3">
        
              {LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} className={linkCls} 
                onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              ))}
        
              <div className="pt-2" style={{ borderTop: '1px solid var(--clr-border)', 
                paddingTop: '0.5rem' }}>
        
                {(isLoggedIn && admin) ? (
        
                  <div className="flex flex-col gap-2">
                    <Link to="/admin/dashboard" className="btn btn-sm" style={{ 
                      background: 'rgba(99,102,241,.1)', color: 'var(--clr-primary)' }} 
                      onClick={() => setOpen(false)}>
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>

                    <button onClick={handleLogout} className="btn btn-ghost btn-sm w-full">
                      <LogOut size={14} /> Logout
                    </button>
 
                  </div>
                ) : (
                  <Link to="/admin/login" className="btn btn-primary btn-md w-full" 
                  onClick={() => setOpen(false)}>Admin Login</Link>
                )}

              </div>
            
            </div>
          
          </motion.div>
        
        )}
      
      </AnimatePresence>

    </header>
  )
}
export default Navbar