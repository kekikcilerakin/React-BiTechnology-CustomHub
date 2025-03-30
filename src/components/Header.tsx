import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { Moon, Sun, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQlikUser } from "@/hooks/useQlikUser";

const Header = () => {
  const { theme, setTheme, activeEventTheme } = useTheme();
  const { username, isUsernameLoading } = useQlikUser();

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {/* <h1 className="text-xl font-poppins">Dashboard</h1> */}
      </div>
      <div className="flex items-center">
        {!isUsernameLoading && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <User className="h-4 w-4" />
                <span>{username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Display active event theme in dropdown menu */}
              {activeEventTheme.theme && (
                <DropdownMenuItem className="flex items-center gap-2 cursor-default" disabled>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="font-medium">{activeEventTheme.displayName}</span>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </DropdownMenuItem>
              )}
              
              {/* Only show theme toggle if no event theme is active */}
              {!activeEventTheme.theme && (
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <div className="flex items-center gap-2">
                      <span>Light Theme</span>
                      <Sun />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Dark Theme</span>
                      <Moon />
                    </div>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
