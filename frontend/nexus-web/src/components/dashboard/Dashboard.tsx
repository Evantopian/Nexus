import { useQuery } from "@apollo/client";
import FeaturedGames from "./FeaturedGames";
import MainContent from "./MainContent";
import Sidebar from "./SideBar";
import { GET_ALL_LFG_POSTS } from "@/graphql/lfg/lfgQueries";
import { useRecommendedPlayers } from "@/hooks/useRecommendedPlayers";
import { useAuth } from "@/contexts/AuthContext";
import { GET_LEADERBOARD } from "@/graphql/user/userQueries";

// temporary data, waiting for backend APIs to be built, then we will fetch.
const Dashboard = () => {
  const { user } = useAuth();

  // Recently played games data
  const recentGames = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      title: "Game Title 1",
      lastPlayed: "Last played 1 hour ago",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      title: "Game Title 2",
      lastPlayed: "Last played 2 hours ago",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      title: "Game Title 3",
      lastPlayed: "Last played 3 hours ago",
    },
  ];

  // Recommended players data
  const { recommendedPlayers } = useRecommendedPlayers(user?.uuid);

  // Communities data
  const communities = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      name: "Community 1",
      memberCount: 1200,
      onlineCount: 3,
      description:
        "A community for gamers who love to play together and share strategies.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      name: "Community 2",
      memberCount: 2400,
      onlineCount: 6,
      description:
        "A community for gamers who love to play together and share strategies.",
    },
  ];

  const { data: leaderboardData } = useQuery(GET_LEADERBOARD, {
    variables: { limit: 5 },
  });

  // console.log("Leaderboard data", leaderboardData?.getLeaderboard);

  const leaderboardUsers = leaderboardData?.getLeaderboard;

  // Tournament data
  const tournamentData = [
    {
      id: 1,
      name: "Weekend Warzone 1",
      startsIn: "Starts in 1 day",
      slots: 16,
      prize: "$250",
    },
    {
      id: 2,
      name: "Weekend Warzone 2",
      startsIn: "Starts in 2 days",
      slots: 32,
      prize: "$500",
    },
  ];

  // LFG post data
  const { data } = useQuery(GET_ALL_LFG_POSTS, {
    variables: { limit: 2, offset: 0 },
  });

  const lfgPostData = data?.getAllLFGPosts || [];

  return (
    <>
      {/* Main Content */}
      <div className="w-full max-w-[1600px] mx-auto px-4 py-8 transition-all duration-300">
        {/* Featured Games Carousel */}
        <FeaturedGames />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <MainContent
            recentGames={recentGames}
            recommendedPlayers={recommendedPlayers}
            communities={communities}
          />

          {/* Sidebar */}
          <Sidebar
            leaderboardData={leaderboardUsers}
            tournamentData={tournamentData}
            lfgPostData={lfgPostData}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
