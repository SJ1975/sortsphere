"use client";

import { useState } from "react";
import { SortingEngine } from "@/features/sorting/engine";
import { MAX_ARRAY_SIZE } from "@/lib/constants";

interface CustomInputProps {
  onSubmit: (input: string) => boolean;
  onRandomize: () => void;
  isPlaying: boolean;
}

export function CustomInput({
  onSubmit,
  onRandomize,
  isPlaying,
}: CustomInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) {
      setError("Please enter some numbers.");
      return;
    }
    const valid = onSubmit(value);
    if (valid) {
      setSuccess(true);
      setError("");
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(
        `Enter 2–${MAX_ARRAY_SIZE} comma-separated numbers between 1 and 999.`,
      );
      setSuccess(false);
    }
  };

  const handleExample = (nums: number[]) => {
    const str = nums.join(", ");
    setValue(str);
    setError("");
    const valid = onSubmit(str);
    if (valid) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const EXAMPLES = [
    { label: "Nearly sorted", nums: [1, 2, 4, 3, 5, 6, 8, 7, 9, 10] },
    { label: "Reverse order", nums: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
    { label: "All equal", nums: [5, 5, 5, 5, 5, 5, 5, 5] },
    { label: "Small", nums: [3, 1, 4, 1, 5, 9, 2, 6] },
  ];

  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "1.1rem 1.25rem",
        background: "rgba(13, 13, 43, 0.65)",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "#475569",
            letterSpacing: "0.08em",
          }}
        >
          CUSTOM INPUT — TYPE YOUR OWN ARRAY
        </p>
        <button
          onClick={onRandomize}
          disabled={isPlaying}
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "6px",
            padding: "0.25rem 0.65rem",
            cursor: isPlaying ? "not-allowed" : "pointer",
            color: "#818cf8",
            fontSize: "0.7rem",
            fontFamily: "var(--font-mono)",
            opacity: isPlaying ? 0.5 : 1,
          }}
        >
          ⟳ Random
        </button>
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && !isPlaying && handleSubmit()}
          disabled={isPlaying}
          placeholder="e.g., 64, 25, 12, 22, 11"
          style={{
            flex: 1,
            padding: "0.55rem 0.85rem",
            borderRadius: "8px",
            background: "rgba(7, 7, 26, 0.8)",
            border: `1px solid ${error ? "rgba(244,63,94,0.4)" : success ? "rgba(16,185,129,0.4)" : "rgba(99,102,241,0.2)"}`,
            color: "#f1f5f9",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            outline: "none",
            cursor: isPlaying ? "not-allowed" : "text",
            opacity: isPlaying ? 0.5 : 1,
            transition: "border-color 0.15s",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isPlaying}
          style={{
            padding: "0.55rem 1.1rem",
            borderRadius: "8px",
            background: success
              ? "rgba(16,185,129,0.15)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: success ? "1px solid rgba(16,185,129,0.4)" : "none",
            color: success ? "#10b981" : "white",
            fontWeight: 600,
            fontSize: "0.82rem",
            fontFamily: "var(--font-geist)",
            cursor: isPlaying ? "not-allowed" : "pointer",
            opacity: isPlaying ? 0.5 : 1,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {success ? "✓ Applied!" : "Visualize →"}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p
          style={{
            fontSize: "0.72rem",
            color: "#f43f5e",
            fontFamily: "var(--font-mono)",
          }}
        >
          ⚠ {error}
        </p>
      )}

      {/* Example presets */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "#334155",
            letterSpacing: "0.06em",
          }}
        >
          TRY:
        </span>
        {EXAMPLES.map(({ label, nums }) => (
          <button
            key={label}
            onClick={() => !isPlaying && handleExample(nums)}
            disabled={isPlaying}
            style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: "5px",
              padding: "0.2rem 0.55rem",
              cursor: isPlaying ? "not-allowed" : "pointer",
              color: "#64748b",
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              transition: "all 0.15s",
              opacity: isPlaying ? 0.5 : 1,
            }}
            onMouseOver={(e) => {
              if (!isPlaying) e.currentTarget.style.color = "#818cf8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#64748b";
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
