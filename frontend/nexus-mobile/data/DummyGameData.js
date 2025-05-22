/*
  use this as a reference for API building and mobile data type reference.
  dummy data for now since we still need to route the backend apis
  however, this is generally how the frotn end will expect data models to look like
*/
export const gameTags = {
  Action: { id: "action", name: "Action", color: "bg-red-100 text-red-700" },
  Adventure: {
    id: "adventure",
    name: "Adventure",
    color: "bg-green-100 text-green-700",
  },
  RPG: { id: "rpg", name: "RPG", color: "bg-purple-100 text-purple-700" },
  FPS: { id: "fps", name: "FPS", color: "bg-orange-100 text-orange-700" },
  Strategy: {
    id: "strategy",
    name: "Strategy",
    color: "bg-blue-100 text-blue-700",
  },
  Simulation: {
    id: "simulation",
    name: "Simulation",
    color: "bg-teal-100 text-teal-700",
  },
  Sports: {
    id: "sports",
    name: "Sports",
    color: "bg-yellow-100 text-yellow-700",
  },
  Racing: { id: "racing", name: "Racing", color: "bg-gray-100 text-gray-700" },
  Puzzle: {
    id: "puzzle",
    name: "Puzzle",
    color: "bg-indigo-100 text-indigo-700",
  },
  Casual: { id: "casual", name: "Casual", color: "bg-pink-100 text-pink-700" },
  Multiplayer: {
    id: "multiplayer",
    name: "Multiplayer",
    color: "bg-blue-100 text-blue-700",
  },
  "Battle Royale": {
    id: "battle-royale",
    name: "Battle Royale",
    color: "bg-red-100 text-red-700",
  },
  "Open World": {
    id: "open-world",
    name: "Open World",
    color: "bg-green-100 text-green-700",
  },
  Survival: {
    id: "survival",
    name: "Survival",
    color: "bg-yellow-100 text-yellow-700",
  },
  Horror: { id: "horror", name: "Horror", color: "bg-gray-100 text-gray-700" },
  Sandbox: {
    id: "sandbox",
    name: "Sandbox",
    color: "bg-amber-100 text-amber-700",
  },
  MOBA: { id: "moba", name: "MOBA", color: "bg-blue-100 text-blue-700" },
  Tactical: {
    id: "tactical",
    name: "Tactical",
    color: "bg-slate-100 text-slate-700",
  },
  "Team-based": {
    id: "team-based",
    name: "Team-based",
    color: "bg-emerald-100 text-emerald-700",
  },
  Building: {
    id: "building",
    name: "Building",
    color: "bg-amber-100 text-amber-700",
  },
  Creative: {
    id: "creative",
    name: "Creative",
    color: "bg-pink-100 text-pink-700",
  },
  Superhero: {
    id: "superhero",
    name: "Superhero",
    color: "bg-red-100 text-red-700",
  },
  Gacha: { id: "gacha", name: "Gacha", color: "bg-purple-100 text-purple-700" },
};

// Dummy game data
const games = [
  {
    id: 1,
    slug: "marvel-rivals",
    title: "Marvel Rivals",
    description:
      "Team up with your favorite Marvel heroes in this action-packed multiplayer game. Battle against other players in intense 6v6 matches, each with unique abilities and playstyles. Choose from a roster of iconic characters including Iron Man, Captain America, Spider-Man, and more.",
    shortDescription:
      "Team up with your favorite Marvel heroes in this action-packed multiplayer game.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1556707752-481d500a2c58?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=MarvelRivals",
    players: "1.7k",
    releaseDate: "2023-06-15",
    developer: "NetEase Games",
    publisher: "Marvel Entertainment",
    platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
    tags: ["Action", "Multiplayer", "Superhero"],
    rating: 4.5,
    servers: [
      {
        id: 1,
        name: "Avengers Assemble",
        members: 128,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server1marvel",
        description:
          "The official server for competitive play and tournaments.",
      },
      {
        id: 2,
        name: "Shield Academy",
        members: 95,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server2marvel",
        description:
          "For new players learning the ropes. Friendly community with guides and tips.",
      },
      {
        id: 3,
        name: "Wakanda Forever",
        members: 76,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server3marvel",
        description: "Black Panther mains and Wakanda enthusiasts.",
      },
      {
        id: 4,
        name: "X-Men United",
        members: 112,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server4marvel",
        description: "For fans of the X-Men characters and strategies.",
      },
    ],
    topPlayers: [
      {
        uuid: "1-marvel",
        email: "ironfanatic@marvel.com",
        username: "IronFanatic",
        profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1marvel",
        region: "NA",
        genre: "Action",
        platform: "PC",
        playstyle: "Aggressive",
        rank: "Diamond",
        reputation: 98,
        age: 22,
      },
      {
        uuid: "2-marvel",
        email: "capshieldpro@marvel.com",
        username: "CapShieldPro",
        profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2marvel",
        region: "EU",
        genre: "Action",
        platform: "PlayStation 5",
        playstyle: "Defensive",
        rank: "Platinum",
        reputation: 95,
        age: 25,
      },
      {
        uuid: "3-marvel",
        email: "thorhammer@marvel.com",
        username: "ThorHammer",
        profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3marvel",
        region: "NA",
        genre: "Action",
        platform: "Xbox Series X/S",
        playstyle: "Balanced",
        rank: "Gold",
        reputation: 90,
        age: 27,
      },
      {
        uuid: "4-marvel",
        email: "spiderqueen@marvel.com",
        username: "SpiderQueen",
        profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4marvel",
        region: "ASIA",
        genre: "Action",
        platform: "PC",
        playstyle: "Stealth",
        rank: "Diamond",
        reputation: 99,
        age: 21,
      },
      {
        uuid: "5-marvel",
        email: "hulksmash99@marvel.com",
        username: "HulkSmash99",
        profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=player5marvel",
        region: "NA",
        genre: "Action",
        platform: "PC",
        playstyle: "Aggressive",
        rank: "Silver",
        reputation: 80,
        age: 24,
      },
      {
        uuid: "6-marvel",
        email: "blackwidowspy@marvel.com",
        username: "BlackWidowSpy",
        profileImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=player6marvel",
        region: "EU",
        genre: "Action",
        platform: "PC",
        playstyle: "Tactical",
        rank: "Platinum",
        reputation: 92,
        age: 23,
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Looking for 2 more for ranked",
        description:
          "Need 2 more players for ranked play. Preferably with mics and experience with the game.",
        author: {
          id: 1,
          name: "IronFanatic",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player1marvel",
        },
        requirements: [
          "Level 30+",
          "Mic required",
          "Previous ranked experience",
        ],
        tags: ["Ranked", "Competitive"],
        createdAt: "2023-09-15T14:30:00Z",
        expiresAt: "2023-09-15T18:30:00Z",
      },
    ],
  },
  {
    id: 2,
    slug: "fortnite",
    title: "Fortnite",
    description:
      "Fortnite is a free-to-play Battle Royale game with numerous game modes for every type of game player. Watch a concert, build an island or fight. Fortnite is a Free-to-Play Battle Royale game and so much more. Hang out peacefully with friends while watching a concert or movie. Build and create your own island, or fight to be the last person standing.",
    shortDescription:
      "The world-famous battle royale game where building and shooting skills combine.",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=Fortnite",
    players: "3.2k",
    releaseDate: "2017-07-25",
    developer: "Epic Games",
    publisher: "Epic Games",
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    tags: ["Battle Royale", "Multiplayer", "Building"],
    rating: 4.2,
    servers: [
      {
        id: 1,
        name: "Victory Royale",
        members: 245,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server1fortnite",
        description:
          "The largest Fortnite community server with daily events and tournaments.",
      },
      {
        id: 2,
        name: "Build Masters",
        members: 178,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server2fortnite",
        description:
          "For players who want to master building techniques and strategies.",
      },
      {
        id: 3,
        name: "Tilted Towers",
        members: 132,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server3fortnite",
        description: "Competitive players looking for scrims and practice.",
      },
      {
        id: 4,
        name: "Fortnite Casuals",
        members: 203,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server4fortnite",
        description: "For casual players who just want to have fun.",
      },
    ],
    topPlayers: [
      {
        id: 1,
        name: "BuildKing",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player1fortnite",
        role: "verified",
        level: 100,
        status: "online",
      },
      {
        id: 2,
        name: "NinjaWarrior",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player2fortnite",
        role: "verified",
        level: 98,
        status: "online",
      },
      {
        id: 3,
        name: "SniperQueen",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player3fortnite",
        level: 87,
        status: "away",
      },
      {
        id: 4,
        name: "StormChaser",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player4fortnite",
        level: 92,
        status: "online",
      },
      {
        id: 5,
        name: "LootLegend",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player5fortnite",
        level: 76,
        status: "offline",
      },
      {
        id: 6,
        name: "VictoryRoyale",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player6fortnite",
        level: 88,
        status: "online",
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Squad up for Arena",
        description:
          "Looking for 3 players to complete a squad for Arena mode. Division 7+ preferred.",
        author: {
          id: 1,
          name: "BuildKing",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player1fortnite",
        },
        requirements: ["Division 7+", "Mic required", "18+"],
        tags: ["Arena", "Competitive"],
        createdAt: "2023-09-16T10:15:00Z",
        expiresAt: "2023-09-16T14:15:00Z",
      },
      {
        id: 2,
        title: "Casual Trios",
        description:
          "Just looking for some chill players to run some trios with. No pressure, just fun.",
        author: {
          id: 5,
          name: "LootLegend",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player5fortnite",
        },
        requirements: ["No requirements", "Be chill"],
        tags: ["Casual", "Trios"],
        createdAt: "2023-09-16T11:30:00Z",
        expiresAt: "2023-09-16T23:30:00Z",
      },
    ],
  },
  {
    id: 3,
    slug: "minecraft",
    title: "Minecraft",
    description:
      "Minecraft is a sandbox video game developed by Mojang Studios. The game was created by Markus 'Notch' Persson in the Java programming language. In Minecraft, players explore a blocky, procedurally generated 3D world with virtually infinite terrain, and may discover and extract raw materials, craft tools and items, and build structures or earthworks.",
    shortDescription:
      "Build, explore, and survive in a blocky, procedurally-generated 3D world.",
    image:
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=Minecraft",
    players: "2.5k",
    releaseDate: "2011-11-18",
    developer: "Mojang Studios",
    publisher: "Mojang Studios",
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    tags: ["Sandbox", "Survival", "Creative"],
    rating: 4.8,
    servers: [
      {
        id: 1,
        name: "Survival Experts",
        members: 187,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server1minecraft",
        description:
          "Hardcore survival server with minimal rules and maximum challenge.",
      },
      {
        id: 2,
        name: "Creative Builders",
        members: 215,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server2minecraft",
        description:
          "For creative mode enthusiasts who love to build amazing structures.",
      },
      {
        id: 3,
        name: "Redstone Engineers",
        members: 98,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server3minecraft",
        description:
          "For those who love creating complex redstone contraptions and mechanisms.",
      },
      {
        id: 4,
        name: "Peaceful Paradise",
        members: 156,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server4minecraft",
        description:
          "A peaceful server with no PvP, just building and exploration.",
      },
    ],
    topPlayers: [
      {
        id: 1,
        name: "BlockMaster",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player1minecraft",
        role: "verified",
        level: 95,
        status: "online",
      },
      {
        id: 2,
        name: "DiamondMiner",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player2minecraft",
        level: 82,
        status: "online",
      },
      {
        id: 3,
        name: "RedstoneWizard",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player3minecraft",
        level: 90,
        status: "away",
      },
      {
        id: 4,
        name: "EndermanHunter",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player4minecraft",
        level: 78,
        status: "online",
      },
      {
        id: 5,
        name: "CreeperSlayer",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player5minecraft",
        level: 65,
        status: "offline",
      },
      {
        id: 6,
        name: "VillagerTrader",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player6minecraft",
        level: 73,
        status: "online",
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Starting a new survival world",
        description:
          "Looking for 3-4 players to start a fresh survival world with. Planning to defeat the Ender Dragon together.",
        author: {
          id: 1,
          name: "BlockMaster",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player1minecraft",
        },
        requirements: [
          "Experience with survival mode",
          "Mic preferred",
          "Age 16+",
        ],
        tags: ["Survival", "Long-term"],
        createdAt: "2023-09-15T09:00:00Z",
        expiresAt: "2023-09-17T09:00:00Z",
      },
    ],
  },
  {
    id: 4,
    slug: "call-of-duty",
    title: "Call of Duty",
    description:
      "Call of Duty is a first-person shooter video game franchise published by Activision. Starting out in 2003, it first focused on games set in World War II. Over time, the series has seen games set in the midst of the Cold War, futuristic worlds, and outer space. The games were first developed by Infinity Ward, then also by Treyarch and Sledgehammer Games.",
    shortDescription:
      "Fast-paced first-person shooter with intense multiplayer action.",
    image:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1616588589676-62b3bd4108f6?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=CallOfDuty",
    players: "1.9k",
    releaseDate: "2003-10-29",
    developer: "Infinity Ward, Treyarch, Sledgehammer Games",
    publisher: "Activision",
    platforms: ["PC", "PlayStation", "Xbox"],
    tags: ["FPS", "Action", "Multiplayer"],
    rating: 4.3,
    servers: [
      {
        id: 1,
        name: "Warzone Warriors",
        members: 210,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server1cod",
        description:
          "For Warzone enthusiasts looking for squad members and strategies.",
      },
      {
        id: 2,
        name: "Search & Destroy Pros",
        members: 145,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server2cod",
        description:
          "Dedicated to the Search & Destroy game mode with competitive play.",
      },
      {
        id: 3,
        name: "Zombie Slayers",
        members: 178,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server3cod",
        description: "For fans of the Zombies mode across all CoD games.",
      },
      {
        id: 4,
        name: "Multiplayer Maniacs",
        members: 192,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server4cod",
        description: "General multiplayer discussion and team formation.",
      },
    ],
    topPlayers: [
      {
        id: 1,
        name: "SniperElite",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1cod",
        role: "verified",
        level: 97,
        status: "online",
      },
      {
        id: 2,
        name: "RushTactical",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2cod",
        level: 85,
        status: "online",
      },
      {
        id: 3,
        name: "ZombieHunter",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3cod",
        level: 91,
        status: "away",
      },
      {
        id: 4,
        name: "WarzoneKing",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4cod",
        role: "verified",
        level: 99,
        status: "online",
      },
      {
        id: 5,
        name: "TacticalOps",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player5cod",
        level: 82,
        status: "offline",
      },
      {
        id: 6,
        name: "GunMaster",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player6cod",
        level: 88,
        status: "online",
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Warzone squad needed",
        description:
          "Looking for 3 players to join my Warzone squad. Aiming for high kill games and wins.",
        author: {
          id: 4,
          name: "WarzoneKing",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4cod",
        },
        requirements: ["1.5+ K/D", "Mic required", "Team player"],
        tags: ["Warzone", "Competitive"],
        createdAt: "2023-09-16T15:45:00Z",
        expiresAt: "2023-09-16T19:45:00Z",
      },
      {
        id: 2,
        title: "Zombies Easter Egg Run",
        description:
          "Need 3 experienced players for a Zombies Easter Egg completion run.",
        author: {
          id: 3,
          name: "ZombieHunter",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3cod",
        },
        requirements: [
          "Knowledge of Easter Egg steps",
          "Mic required",
          "Patience",
        ],
        tags: ["Zombies", "Easter Egg"],
        createdAt: "2023-09-16T14:30:00Z",
        expiresAt: "2023-09-16T20:30:00Z",
      },
    ],
  },
  {
    id: 5,
    slug: "league-of-legends",
    title: "League of Legends",
    description:
      "League of Legends is a team-based strategy game developed and published by Riot Games. In the game, two teams of five powerful champions face off to destroy the other's base. Choose from over 140 champions to make epic plays, secure kills, and take down towers as you battle your way to victory.",
    shortDescription:
      "Team-based strategy game where two teams of five compete to destroy the enemy base.",
    image:
      "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=LeagueOfLegends",
    players: "2.1k",
    releaseDate: "2009-10-27",
    developer: "Riot Games",
    publisher: "Riot Games",
    platforms: ["PC"],
    tags: ["MOBA", "Strategy", "Team-based"],
    rating: 4.4,
    servers: [
      {
        id: 1,
        name: "Summoner's Rift",
        members: 230,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server1lol",
        description:
          "The main server for general League of Legends discussion and team formation.",
      },
      {
        id: 2,
        name: "Pro Strategies",
        members: 165,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server2lol",
        description:
          "For high-ELO players discussing advanced strategies and meta.",
      },
      {
        id: 3,
        name: "Champion Mains",
        members: 198,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server3lol",
        description:
          "A place for players to discuss their main champions and share tips.",
      },
      {
        id: 4,
        name: "ARAM Enthusiasts",
        members: 112,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server4lol",
        description: "For fans of the All Random All Mid game mode.",
      },
    ],
    topPlayers: [
      {
        id: 1,
        name: "MidLaneGod",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1lol",
        role: "verified",
        level: 96,
        status: "online",
      },
      {
        id: 2,
        name: "JungleKing",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2lol",
        level: 89,
        status: "online",
      },
      {
        id: 3,
        name: "SupportMaster",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3lol",
        level: 92,
        status: "away",
      },
      {
        id: 4,
        name: "ADCarry",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4lol",
        role: "verified",
        level: 94,
        status: "online",
      },
      {
        id: 5,
        name: "TopLaneChamp",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player5lol",
        level: 87,
        status: "offline",
      },
      {
        id: 6,
        name: "PentakillPro",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player6lol",
        level: 91,
        status: "online",
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Ranked Flex Team",
        description:
          "Looking for 4 players to form a consistent ranked flex team. Goal is to climb to Diamond.",
        author: {
          id: 1,
          name: "MidLaneGod",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1lol",
        },
        requirements: [
          "Platinum+ in solo queue",
          "Mic required",
          "Available evenings",
        ],
        tags: ["Ranked", "Competitive"],
        createdAt: "2023-09-16T18:00:00Z",
        expiresAt: "2023-09-17T18:00:00Z",
      },
      {
        id: 2,
        title: "Casual ARAM group",
        description:
          "Looking for players to join for some casual ARAM games. Just for fun, no pressure.",
        author: {
          id: 3,
          name: "SupportMaster",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3lol",
        },
        requirements: ["No toxicity", "Just have fun"],
        tags: ["ARAM", "Casual"],
        createdAt: "2023-09-16T19:15:00Z",
        expiresAt: "2023-09-16T23:15:00Z",
      },
    ],
  },
  {
    id: 6,
    slug: "valorant",
    title: "Valorant",
    description:
      "Valorant is a free-to-play first-person tactical shooter developed and published by Riot Games. The game operates on an economy-round, objective-based, first-to-13 competitive format where you select a unique agent to play for the entirety of the match. Each agent has their own unique abilities and playstyle.",
    shortDescription:
      "Character-based tactical shooter with unique abilities and precise gunplay.",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=Valorant",
    players: "1.5k",
    releaseDate: "2020-06-02",
    developer: "Riot Games",
    publisher: "Riot Games",
    platforms: ["PC"],
    tags: ["FPS", "Tactical", "Team-based"],
    rating: 4.5,
    servers: [
      {
        id: 1,
        name: "Radiant Tactics",
        members: 185,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server1valorant",
        description:
          "High-level tactical discussion and team formation for competitive play.",
      },
      {
        id: 2,
        name: "Agent Academy",
        members: 142,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server2valorant",
        description: "Learn agent-specific strategies and improve your skills.",
      },
      {
        id: 3,
        name: "Spike Rush",
        members: 98,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server3valorant",
        description:
          "Casual players who enjoy Spike Rush and other non-competitive modes.",
      },
      {
        id: 4,
        name: "Aim Training",
        members: 126,
        image:
          "https://api.dicebear.com/7.x/identicon/svg?seed=server4valorant",
        description: "Focused on improving aim and mechanical skills.",
      },
    ],
    topPlayers: [
      {
        id: 1,
        name: "HeadshotMachine",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player1valorant",
        role: "verified",
        level: 95,
        status: "online",
      },
      {
        id: 2,
        name: "JettMain",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player2valorant",
        level: 88,
        status: "online",
      },
      {
        id: 3,
        name: "SageMaster",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player3valorant",
        level: 90,
        status: "away",
      },
      {
        id: 4,
        name: "PhoenixFlash",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player4valorant",
        role: "verified",
        level: 93,
        status: "online",
      },
      {
        id: 5,
        name: "ViperLineup",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player5valorant",
        level: 86,
        status: "offline",
      },
      {
        id: 6,
        name: "OmenTeleport",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player6valorant",
        level: 89,
        status: "online",
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Immortal+ team for VCT watch party",
        description:
          "Looking for high-ranked players to analyze VCT matches together and improve strategies.",
        author: {
          id: 1,
          name: "HeadshotMachine",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player1valorant",
        },
        requirements: [
          "Immortal+ rank",
          "Good game knowledge",
          "Active player",
        ],
        tags: ["VCT", "Analysis"],
        createdAt: "2023-09-16T16:30:00Z",
        expiresAt: "2023-09-16T22:30:00Z",
      },
      {
        id: 2,
        title: "Need 4 for ranked grind",
        description:
          "Currently Diamond 2, looking to push to Immortal this act. Need consistent teammates.",
        author: {
          id: 4,
          name: "PhoenixFlash",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player4valorant",
        },
        requirements: ["Diamond+", "Mic required", "Non-toxic"],
        tags: ["Ranked", "Competitive"],
        createdAt: "2023-09-16T17:45:00Z",
        expiresAt: "2023-09-16T21:45:00Z",
      },
    ],
  },
  {
    id: 7,
    slug: "apex-legends",
    title: "Apex Legends",
    description:
      "Apex Legends is a free-to-play battle royale-hero shooter game developed by Respawn Entertainment and published by Electronic Arts. It was released for Microsoft Windows, PlayStation 4, and Xbox One in February 2019, for Nintendo Switch in March 2021, and for PlayStation 5 and Xbox Series X/S in March 2022.",
    shortDescription:
      "Free-to-play battle royale game where legendary characters with powerful abilities team up.",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=ApexLegends",
    players: "1.8k",
    releaseDate: "2019-02-04",
    developer: "Respawn Entertainment",
    publisher: "Electronic Arts",
    platforms: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    tags: ["Battle Royale", "FPS", "Team-based"],
    rating: 4.4,
    servers: [
      {
        id: 1,
        name: "Apex Predators",
        members: 175,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server1apex",
        description:
          "For high-ranked players aiming for Predator and Masters ranks.",
      },
      {
        id: 2,
        name: "Legend Mains",
        members: 156,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server2apex",
        description: "Discuss strategies for specific legends and share tips.",
      },
      {
        id: 3,
        name: "Casual Apex",
        members: 203,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server3apex",
        description:
          "For casual players who just want to have fun and find teammates.",
      },
      {
        id: 4,
        name: "Ranked Grinders",
        members: 142,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server4apex",
        description:
          "Dedicated to climbing the ranked ladder and improving skills.",
      },
    ],
    topPlayers: [
      {
        id: 1,
        name: "WraithMain",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1apex",
        role: "verified",
        level: 500,
        status: "online",
      },
      {
        id: 2,
        name: "PathfinderPro",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2apex",
        level: 487,
        status: "online",
      },
      {
        id: 3,
        name: "LifelineMedic",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3apex",
        level: 492,
        status: "away",
      },
      {
        id: 4,
        name: "BangaloreSmoke",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4apex",
        role: "verified",
        level: 500,
        status: "online",
      },
      {
        id: 5,
        name: "OctaneSpeed",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player5apex",
        level: 478,
        status: "offline",
      },
      {
        id: 6,
        name: "CausticTrap",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player6apex",
        level: 485,
        status: "online",
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Need 1 for ranked",
        description:
          "Currently Platinum 2, looking for one more player to push to Diamond. We play aggressive but smart.",
        author: {
          id: 1,
          name: "WraithMain",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1apex",
        },
        requirements: ["Platinum+", "Mic required", "18+"],
        tags: ["Ranked", "Competitive"],
        createdAt: "2023-09-16T20:00:00Z",
        expiresAt: "2023-09-16T23:00:00Z",
      },
      {
        id: 2,
        title: "Casual trios",
        description:
          "Just looking for some chill players to run pubs with. No pressure, just having fun.",
        author: {
          id: 3,
          name: "LifelineMedic",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3apex",
        },
        requirements: ["No requirements", "Be chill"],
        tags: ["Casual", "Pubs"],
        createdAt: "2023-09-16T19:30:00Z",
        expiresAt: "2023-09-17T01:30:00Z",
      },
    ],
  },
  {
    id: 8,
    slug: "genshin-impact",
    title: "Genshin Impact",
    description:
      "Genshin Impact is an open-world action role-playing game developed and published by miHoYo. The game features a fantasy open-world environment and action-based battle system using elemental magic and character-switching, and uses gacha game monetization for players to obtain new characters, weapons, and other resources.",
    shortDescription:
      "Open-world action RPG with elemental combat and gacha mechanics.",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    banner:
      "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=1200&q=80",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=GenshinImpact",
    players: "1.3k",
    releaseDate: "2020-09-28",
    developer: "miHoYo",
    publisher: "miHoYo",
    platforms: ["PC", "PlayStation", "Mobile"],
    tags: ["RPG", "Open World", "Gacha"],
    rating: 4.6,
    servers: [
      {
        id: 1,
        name: "Teyvat Travelers",
        members: 215,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server1genshin",
        description:
          "General Genshin Impact discussion and co-op partner finding.",
      },
      {
        id: 2,
        name: "Abyss Clearers",
        members: 132,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server2genshin",
        description:
          "Focused on Spiral Abyss strategies and team compositions.",
      },
      {
        id: 3,
        name: "Artifact Grinders",
        members: 168,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server3genshin",
        description:
          "For players grinding for perfect artifacts and sharing their luck.",
      },
      {
        id: 4,
        name: "Wishing Well",
        members: 195,
        image: "https://api.dicebear.com/7.x/identicon/svg?seed=server4genshin",
        description: "Discuss upcoming banners and share gacha pulls.",
      },
    ],
    topPlayers: [
      {
        id: 1,
        name: "DilucMain",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player1genshin",
        role: "verified",
        level: 60,
        status: "online",
      },
      {
        id: 2,
        name: "KeqingQueen",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player2genshin",
        level: 58,
        status: "online",
      },
      {
        id: 3,
        name: "ZhongliShield",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player3genshin",
        level: 59,
        status: "away",
      },
      {
        id: 4,
        name: "VentiCC",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player4genshin",
        role: "verified",
        level: 60,
        status: "online",
      },
      {
        id: 5,
        name: "GanyuDPS",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player5genshin",
        level: 57,
        status: "offline",
      },
      {
        id: 6,
        name: "HuTaoMaster",
        avatar:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=player6genshin",
        level: 59,
        status: "online",
      },
    ],
    lfgPosts: [
      {
        id: 1,
        title: "Weekly boss runs",
        description:
          "Looking for 3 players to farm weekly bosses efficiently. Will be doing all of them.",
        author: {
          id: 1,
          name: "DilucMain",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player1genshin",
        },
        requirements: ["AR 45+", "Have all weekly bosses unlocked"],
        tags: ["Co-op", "Farming"],
        createdAt: "2023-09-16T10:00:00Z",
        expiresAt: "2023-09-16T14:00:00Z",
      },
      {
        id: 2,
        title: "Azhdaha help needed",
        description:
          "Need help defeating Azhdaha for weekly rewards. My characters aren't strong enough yet.",
        author: {
          id: 5,
          name: "GanyuDPS",
          avatar:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=player5genshin",
        },
        requirements: ["AR 40+", "Strong characters"],
        tags: ["Co-op", "Boss"],
        createdAt: "2023-09-16T11:15:00Z",
        expiresAt: "2023-09-16T13:15:00Z",
      },
    ],
  },
];

const getGameBySlug = (slug) => {
  return games.find((game) => game.slug === slug);
};

const getAllGames = () => {
  return games;
};

const getTagColor = (tagName) => {
  return gameTags[tagName]?.color || "bg-gray-100 text-gray-700";
};

const getAllGuilds = () => {
  return games.flatMap((game) =>
    (game.servers || []).map(server => ({
      ...server,
      gameId: String(game.id),
      gameTitle: game.title,
      gameSlug: game.slug,
      id: `${game.id}-${server.id}`,
    }))
  );
};

export { getGameBySlug, getAllGames, getTagColor, getAllGuilds };
export default games;