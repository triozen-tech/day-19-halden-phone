import { camera, chapters } from "@/site/content";

export default function HaldenCamera() {
  return (
    <>
      <div className="label">{camera.count} / {chapters.total} · {camera.title}</div>
      <div data-card="camera" className="corner bl flex gap-3">
        {camera.chips.map((c, i) => (
          <div key={c.k} className="chip-spec frost" {...(i === 0 ? { "data-hover-demo": true } : {})}>
            <div className="text-[15px] font-bold">{c.k}</div>
            <div className="text-[12px] text-muted">{c.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}
