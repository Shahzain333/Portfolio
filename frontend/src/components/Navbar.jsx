import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Layers, Code2, Briefcase, ArrowRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import useTheme from '../hooks/useTheme'
import Logo from '../components/Logo.jsx'

const LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/projects', label: 'Projects', icon: Layers },
  { to: '/skills', label: 'Skills', icon: Code2 },
  { to: '/experience', label: 'Experience', icon: Briefcase },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark } = useTheme()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open || !isMobile) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open, isMobile])

  const linkCls = ({ isActive }) =>
    `relative text-sm md:text-[0.96rem] font-semibold transition-all duration-200 ${
      isActive ? 'text-[var(--clr-primary)]' : 'text-[var(--clr-text-2)] hover:text-[var(--clr-primary)]'
    }`

  return (
    <>
      <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: open && isMobile
          ? isDark ? 'rgba(6,8,22,.92)' : 'rgba(245,247,251,.92)'
          : scrolled
          ? isDark ? 'rgba(6, 8, 22, 0.78)' : 'rgba(245, 247, 251, 0.75)'
          : isDark ? 'rgba(6, 8, 22, 0.82)' : 'rgba(245, 247, 251, 0.82)',
        borderBottom: scrolled ? '1px solid var(--clr-border)' : '1px solid transparent',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="container-page">

        <div className="flex items-center justify-between h-18">

          <Logo size='lg' onClick={() => setOpen(false)} />

          <nav className="hidden md:flex items-center gap-7">
            {LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={linkCls}>{label}</NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-0 md:gap-1">

            <ThemeToggle />

            <button
              className="md:hidden -ml-2 p-2.5 rounded-xl transition-colors"
              style={{
                color: 'var(--clr-text-2)',
                background: 'transparent',
                boxShadow: 'none',
              }}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />} 
            </button>

          </div>

        </div>
      
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden relative w-full overflow-hidden"
            style={{
              borderTop: '1px solid var(--clr-border)',
              background: isDark
                ? 'rgba(6,8,22,.92)'
                : 'rgba(245,247,251,.92)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            <div className="rotation-atmosphere mobile-menu-atmosphere" aria-hidden="true">
              <div className="rotation-core" />
              <div className="rotation-orbit rotation-orbit-a"><i /><b /></div>
              <div className="rotation-orbit rotation-orbit-b"><i /><b /></div>
              <div className="rotation-orbit rotation-orbit-c"><i /><b /></div>
            </div>
            <div className="container-page relative z-10 py-4 flex flex-col gap-2">
              {LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all ${isActive ? 'text-[var(--clr-primary)]' : 'text-[var(--clr-text-2)]'}`}
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(99,102,241,.12)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,.2)' : 'transparent'}`,
                  })}
                >
                  <span className="flex items-center gap-3"><Icon size={18} />{label}</span>
                  {/* <ArrowRight size={15} className="opacity-50" /> */}
                </NavLink>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </header>

      <AnimatePresence>
        {open && isMobile && (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:.2 }}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 md:hidden"
            style={{ background:'rgba(2,6,23,.52)', backdropFilter:'blur(8px)' }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar