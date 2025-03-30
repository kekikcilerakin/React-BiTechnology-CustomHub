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
  const { theme, setTheme } = useTheme();
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
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <div className="flex items-center gap-2">
                    <span>Light Theme</span>
                    <Sun className="h-7 w-7" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Dark Theme</span>
                    <Moon />
                  </div>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
