import { Button } from "@/components/ui/button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Link } from "react-router-dom";
import BoyGirlBG from "../../assets/pages/landing/LandingBoyGirl.png";
import { activePalette, ColorPalette } from "@/lib/theme";

interface HeroSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  backgroundImage?: string;
  onCtaClick?: () => void;
  palette?: ColorPalette;
}

const HeroSection = ({
  title = "Try Nexus Today",
  description = "Connect with like-minded gamers, form the ultimate party, and conquer challenges together. Whether you're raiding dungeons or battling royale, find your perfect squad now.",
  ctaText = "Start Your Adventure",
  backgroundImage = BoyGirlBG,
  onCtaClick = () => console.log("CTA clicked"),
  palette = activePalette,
}: HeroSectionProps) => {
  return (
    <div
      className={`relative h-[750px] w-full ${palette.secondary} overflow-hidden p-0 m-0`}
    >
      {/* Desktop layout */}
      <div className="hidden md:flex h-full">
        {/* Left side - Content */}
        <div className="w-3/5 relative z-10 px-10 md:px-16 lg:px-20 flex flex-col justify-center pt-0">
          {/* Animated badge for the wip*/}
          <div
            className={`border ${palette.border} inline-flex items-center rounded-full px-4 py-1 mb-6 ${palette.muted} backdrop-blur-sm ${palette.border} ${palette.background} w-fit`}
          >
            <span
              className={`animate-pulse mr-2 h-2 w-2 rounded-full ${palette.accent}`}
            ></span>
            <span className="text-sm font-medium">
              Some Alpha/Beta Text
            </span>
          </div>

          {/* Hero title */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold ${palette.foreground} mb-6 mt-0 tracking-tight`}
          >
            {title}
          </h1>

          {/* Hero description */}
          <p
            className={`text-lg md:text-xl ${palette.mutedForeground} mb-8 mt-0`}
          >
            {description}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className={`${palette.primary} ${palette.primaryHover} ${palette.primaryForeground} px-8 py-6 h-auto text-lg font-semibold`}
              onClick={onCtaClick}
            >
              {ctaText}
              <ArrowRightAltIcon className="ml-2" sx={{ fontSize: 20 }} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`${palette.border} ${palette.secondaryForeground} ${palette.secondaryHover} hover:text-gray-900 px-8 py-6 h-auto text-lg font-semibold`}
              asChild
            >
              <Link to="/login">Already have an account?</Link>
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-2/3 relative">
          <div
            className={`absolute inset-0 ${palette.border}`}
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "15px", 
            }}
          ></div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden relative h-full">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 px-6 py-12 flex flex-col justify-center h-full">
          {/* Animated badge */}
          <div
            className={`inline-flex items-center rounded-full px-4 py-1 mb-6 ${palette.muted} backdrop-blur-sm ${palette.border} ${palette.secondaryForeground} w-fit`}
          >
            <span
              className={`animate-pulse mr-2 h-2 w-2 rounded-full ${palette.accent}`}
            ></span>
            <span className="text-sm font-medium">
              Matchmaking Platform Now Live
            </span>
          </div>

          {/* Hero title */}
          <h1
            className={`text-3xl md:text-4xl font-extrabold ${palette.foreground} mb-6 mt-0 tracking-tight`}
          >
            {title}
          </h1>

          {/* Hero description */}
          <p className={`text-base ${palette.mutedForeground} mb-8 mt-0`}>
            {description}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className={`${palette.primary} ${palette.primaryHover} ${palette.primaryForeground} px-6 py-4 h-auto text-base font-semibold`}
              onClick={onCtaClick}
            >
              {ctaText}
              <ArrowRightAltIcon className="ml-2" sx={{ fontSize: 18 }} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`${palette.border} ${palette.secondaryForeground} ${palette.secondaryHover} hover:text-gray-900 px-6 py-4 h-auto text-base font-semibold`}
              asChild
            >
              <Link to="/login">Already have an account?</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;