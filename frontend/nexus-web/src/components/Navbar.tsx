import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NexusDragon from "../assets/Nexus_Dragon.svg";

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = false }: NavbarProps) => {
  return (
    <nav
      className={`w-full py-4 px-6 ${transparent ? "bg-transparent" : "bg-white border-b border-gray-200"}`}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
        <Link to="/" className="flex items-center">
            <img
            src={NexusDragon}
            alt="Nexus"
            className="h-10 w-auto mr-2" 
            style={{ transform: 'scale(1.2)' }} 
            />
            <span
            className={`text-xl font-bold ${transparent ? "text-white" : "text-black"}`}
            >
            Nexus
            </span>
        </Link>
        </div>


        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`${transparent ? "text-white" : "text-black"} hover:text-indigo-600`}
          >
            Home
          </Link>
          <Link
            to="/features"
            className={`${transparent ? "text-white" : "text-black"} hover:text-indigo-600`}
          >
            Features
          </Link>
          <Link
            to="/about"
            className={`${transparent ? "text-white" : "text-black"} hover:text-indigo-600`}
          >
            About
          </Link>
          <Button
            asChild
            className="bg-black text-white hover:bg-gray-800 rounded-md px-6"
          >
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
