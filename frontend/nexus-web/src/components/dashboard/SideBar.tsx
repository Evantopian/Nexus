import Leaderboard from "./side/Leaderboard";
import Tournaments from "./side/Tournaments";
import LFGPosts from "./side/LFGPosts";

interface SidebarProps {
  leaderboardData: any[];
  tournamentData: any[];
  lfgPostData: any[];
}

const Sidebar = ({
  leaderboardData,
  tournamentData,
  lfgPostData,
}: SidebarProps) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Leaderboard leaders={leaderboardData} />
      <Tournaments tournaments={tournamentData} />
      <LFGPosts posts={lfgPostData} />
    </div>
  );
};

export default Sidebar;
