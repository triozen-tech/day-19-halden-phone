import { chip, chapters } from "@/site/content";

export default function HaldenChip() {
  return (
    <>
      <div className="label">{chip.count} / {chapters.total} · {chip.title}</div>
      <div data-card="chip" className="corner bl flex gap-3">
        {chip.tiles.map((t) => (
          <div key={t.u} className="tile frost"><div className="text-[44px] font-extrabold leading-none">{t.n}</div><div className="text-[12px] text-muted">{t.u}</div></div>
        ))}
      </div>
    </>
  );
}
