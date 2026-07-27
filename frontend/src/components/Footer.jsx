import { Link } from 'react-router-dom'
import { Code2, Mail } from 'lucide-react'

// ── Brand SVG icons ───────────────────────────────────────────────────────────
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
      0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
      -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
      .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
      -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0
      012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595
      1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012
      2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136
      1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85
      3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065
      2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771
      C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227
      24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401
      6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084
      4.126H5.117z" />
  </svg>
)

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954
      10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669
      1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328
      l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// ── Social + Email links — update hrefs here ──────────────────────────────────
const SOCIALS = [
  {
    label:          'Email',
    href:           'mailto:shahzainkhannaizi1234@gmail.com',
    icon:           Mail,
    isLucide:       true,   // lucide component — needs size prop differently
    hoverColor:     'var(--clr-primary)',
    darkHoverColor: 'var(--clr-primary)',
  },
  {
    label:          'GitHub',
    href:           'https://github.com/yourusername',
    icon:           GithubIcon,
    hoverColor:     '#1a1a1a',
    darkHoverColor: '#e6edf3',
  },
  {
    label:          'LinkedIn',
    href:           'https://linkedin.com/in/yourusername',
    icon:           LinkedinIcon,
    hoverColor:     '#0a66c2',
    darkHoverColor: '#0a66c2',
  },
  {
    label:          'Twitter / X',
    href:           'https://twitter.com/yourusername',
    icon:           TwitterIcon,
    hoverColor:     '#000000',
    darkHoverColor: '#ffffff',
  },
  {
    label:          'Facebook',
    href:           'https://facebook.com/yourusername',
    icon:           FacebookIcon,
    hoverColor:     '#1877f2',
    darkHoverColor: '#1877f2',
  },
]

const NAV_LINKS = [
  ['/',           'Home'      ],
  ['/projects',   'Projects'  ],
  ['/skills',     'Skills'    ],
  ['/experience', 'Experience'],
]

// Shared hover handlers — avoid repeating inline styles
const onEnter = (hoverColor, darkHoverColor) => e => {
  const dark = document.documentElement.classList.contains('dark')
  e.currentTarget.style.color       = dark ? darkHoverColor : hoverColor
  e.currentTarget.style.background  = 'var(--clr-bg-card)'
  e.currentTarget.style.borderColor = dark ? darkHoverColor : hoverColor
  e.currentTarget.style.transform   = 'translateY(-3px)'
  e.currentTarget.style.boxShadow   = 'var(--shadow-md)'
}

const onLeave = e => {
  e.currentTarget.style.color       = 'var(--clr-text-2)'
  e.currentTarget.style.background  = 'var(--clr-bg-3)'
  e.currentTarget.style.borderColor = 'var(--clr-border)'
  e.currentTarget.style.transform   = 'translateY(0)'
  e.currentTarget.style.boxShadow   = 'none'
}

export default function Footer() {

  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--clr-border)', background: 'var(--clr-bg-2)', 
     }}>

      <div className="container-page">

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="py-10 flex flex-col md:flex-row items-start md:items-center
          justify-between gap-4 md:gap-8" style={{ paddingBottom: '0.8rem', paddingTop: '0.8rem' }}>

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            
            <div className="w-9 h-9 rounded-xl flex items-center justify-center
                transition-transform group-hover:scale-110"
              style={{ background: 'var(--grad-primary)' }}>
              <Code2 size={18} className="text-white" />
            </div>

            <span className="font-bold text-lg" style={{ color: 'var(--clr-text)' }}>
              SK_<span className="gradient-text">DEV</span>
            </span>
          
          </Link>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            
            {NAV_LINKS.map(([to, label]) => (
            
              <Link key={to} to={to} className="transition-colors duration-200"
                style={{ color: 'var(--clr-text-2)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--clr-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--clr-text-2)' }}>
                {label}
              </Link>

            ))}

          </nav>

          {/* Social icon buttons — using Link for internal, <a> for external */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            
            {SOCIALS.map(({ label, href, icon: Icon, isLucide, hoverColor, darkHoverColor }) => {

              const iconEl = isLucide
                ? <Icon size={16} />
                : <Icon size={16} />

              const sharedProps = {
                key:          label,
                'aria-label': label,
                title:        label,
                className:    'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
                style: {
                  color:      'var(--clr-text-2)',
                  background: 'var(--clr-bg-3)',
                  border:     '1px solid var(--clr-border)',
                },
                onMouseEnter: onEnter(hoverColor, darkHoverColor),
                onMouseLeave: onLeave,
              }

              // Email uses Link (react-router handles mailto fine)
              // External URLs use <a> with target="_blank"
              return href.startsWith('mailto:') ? (
                <Link to={href} {...sharedProps}>{iconEl}</Link>
              ) : (
                <a href={href} target="_blank" rel="noreferrer" {...sharedProps}>{iconEl}</a>
              )
            })}

          </div>

        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div style={{ height: '1px', background: 'var(--clr-border)'}} />

        {/* ── Copyright ─────────────────────────────────────────────────── */}
        <div className="py-6 text-center" style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
          <p className="text-xs" style={{ color: 'var(--clr-text-3)', paddingTop: '0.5rem' }}>
            © {year} SK_Dev_Portfolio · Built with MERN Stack
          </p>
        </div>

      </div>
    </footer>
  )
}