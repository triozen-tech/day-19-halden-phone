import { layers, chapters } from "@/site/content";

export default function HaldenLayers() {
  return (
    <>
      <div className="label">{layers.count} / {chapters.total} · {layers.title}</div>
      <div data-card="layers" className="corner br frost w-[280px] px-5 py-3 text-left layer-rows">
        {layers.rows.map((r, i) => (
          <div key={r} className="layer-row" {...(i === 1 ? { "data-hover-demo": true } : {})}><span className="text-muted">0{i + 1}</span>{r}</div>
        ))}
      </div>
    </>
  );
}
