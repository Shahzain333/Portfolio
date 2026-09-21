import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Code2,
  Layers,
  Briefcase,
  Globe,
  ExternalLink,
  FolderOpen,
} from 'lucide-react'

import useProjectActions from '../hooks/useProjectActions'
import useSkillActions from '../hooks/useSkillActions'
import useExperienceActions from '../hooks/useExperienceActions'

import Loader from '../components/Loader'
import AboutMe from '../components/AboutMe'
import ProjectStatusBadge from '../components/ProjectStatusBadge'


// ----------------------------------------------------
// Animation
// ----------------------------------------------------

const fd = (i = 0) => ({
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },

  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  viewport: {
    once: true,
    amount: 0.15,
  },

  transition: {
    delay: i * 0.08,
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
  },
})


export default function Home() {
  const { fetchProjects } = useProjectActions()
  const { fetchSkills } = useSkillActions()
  const { fetchExperiences } = useExperienceActions()

  const { items: projects, loading: pLoad } = useSelector(
    (s) => s.projects
  )

  const { items: skills } = useSelector(
    (s) => s.skills
  )

  const { items: experiences } = useSelector(
    (s) => s.experiences
  )


  useEffect(() => {
    fetchProjects(1, 3)
    fetchSkills(1, 18)
    fetchExperiences(1, 10)
  }, [])


  const currentJob = experiences.find(
    (e) => e.isCurrent
  )


  return (
    <div
      style={{
        color: 'var(--clr-text)',
      }}
    >

      {/* ====================================================
          HERO
      ==================================================== */}

      <section className="section home-hero relative overflow-hidden">

        {/* Background animations */}

        <div className="absolute inset-0 pointer-events-none">

          <motion.div
            className="
              absolute
              -top-28
              -right-16
              w-[620px]
              h-[620px]
              rounded-full
              opacity-[0.10]
            "
            style={{
              background: 'var(--grad-primary)',
              filter: 'blur(90px)',
            }}
            animate={{
              x: [0, -30, 0],
              y: [0, 25, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="
              absolute
              -bottom-32
              -left-20
              w-[420px]
              h-[420px]
              rounded-full
              opacity-[0.08]
            "
            style={{
              background: '#22d3ee',
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, 35, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

        </div>


        <div className="container-page pt-5 relative z-10">

          <div className="max-w-4xl">

            {/* Current Job */}

            {currentJob && (

              <motion.div
                {...fd(0)}
                className="mb-6"
              >

                <motion.span
                  className="badge badge-success"
                  whileHover={{
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >

                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      animate-pulse
                    "
                    style={{
                      background: 'var(--clr-success)',
                    }}
                  />

                  {currentJob.role} @ {currentJob.companyName}

                </motion.span>

              </motion.div>

            )}


            {/* Heading */}

            <motion.h1
              {...fd(1)}
              className="
                font-extrabold
                tracking-[-0.06em]
                leading-[0.95]
                mb-6
              "
              style={{
                fontSize: 'clamp(3rem, 7vw, 5rem)',
              }}
            >

              Building modern web experiences

              <motion.span
                className="gradient-text block"
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                }}
              >
                that make an impact.
              </motion.span>

            </motion.h1>


            {/* Description */}

            <motion.p
              {...fd(2)}
              className="
                leading-relaxed
                mb-8
                max-w-33xl
              "
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.26rem)',
                color: 'var(--clr-text-2)',
              }}
            >

              I’m a MERN Stack Developer focused on building fast, responsive, and scalable web applications with clean code, thoughtful user experiences, and real-world functionality.

            </motion.p>


            {/* Buttons */}

            <motion.div
              {...fd(3)}
              className="flex flex-wrap gap-3 mb-8"
            >

              <motion.div
                whileHover={{
                  y: -3,
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.2,
                }}
              >

                <Link
                  to="/projects"
                  className="btn btn-primary btn-lg group"
                >

                  View My Work

                  <ArrowRight
                    size={18}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />

                </Link>

              </motion.div>


              <motion.div
                whileHover={{
                  y: -3,
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.2,
                }}
              >

                <Link
                  to="/experience"
                  className="btn btn-ghost btn-lg"
                >
                  My Journey
                </Link>

              </motion.div>

            </motion.div>


            {/* Stats */}

            <motion.div
              {...fd(4)}
              className="
                grid
                gap-4
                sm:grid-cols-3
                max-w-3xl
              "
            >

              {[
                {
                  icon: Layers,
                  val: projects.length,
                  label: 'Projects Built',
                },
                {
                  icon: Code2,
                  val: skills.length,
                  label: 'Technologies',
                },
                {
                  icon: Briefcase,
                  val: experiences.length,
                  label: 'Work Experience',
                },
              ].map(
                (
                  {
                    icon: Icon,
                    val,
                    label,
                  },
                  index
                ) => (

                  <motion.div
                    key={label}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.4,
                    }}
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="card p-4"
                    style={{
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >

                    <div className="flex items-center gap-3">

                      <motion.div
                        className="
                          w-11
                          h-11
                          rounded-xl
                          flex
                          items-center
                          justify-center
                        "
                        style={{
                          background:
                            'rgba(79, 70, 229, 0.1)',
                        }}
                        whileHover={{
                          rotate: 8,
                          scale: 1.1,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 15,
                        }}
                      >

                        <Icon
                          size={18}
                          style={{
                            color:
                              'var(--clr-primary)',
                          }}
                        />

                      </motion.div>


                      <div>

                        <div
                          className="
                            text-2xl
                            font-extrabold
                            leading-none
                          "
                          style={{
                            color: 'var(--clr-text)',
                          }}
                        >
                          {val}
                        </div>

                        <div
                          className="
                            text-xs
                            mt-1
                            uppercase
                            tracking-[0.12em]
                          "
                          style={{
                            color:
                              'var(--clr-text-3)',
                          }}
                        >
                          {label}
                        </div>

                      </div>

                    </div>

                  </motion.div>

                )
              )}

            </motion.div>

          </div>

        </div>

      </section>


      {/* ====================================================
          ABOUT
      ==================================================== */}

      <AboutMe />

      {/* ====================================================
          FEATURED PROJECTS
      ==================================================== */}

      <section className="section !pt-6 sm:!pt-8 lg:!pt-10 !pb-14">
        <div className="container-page">

          {/* Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.45,
            }}
            className="
              flex
              items-end
              justify-between
              mb-7
              gap-4
            "
          >
            <div>
              <p className="section-label">
                Portfolio
              </p>

              <h2 className="section-title">
                Featured Projects
              </h2>
            </div>

            {/* Only show button when projects exist */}
            {projects.length > 0 && (
              <motion.div
                whileHover={{
                  x: 4,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <Link
                  to="/projects"
                  className="
                    btn
                    btn-ghost
                    btn-sm
                    group
                  "
                >
                  All Projects

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Loading */}
          {pLoad ? (
            <Loader />
          ) : projects.length === 0 ? (

            /* Empty Projects State */
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                min-h-[260px]
                rounded-2xl
                px-6
                py-10
              "
              style={{
                background: 'var(--clr-bg-card)',
                border: '1px solid var(--clr-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Icon */}
              <motion.div
                initial={{
                  scale: 0.8,
                  rotate: -5,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                whileHover={{
                  scale: 1.08,
                  rotate: 4,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 250,
                  damping: 18,
                }}
                className="
                  w-16
                  h-16
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  mb-5
                "
                style={{
                  background: 'rgba(79, 70, 229, 0.10)',
                  color: 'var(--clr-primary)',
                }}
              >
                <FolderOpen size={30} strokeWidth={1.8} />
              </motion.div>

              <h3
                className="
                  text-lg
                  font-bold
                  mb-2
                "
                style={{
                  color: 'var(--clr-text)',
                }}
              >
                Projects coming soon
              </h3>

              <p
                className="
                  text-sm
                  leading-relaxed
                  max-w-sm
                "
                style={{
                  color: 'var(--clr-text-3)',
                }}
              >
                I'm currently preparing some of my latest work.
                Check back soon to explore the projects.
              </p>
            </motion.div>

          ) : (

            /* Projects Grid */
            <div
              className="
                grid
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
              "
            >
              {projects
                .slice(0, 3)
                .map((p, i) => {
                  const cats = Array.isArray(p.category)
                    ? p.category
                    : [p.category].filter(Boolean)

                  return (
                    <motion.div
                      key={p._id}
                      initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.98,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        delay: i * 0.08,
                        duration: 0.45,
                        ease: 'easeOut',
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.01,
                      }}
                      className="
                        card
                        group
                        overflow-hidden
                        card-hover
                      "
                    >

                      {/* Project Image */}
                      <div
                        className="
                          relative
                          h-52
                          overflow-hidden
                        "
                        style={{
                          background: 'var(--grad-card)',
                        }}
                      >
                        {p.imageUrl ? (
                          <motion.img
                            src={p.imageUrl}
                            alt={p.title}
                            className="
                              w-full
                              h-full
                              object-cover
                              transition-transform
                              duration-700
                              ease-out
                              group-hover:scale-110
                            "
                          />
                        ) : (
                          
                          <div
                            className="
                              w-full
                              h-full
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <motion.div
                              whileHover={{
                                scale: 1.1,
                                rotate: 4,
                              }}
                              className="
                                w-16
                                h-16
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                              "
                              style={{
                                background:
                                  'rgba(79, 70, 229, 0.10)',
                                color:
                                  'var(--clr-primary)',
                              }}
                            >
                              <FolderOpen
                                size={30}
                                strokeWidth={1.7}
                              />
                            </motion.div>
                          </div>
                        )}

                        {p.status && (
                          <ProjectStatusBadge
                            status={p.status}
                            className="
                              absolute
                              top-3
                              right-3
                            "
                          />
                        )}
                      </div>

                      {/* Project Content */}
                      <div className="p-5">

                        {/* Categories */}
                        {cats.length > 0 && (
                          <div
                            className="
                              flex
                              flex-wrap
                              gap-1.5
                              mb-2.5
                            "
                          >
                            {cats.map((c, index) => (
                              <motion.span
                                key={`${c}-${index}`}
                                initial={{
                                  opacity: 0,
                                  scale: 0.8,
                                }}
                                whileInView={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                viewport={{
                                  once: true,
                                }}
                                transition={{
                                  delay: index * 0.05,
                                }}
                                whileHover={{
                                  scale: 1.05,
                                }}
                                className="
                                  badge
                                  badge-primary
                                  text-xs
                                "
                              >
                                {c}
                              </motion.span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h3
                          className="
                            font-bold
                            mb-1.5
                            truncate
                          "
                          style={{
                            color: 'var(--clr-text)',
                            fontSize: '1rem',
                          }}
                        >
                          {p.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="
                            text-sm
                            leading-relaxed
                            line-clamp-2
                            mb-4
                          "
                          style={{
                            color: 'var(--clr-text-2)',
                          }}
                        >
                          {p.description}
                        </p>

                        {/* Links */}
                        {(p.projectUrl || p.sourceCodeUrl) && (
                          <div
                            className="
                              flex
                              gap-4
                              pt-3
                            "
                            style={{
                              borderTop:
                                '1px solid var(--clr-border)',
                            }}
                          >
                            {p.projectUrl && (
                              <motion.a
                                href={p.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{
                                  x: 3,
                                }}
                                whileTap={{
                                  scale: 0.96,
                                }}
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-xs
                                  font-semibold
                                "
                                style={{
                                  color:
                                    'var(--clr-primary)',
                                }}
                              >
                                <Globe size={12} />
                                Live Demo
                              </motion.a>
                            )}

                            {p.sourceCodeUrl && (
                              <motion.a
                                href={p.sourceCodeUrl}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{
                                  x: 3,
                                }}
                                whileTap={{
                                  scale: 0.96,
                                }}
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-xs
                                  font-semibold
                                "
                                style={{
                                  color:
                                    'var(--clr-text-2)',
                                }}
                              >
                                <ExternalLink size={12} />
                                Source
                              </motion.a>
                            )}
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )
                })}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          SKILLS
      ==================================================== */}

      {skills.length > 0 && (

        <section
          className="section-sm"
          style={{
            background: 'var(--clr-bg-2)',
          }}
        >

          <div className="container-page">

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
              className="
                flex
                items-end
                justify-between
                mb-8
                gap-4
              "
            >

              <div>

                <p className="section-label">
                  Tech Stack
                </p>

                <h2
                  className="section-title"
                  style={{
                    fontSize: '1.9rem',
                  }}
                >
                  Skills & Tools
                </h2>

              </div>


              <motion.div
                whileHover={{
                  x: 4,
                }}
                transition={{
                  duration: 0.2,
                }}
              >

                <Link
                  to="/skills"
                  className="
                    btn
                    btn-ghost
                    btn-sm
                    group
                  "
                >

                  All Skills

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                  />

                </Link>

              </motion.div>

            </motion.div>


            <div
              className="
                flex
                flex-wrap
                gap-2.5
              "
            >

              {skills.map(
                (s, i) => (

                  <motion.div
                    key={s._id}
                    initial={{
                      opacity: 0,
                      y: 15,
                      scale: 0.9,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: Math.min(
                        i * 0.035,
                        0.4
                      ),
                      duration: 0.35,
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.05,
                      borderColor:
                        'var(--clr-primary)',
                      color:
                        'var(--clr-primary)',
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-xl
                      transition-colors
                      duration-200
                    "
                    style={{
                      background:
                        'var(--clr-bg-card)',
                      border:
                        '1px solid var(--clr-border)',
                      color:
                        'var(--clr-text-2)',
                      fontSize: '.875rem',
                      fontWeight: 600,
                      cursor: 'default',
                    }}
                  >

                    {s.iconUrl && (

                      <motion.img
                        src={s.iconUrl}
                        alt={s.name}
                        className="
                          w-4
                          h-4
                          object-contain
                        "
                        whileHover={{
                          rotate: 8,
                          scale: 1.15,
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            'none'
                        }}
                      />

                    )}

                    {s.name}

                  </motion.div>

                )
              )}

            </div>

          </div>

        </section>

      )}

    </div>
  )
}