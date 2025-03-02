import { Button } from "@/components/ui/button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import BoyGirlBG from "../../assets/pages/landing/LandingBoyGirl.png";

interface HeroSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  backgroundImage?: string;
  onCtaClick?: () => void;
}

const HeroSection = ({
  title = "Find Your Epic Quest Party",
  description = "Connect with like-minded gamers, form the ultimate party, and conquer challenges together. Whether you're raiding dungeons or battling royale, find your perfect squad now.",
  ctaText = "Start Your Adventure",
  backgroundImage = BoyGirlBG,
  onCtaClick = () => console.log("CTA clicked"),
}: HeroSectionProps) => {
  return (
    <div className="relative h-[700px] w-full bg-slate-900 overflow-hidden p-0 m-0">
      {/* Split layout container */}
      <div className="flex h-full">
        {/* Left side - Content */}
        <div className="w-1/2 relative z-10 px-8 md:px-12 lg:px-16 flex flex-col justify-center pt-0">
          {/* Animated badge */}
          <div className="inline-flex items-center rounded-full px-4 py-1 mb-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700 text-slate-200 w-fit">
            <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-sm font-medium">
              Matchmaking Platform Now Live
            </span>
          </div>

          {/* Hero title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 mt-0 tracking-tight">
            {title}
          </h1>

          {/* Hero description */}
          <p className="text-lg md:text-xl text-slate-300 mb-8 mt-0">
            {description}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 h-auto text-lg font-semibold"
              onClick={onCtaClick}
            >
              {ctaText}
              <ArrowRightAltIcon className="ml-2" sx={{ fontSize: 20 }} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white px-8 py-6 h-auto text-lg font-semibold"
              asChild
            >
              <Link to="/login">Already have an account?</Link>
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-1/2 relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
          </div>
        </div>
      </div>

      {/* Decorative elements */}
    </div>
  );
};

export default HeroSection;
