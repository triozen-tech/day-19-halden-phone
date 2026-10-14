import GoLink from "./GoLink";
import { footer } from "@/site/content";

export default function HaldenFooter() {
  return (
    <>
      <div data-card="footer" className="corner bl frost flex gap-6 rounded-full px-5 py-2">{footer.links.map((l) => <GoLink key={l.label} id={l.href.slice(1)} className="u-link">{l.label}</GoLink>)}</div>
      <div data-card="footer" className="corner br frost rounded-full px-5 py-2">{footer.credit}</div>
      <GoLink id="top" data-card="footer" className="label">Back to top</GoLink>
    </>
  );
}
