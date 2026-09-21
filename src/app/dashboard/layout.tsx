"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isVisualizer = pathname.includes("/visualize");

  return (
    <div style={{ minHeight: "100vh", background: "#07071a" }}>
      {/* App navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
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
              boxShadow: "0 0 12px rgba(99,102,241,0.3)",
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

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link
            href="/dashboard"
            style={{
              fontSize: "0.85rem",
              fontFamily: "var(--font-geist)",
              textDecoration: "none",
              color: !isVisualizer ? "#f1f5f9" : "#64748b",
              fontWeight: !isVisualizer ? 500 : 400,
              transition: "color 0.2s",
            }}
          >
            Dashboard
          </Link>
        </div>

        {/* User button */}
        <UserButton />
      </nav>

      {/* Page content */}
      <main style={{ paddingTop: "60px", minHeight: "100vh" }}>{children}</main>
    </div>
  );
}
