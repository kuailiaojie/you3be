
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Settings } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:relative md:border-t-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-8 py-3">
          <Link
            to="/"
            className={`flex flex-col items-center ${
              isActive("/") ? "text-red-500" : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/discover"
            className={`flex flex-col items-center ${
              isActive("/discover") ? "text-red-500" : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <Compass className="w-6 h-6" />
            <span className="text-xs mt-1">Discover</span>
          </Link>
          <Link
            to="/settings"
            className={`flex flex-col items-center ${
              isActive("/settings") ? "text-red-500" : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
