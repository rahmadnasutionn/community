"use client";
import { useEffect, useState, useCallback } from "react";
import va from "@vercel/analytics";
import useEventListener from "@/hooks/useEventListener";
import { Icons } from "./icons";
import useTheme from "@/hooks/useTheme";
import { Laptop } from "lucide-react";
import { Button } from "./ui/button";

export default function DarkModeToggle() {
  const [preference, setPreference] = useState<undefined | null | string>(
    undefined
  );
  const [currentTheme, setCurrentTheme] = useState<null | string>(null);

  const onMediaChange = useCallback(() => {
    const current = useTheme();
    setCurrentTheme(current);
  }, []);

  useEffect(() => {
    setPreference(localStorage.getItem("theme"));
    const current = useTheme();
    setCurrentTheme(current);

    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    matchMedia.addEventListener("change", onMediaChange);
    return () => matchMedia.removeEventListener("change", onMediaChange);
  }, [onMediaChange]);

  const onStorageChange = useCallback(
    (event: StorageEvent) => {
      if (event.key === "theme") setPreference(event.newValue);
    },
    [setPreference]
  );

  useEffect(() => {
    setCurrentTheme(useTheme());
  }, [preference]);

  useEventListener('storage', onStorageChange)

  return (
    
      <Button
        variant={'outline'}
        aria-label="Toggle theme"
        className={`inline-flex active:bg-gray-300 transition-[background-color] dark:active:bg-[#242424] rounded-sm p-2 
          dark:bg-[#313131]
          theme-system:!bg-inherit
          [&_.sun-icon]:hidden
          dark:[&_.moon-icon]:hidden
          dark:[&_.sun-icon]:inline
        }`}
        onClick={ev => {
          ev.preventDefault();

          let newPreference: string | null =
            currentTheme === "dark" ? "light" : "dark";
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          if (preference !== null && systemTheme === currentTheme) {
            newPreference = null;
            localStorage.removeItem("theme");
          } else {
            localStorage.setItem("theme", newPreference);
          }

          va.track("Theme toggle", {
            Theme: newPreference === null ? "system" : newPreference,
          });

          setPreference(newPreference);
        }}
      >
        <span className="sun-icon">
          <Icons.soon className="w-4 h-4" />
        </span>
        <span className="moon-icon">
          <Icons.moon className="w-4 h-4" />
        </span>
      </Button>
  );
}

