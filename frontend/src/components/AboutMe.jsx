import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
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
  const reduceMotion = useReducedMotion()

  const revealLeft = {
    initial: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0, x: -35 },

    whileInView: {
      opacity: 1,
      x: 0,
    },

    viewport: {
      once: true,
      amount: 0.2,
    },

    transition: {
      duration: reduceMotion ? 0 : 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }

  const revealRight = {
    initial: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0, x: 35 },

    whileInView: {
      opacity: 1,
      x: 0,
    },

    viewport: {
      once: true,
      amount: 0.2,
    },

    transition: {
      duration: reduceMotion ? 0 : 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }

  return (
    <section
      id="about"
      className="
        relative
        isolate
        overflow-hidden
        scroll-mt-20
        py-14
        sm:py-16
        lg:flex
        lg:min-h-[calc(100svh-72px)]
        lg:items-center
        lg:py-6
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="
            absolute
            -left-32
            top-1/4
            h-[300px]
            w-[300px]
            rounded-full
            opacity-[0.12]
            blur-[110px]

            lg:h-[420px]
            lg:w-[420px]
          "
          style={{
            background: 'var(--clr-primary)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 25, 0],
                  y: [0, -15, 0],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="
            absolute
            -right-28
            bottom-0
            h-[280px]
            w-[280px]
            rounded-full
            opacity-[0.08]
            blur-[110px]

            lg:h-[380px]
            lg:w-[380px]
          "
          style={{
            background: 'var(--clr-primary)',
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -20, 0],
                  y: [0, 15, 0],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container-page relative z-10 w-full">
        <div
          className="
            grid
            items-center
            gap-12
            md:gap-14
            lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]
            lg:gap-[clamp(2rem,4vw,5rem)]
          "
        >
          {/* ================= IMAGE SIDE ================= */}

          <motion.div
            {...revealLeft}
            className="
              relative
              mx-auto
              w-full
              max-w-[520px]

              lg:mx-0
              lg:max-w-[clamp(340px,34vw,470px)]
            "
          >
            {/* Border */}
            <div
              className="
                pointer-events-none
                absolute
                -inset-px
                rounded-[1.8rem]
                opacity-60
                sm:rounded-[2rem]
              "
              style={{
                background:
                  'linear-gradient(145deg, var(--clr-primary), transparent 35%, transparent 68%, var(--clr-primary))',
              }}
            />

            {/* Main photo card */}
            <motion.div
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -4,
                      scale: 1.005,
                    }
              }
              transition={{
                duration: 0.3,
              }}
              className="
                group
                relative
                h-[430px]
                overflow-hidden
                rounded-[1.8rem]

                sm:h-[500px]
                sm:rounded-[2rem]

                lg:h-[clamp(400px,63vh,590px)]
              "
              style={{
                background: 'var(--clr-bg-card)',
                border: '1px solid var(--clr-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-[0.035]"
                style={{
                  backgroundImage: `
                    linear-gradient(var(--clr-text) 1px, transparent 1px),
                    linear-gradient(90deg, var(--clr-text) 1px, transparent 1px)
                  `,
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Gradient */}
              <div
                className="absolute inset-x-0 bottom-0 h-[60%]"
                style={{
                  background:
                    'linear-gradient(to top, color-mix(in srgb, var(--clr-primary) 18%, transparent), transparent)',
                }}
              />

              {/* DEV Text */}
              <motion.span
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  -translate-x-1/2
                  -translate-y-1/2
                  select-none
                  whitespace-nowrap
                  font-black
                  uppercase
                  tracking-[-0.08em]
                  opacity-[0.035]

                  text-[5rem]
                  sm:text-[7rem]
                  lg:text-[clamp(5rem,8vw,8rem)]
                "
                style={{
                  color: 'var(--clr-text)',
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [-4, 4, -4],
                      }
                }
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                DEV
              </motion.span>

              {/* Badge */}
              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        scale: 1.04,
                      }
                }
                className="
                  absolute
                  left-4
                  top-4
                  z-20
                  flex
                  items-center
                  gap-2
                  rounded-full
                  px-3.5
                  py-2
                  text-[11px]
                  font-semibold
                  backdrop-blur-xl

                  sm:left-5
                  sm:top-5
                  sm:px-4
                  sm:text-xs
                "
                style={{
                  background:
                    'color-mix(in srgb, var(--clr-bg-card) 82%, transparent)',
                  border: '1px solid var(--clr-border)',
                  color: 'var(--clr-text)',
                }}
              >
                <Sparkles
                  size={14}
                  style={{
                    color: 'var(--clr-primary)',
                  }}
                />

                Developer
              </motion.div>

              {/* Portrait */}
              <motion.img
                src={heroImage}
                alt="Developer portrait"
                draggable="false"
                className="
                  absolute
                  bottom-0
                  left-1/2
                  z-10
                  h-[92%]
                  w-auto
                  max-w-none
                  -translate-x-1/2
                  select-none
                  object-contain
                  object-bottom
                  drop-shadow-[0_25px_30px_rgba(0,0,0,0.22)]
                  transition-transform
                  duration-500

                  group-hover:scale-[1.015]
                "
              />
            </motion.div>

            {/* Floating card */}
            <motion.div
              initial={
                reduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 0,
                      y: 15,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -4,
                    }
              }
              transition={{
                duration: 0.45,
                delay: 0.25,
              }}
              className="
                absolute
                -bottom-4
                right-3
                z-30
                rounded-2xl
                px-4
                py-3
                backdrop-blur-xl

                sm:-right-5
                sm:px-5
              "
              style={{
                background:
                  'color-mix(in srgb, var(--clr-bg-card) 90%, transparent)',
                border: '1px solid var(--clr-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl

                    sm:h-10
                    sm:w-10
                  "
                  style={{
                    background: 'var(--grad-card)',
                    color: 'var(--clr-primary)',
                  }}
                >
                  <Code2 size={18} />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[10px]
                      uppercase
                      tracking-[0.15em]
                    "
                    style={{
                      color: 'var(--clr-text-2)',
                    }}
                  >
                    I build
                  </p>

                  <p
                    className="
                      whitespace-nowrap
                      text-xs
                      font-bold

                      sm:text-sm
                    "
                    style={{
                      color: 'var(--clr-text)',
                    }}
                  >
                    Digital Experiences
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= CONTENT SIDE ================= */}

          <motion.div
            {...revealRight}
            className="
              min-w-0
              lg:max-w-[720px]
            "
          >
            {/* Label */}
            <div className="mb-3 flex items-center gap-3">
              <motion.span
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: 32,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.55,
                }}
                className="h-px"
                style={{
                  background: 'var(--clr-primary)',
                }}
              />

              <span
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.22em]
                  sm:text-xs
                "
                style={{
                  color: 'var(--clr-primary)',
                }}
              >
                About Me
              </span>
            </div>

            {/* Heading */}
            <h2
              className="
                max-w-[760px]
                font-bold
                leading-[1.02]
                tracking-[-0.045em]
              "
              style={{
                color: 'var(--clr-text)',
                fontSize:
                  'clamp(2.15rem, min(4.1vw, 6vh), 4.25rem)',
              }}
            >
              Building with purpose

              <span
                className="block"
                style={{
                  color: 'var(--clr-primary)',
                }}
              >
                Designing for impact.
              </span>
            </h2>

            {/* Paragraphs */}
            <p
              className="
                mt-[clamp(1rem,2vh,1.5rem)]
                max-w-[650px]
                text-[15px]
                leading-7

                xl:text-[17px]
              "
              style={{
                color: 'var(--clr-text)',
              }}
            >
              I’m a MERN Stack Developer who enjoys turning ideas into polished, high-performing digital products. I focus on creating responsive, scalable, and thoughtfully built web experiences that are both functional and easy to use.
            </p>

            <p
              className="
                mt-3
                max-w-[650px]
                text-sm
                leading-6

                xl:text-base
                xl:leading-7
              "
              style={{
                color: 'var(--clr-text-2)',
              }}
            >
              From frontend interfaces to backend APIs and application logic, I enjoy working across the full development process. I’m also expanding my skills with Python, continuously learning new technologies and improving the way I build modern web applications.
            </p>

            {/* Divider */}
            <div
              className="
                my-[clamp(1rem,2vh,1.5rem)]
                h-px
                w-full
              "
              style={{
                background: 'var(--clr-border)',
              }}
            />

            {/* Skills */}
            <div
              className="
                grid
                grid-cols-1
                gap-2.5
                sm:grid-cols-3
                lg:gap-3
              "
            >
              {skills.map((item, index) => {
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.title}
                    initial={
                      reduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 0,
                            y: 15,
                          }
                    }
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: reduceMotion
                        ? 0
                        : index * 0.08,
                      duration: 0.4,
                    }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            y: -5,
                          }
                    }
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="
                      group
                      cursor-default
                      rounded-2xl
                      p-3.5
                      transition-colors
                      duration-300

                      xl:p-4
                    "
                    style={{
                      background: 'var(--clr-bg-card)',
                      border: '1px solid var(--clr-border)',
                    }}
                  >
                    <motion.div
                      className="
                        mb-3
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl

                        xl:h-10
                        xl:w-10
                      "
                      style={{
                        background: 'var(--grad-card)',
                        color: 'var(--clr-primary)',
                      }}
                      whileHover={
                        reduceMotion
                          ? undefined
                          : {
                              rotate: 5,
                              scale: 1.08,
                            }
                      }
                    >
                      <Icon size={18} />
                    </motion.div>

                    <h3
                      className="
                        text-sm
                        font-bold
                      "
                      style={{
                        color: 'var(--clr-text)',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-1.5
                        text-xs
                        leading-[1.6]
                      "
                      style={{
                        color: 'var(--clr-text-2)',
                      }}
                    >
                      {item.text}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            {/* <div
              className="
                mt-[clamp(1.2rem,2.5vh,1.8rem)]
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -3,
                      }
                }
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  to="/experience"
                  className="
                    group
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    transition-all
                    duration-300
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-offset-2
                  "
                  style={{
                    background: 'var(--clr-primary)',
                    color: 'var(--clr-bg)',
                    boxShadow:
                      '0 10px 25px color-mix(in srgb, var(--clr-primary) 22%, transparent)',
                  }}
                >
                  Explore my journey

                  <ArrowUpRight
                    size={17}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                  />
                </Link>
              </motion.div>

              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        x: 3,
                      }
                }
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  to="/projects"
                  className="
                    group
                    inline-flex
                    min-h-11
                    items-center
                    gap-2
                    rounded-xl
                    px-3
                    text-sm
                    font-semibold
                    focus-visible:outline-none
                    focus-visible:ring-2
                  "
                  style={{
                    color: 'var(--clr-text)',
                  }}
                >
                  View my work

                  <ArrowUpRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                    "
                    style={{
                      color: 'var(--clr-primary)',
                    }}
                  />
                </Link>
              </motion.div>
            </div> */}

          </motion.div>
        </div>
      </div>
    </section>
  )
}