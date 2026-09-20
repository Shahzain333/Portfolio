import { Link } from 'react-router-dom'
import { ArrowUpRight, UserRound } from 'lucide-react'
import heroImage from '../assets/hero.png'

export default function AboutMe() {
  return (
    <section className="section-sm">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <p className="section-label">A little context</p>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>About Me</h2>
            <div className="relative w-full max-w-[380px] mt-5 mx-auto lg:mx-0">
              <div className="absolute -inset-3 rounded-[1.5rem] opacity-60" style={{ background: 'var(--grad-card)', filter: 'blur(14px)' }} />
              <div className="relative aspect-square rounded-[1.5rem] flex items-center justify-center overflow-hidden" style={{ background: 'var(--clr-bg-card)', border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-card)' }}>
                <div className="absolute inset-4 rounded-[1.1rem]" style={{ border: '1px solid var(--clr-border)', background: 'var(--grad-card)' }} />
                <img src={heroImage} alt="Developer profile placeholder" className="relative z-10 w-3/4 h-3/4 object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--grad-card)', color: 'var(--clr-primary)', border: '1px solid var(--clr-border)' }}>
                <UserRound size={22} />
              </div>
              <p className="text-lg leading-relaxed" style={{ color: 'var(--clr-text)' }}>
                I am a developer who enjoys turning complex ideas into clear, useful digital experiences.
              </p>
            </div>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--clr-text-2)' }}>
              I work across frontend, backend, and modern application architecture, with a focus on thoughtful interfaces, reliable systems, and work that creates real value for people.
            </p>
            <Link to="/experience" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--clr-primary)' }}>
              Explore my journey <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
