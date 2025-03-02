import React from "react";
import { Users, Trophy, MessageSquare } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon = <Users className="h-10 w-10 text-primary" />,
  title = "Feature Title",
  description = "Feature description goes here. This explains the benefit to the user.",
}: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4 p-3 rounded-full bg-primary/10">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
      <p className="text-center text-muted-foreground">{description}</p>
    </div>
  );
};

interface FeatureHighlightsProps {
  features?: FeatureCardProps[];
  title?: string;
  subtitle?: string;
}

const FeatureHighlights = ({
  features = [
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Party Finding",
      description:
        "Connect with like-minded gamers and form the perfect party for your next gaming adventure.",
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Tournaments",
      description:
        "Join competitive tournaments across various games and win exclusive rewards and recognition.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Real-time Chat",
      description:
        "Communicate seamlessly with your party members through our integrated real-time chat system.",
    },
  ],
  title = "Epic Features for Epic Gamers",
  subtitle = "Discover how Mythic Match-Up enhances your gaming experience with these powerful features.",
}: FeatureHighlightsProps) => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;