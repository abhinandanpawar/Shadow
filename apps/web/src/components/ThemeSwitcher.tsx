"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@resume-platform/ui/components/Button";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="outline">
      {theme === "light" ? "Dark" : "Light"} Mode
    </Button>
  );
};