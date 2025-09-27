"use client";

import { Button } from "@resume-platform/ui/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@resume-platform/ui/components/DropdownMenu";

export const themes = ["Classic", "Modern"];

interface PreviewThemeSwitcherProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export const PreviewThemeSwitcher = ({
  currentTheme,
  onThemeChange,
}: PreviewThemeSwitcherProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Theme: {currentTheme}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => onThemeChange(theme)}>
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};