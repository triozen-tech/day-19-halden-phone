"use client";
import { useState } from "react";
import { display, chapters } from "@/site/content";

export default function HaldenDisplay() {
  const [outdoor, setOutdoor] = useState(false);
  const d = display;
  return (
    <>
      <div className="label">{d.count} / {chapters.total} · {d.title}</div>
      <div data-card="display" className="corner bl frost w-[250px] p-5 text-left">
        <div className="text-[12px] text-muted">{d.screen.label}</div>
        <div className="text-[40px] font-extrabold leading-none">{outdoor ? d.screen.value : 800} <span className="text-[16px]">{d.screen.unit}</span></div>
        <div className="mt-3 flex gap-2">
          {d.screen.toggle.map((t, i) => (
            <button type="button" key={t} aria-pressed={outdoor === (i === 1)} onClick={() => setOutdoor(i === 1)} className="pill" data-hover-demo={i === 1 ? "click" : undefined}>{t}</button>
          ))}
        </div>
      </div>
      <div data-card="battery" className="corner br frost w-[300px] p-5 text-left">
        <div className="text-[12px] text-muted">{d.battery.label}</div>
        <div className="text-[40px] font-extrabold leading-none">{d.battery.hours} <span className="text-[16px]">{d.battery.unit}</span></div>
        <div className="mt-3 h-[8px] rounded-full bg-black/15"><div className="h-full w-[76%] rounded-full bg-accent" /></div>
        <div className="mt-2 text-[12px] text-muted">{d.battery.note}</div>
      </div>
    </>
  );
}
