"use client";
import { finishes, chapters } from "@/site/content";
import { FINISH_AT } from "@/site/clips";
import { goTo } from "./GoLink";
import { useFilmUnit } from "./Film";

export default function HaldenFinishes() {
  const f = finishes;
  // the active finish follows the film: it switches when the new colour covers more than half of the phone
  const i = useFilmUnit((u) => (u >= FINISH_AT[2] ? 2 : u >= FINISH_AT[1] ? 1 : 0), 0);
  return (
    <>
      <div className="label">{f.count} / {chapters.total} · {f.title}</div>
      <div className="corner bl frost px-5 py-4">
        <div className="text-[30px] font-extrabold leading-none" data-finish-name>{f.items[i].name}</div>
        <div className="mt-3 flex gap-4">
          {f.swatches.map((c, k) => (
            <button key={c} type="button" aria-label={f.items[k].name} aria-pressed={i === k} className="swatch" style={{ background: c }}
              onClick={() => goTo("finishes", k ? FINISH_AT[k] + 4 : 24)} data-hover-demo={k > 0 ? "click" : undefined} />
          ))}
        </div>
      </div>
    </>
  );
}
