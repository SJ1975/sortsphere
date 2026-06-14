'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { SignUpButton, useAuth } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { AnimatedBars } from '@/components/shared/AnimatedBars';
import { ALGORITHM_INFO, ALGORITHM_KEYS } from '@/lib/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  {
    icon: '◈',
    title: '3D Immersive Visualization',
    description:
      'Watch algorithms come alive with interactive 3D bars you can orbit, zoom, and explore from any angle using WebGL.',
    color: '#6366f1',
  },
  {
    icon: '⚡',
    title: 'Real-time Performance Metrics',
    description:
      'Live comparison and swap counters update every frame. Understand why O(n²) is slow without reading a textbook.',
    color: '#22d3ee',
  },
  {
    icon: '◐',
    title: 'Educational Deep-Dives',
    description:
      'Every algorithm ships with complexity analysis, step-by-step explanations, stability notes, and space analysis.',
    color: '#10b981',
  },
];

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* ════════════════════════════════
          HERO SECTION
      ════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '80px',
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div className="section-container" style={{ width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
              minHeight: '75vh',
            }}
          >
            {/* ── LEFT — Text ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              {/* Live badge */}
              <motion.div variants={fadeUp}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '999px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    color: '#818cf8',
                    letterSpacing: '0.08em',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 6px #10b981',
                    }}
                  />
                  LIVE 3D VISUALIZATION PLATFORM
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em',
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                }}
              >
                <span style={{ color: '#f1f5f9' }}>Visualize</span>
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, #818cf8, #a78bfa 50%, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sorting
                </span>
                <br />
                <span style={{ color: '#f1f5f9' }}>Algorithms</span>
                <br />
                <span
                  style={{
                    color: '#475569',
                    fontSize: '0.65em',
                    fontWeight: 600,
                  }}
                >
                  in 3D
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.75,
                  color: '#94a3b8',
                  maxWidth: '440px',
                  fontFamily: 'var(--font-geist)',
                }}
              >
                An immersive platform that transforms abstract sorting
                algorithms into interactive 3D experiences. Watch, learn, and
                compare with live performance metrics.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={fadeUp}
                style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
              >
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    className="btn-primary"
                    style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
                  >
                    Open Dashboard →
                  </Link>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <button
                        className="btn-primary"
                        style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
                      >
                        Start for Free →
                      </button>
                    </SignUpButton>
                    <Link
                      href="/#algorithms"
                      className="btn-ghost"
                      style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
                    >
                      View Algorithms
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Micro stats */}
              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#475569',
                }}
              >
                6 algorithms &nbsp;•&nbsp; 3D WebGL &nbsp;•&nbsp; Live metrics
                &nbsp;•&nbsp; Free forever
              </motion.p>
            </motion.div>

            {/* ── RIGHT — Animated bars card ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              style={{ position: 'relative' }}
            >
              <div
                className="glass"
                style={{
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow:
                    '0 0 80px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.04)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#475569',
                        marginBottom: '0.25rem',
                        letterSpacing: '0.1em',
                      }}
                    >
                      LIVE DEMO
                    </p>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-syne)',
                        fontWeight: 600,
                        color: '#94a3b8',
                      }}
                    >
                      Bubble Sort
                    </p>
                  </div>
                  {/* Traffic light dots */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      alignItems: 'center',
                      marginTop: '4px',
                    }}
                  >
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#f43f5e',
                        opacity: 0.7,
                      }}
                    />
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#fbbf24',
                        opacity: 0.7,
                      }}
                    />
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#10b981',
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>

                {/* Animated bars */}
                <AnimatedBars />

                {/* Color legend */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginTop: '1rem',
                  }}
                >
                  {[
                    { color: '#6366f1', label: 'Idle' },
                    { color: '#fbbf24', label: 'Comparing' },
                    { color: '#f43f5e', label: 'Swapping' },
                    { color: '#10b981', label: 'Sorted' },
                  ].map(({ color, label }) => (
                    <div
                      key={label}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '2px',
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#475569',
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating complexity badge */}
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  bottom: '-16px',
                  right: '-16px',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.6rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#475569',
                    marginBottom: '2px',
                  }}
                >
                  WORST CASE
                </p>
                <p
                  style={{
                    fontSize: '1.4rem',
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  O(n²)
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          STATS BAR
      ════════════════════════════════ */}
      <section
        style={{
          padding: '2rem 0',
          borderTop: '1px solid rgba(99,102,241,0.08)',
          borderBottom: '1px solid rgba(99,102,241,0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="section-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            {[
              { value: '6', label: 'Algorithms' },
              { value: '3D', label: 'WebGL Renderer' },
              { value: '∞', label: 'Frame Control' },
              { value: 'Free', label: 'Forever' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 800,
                    fontSize: '2rem',
                    background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {value}
                </p>
                <p
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#475569',
                    marginTop: '4px',
                    letterSpacing: '0.06em',
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════ */}
      <section
        id="features"
        style={{ padding: '7rem 0', position: 'relative', zIndex: 1 }}
      >
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <p
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#6366f1',
                  letterSpacing: '0.15em',
                  marginBottom: '1rem',
                }}
              >
                FEATURES
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  lineHeight: 1.15,
                  color: '#f1f5f9',
                }}
              >
                Built for understanding,
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  not just watching
                </span>
              </h2>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {FEATURES.map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  className="glass-hover"
                  style={{ borderRadius: '16px', padding: '2rem' }}
                >
                  <span
                    style={{
                      fontSize: '2rem',
                      color: f.color,
                      display: 'block',
                      marginBottom: '1rem',
                    }}
                  >
                    {f.icon}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#f1f5f9',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.7,
                      color: '#94a3b8',
                      fontFamily: 'var(--font-geist)',
                    }}
                  >
                    {f.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          ALGORITHMS GRID
      ════════════════════════════════ */}
      <section
        id="algorithms"
        style={{ padding: '7rem 0', position: 'relative', zIndex: 1 }}
      >
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <p
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#6366f1',
                  letterSpacing: '0.15em',
                  marginBottom: '1rem',
                }}
              >
                ALGORITHMS
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  lineHeight: 1.15,
                  color: '#f1f5f9',
                }}
              >
                6 classics,
                <span
                  style={{
                    background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {' '}
                  fully visualized
                </span>
              </h2>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1rem',
              }}
            >
              {ALGORITHM_KEYS.map((key) => {
                const info = ALGORITHM_INFO[key];
                const isNLogN = info.timeComplexity.average.includes('log');

                return (
                  <motion.div
                    key={key}
                    variants={fadeUp}
                    className="glass-hover"
                    style={{ borderRadius: '14px', padding: '1.5rem' }}
                  >
                    {/* Header row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: '0.6rem',
                            fontFamily: 'var(--font-mono)',
                            color: '#475569',
                            marginBottom: '0.25rem',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {info.inPlace ? 'IN-PLACE' : 'EXTRA MEMORY'}
                          &nbsp;·&nbsp;
                          {info.stable ? 'STABLE' : 'UNSTABLE'}
                        </p>
                        <h3
                          style={{
                            fontFamily: 'var(--font-syne)',
                            fontWeight: 700,
                            fontSize: '1.05rem',
                            color: '#f1f5f9',
                          }}
                        >
                          {info.name}
                        </h3>
                      </div>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          marginTop: '6px',
                          flexShrink: 0,
                          background: isNLogN ? '#10b981' : '#f59e0b',
                          boxShadow: `0 0 6px ${isNLogN ? '#10b981' : '#f59e0b'}`,
                        }}
                      />
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                        color: '#64748b',
                        marginBottom: '1.25rem',
                        fontFamily: 'var(--font-geist)',
                      }}
                    >
                      {info.description.substring(0, 110)}...
                    </p>

                    {/* Complexity badges */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                    >
                      {[
                        { label: 'Best', val: info.timeComplexity.best },
                        { label: 'Average', val: info.timeComplexity.average },
                        { label: 'Space', val: info.spaceComplexity },
                      ].map(({ label, val }) => {
                        const isGood =
                          val.includes('n log n') ||
                          val === 'O(n)' ||
                          val === 'O(1)' ||
                          val === 'O(log n)';
                        return (
                          <div
                            key={label}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontFamily: 'var(--font-mono)',
                                color: '#475569',
                              }}
                            >
                              {label}
                            </span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontFamily: 'var(--font-mono)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '6px',
                                color: isGood
                                  ? '#10b981'
                                  : val.includes('n²')
                                  ? '#f59e0b'
                                  : '#8b5cf6',
                                background: isGood
                                  ? 'rgba(16,185,129,0.1)'
                                  : val.includes('n²')
                                  ? 'rgba(245,158,11,0.1)'
                                  : 'rgba(139,92,246,0.1)',
                              }}
                            >
                              {val}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          FINAL CTA
      ════════════════════════════════ */}
      <section style={{ padding: '7rem 0', position: 'relative', zIndex: 1 }}>
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="glass"
            style={{
              borderRadius: '24px',
              padding: '5rem 3rem',
              textAlign: 'center',
              boxShadow: '0 0 120px rgba(99,102,241,0.07)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 50% 120%, rgba(99,102,241,0.1) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#6366f1',
                  letterSpacing: '0.15em',
                  marginBottom: '1.5rem',
                }}
              >
                GET STARTED TODAY
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-syne)',
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  lineHeight: 1.1,
                  color: '#f1f5f9',
                  marginBottom: '1.5rem',
                }}
              >
                Ready to see algorithms
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, #818cf8, #a78bfa 50%, #22d3ee)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  come to life?
                </span>
              </h2>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: '#94a3b8',
                  maxWidth: '480px',
                  margin: '0 auto 2.5rem',
                  lineHeight: 1.7,
                  fontFamily: 'var(--font-geist)',
                }}
              >
                Start visualizing in seconds. No credit card required. Six
                algorithms ready to explore.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    className="btn-primary"
                    style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
                  >
                    Open Dashboard →
                  </Link>
                ) : (
                  <SignUpButton mode="modal">
                    <button
                      className="btn-primary"
                      style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
                    >
                      Start Visualizing — Free →
                    </button>
                  </SignUpButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer
        style={{
          padding: '2rem 0',
          borderTop: '1px solid rgba(99,102,241,0.08)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="section-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: 'white',
              }}
            >
              S
            </div>
            <span
              style={{
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#475569',
              }}
            >
              SortSphere
            </span>
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: '#334155',
            }}
          >
            Built with Next.js 15 · Three.js · Clerk · Vercel
          </p>
        </div>
      </footer>
    </div>
  );
}