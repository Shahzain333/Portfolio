import { Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const SIZES = {
  sm: { box: 'w-7 h-7',  icon: 16, text: 'text-base'  },
  md: { box: 'w-9 h-9',  icon: 18, text: 'text-lg'    },
  lg: { box: 'w-12 h-12', icon: 24, text: 'text-2xl'  },
}

export function Logo({ size = 'md', asLink = true, onClick }) {

  const s = SIZES[size] || SIZES.md

  const inner = (
    <div className="flex items-center gap-2.5 group select-none">

      {/* Icon box */}
      <div className={`${s.box} rounded-xl flex items-center justify-center flex-shrink-0 
      transition-transform duration-200 group-hover:scale-110`} style={{ background: 'var(--grad-primary)',
       boxShadow: 'var(--shadow-md)' }}>

        <Code2 size={s.icon} className="text-white" strokeWidth={2.5} />
      
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
      
        <span className={`${s.text} font-extrabold tracking-tight`}
          style={{ color: 'var(--clr-text)', letterSpacing: '-0.03em' }}>
          SK_<span className="gradient-text" style={{ fontStyle: 'italic' }}>DEV</span>

        </span>

        {/* <span className="text-[0.6rem] font-semibold tracking-[0.18em] uppercase"
          style={{ color: 'var(--clr-text-3)', marginTop: '1px' }}>
          Portfolio
        </span> */}
      
      </div>

    </div>
  )

  if (!asLink) return <div onClick={onClick}>{inner}</div>

  return (
    <Link to="/" onClick={onClick} className="flex-shrink-0">
      {inner}
    </Link>
  )
}

export default Logo