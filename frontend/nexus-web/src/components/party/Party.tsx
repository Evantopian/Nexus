import PartyList from "./PartyList";
import PlayerRecommendation from "./PlayerRecommendation";

export type Player = {
  id: string;
  username: string;
  profileImg: string;
};

const Party = () => {
  const recommendedPlayers = [
    {
      id: "1",
      username: "AceHunter",
      profileImg:
        "https://fastly.picsum.photos/id/874/200/300.jpg?hmac=rJgHohZZtli5gr1B42TQbIuoC-GrMDffD-Xukd2Grj8",
    },
    {
      id: "2",
      username: "ShadowKnight",
      profileImg: "https://thispersondoesnotexist.com/",
    },
    {
      id: "3",
      username: "SkyFlyer",
      profileImg: "https://thispersondoesnotexist.com/",
    },
    {
      id: "4",
      username: "StarMaker",
      profileImg: "https://thispersondoesnotexist.com/",
    },
  ];

  const partyMembers = [
    {
      id: "3",
      username: "DragonSlayer",
      profileImg: "https://thispersondoesnotexist.com/",
    },
    {
      id: "4",
      username: "SkyWalker",
      profileImg: "https://thispersondoesnotexist.com/",
    },
    {
      id: "5",
      username: "LunaMage",
      profileImg: "https://thispersondoesnotexist.com/",
    },
  ];

  const handleHonor = (userId: string) => {
    console.log(userId);
  };

  const handleDislike = (userId: string) => {
    console.log(userId);
  };

  const handleViewProfile = (userId: string) => {
    console.log(userId);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 mt-8">
      {/* Main Layout */}
      <div className="flex items-start gap-2 w-4/5 max-w-[1440px]">
        {/* Carousel / Profile Cards */}
        <div className="flex-2">
          <PlayerRecommendation recommendedPlayers={recommendedPlayers} />
        </div>

        {/* Current Party Sidebar */}
        <div className="flex-1">
          <PartyList
            partyMembers={partyMembers}
            onHonor={handleHonor}
            onDislike={handleDislike}
            onViewProfile={handleViewProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default Party;
