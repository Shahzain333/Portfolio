import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Code2,
  Layers3,
  Sparkles,
  Braces,
} from 'lucide-react'

import heroImage from '../assets/HeroImage.png'

const skills = [
  {
    icon: Code2,
    title: 'Frontend',
    text: 'Modern, responsive and engaging interfaces.',
  },
  {
    icon: Braces,
    title: 'Backend',
    text: 'Reliable APIs, logic and scalable systems.',
  },
  {
    icon: Layers3,
    title: 'Architecture',
    text: 'Clean structure built for growth and maintainability.',
  },
]

export default function AboutMe() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-10"
    >
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full blur-[150px] opacity-20"
        style={{ background: 'var(--clr-primary)' }}
      />

      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-[380px] w-[380px] rounded-full blur-[150px] opacity-10"
        style={{ background: 'var(--clr-primary)' }}
      />

      <div className="container-page relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">

          {/* ================= IMAGE ================= */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-[500px] lg:mx-0"
          >
            {/* Decorative border */}
            <div
              className="absolute -inset-[1px] rounded-[2.2rem] opacity-60"
              style={{
                background:
                  'linear-gradient(145deg, var(--clr-primary), transparent 35%, transparent 70%, var(--clr-primary))',
              }}
            />

            <div
              className="relative min-h-[470px] overflow-hidden rounded-[2.2rem] sm:min-h-[560px]"
              style={{
                background: 'var(--clr-bg-card)',
                border: '1px solid var(--clr-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--clr-text) 1px, transparent 1px),
                    linear-gradient(90deg, var(--clr-text) 1px, transparent 1px)
                  `,
                  backgroundSize: '34px 34px',
                }}
              />

              {/* Bottom gradient */}
              <div
                className="absolute inset-x-0 bottom-0 h-[55%]"
                style={{
                  background:
                    'linear-gradient(to top, color-mix(in srgb, var(--clr-primary) 18%, transparent), transparent)',
                }}
              />

              {/* Large background text */}
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[5.5rem] font-black uppercase tracking-[-0.08em] opacity-[0.035] sm:text-[8rem]"
                style={{ color: 'var(--clr-text)' }}
              >
                DEV
              </span>

              {/* Badge */}
              <div
                className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold backdrop-blur-xl"
                style={{
                  background:
                    'color-mix(in srgb, var(--clr-bg-card) 80%, transparent)',
                  border: '1px solid var(--clr-border)',
                  color: 'var(--clr-text)',
                }}
              >
                <Sparkles
                  size={14}
                  style={{ color: 'var(--clr-primary)' }}
                />
                Developer
              </div>

              {/* Actual Image */}
              <img
                src={heroImage}
                alt="Portrait"
                className="
                  absolute
                  bottom-0
                  left-1/2
                  z-10
                  h-[94%]
                  w-auto
                  max-w-none
                  -translate-x-1/2
                  object-contain
                  object-bottom
                  drop-shadow-[0_30px_35px_rgba(0,0,0,0.25)]
                "
              />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-5 right-4 z-30 rounded-2xl px-5 py-4 backdrop-blur-xl sm:-right-6"
              style={{
                background:
                  'color-mix(in srgb, var(--clr-bg-card) 88%, transparent)',
                border: '1px solid var(--clr-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: 'var(--grad-card)',
                    color: 'var(--clr-primary)',
                  }}
                >
                  <Code2 size={18} />
                </div>

                <div>
                  <p
                    className="text-[11px] uppercase tracking-[0.16em]"
                    style={{ color: 'var(--clr-text-2)' }}
                  >
                    I build
                  </p>

                  <p
                    className="text-sm font-bold"
                    style={{ color: 'var(--clr-text)' }}
                  >
                    Digital Experiences
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* ================= CONTENT ================= */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
          >
            {/* Section label */}
            <div className="mb-4 flex items-center gap-3">
              <span
                className="h-px w-8"
                style={{ background: 'var(--clr-primary)' }}
              />

              <span
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: 'var(--clr-primary)' }}
              >
                About Me
              </span>
            </div>

            {/* Main heading */}
            <h2
              className="max-w-[750px] font-bold leading-[1.05] tracking-[-0.045em]"
              style={{
                color: 'var(--clr-text)',
                fontSize: 'clamp(2.5rem, 5vw, 4.7rem)',
              }}
            >
              I turn ideas into
              <span
                className="block"
                style={{ color: 'var(--clr-primary)' }}
              >
                digital experiences.
              </span>
            </h2>

            {/* Main paragraph */}
            <p
              className="mt-7 max-w-[650px] text-lg leading-8"
              style={{ color: 'var(--clr-text)' }}
            >
              I’m a developer who enjoys solving problems through thoughtful
              design and clean development. I focus on creating products that
              don’t just look good — they feel intuitive, perform well, and
              serve a real purpose.
            </p>

            <p
              className="mt-4 max-w-[650px] leading-7"
              style={{ color: 'var(--clr-text-2)' }}
            >
              From frontend interfaces to backend systems and application
              architecture, I enjoy working across the complete development
              process and turning complex ideas into simple, polished
              experiences.
            </p>

            {/* Divider */}
            <div
              className="my-8 h-px w-full"
              style={{ background: 'var(--clr-border)' }}
            />

            {/* Skills */}
            <div className="grid gap-3 sm:grid-cols-3">
              {skills.map((item, index) => {
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.1 + index * 0.1,
                      duration: 0.45,
                    }}
                    whileHover={{ y: -5 }}
                    className="group rounded-2xl p-4 transition-colors"
                    style={{
                      background: 'var(--clr-bg-card)',
                      border: '1px solid var(--clr-border)',
                    }}
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: 'var(--grad-card)',
                        color: 'var(--clr-primary)',
                      }}
                    >
                      <Icon size={19} />
                    </div>

                    <h3
                      className="text-sm font-bold"
                      style={{ color: 'var(--clr-text)' }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="mt-2 text-xs leading-5"
                      style={{ color: 'var(--clr-text-2)' }}
                    >
                      {item.text}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/experience"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-bold
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
                style={{
                  background: 'var(--clr-primary)',
                  color: 'var(--clr-bg)',
                  boxShadow:
                    '0 12px 30px color-mix(in srgb, var(--clr-primary) 25%, transparent)',
                }}
              >
                Explore my journey

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 text-sm font-semibold ml-3 sm:ml-0"
                style={{ color: 'var(--clr-text)' }}
              >
                View my work

                <ArrowUpRight
                  size={16}
                  style={{ color: 'var(--clr-primary)' }}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}