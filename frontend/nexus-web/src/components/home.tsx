import HeroSection from "./landing/HeroSection";
import FeatureHighlights from "./landing/FeatureHighlights";
import SecondaryCTA from "./landing/SecondaryCTA";

function Home() {
  const handleCtaClick = () => {
    window.location.href = "/signup"; // to be added
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HeroSection onCtaClick={handleCtaClick} />
      <FeatureHighlights />
      <SecondaryCTA />
    </div>
  );
}

export default Home;
