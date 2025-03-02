import { RouteObject } from "react-router-dom";
import Home from "@/components/home";
import MainLayout from "@/layouts/MainLayout";


const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Home /> }],
  },
];

export default routes;
