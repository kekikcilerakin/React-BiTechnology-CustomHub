import { createContext, useContext, useEffect, useState } from "react";

type BasicTheme = "dark" | "light";
type EventTheme = "new-years" | "halloween" | "christmas";
type Theme = BasicTheme | EventTheme;

interface EventThemeConfig {
  name: EventTheme;
  displayName: string;
  startDate: { month: number; day: number };
  endDate: { month: number; day: number };
}

// Define event themes and their active date ranges
const EVENT_THEMES: EventThemeConfig[] = [
  {
    name: "new-years",
    displayName: "New Year's Theme",
    startDate: { month: 11, day: 27 }, // December 27
    endDate: { month: 0, day: 5 }, // January 5
  },
  {
    name: "halloween",
    displayName: "Halloween Theme",
    startDate: { month: 9, day: 25 }, // October 25
    endDate: { month: 10, day: 2 }, // November 2
  },
  {
    name: "christmas",
    displayName: "Christmas Theme",
    startDate: { month: 11, day: 15 }, // December 15
    endDate: { month: 11, day: 26 }, // December 26
  },
];

// Debug function to check if a theme should be active
const debugEventTheme = () => {
  const today = new Date();
  console.log("Current date:", today);
  console.log(
    "Current month:",
    today.getMonth(),
    "Current day:",
    today.getDate(),
  );

  for (const theme of EVENT_THEMES) {
    let isActive = false;
    const { startDate, endDate, name } = theme;

    if (startDate.month > endDate.month) {
      // Cross-year theme
      isActive =
        (today.getMonth() === startDate.month &&
          today.getDate() >= startDate.day) ||
        (today.getMonth() === endDate.month &&
          today.getDate() <= endDate.day) ||
        today.getMonth() > startDate.month ||
        today.getMonth() < endDate.month;
    } else {
      // Same-year theme
      isActive =
        (today.getMonth() > startDate.month ||
          (today.getMonth() === startDate.month &&
            today.getDate() >= startDate.day)) &&
        (today.getMonth() < endDate.month ||
          (today.getMonth() === endDate.month &&
            today.getDate() <= endDate.day));
    }

    console.log(`${name} theme should be active: ${isActive}`);
    console.log(`- Start: Month ${startDate.month}, Day ${startDate.day}`);
    console.log(`- End: Month ${endDate.month}, Day ${endDate.day}`);
  }
};

// Function to check if there's an active event theme based on current date
const getActiveEventTheme = (): {
  theme: EventTheme | null;
  displayName: string | null;
} => {
  // For debugging - call this once to see what's happening
  debugEventTheme();

  const today = new Date();
  const currentMonth = today.getMonth(); // getMonth is already 0-indexed
  const currentDay = today.getDate();

  for (const eventTheme of EVENT_THEMES) {
    const { startDate, endDate, name, displayName } = eventTheme;

    // Handle cases where an event spans across years (like New Year's)
    if (startDate.month > endDate.month) {
      // Event spans across years (e.g., Dec to Jan)
      if (
        // Either we're in or after the start month
        (currentMonth === startDate.month && currentDay >= startDate.day) ||
        // Or we're in or before the end month
        (currentMonth === endDate.month && currentDay <= endDate.day) ||
        // Or we're in any month between the start and end (considering year wrap)
        currentMonth > startDate.month ||
        currentMonth < endDate.month
      ) {
        return { theme: name, displayName };
      }
    } else {
      // Event within same year
      if (
        (currentMonth > startDate.month ||
          (currentMonth === startDate.month && currentDay >= startDate.day)) &&
        (currentMonth < endDate.month ||
          (currentMonth === endDate.month && currentDay <= endDate.day))
      ) {
        return { theme: name, displayName };
      }
    }
  }

  return { theme: null, displayName: null };
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: BasicTheme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: BasicTheme) => void;
  activeEventTheme: { theme: EventTheme | null; displayName: string | null };
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  activeEventTheme: { theme: null, displayName: null },
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "hub-theme",
  ...props
}: ThemeProviderProps) {
  const [userTheme, setUserTheme] = useState<BasicTheme>(
    () => (localStorage.getItem(storageKey) as BasicTheme) || defaultTheme,
  );

  const [activeEventTheme, setActiveEventTheme] = useState<{
    theme: EventTheme | null;
    displayName: string | null;
  }>({
    theme: null,
    displayName: null,
  });

  // Check for active event themes on mount and when date changes
  useEffect(() => {
    const checkEventThemes = () => {
      const eventTheme = getActiveEventTheme();
      setActiveEventTheme(eventTheme);
    };

    // Check immediately on mount
    checkEventThemes();

    // Set up a timer to check daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    // Initial timeout to sync with midnight
    const initialTimeout = setTimeout(() => {
      checkEventThemes();

      // Then set up a daily interval
      const dailyInterval = setInterval(checkEventThemes, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);

    return () => clearTimeout(initialTimeout);
  }, []);

  // Determine the actual theme to use (event theme overrides user theme)
  const effectiveTheme = activeEventTheme.theme || userTheme;

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all possible theme classes
    root.classList.remove(
      "light",
      "dark",
      "new-years",
      "halloween",
      "christmas",
    );

    // Add the effective theme class
    root.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  const value = {
    theme: effectiveTheme,
    setTheme: (theme: BasicTheme) => {
      localStorage.setItem(storageKey, theme);
      setUserTheme(theme);
    },
    activeEventTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
