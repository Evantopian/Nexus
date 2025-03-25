import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import NexusDragon from "@/assets/Nexus_Dragon.svg";

import BoyWave from "@/assets/pages/auth/BoyWaving.jpg";
import GirlPose from "@/assets/pages/auth/GirlPosing.png";

const Login = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-[#312E68]">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12 relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center">
            <img
              src={NexusDragon}
              alt="Nexus"
              className="h-10 w-auto mr-2 filter invert"
              style={{ transform: "scale(1.2)" }}
            />
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-8">
          Login to Nexus
        </h1>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            <div className="flex justify-end mt-1">
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-indigo-400"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md flex items-center justify-center transition-all duration-300 transform hover:scale-105">
            Continue{" "}
            <ArrowRightAltIcon className="ml-2" sx={{ fontSize: 16 }} />
          </Button>

          <div className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Sign Up →
            </Link>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-16">
          <a href="#" className="text-xs text-gray-400 hover:text-gray-300">
            Terms
          </a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-300">
            Privacy
          </a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-300">
            Docs
          </a>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-300">
            Contact Support
          </a>
        </div>

        <div className="flex justify-between mt-12">
          <img
            src={BoyWave}
            alt="Player character"
            className="h-48 w-auto transform -translate-x-1/4 hidden md:block"
          />
          <img
            src={GirlPose}
            alt="Player character"
            className="h-48 w-auto transform translate-x-1/4 hidden md:block"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

