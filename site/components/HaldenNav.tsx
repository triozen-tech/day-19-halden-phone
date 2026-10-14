import { nav } from "@/site/content";
import GoLink from "./GoLink";

export default function HaldenNav() {
  return (
    <header className="glass fixed left-[28px] right-[28px] top-[24px] z-50 flex h-[48px] items-center justify-between rounded-full px-7 text-[#101114]">
      <GoLink id="top" className="text-[17px] font-extrabold tracking-[0.04em]" data-nav-word>{nav.brand}</GoLink>
      <nav className="flex items-center gap-8">
        {nav.links.map((l) => (
          <GoLink key={l.label} id={l.href.slice(1)} className="u-link">{l.label}</GoLink>
        ))}
        <GoLink id={nav.cta.href.slice(1)} className="u-link underline underline-offset-4 hover:text-accent">{nav.cta.label}</GoLink>
      </nav>
    </header>
  );
}
