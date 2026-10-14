"use client";
import type { ReactNode } from "react";
import { FILM_RUN, RANGE, TOTAL, type SecKey } from "@/site/clips";

const KEY: Record<string, SecKey> = { top: "hero", layers: "layers", camera: "camera", display: "display", chip: "chip", finishes: "finishes", prices: "prices", footer: "footer" };
/** Smooth-scrolls the one film to the start of a section (just after its label has faded in). In ?static=1 the plain #anchor works. */
export function goTo(id: string, u?: number) {
  const film = document.getElementById("film");
  if (!film) return false;
  const k = KEY[id];
  const unit = u ?? (k === "hero" ? 0 : RANGE[k][0] + 18);
  const y = film.getBoundingClientRect().top + window.scrollY + (unit / TOTAL) * FILM_RUN;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(y, { duration: 1.6 }); else window.scrollTo({ top: y, behavior: "smooth" });
  return true;
}
export default function GoLink({ id, className, children, ...rest }: { id: string; className?: string; children: ReactNode } & Record<string, unknown>) {
  return <a href={`#${id}`} className={className} onClick={(e) => { if (goTo(id)) e.preventDefault(); }} {...rest}>{children}</a>;
}
