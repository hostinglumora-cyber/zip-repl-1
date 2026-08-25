// LibertyX Design Tokens — Central design constants
// Inspired by melonly.xyz aesthetic

export const COLORS = {
  // Backgrounds
  canvas: "#090A0F",
  surface1: "#12151E",
  surface2: "#1C212E",
  surface3: "#2A3042",

  // Borders
  border: "rgba(255, 255, 255, 0.08)",
  borderHover: "rgba(255, 255, 255, 0.18)",
  borderAccent: "rgba(16, 185, 129, 0.3)",

  // Brand
  accent: "#10B981",
  accentLight: "#34D399",
  accentDark: "#059669",
  discord: "#5865F2",
  danger: "#F43F5E",

  // Text
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
} as const;

export const SPACING = {
  sectionY: "py-12 sm:py-16",
  containerX: "px-4 sm:px-6 lg:px-8",
  maxWidth: "max-w-6xl",
  cardPadding: "p-4 sm:p-5",
  gridGap: "gap-4",
} as const;

export const RADIUS = {
  card: "rounded-xl",
  button: "rounded-lg",
  pill: "rounded-full",
  input: "rounded-lg",
} as const;
