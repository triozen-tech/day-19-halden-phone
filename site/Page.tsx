import HaldenLoader from "./components/HaldenLoader";
import HaldenNav from "./components/HaldenNav";
import Film from "./components/Film";
import HaldenHero from "./components/HaldenHero";
import HaldenLayers from "./components/HaldenLayers";
import HaldenCamera from "./components/HaldenCamera";
import HaldenDisplay from "./components/HaldenDisplay";
import HaldenChip from "./components/HaldenChip";
import HaldenFinishes from "./components/HaldenFinishes";
import HaldenPrices from "./components/HaldenPrices";
import HaldenFooter from "./components/HaldenFooter";

export default function Page() {
  return (
    <main>
      <HaldenLoader />
      <HaldenNav />
      <Film secs={{ hero: <HaldenHero />, layers: <HaldenLayers />, camera: <HaldenCamera />, display: <HaldenDisplay />, chip: <HaldenChip />, finishes: <HaldenFinishes />, prices: <HaldenPrices />, footer: <HaldenFooter /> }} />
    </main>
  );
}
