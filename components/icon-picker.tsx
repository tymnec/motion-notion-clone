"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
};

/**
 * Renders an icon picker component.
 *
 * @param {object} onChange - The function to be called when the selected icon changes.
 * @param {ReactNode} children - The child node to be rendered as the trigger for the popover.
 * @param {boolean} asChild - Determines if the children should be rendered as a child component.
 * @return {JSX.Element} The rendered icon picker component.
 */
export const IconPicker = ({
  onChange,
  children,
  asChild
}: IconPickerProps) => {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap

  const themeMap = {
    "dark": Theme.DARK,
    "light": Theme.LIGHT
  };

  const theme = themeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};
