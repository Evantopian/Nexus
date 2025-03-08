import HeroSection from "./landing/HeroSection";
import FeatureHighlights from "./landing/FeatureHighlights";
import SecondaryCTA from "./landing/SecondaryCTA";
import { activePalette } from "@/lib/theme";

function Home() {
  const currentPalette = activePalette;

  const handleCtaClick = () => {
    window.location.href = "/signup";
  };

  return (
    <div className={`min-h-screen ${currentPalette.background}`}>
      <HeroSection onCtaClick={handleCtaClick} palette={currentPalette} />
      <FeatureHighlights palette={currentPalette} />
      <SecondaryCTA palette={currentPalette} />
    </div>
  );
}

export default Home;
