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

  return (
    <div className="min-h-screen flex items-center justify-start p-4">
      {/* Main Layout */}
      <div className="flex items-center justify-center gap-16 w-full max-w-[1440px]">
        {/* Carousel / Profile Cards */}
        <div className="flex-1 flex justify-center">
          <PlayerRecommendation recommendedPlayers={recommendedPlayers} />
        </div>

        {/* Current Party Sidebar */}
        <div className="w-[300px]">
          <PartyList partyMembers={partyMembers} />
        </div>
      </div>
    </div>
  );
};

export default Party;
