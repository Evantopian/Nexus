# Nexus  
Frontend for the Nexus web app (React + TypeScript + Vite)  

## Milestones  
General Implementations (no nitpick of UI)

| Status | Milestone               | Description                          |
|--------|-------------------------|--------------------------------------|
| ✅     | Initial Setup            | Project structure and config        |
| ✅     | Common Page Layouts 1    | Home & Landing Pages                |
| ⏳     | Common Page Layouts 2    | Dashboard, Query, Game Pages        |
| ⏳⏳    | Developer Panel    | Create a UI to easily integrate system UI dependencies (game images, banners, logos, etc)      |
| ⏳⏳    | Core Features Backend    | API integrations (auth, pull from dev panel)      |
| -      | TBD                      | TBD                                  |

## Bugs to Fix  
Bugs and nitpicks of UI

| Bug  | Description                                                   |
|------|---------------------------------------------------------------|
| 🐞   | Dark Theme on Homepage (need to reconfigure so its not affected or make homepage theme viable)                                      |
| 🐞   | Featured Cards need to be realigned for mobile webview        |


Working Tree Routes:
* Following -> Layout of followed games, players, servers joined.
* Browse -> Search
* LFG -> Collection of LFGs sorted by Genre? (Netflix style)
* Players -> Same as LFG but for players.
* Events -> TBD
> **LFG and Players Require Recommendation Model, can also incoperate games.**


(Locally Stored: Game Channels -waiting on backend APIs to make use.)