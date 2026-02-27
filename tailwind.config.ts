// @ts-nocheck
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  corePlugins: {
    // Disable unused core plugins to speed up builds
    preflight: true
  },
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        bg: {
          950: "#070912",
          900: "#0b1020",
          800: "#12182b"
        },
        neon: {
          blue: "#3b82f6",
          indigo: "#6366f1",
          violet: "#8b5cf6",
          cyan: "#22d3ee"
        },
        panel: {
          900: "rgba(15, 20, 40, 0.78)",
          800: "rgba(18, 24, 48, 0.88)"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(99, 102, 241, 0.35), 0 8px 30px rgba(8, 47, 73, 0.35)",
        card: "0 15px 45px rgba(2, 6, 23, 0.45)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(99,102,241,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.1) 1px, transparent 1px)",
        "accent-sweep":
          "radial-gradient(1200px 450px at 20% 0%, rgba(34,211,238,0.2), transparent 55%), radial-gradient(900px 450px at 80% 10%, rgba(139,92,246,0.26), transparent 55%), radial-gradient(800px 500px at 50% 100%, rgba(59,130,246,0.22), transparent 60%)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 3.8s ease-in-out infinite",
        drift: "drift 16s linear infinite",
        shimmer: "shimmer 5s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" }
        },
        drift: {
          "0%": { transform: "translateX(0px)" },
          "50%": { transform: "translateX(22px)" },
          "100%": { transform: "translateX(0px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-180% 0" },
          "100%": { backgroundPosition: "180% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;