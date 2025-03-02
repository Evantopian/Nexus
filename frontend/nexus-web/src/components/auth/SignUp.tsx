import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import NexusDragon from "@/assets/Nexus_Dragon.svg";
import BoyFoxCamp from "@/assets/pages/auth/BoyFoxCamping.png"

const SignUp = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="w-1/2 bg-gradient-to-br from-black to-[#312E68] p-10 flex flex-col justify-between">
        <div>
          <div className="mb-16">
            <Link to="/" className="flex items-center">
                <img
                src={NexusDragon}
                alt="Nexus"
                className="h-10 w-auto mr-2 filter invert" 
                style={{ transform: 'scale(1.2)' }} 
                />
            </Link>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-4">
              Create your free account
            </h1>
            <p className="text-gray-400 mb-6">
              Join the ultimate gaming community and find your perfect party.
            </p>

            <button className="flex items-center text-white mb-8">
              <span className="mr-2">See what's included</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 12L4 8H12L8 12Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          <img
            src={BoyFoxCamp}
            alt="BoyFoxCamp"
            className="rounded-lg w-auto h-120"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-right mb-10">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In →
              </Link>
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Sign Up to Nexus</h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password should be at least 10 characters OR at least 8
                  characters including a number and a lowercase letter.
                </p>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username may only contain alphanumeric characters or single
                  hyphens, and cannot begin or end with a hyphen.
                </p>
              </div>
            </div>
          </div>

          <Button className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center">
            Continue{" "}
            <ArrowRightAltIcon className="ml-2" sx={{ fontSize: 16 }} />
          </Button>

          <p className="text-xs text-gray-500 mt-6">
            By clicking "Continue", you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
