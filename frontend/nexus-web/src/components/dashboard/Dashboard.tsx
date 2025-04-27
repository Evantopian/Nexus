import FeaturedGames from "./FeaturedGames";
import MainContent from "./MainContent";
import Sidebar from "./SideBar";

// temporary data, waiting for backend APIs to be built, then we will fetch.
const Dashboard = () => {
  // Featured games data
  const games = [
    {
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Marvel Rivals",
      players: "1.7",
      tags: ["bg-blue-500", "bg-purple-500", "bg-green-500"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Fortnite",
      players: "3.2",
      tags: ["bg-blue-500", "bg-yellow-500"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Minecraft",
      players: "2.5",
      tags: ["bg-green-500", "bg-orange-500"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "Call of Duty",
      players: "1.9",
      tags: ["bg-red-500", "bg-gray-500"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      title: "League of Legends",
      players: "2.1",
      tags: ["bg-purple-500", "bg-blue-300"],
    },
  ];

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
  const recommendedPlayers = [
    {
      id: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1",
      username: "GamerTag1",
      level: 10,
    },
    {
      id: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2",
      username: "GamerTag2",
      level: 20,
    },
    {
      id: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3",
      username: "GamerTag3",
      level: 30,
    },
    {
      id: 4,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4",
      username: "GamerTag4",
      level: 40,
    },
  ];

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

  // Leaderboard data
  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=top1",
      username: "TopPlayer1",
      points: 1000,
    },
    {
      id: 2,
      rank: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=top2",
      username: "TopPlayer2",
      points: 2000,
    },
    {
      id: 3,
      rank: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=top3",
      username: "TopPlayer3",
      points: 3000,
    },
  ];

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
  const lfgPostData = [
    {
      id: 1,
      title: "Need 2 for Raid",
      author: {
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lfg1",
        username: "RaidLeader1",
      },
      tags: ["Tank", "Healer"],
    },
    {
      id: 2,
      title: "Need 3 for Raid",
      author: {
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lfg2",
        username: "RaidLeader2",
      },
      tags: ["Tank", "Healer"],
    },
  ];

  return (
    <>
      {/* Main Content */}
      <div className="w-full max-w-[1600px] mx-auto px-4 py-8 transition-all duration-300">
        {/* Featured Games Carousel */}
        <FeaturedGames games={games} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <MainContent
            recentGames={recentGames}
            recommendedPlayers={recommendedPlayers}
            communities={communities}
          />

          {/* Sidebar */}
          <Sidebar
            leaderboardData={leaderboardData}
            tournamentData={tournamentData}
            lfgPostData={lfgPostData}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
