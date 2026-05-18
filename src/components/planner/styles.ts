import type { CSSProperties } from "react";

export const palette = {
  pink: "#f4a7a7",
  cream: "#f0e9c5",
  salmon: "#f2a58e",
  lavender: "#d9c8e8",
  mint: "#c9e4ca",
  sky: "#bcd4e6",
  dark: "#3d2b3d",
  paper: "#fdfaf3",
  ink: "#5a4a5a",
  line: "#e8dcc8",
};

export const fonts = {
  display: "'Playfair Display', 'Georgia', serif",
  script: "'Dancing Script', cursive",
  body: "'Quicksand', 'Helvetica Neue', sans-serif",
};

export const card: CSSProperties = {
  background: palette.paper,
  border: `1px solid ${palette.line}`,
  borderRadius: 18,
  padding: 20,
  boxShadow: "0 4px 16px rgba(93, 74, 90, 0.06)",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: 10,
  border: `1px solid ${palette.line}`,
  background: "#fffdf7",
  color: palette.dark,
  fontFamily: fonts.body,
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: palette.ink,
  marginBottom: 6,
};

export const buttonStyle = (bg = palette.pink): CSSProperties => ({
  background: bg,
  color: palette.dark,
  border: "none",
  padding: "9px 18px",
  borderRadius: 999,
  fontFamily: fonts.body,
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(93,74,90,0.12)",
});

export const sectionTitle: CSSProperties = {
  fontFamily: fonts.display,
  fontSize: "1.4rem",
  fontWeight: 700,
  color: palette.dark,
  marginBottom: 14,
  marginTop: 4,
  borderBottom: `2px solid ${palette.pink}`,
  paddingBottom: 6,
};
