import { RouteObject } from "react-router-dom";
import Home from "@/components/home";
import SignUp from "@/components/auth/SignUp";
import Login from "@/components/auth/Login";
import Dashboard from "@/components/dashboard/Dashboard";
import GameDetail from "@/components/games/GameDetail";
import GamesList from "@/components/games/GamesList";
import WorkInProgress from "@/components/common/WorkInProgress";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthRedirect from "@/components/auth/AuthRedirect";
import Profile from "@/components/profile/Profile";
import ChatLayout from "@/layouts/ChatLayout";
import ChatArea from "@/components/chats/ChatArea";
import LFGPosts from "@/components/dashboard/side/LFGPosts";
import { dummyPosts } from "@/data/MockData";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "/",
    element: <AuthRedirect />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <SignUp /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "browse", element: <GamesList /> },
      {
        path: "lfg",
        element: <LFGPosts posts={dummyPosts} />,
      },
      {
        path: "players",
        element: (
          <WorkInProgress
            title="Players Directory"
            message="The Players Directory is being built. Soon you'll be able to discover and connect with gamers worldwide."
          />
        ),
      },
      {
        path: "events",
        element: (
          <WorkInProgress
            title="Events Calendar"
            message="The Events Calendar is coming soon. Stay tuned for tournaments, livestreams, and gaming events!"
          />
        ),
      },
      {
        path: "profile",
        element: <Profile />,
      },
      { path: "games/:gameName", element: <GameDetail /> },
      {
        path: "chat",
        element: <ChatLayout />,
        children: [
          { path: ":roomId/:channelId", element: <ChatArea /> },
          {
            index: true,
            element: (
              <div className="p-4 text-gray-400">
                Select a room and a channel to start messaging.
              </div>
            ),
          },
        ],
      },
      {
        path: "*",
        element: (
          <WorkInProgress
            title="Page Not Found"
            message="The page you're looking for doesn't exist or has been moved."
          />
        ),
      },
    ],
  },
];

export default routes;
