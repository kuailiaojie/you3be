
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Settings } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:fixed md:left-0 md:top-0 md:bottom-0 md:w-16 bg-secondary/95 backdrop-blur-lg border-t md:border-t-0 md:border-r border-border/20 z-50">
      <div className="h-full flex items-center">
        <div className="flex w-full justify-around md:flex-col md:justify-center md:items-center md:h-full md:gap-12 py-3 md:py-0">
          <Link
            to="/"
            className={`flex flex-col items-center group ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            } hover:text-primary transition-colors`}
          >
            <div className="relative p-2 rounded-lg transition-colors group-hover:bg-primary/10">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-xs mt-0.5 md:text-[0.65rem] font-medium">Home</span>
          </Link>
          <Link
            to="/discover"
            className={`flex flex-col items-center group ${
              isActive("/discover") ? "text-primary" : "text-muted-foreground"
            } hover:text-primary transition-colors`}
          >
            <div className="relative p-2 rounded-lg transition-colors group-hover:bg-primary/10">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs mt-0.5 md:text-[0.65rem] font-medium">Discover</span>
          </Link>
          <Link
            to="/settings"
            className={`flex flex-col items-center group ${
              isActive("/settings") ? "text-primary" : "text-muted-foreground"
            } hover:text-primary transition-colors`}
          >
            <div className="relative p-2 rounded-lg transition-colors group-hover:bg-primary/10">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-xs mt-0.5 md:text-[0.65rem] font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
