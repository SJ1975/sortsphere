'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: '64px',
        background: 'rgba(7, 7, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
      }}
    >
      {/* ── Logo ── */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 800, color: 'white',
          boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          fontFamily: 'var(--font-syne)',
        }}>
          S
        </div>
        <span style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: '1.1rem',
          background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          SortSphere
        </span>
      </Link>

      {/* ── Nav links (desktop) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '2rem',
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      }}
        className="hidden md:flex"
      >
        {[
          { label: 'Features', href: '/#features' },
          { label: 'Algorithms', href: '/#algorithms' },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s',
              fontFamily: 'var(--font-geist)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#f1f5f9')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            {label}
          </Link>
        ))}
        {isSignedIn && (
          <Link
            href="/dashboard"
            style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#f1f5f9')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* ── Auth section ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {!isLoaded ? (
          // Loading skeleton
          <div style={{
            width: '100px', height: '36px', borderRadius: '8px',
            background: 'rgba(99,102,241,0.1)', animation: 'pulse 2s infinite',
          }} />
        ) : isSignedIn ? (
          <>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Dashboard →
            </Link>
            <UserButton />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Get Started
              </button>
            </SignUpButton>
          </>
        )}
      </div>
    </motion.nav>
  );
}