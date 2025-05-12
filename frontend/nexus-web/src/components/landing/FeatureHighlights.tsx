import React from "react";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ChatIcon from "@mui/icons-material/Chat";
import { activePalette, ColorPalette } from "@/lib/theme";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  palette?: ColorPalette;
}

const FeatureCard = ({
  icon = <PeopleIcon sx={{ fontSize: 40 }} />,
  title = "Feature Title",
  description = "Feature description goes here. This explains the benefit to the user.",
  palette = activePalette,
}: FeatureCardProps) => {
  return (
    <div
      className={`flex flex-col items-center p-6 rounded-lg ${palette.background} border ${palette.border} shadow-md hover:shadow-lg transition-shadow`}
    >
      <div className={`mb-4 p-3 rounded-full`}>
        <div className="text-black-600">{icon}</div>
      </div>
      <h3
        className={`text-xl font-bold mb-2 text-center ${palette.foreground}`}
      >
        {title}
      </h3>
      <p className={`text-center ${palette.mutedForeground}`}>{description}</p>
    </div>
  );
};

interface FeatureHighlightsProps {
  features?: FeatureCardProps[];
  title?: string;
  subtitle?: string;
  palette?: ColorPalette;
}

const FeatureHighlights = ({
  features = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: "Party Finding",
      description:
        "Connect with like-minded gamers and form the perfect party for your next gaming adventure.",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: "Tournaments",
      description:
        "Join competitive tournaments across various games and win exclusive rewards and recognition.",
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: "Real-time Chat",
      description:
        "Communicate seamlessly with your party members through our integrated real-time chat system.",
    },
  ],
  title = "Epic Features for Epic Gamers",
  subtitle = "Discover how Nexus enhances your gaming experience with these powerful features.",
  palette = activePalette,
}: FeatureHighlightsProps) => {
  return (
    <section className={`py-28 px-6 ${palette.background}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${palette.foreground}`}
          >
            {title}
          </h2>
          <p className={`text-lg ${palette.mutedForeground} max-w-2xl mx-auto`}>
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              palette={palette}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;