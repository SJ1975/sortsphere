"use client";

import Link from "next/link";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#07071a" }}>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          background: "rgba(7, 7, 26, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 800,
              color: "white",
              fontFamily: "var(--font-syne)",
            }}
          >
            S
          </div>
          <span
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "1rem",
              background: "linear-gradient(135deg, #818cf8, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SortSphere
          </span>
        </Link>

        {/* Right side — auth aware */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isSignedIn ? (
            <>
              {/* Only show Dashboard link when on visualizer */}
              {pathname.includes("/visualize") && (
                <Link
                  href="/dashboard"
                  style={{
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-geist)",
                    color: "#64748b",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#f1f5f9")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#64748b")}
                >
                  Dashboard
                </Link>
              )}
              <UserButton />
            </>
          ) : (
            /* Not logged in — show sign in prompt */
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                  color: "#475569",
                }}
              >
                Save favorites →
              </span>
              <SignInButton mode="modal">
                <button
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "7px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-geist)",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </nav>

      <main style={{ paddingTop: "60px", minHeight: "100vh" }}>{children}</main>
    </div>
  );
}
