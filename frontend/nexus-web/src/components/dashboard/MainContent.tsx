import RecentlyPlayed from "./main/RecentlyPlayed";
import RecommendedPlayers from "./main/RecommendPlayers";
import Communities from "./main/Communities";

interface MainContentProps {
  recentGames: any[];
  recommendedPlayers: any[];
  communities: any[];
}

const MainContent = ({
  recentGames,
  recommendedPlayers,
  communities,
}: MainContentProps) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      <RecentlyPlayed games={recentGames} />
      <RecommendedPlayers players={recommendedPlayers} />
      <Communities communities={communities} />
    </div>
  );
};

export default MainContent;
