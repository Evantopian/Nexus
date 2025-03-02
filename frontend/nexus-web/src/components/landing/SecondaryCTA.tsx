import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { activePalette, ColorPalette } from "@/lib/theme";

interface SecondaryCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
  palette?: ColorPalette;
}

const SecondaryCTA = ({
  title = "Ready to Join the Adventure?",
  description = "Create your account now and start connecting with gamers worldwide. Join tournaments, form parties, and level up your gaming experience.",
  primaryButtonText = "Create Account",
  secondaryButtonText = "Learn More",
  primaryButtonLink = "/signup",
  secondaryButtonLink = "/about",
  palette = activePalette,
}: SecondaryCTAProps) => {
  return (
    <section className={`py-16 ${palette.secondary}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2
            className={`text-3xl md:text-4xl font-bold ${palette.foreground} mb-4`}
          >
            {title}
          </h2>
          <p className={`text-lg ${palette.mutedForeground} mb-8`}>
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className={`${palette.primary} ${palette.primaryHover} ${palette.primaryForeground} px-8 py-6 h-auto text-lg font-semibold`}
            >
              <Link to={primaryButtonLink}>{primaryButtonText}</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className={`${palette.border} ${palette.secondaryForeground} ${palette.secondaryHover} hover:text-gray-900 px-8 py-6 h-auto text-lg font-semibold`}
            >
              <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
            </Button>
          </div>

          <div className="mt-12 flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=gamer1"
                  alt="Gamer avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className={`${palette.foreground} font-medium`}>
                  "Found my raid team here!"
                </p>
                <p className={`${palette.mutedForeground} text-sm`}>
                  - Alex, Level 50 Mage
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=gamer2"
                  alt="Gamer avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className={`${palette.foreground} font-medium`}>
                  "Won my first tournament!"
                </p>
                <p className={`${palette.mutedForeground} text-sm`}>
                  - Sam, Pro Gamer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryCTA;
