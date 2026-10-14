import { prices, img } from "@/site/content";

export default function HaldenPrices() {
  return (
    <>
      <div data-card="prices" className="label">{prices.title}</div>
        {prices.models.map((m, k) => (
          <div key={m.name} data-card="prices" className="model-card frost absolute bottom-4 z-[5] flex w-[336px] gap-3" style={{ left: `${25 + k * 25}%`, transform: "translateX(-50%)" }} {...(k === 0 ? { "data-hover-demo": true } : {})}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(m.cut)} alt={m.name} className="h-[92px] w-[52px] object-cover object-top" />
            <div className="flex-1">
              <div className="flex items-baseline justify-between"><span className="text-[20px] font-bold">{m.name}</span><span className="text-[16px]">{m.price}</span></div>
              <ul className="mt-1 grid grid-cols-2 gap-x-4">{m.specs.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          </div>
        ))}
    </>
  );
}
