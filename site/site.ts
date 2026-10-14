import type { SiteMeta, Theme } from "@/lib/site";

export const meta: SiteMeta = {
  name: "Halden",
  title: "Halden — smartphone launch (concept)",
  description: "Halden, a fictional smartphone. Concept website by Triozen Tech.",
  loaderText: "Halden",
  loader: false, // Round 2 builds the site's own loader (bezel lights up, stage fades up)
  cursor: false,
  record: { duration: 36 },
};

export const theme: Theme = {
  bg: "#2A2B2F",
  surface: "#B9BBC1",
  text: "#101114",
  muted: "#4A4C53",
  accent: "#4B4DFF",
  accentText: "#ffffff",
  line: "rgba(16,17,20,0.22)",
  fontDisplay: "'Inter Variable', sans-serif",
  fontBody: "'Inter Variable', sans-serif",
  radius: 28,
  heroText: "#101114",
};
