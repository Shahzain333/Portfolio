import { Sun, Moon } from 'lucide-react'
import useTheme from '../hooks/useTheme'

export default function ThemeToggle() {
  
  const { isDark, toggle } = useTheme()

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-lg transition-colors 
    duration-200" style={{ color: 'var(--clr-text-2)', background: 'transparent' }} 
    onMouseEnter={e => { 
        e.currentTarget.style.background = 'var(--clr-bg-3)'; 
        e.currentTarget.style.color = 'var(--clr-primary)' 
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.background = 'transparent'; 
        e.currentTarget.style.color = 'var(--clr-text-2)' 
      }}
    >
      
      {isDark ? <Sun size={17} /> : <Moon size={17} />}

    </button>
  )
}
