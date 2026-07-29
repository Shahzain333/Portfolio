import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Eye, EyeOff, LogIn, Code2 } from 'lucide-react'
import useAuthActions from '../../hooks/useAuthActions'
import Logo from '../../components/logo'

export default function AdminLogin() {
  const { login }               = useAuthActions()
  const { isLoggedIn, loading } = useSelector(s => s.auth)
  const navigate                = useNavigate()
  const [form, setForm]         = useState({ email:'', password:'' })
  const [show, setShow]         = useState(false)
  const [errors, setErrors]     = useState({})

  // useEffect(() => { 
  //   if (isLoggedIn) 
  //     navigate('/admin/dashboard', { replace:true }) 
  //   }, [isLoggedIn])

  const validate = () => {
    
    const e = {}

    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    
    if (!form.password.trim()) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
  
    setErrors(e)
  
    return !Object.keys(e).length
  
  }

  const onSubmit = async e => {
    e.preventDefault()

    if (!validate()) return
    
    const ok = await login(form)
  
    if (ok) navigate('/admin/dashboard', { replace:true })
  
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{background:'var(--clr-bg)'}}>

      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10"
          style={{background:'var(--grad-primary)', filter:'blur(80px)'}} />
      </div>

      <div className="w-full max-w-md relative z-10">

        <div className="card p-8" style={{boxShadow:'var(--shadow-lg)'}}>

          <div className="text-center mb-8">
          
            <div className="flex items-center justify-center mb-4">
              <Logo size="lg" asLink={false}/>
            </div>
          
            <h1 className="text-2xl font-extrabold mb-1" style={{color:'var(--clr-text)'}}>
              Admin <span className="gradient-text" style={{ fontStyle: 'italic' }}>Login</span>
            </h1>
          
            <p className="text-sm" style={{color:'var(--clr-text-2)'}}>Sign in to manage your portfolio</p>
          
          </div>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>

            <div>
            
              <label className="block text-sm font-semibold mb-1.5" style={{color:'var(--clr-text-2)'}}>Email</label>
            
              <input type="email" autoComplete="username" placeholder="admin@portfolio.com"
                className={`input ${errors.email ? 'error' : ''}`}
                value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} 
                disabled={loading} />
            
              {errors.email && <p className="text-xs mt-1" style={{color:'var(--clr-error)'}}>
                {errors.email} </p>}
            
            </div>

            <div>

              <label className="block text-sm font-semibold mb-1.5" style={{color:'var(--clr-text-2)'}}>Password</label>
              
              <div className="relative">
              
                <input type={ show ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
                  className={`input pr-12 ${errors.password ? 'error' : ''}`}
                  value={form.password} onChange={e => setForm(p => ({...p, password:e.target.value}))} 
                  disabled={loading} />
              
                <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{color:'var(--clr-text-3)'}}>
                  
                  {show ? <Eye size={16}/> : <EyeOff size={16}/>}

                </button>
              
              </div>
            
              {errors.password && <p className="text-xs mt-1" style={{color:'var(--clr-error)'}}>{errors.password}</p>}
            
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-2">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white 
              rounded-full animate-spin"/> : <><LogIn size={17}/> Sign In</>}
            </button>
          
          </form>

          <p className="text-center mt-5 text-sm">

            <Link to="/" className="transition-colors" style={{color:'var(--clr-text-2)'}}
              onMouseEnter={e=>e.target.style.color='var(--clr-primary)'}
              onMouseLeave={e=>e.target.style.color='var(--clr-text-2)'}>
              ← Back to site
            </Link>
        
          </p>

        </div>

      </div>

    </div>
  )
}
