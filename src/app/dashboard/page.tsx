"use client";

import { motion, type Variants } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { ALGORITHM_KEYS } from "@/lib/constants";
import { usePreferencesStore } from "@/store";
import { AlgorithmCard } from "@/features/dashboard/components/AlgorithmCard";

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function DashboardPage() {
  const { user } = useUser();
  const { favorites, toggleFavorite, isFavorite } = usePreferencesStore();

  const favoriteKeys = ALGORITHM_KEYS.filter((k) => favorites.includes(k));

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2.5rem 2rem",
      }}
    >
      {/* ── Welcome header ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{ marginBottom: "3rem" }}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: "0.65rem",
            fontFamily: "var(--font-mono)",
            color: "#475569",
            letterSpacing: "0.12em",
            marginBottom: "0.5rem",
          }}
        >
          WELCOME BACK
        </motion.p>

        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            color: "#f1f5f9",
            marginBottom: "0.5rem",
            lineHeight: 1.2,
          }}
        >
          {user?.firstName ? `Hey, ${user.firstName} 👋` : "Your Dashboard"}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          style={{
            color: "#64748b",
            fontFamily: "var(--font-geist)",
            fontSize: "0.95rem",
          }}
        >
          Pick an algorithm and watch it sort in real time.
        </motion.p>

        {/* Quick stats */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            gap: "0.75rem",
            marginTop: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "6", label: "ALGORITHMS" },
            { value: String(favorites.length), label: "FAVORITES" },
            { value: "2D→3D", label: "RENDERER" },
          ].map(({ value, label }) => (
            <div
              key={label}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "8px",
                background: "rgba(99, 102, 241, 0.06)",
                border: "1px solid rgba(99, 102, 241, 0.12)",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#818cf8",
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "#475569",
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Favorites section ── */}
      {favoriteKeys.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ marginBottom: "3rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              marginBottom: "1rem",
            }}
          >
            <span style={{ color: "#f43f5e", fontSize: "0.9rem" }}>♥</span>
            <h2
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#f1f5f9",
              }}
            >
              Favorites
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "#475569",
              }}
            >
              ({favoriteKeys.length})
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {favoriteKeys.map((key) => (
              <AlgorithmCard
                key={key}
                algorithmKey={key}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(key)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── All algorithms ── */}
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-syne)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#f1f5f9",
            }}
          >
            All Algorithms
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "#475569",
            }}
          >
            {ALGORITHM_KEYS.length} available
          </span>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}
        >
          {ALGORITHM_KEYS.map((key) => (
            <motion.div key={key} variants={fadeUp}>
              <AlgorithmCard
                algorithmKey={key}
                isFavorite={isFavorite(key)}
                onToggleFavorite={() => toggleFavorite(key)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
