// All text + data for Halden. Source: site/DESIGN.md. Sample prices are labelled "sample".
const IMG = "/images/halden";
export const img = (f: string) => `${IMG}/${f}`;

export const nav = {
  brand: "HALDEN",
  links: [
    { label: "Layers", href: "#layers" },
    { label: "Camera", href: "#camera" },
    { label: "Display", href: "#display" },
    { label: "Finishes", href: "#finishes" },
  ],
  cta: { label: "Where to buy?", href: "#prices" },
};

export const chapters = { total: "005", share: "Share", scroll: "Scroll" };

export const hero = {
  still: "s3-hero-start.jpg", // V1: S3 → S2
  tabs: nav.links,
  card: { name: "Halden", from: "From ₹ 49,900", note: "sample price", cta: "Where to buy?" },
};

export const layers = {
  id: "layers",
  count: "001",
  title: "Layers",
  still: "s4-layers.jpg", // V2: S2 → S4, V3: S4 → S1
  note: "The phone separates into layers and snaps back together.",
  rows: ["Back glass", "Battery", "Circuit board", "Display", "Frame"],
};

export const camera = {
  id: "camera",
  count: "002",
  title: "Camera",
  still: "s5-camera-macro.jpg", // V4: S1 → S5
  note: "One thin centred camera bar.",
  chips: [
    { k: "Aperture", v: "Two lenses and a flash" },
    { k: "Sensor", v: "Sits flush with the glass" },
    { k: "Zoom", v: "Slim glass capsule" },
  ],
};

export const display = {
  id: "display",
  count: "003",
  title: "Display & battery",
  screenStill: "s6-display.jpg", // V5: S5 → S6
  batteryStill: "s7-battery-edge.jpg", // V6: S6 → S7
  screen: { label: "Display", value: 1800, unit: "nits", toggle: ["Indoor", "Outdoor"] },
  battery: { label: "Battery", hours: 38, unit: "hours", note: "per use" },
};

export const chip = {
  id: "chip",
  count: "004",
  title: "Chip",
  still: "s8-board-macro.jpg", // V7: S7 → S8
  tiles: [
    { n: "8", u: "cores" },
    { n: "3", u: "nm" },
    { n: "12", u: "GB memory" },
  ],
};

export const finishes = {
  id: "finishes",
  count: "005",
  title: "Finishes",
  items: [
    { name: "Slate", still: "s1-back-master.jpg", clip: "V8" },
    { name: "Bone", still: "s9-finish-b.jpg", clip: "V9" },
    { name: "Cobalt", still: "s10-finish-c.jpg", clip: "V10" },
  ],
  swatches: ["#2E3036", "#E7DFCF", "#4B4DFF"],
};

export const prices = {
  id: "prices",
  title: "Models & prices",
  still: "s11-lineup.jpg", // V11: S10 → S11
  note: "Sample prices",
  models: [
    { name: "Bone", cut: "s9-finish-b.png", price: "₹ 52,900", specs: ["6.4 in display", "38 h battery", "Two-lens camera", "8-core chip"] },
    { name: "Slate", cut: "s1-back-master.png", price: "₹ 49,900", specs: ["6.4 in display", "38 h battery", "Two-lens camera", "8-core chip"] },
    { name: "Cobalt", cut: "s10-finish-c.png", price: "₹ 54,900", specs: ["6.4 in display", "38 h battery", "Two-lens camera", "8-core chip"] },
  ],
};

export const footer = {
  still: "s3-hero-start.jpg", // V12: S11 → S3
  links: nav.links,
  credit: "Concept website by Triozen Tech",
};
