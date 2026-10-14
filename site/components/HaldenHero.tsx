import GoLink from "./GoLink";
import { hero } from "@/site/content";

export default function HaldenHero() {
  return (
    <>
      <div className="corner bl flex gap-2">
        {hero.tabs.map((t) => <GoLink key={t.label} id={t.href.slice(1)} className="pill">{t.label}</GoLink>)}
      </div>
      <div className="corner br frost w-[250px] p-5 text-left">
        <div className="text-[22px] font-bold">{hero.card.name}</div>
        <div className="mt-1 text-[15px]">{hero.card.from}</div>
        <div className="text-[12px] text-muted">{hero.card.note}</div>
        <GoLink id="prices" className="btn-ind mt-4" data-hover-demo>{hero.card.cta}</GoLink>
      </div>
    </>
  );
}
